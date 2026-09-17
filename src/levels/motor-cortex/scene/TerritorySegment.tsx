import { useState } from 'react';
import type { BodyPart, Territory } from '@content/schema';

interface Props {
  territory: Territory;
  offset: number;
  length: number;
  selectable: boolean;
  onSelect: () => void;
  onHover: (id: BodyPart | null) => void;
}

export function TerritorySegment({ territory, offset, length, selectable, onSelect, onHover }: Props) {
  const [hovered, setHovered] = useState(false);
  const color = !selectable ? '#64748b' : hovered ? '#fbbf24' : '#f59e0b';

  return (
    <mesh
      position={[0, offset + length / 2, 0]}
      onClick={(e) => { e.stopPropagation(); if (selectable) onSelect(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(territory.id); }}
      onPointerOut={() => { setHovered(false); onHover(null); }}
    >
      <boxGeometry args={[12, Math.max(length - 0.6, 0.4), 12]} />
      <meshStandardMaterial
        color={color}
        emissive={hovered ? color : '#000000'}
        emissiveIntensity={hovered ? 0.4 : 0}
        roughness={0.6}
        opacity={selectable ? 1 : 0.55}
        transparent={!selectable}
      />
    </mesh>
  );
}
