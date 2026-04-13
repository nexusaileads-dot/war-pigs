import { FastifyInstance } from 'fastify';
import { prisma } from '@war-pigs/database';
import { authenticate } from '../middleware/auth';

export async function inventoryRoutes(fastify: FastifyInstance) {
  // Get full inventory
  fastify.get('/', { preHandler: authenticate }, async (request) => {
    const [items, profile] = await Promise.all([
      prisma.inventoryItem.findMany({
        where: { userId: request.user!.userId },
        include: {
          character: true,
          weapon: true
        }
      }),
      prisma.profile.findUnique({
        where: { userId: request.user!.userId }
      })
    ]);

    return {
      items: items.map(item => ({
        id: item.id,
        type: item.itemType,
        acquiredAt: item.acquiredAt,
        timesUsed: item.timesUsed,
        details: item.itemType === 'CHARACTER' ? item.character : item.weapon
      })),
      equipped: {
        characterId: profile?.equippedCharacterId,
        weaponId: profile?.equippedWeaponId
      }
    };
  });

  // Equip items
  fastify.post('/equip', { preHandler: authenticate }, async (request, reply) => {
    const { characterId, weaponId } = request.body as { characterId?: string; weaponId?: string };

    // Verify ownership
    if (characterId) {
      const ownsChar = await prisma.inventoryItem.findFirst({
        where: { userId: request.user!.userId, characterId }
      });
      if (!ownsChar) {
        return reply.status(400).send({ error: 'Character not owned' });
      }
    }

    if (weaponId) {
      const ownsWeapon = await prisma.inventoryItem.findFirst({
        where: { userId: request.user!.userId, weaponId }
      });
      if (!ownsWeapon) {
        return reply.status(400).send({ error: 'Weapon not owned' });
      }
    }

    // Update equipped
    await prisma.profile.update({
      where: { userId: request.user!.userId },
      data: {
        ...(characterId && { equippedCharacterId: characterId }),
        ...(weaponId && { equippedWeaponId: weaponId })
      }
    });

    return { success: true };
  });
      }
