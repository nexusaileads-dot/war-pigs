import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

export const WeaponSelect: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/api/inventory').then(res => {
      setInventory(res.data.items.filter((i: any) => i.type === 'WEAPON'));
    });
  }, []);

  const selectWeapon = async (id: string) => {
    await apiClient.post('/api/inventory/equip', { weaponId: id });
    onBack();
  };

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <button onClick={onBack} style={{ padding: '10px', marginBottom: '20px', background: '#ff6b35', border: 'none', color: '#fff' }}>Back</button>
      <h2>Select Loadout</h2>
      {inventory.map(item => (
        <div key={item.details.weaponId} style={{ background: '#222', padding: '15px', margin: '10px 0', borderRadius: '8px', cursor: 'pointer' }} onClick={() => selectWeapon(item.details.weaponId)}>
          <h3>{item.details.name}</h3>
          <p>DMG: {item.details.damage}</p>
        </div>
      ))}
    </div>
  );
};
