import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls, RoundedBox } from '@react-three/drei';

const NODE_RADIUS = 0.17;

function buildGraph(branches) {
  const nodes = [{ id: 'root', label: 'TƯ DUY', color: '#ffffff', x: 0, y: 0, z: 0, kind: 'root' }];
  const edges = [];

  branches.forEach((branch, branchIndex) => {
    const angle = (branchIndex / branches.length) * Math.PI * 2 - Math.PI / 2;
    const branchNode = {
      id: `branch-${branch.id}`,
      label: branch.title.replace(/^\d+\.\s*/, ''),
      color: branch.color,
      x: Math.cos(angle) * 3.2,
      y: Math.sin(angle) * 1.7,
      z: 0.2,
      kind: 'branch',
      branch
    };
    nodes.push(branchNode);
    edges.push({ from: 'root', to: branchNode.id });

    branch.sections.forEach((section, sectionIndex) => {
      const sectionNode = {
        id: `section-${branch.id}-${sectionIndex}`,
        label: section.title,
        color: branch.color,
        x: branchNode.x + Math.cos(angle + Math.PI / 2) * (0.8 + sectionIndex * 0.45),
        y: branchNode.y + Math.sin(angle + Math.PI / 2) * (0.8 + sectionIndex * 0.45),
        z: (sectionIndex % 2) * 0.25,
        kind: 'section',
        section
      };
      nodes.push(sectionNode);
      edges.push({ from: branchNode.id, to: sectionNode.id });
    });
  });

  return { nodes, edges };
}

function ForceGraph({ branches, onSelect }) {
  const groupRef = useRef();
  const [selectedId, setSelectedId] = useState(null);
  const { nodes, edges } = useMemo(() => buildGraph(branches), [branches]);

  const nodeById = useMemo(() => Object.fromEntries(nodes.map(node => [node.id, node])), [nodes]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.035;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.035;
  });

  const selectNode = node => {
    setSelectedId(node.id);
    onSelect(node);
  };

  return (
    <group ref={groupRef}>
      {edges.map(edge => {
        const from = nodeById[edge.from];
        const to = nodeById[edge.to];
        const points = [
          [from.x, from.y, from.z],
          [to.x, to.y, to.z]
        ];
        return <Line key={`${edge.from}-${edge.to}`} points={points} color={to.color} lineWidth={2.2} transparent opacity={0.72} />;
      })}

      {nodes.map(node => (
        <group key={node.id} position={[node.x, node.y, node.z]}>
          <FloatNode node={node} selected={selectedId === node.id} onSelect={selectNode} />
          <Html center distanceFactor={12} position={[0, node.kind === 'root' ? 0.55 : 0.48, 0]} transform sprite>
            <button className={`graph-label ${node.kind}`} type="button" onClick={() => selectNode(node)}>
              {node.label}
            </button>
          </Html>
        </group>
      ))}
    </group>
  );
}

function FloatNode({ node, selected, onSelect }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const target = selected ? 0.12 : 0;
    meshRef.current.position.z += (target - meshRef.current.position.z) * 0.12;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.2 + node.x) * 0.08;
  });

  const size = node.kind === 'root' ? 0.45 : node.kind === 'branch' ? 0.34 : 0.28;
  const color = node.kind === 'root' ? '#ffffff' : node.color;

  return (
    <group onClick={event => { event.stopPropagation(); onSelect(node); }}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? 1.2 : 0.25} roughness={0.22} metalness={0.42} />
      </mesh>
      {node.kind !== 'root' && (
        <RoundedBox args={[size * 1.8, size * 0.35, 0.08]} radius={0.08} smoothness={4} position={[0, -size * 1.1, 0.1]}>
          <meshStandardMaterial color="#0c2743" transparent opacity={0.9} />
        </RoundedBox>
      )}
      <mesh position={[0, 0, -0.01]}>
        <sphereGeometry args={[size * 1.08, 24, 24]} />
        <meshBasicMaterial color={node.kind === 'root' ? '#0878d1' : color} transparent opacity={0.14} />
      </mesh>
    </group>
  );
}

export default function MindMap3D({ branches, onSelect }) {
  return (
    <div className="mindmap-canvas-shell">
      <Canvas camera={{ position: [0, 0, 9.5], fov: 43 }} dpr={[1, 1.7]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.15} />
        <directionalLight position={[4, 5, 6]} intensity={2.3} color="#b9e9ff" />
        <pointLight position={[-4, -2, 4]} intensity={3.5} color="#7ee7c6" />
        <ForceGraph branches={branches} onSelect={onSelect} />
        <OrbitControls enablePan={false} minDistance={6.5} maxDistance={14} autoRotate autoRotateSpeed={0.35} />
      </Canvas>
      <div className="canvas-hint">Drag để quay · Scroll để phóng · Click để xem chi tiết</div>
    </div>
  );
}
