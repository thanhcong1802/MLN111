import { memo, useMemo } from 'react';
import { CatmullRomCurve3, Vector3 } from 'three';
import { Tube } from '@react-three/drei';

function Connection({ from, to, color, active }) {
  const curve = useMemo(() => {
    const start = new Vector3(from.x, from.y, from.z + 0.13);
    const end = new Vector3(to.x, to.y, to.z + 0.13);
    const mid = new Vector3((start.x + end.x) / 2, (start.y + end.y) / 2, Math.max(start.z, end.z) + 0.32);
    return new CatmullRomCurve3([start, mid, end]);
  }, [from, to]);

  return (
    <Tube args={[curve, 24, active ? 0.035 : 0.018, 8, false]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 2.4 : 0.5} transparent opacity={active ? 0.98 : 0.48} toneMapped={false} />
    </Tube>
  );
}

export default memo(Connection);
