import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { CanvasTexture, Color } from 'three';

const NODE_SIZES = { root: 0.72, chapter: 0.56, branch: 0.38, leaf: 0.25 };

function wrapLabel(label, maxChars = 24) {
  const words = label.split(' ');
  const lines = [];
  let current = '';
  words.forEach(word => {
    if (!current) current = word;
    else if (`${current} ${word}`.length <= maxChars) current += ` ${word}`;
    else { lines.push(current); current = word; }
  });
  if (current) lines.push(current);
  return lines.join('\n');
}

function NodeLabel({ node, selected, hovered }) {
  const lines = wrapLabel(node.title, node.size === 'root' ? 13 : 25).split('\n');
  const height = Math.max(320, lines.length * 100 + 96);
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = height * 2;
    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.fillStyle = selected ? '#831843' : hovered ? '#57213f' : '#28112b';
    context.beginPath();
    context.roundRect(8, 8, 1008, height - 16, 64);
    context.fill();
    context.strokeStyle = selected ? '#ffffff' : node.color;
    context.lineWidth = 8;
    context.stroke();
    context.fillStyle = '#ffffff';
    context.font = 'bold 76px "Segoe UI", Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const textLines = wrapLabel(node.title, node.size === 'root' ? 13 : 25).split('\n');
    textLines.forEach((line, index) => {
      context.fillText(line, 512, height / 2 + (index - (textLines.length - 1) / 2) * 100, 940);
    });
    return new CanvasTexture(canvas);
  }, [node.title, node.size, node.color, height, selected, hovered]);

  useEffect(() => () => texture.dispose(), [texture]);

  const width = node.size === 'root' ? 3 : node.size === 'chapter' ? 4 : 3.4;
  const y = node.size === 'root' ? 0 : (NODE_SIZES[node.size] || 0.25) + width * height / 1024 / 2 + 0.15;
  return (
    <sprite position={[0, y, 0.95]} scale={[width, width * height / 1024, 1]} renderOrder={10}>
      <spriteMaterial map={texture} transparent depthTest={false} depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

function DetailsButton({ node, onShowDetails }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    context.fillStyle = '#be185d';
    context.beginPath();
    context.roundRect(8, 8, 1008, 240, 64);
    context.fill();
    context.strokeStyle = '#f9a8d4';
    context.lineWidth = 8;
    context.stroke();
    context.fillStyle = '#ffffff';
    context.font = 'bold 82px "Segoe UI", Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Hiện chi tiết ↗', 512, 128);
    return new CanvasTexture(canvas);
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  const labelHeight = Math.max(320, wrapLabel(node.title, node.size === 'root' ? 13 : 25).split('\n').length * 100 + 96);
  const labelWidth = node.size === 'root' ? 3 : node.size === 'chapter' ? 4 : 3.4;
  const labelTop = node.size === 'root' ? labelWidth * labelHeight / 2048 : (NODE_SIZES[node.size] || 0.25) + labelWidth * labelHeight / 1024 + 0.15;
  return (
    <sprite position={[0, labelTop + 0.55, 1]} scale={[2.8, 0.7, 1]} renderOrder={20}
      onClick={event => { event.stopPropagation(); if (event.delta <= 5) onShowDetails(node); }}>
      <spriteMaterial map={texture} transparent depthTest={false} depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

function MindNode({ node, selected, hovered, visible, onSelect, onHover, showDetails, onShowDetails }) {
  const group = useRef();
  const [labelHovered, setLabelHovered] = useState(false);
  const size = NODE_SIZES[node.size] || 0.25;
  const color = new Color(node.color);
  const isRoot = node.size === 'root';

  useFrame((state, delta) => {
    if (!group.current || !visible) return;
    const target = selected ? 1.08 : hovered || labelHovered ? 1.06 : 1;
    group.current.scale.lerp({ x: target, y: target, z: target }, Math.min(delta * 12, 1));
    if (hovered || selected) group.current.position.z += (node.position.z + 0.14 - group.current.position.z) * Math.min(delta * 8, 1);
    else group.current.position.z += (node.position.z - group.current.position.z) * Math.min(delta * 8, 1);
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7 + node.depth) * 0.04;
  });

  const onPointerOver = event => {
    event.stopPropagation();
    document.body.style.cursor = 'pointer';
    setLabelHovered(true);
    onHover(node, true);
  };

  const onPointerOut = event => {
    event.stopPropagation();
    document.body.style.cursor = 'default';
    setLabelHovered(false);
    onHover(node, false);
  };

  return (
    <group
      ref={group}
      position={[node.position.x, node.position.y, node.position.z]}
      onClick={event => { event.stopPropagation(); if (event.delta <= 5) onSelect(node); }}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 1.35 : hovered ? 0.8 : isRoot ? 0.28 : 0.18}
          roughness={0.2}
          metalness={0.42}
          transparent
          opacity={selected ? 1 : 0.95}
        />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={selected ? 0.28 : hovered ? 0.14 : 0.055} toneMapped={false} />
      </mesh>
      {node.size !== 'leaf' && (
        <RoundedBox args={[size * 1.65, size * 0.32, 0.1]} radius={0.08} position={[0, -size * 1.08, 0.06]}>
          <meshStandardMaterial color="#07122b" transparent opacity={0.92} />
        </RoundedBox>
      )}
      <NodeLabel node={node} selected={selected} hovered={labelHovered} onSelect={onSelect} onPointerOver={onPointerOver} onPointerOut={onPointerOut} />
      {showDetails && <DetailsButton node={node} onShowDetails={onShowDetails} />}
    </group>
  );
}

export default memo(MindNode);
