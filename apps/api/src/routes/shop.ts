import { FastifyInstance } from 'fastify';
import { prisma } from '@war-pigs/database';
import { authenticate } from '../middleware/auth';
import { EconomyService } from '../services/EconomyService';

const economy = new EconomyService();

export async function shopRoutes(fastify: FastifyInstance) {
  // Get shop items
  fastify.get('/items', { preHandler: authenticate }, async (request) => {
    const profile = await prisma.profile.findUnique({
      where: { userId: request.user!.userId }
    });

    const [characters, weapons, ownedItems] = await Promise.all([
      prisma.character.findMany(),
      prisma.weapon.findMany(),
      prisma.inventoryItem.findMany({
        where: { userId: request.user!.userId },
        select: { characterId: true, weaponId: true }
      })
    ]);

    const ownedIds = new Set([
      ...ownedItems.map(i => i.characterId).filter(Boolean),
      ...ownedItems.map(i => i.weaponId).filter(Boolean)
    ]);

    return {
      characters: characters.map(c => ({
        ...c,
        owned: ownedIds.has(c.characterId),
        canAfford: (profile?.currentWpigs || 0) >= c.priceWpigs,
        canUnlock: (profile?.level || 1) >= c.unlockLevel
      })),
      weapons: weapons.map(w => ({
        ...w,
        owned: ownedIds.has(w.weaponId),
        canAfford: (profile?.currentWpigs || 0) >= w.priceWpigs,
        canUnlock: (profile?.level || 1) >= w.unlockLevel
      }))
    };
  });

  // Buy item
  fastify.post('/buy', { preHandler: authenticate }, async (request, reply) => {
    const { itemType, itemId } = request.body as { itemType: 'CHARACTER' | 'WEAPON'; itemId: string };

    const profile = await prisma.profile.findUnique({
      where: { userId: request.user!.userId }
    });

    if (!profile) {
      return reply.status(404).send({ error: 'Profile not found' });
    }

    // Check if already owned
    const existing = await prisma.inventoryItem.findFirst({
      where: {
        userId: request.user!.userId,
        OR: [
          { characterId: itemId },
          { weaponId: itemId }
        ]
      }
    });

    if (existing) {
      return reply.status(400).send({ error: 'Item already owned' });
    }

    // Get item details
    let item;
    if (itemType === 'CHARACTER') {
      item = await prisma.character.findUnique({ where: { characterId: itemId } });
    } else {
      item = await prisma.weapon.findUnique({ where: { weaponId: itemId } });
    }

    if (!item) {
      return reply.status(404).send({ error: 'Item not found' });
    }

    // Check level requirement
    if (profile.level < item.unlockLevel) {
      return reply.status(403).send({ error: 'Level requirement not met' });
    }

    // Check balance
    if (profile.currentWpigs < item.priceWpigs) {
      return reply.status(400).send({ error: 'Insufficient WPIGS' });
    }

    // Transaction
    try {
      await prisma.$transaction(async (tx) => {
        // Deduct currency
        await tx.profile.update({
          where: { userId: request.user!.userId },
          data: { currentWpigs: { decrement: item.priceWpigs } }
        });

        // Add to inventory
        await tx.inventoryItem.create({
          data: {
            userId: request.user!.userId,
            itemType,
            characterId: itemType === 'CHARACTER' ? itemId : null,
            weaponId: itemType === 'WEAPON' ? itemId : null
          }
        });

        // Log transaction
        await tx.transaction.create({
          data: {
            userId: request.user!.userId,
            type: 'SPEND',
            amount: -item.priceWpigs,
            description: `Purchased ${item.name}`,
            referenceId: itemId
          }
        });
      });

      return { success: true, message: `Purchased ${item.name}` };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Purchase failed' });
    }
  });
        }
