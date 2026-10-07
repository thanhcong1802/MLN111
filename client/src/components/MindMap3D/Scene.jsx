import { useEffect, useMemo, useRef, useState } from 'react';
import { OrbitControls, Stars, TransformControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { MOUSE, TOUCH, Vector3 } from 'three';
import Connection from './Connection';
import MindNode from './MindNode';

function CameraController({ focusNode, visibleNodes, resetSignal, zoomSignal }) {
  const { camera, size } = useThree();
  const controls = useRef();
  const targetPosition = useRef(new Vector3(0, 0, 15));
  const targetLookAt = useRef(new Vector3());
  const animationActive = useRef(false);
  const previousZoom = useRef(zoomSignal);
  const home = useMemo(() => {
    const xs = visibleNodes.map(node => node.position.x);
    const ys = visibleNodes.map(node => node.position.y);
    const left = Math.min(0, ...xs) - 2;
    const right = Math.max(0, ...xs) + 2;
    const bottom = Math.min(0, ...ys) - 2;
    const top = Math.max(0, ...ys) + 2;
    const target = new Vector3((left + right) / 2, (bottom + top) / 2, 0);
    const tangent = Math.tan(camera.fov * Math.PI / 360);
    const aspect = size.width / Math.max(size.height, 1);
    const distance = Math.max((top - bottom) / (2 * tangent), (right - left) / (2 * tangent * aspect)) * 1.15;
    return { target, position: target.clone().add(new Vector3(0, 0, Math.max(15, distance))) };
  }, [visibleNodes, camera, size.width, size.height]);

  useEffect(() => {
    targetPosition.current.copy(home.position);
    targetLookAt.current.copy(home.target);
    animationActive.current = true;
  }, [home, resetSignal]);

  useEffect(() => {
    if (!focusNode) return;
    targetLookAt.current.set(focusNode.position.x, focusNode.position.y, focusNode.position.z);
    targetPosition.current.copy(targetLookAt.current).add(new Vector3(0, 0, focusNode.depth === 0 ? 18 : 12));
    animationActive.current = true;
  }, [focusNode]);

  useEffect(() => {
    const change = zoomSignal - previousZoom.current;
    previousZoom.current = zoomSignal;
    if (!change) return;
    const target = controls.current?.target || targetLookAt.current;
    const offset = camera.position.clone().sub(target);
    const distance = Math.max(6.5, Math.min(250, offset.length() * (change > 0 ? 0.82 : 1.22)));
    targetLookAt.current.copy(target);
    targetPosition.current.copy(target).add(offset.setLength(distance));
    animationActive.current = true;
  }, [camera, zoomSignal]);

  useFrame((_, delta) => {
    if (!animationActive.current) return;
    const speed = 1 - Math.exp(-delta * 5);
    camera.position.lerp(targetPosition.current, speed);
    controls.current?.target.lerp(targetLookAt.current, speed);
    controls.current?.update();
    if (camera.position.distanceTo(targetPosition.current) < 0.01) animationActive.current = false;
  });

  return <OrbitControls ref={controls} makeDefault enablePan screenSpacePanning mouseButtons={{ LEFT: MOUSE.PAN, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE }} touches={{ ONE: TOUCH.PAN, TWO: TOUCH.DOLLY_ROTATE }} minDistance={6.5} maxDistance={250} minPolarAngle={Math.PI * 0.15} maxPolarAngle={Math.PI * 0.85} onStart={() => { animationActive.current = false; }} />;
}

export function Scene({ moveMode, nodes, visibleNodeIds, selectedId, resetSignal, zoomSignal, onSelect, onFocus, detailsNodeId, onShowDetails }) {
  const graph = useRef();
  const dragActive = useRef(false);
  useEffect(() => { graph.current?.position.set(0, 0, 0); }, [resetSignal]);
  const [hoveredId, setHoveredId] = useState(null);
  const [focusNode, setFocusNode] = useState(null);
  const nodeMap = useMemo(() => new Map(nodes.map(node => [node.id, node])), [nodes]);
  const visibleNodes = useMemo(() => nodes.filter(node => visibleNodeIds.has(node.id)), [nodes, visibleNodeIds]);
  const selectedNode = nodeMap.get(selectedId);
  const connectedIds = useMemo(() => {
    const ids = new Set();
    const add = node => {
      ids.add(node.id);
      for (const child of node.children || []) add(child);
    };
    if (selectedNode) add(selectedNode);
    return ids;
  }, [selectedNode]);

  useEffect(() => {
    if (selectedNode && selectedNode.depth > 0) {
      const world = graph.current.localToWorld(new Vector3(selectedNode.position.x, selectedNode.position.y, selectedNode.position.z));
      setFocusNode({ ...selectedNode, position: world });
    }
  }, [selectedNode]);

  const selectNode = node => {
    if (moveMode || dragActive.current) return;
    onSelect(node);
    const world = graph.current.localToWorld(new Vector3(node.position.x, node.position.y, node.position.z));
    setFocusNode({ ...node, position: world });
    setHoveredId(null);
    onFocus?.(node);
  };

  const handleHover = (node, active) => setHoveredId(active ? node.id : null);

  return (
    <>
      <color attach="background" args={['#160d24']} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 6, 8]} intensity={2.1} color="#fbcfe8" castShadow />
      <pointLight position={[-6, -3, 5]} intensity={2.8} color="#ec4899" />
      <pointLight position={[5, 3, 4]} intensity={2.2} color="#2dd4bf" />
      <Stars radius={80} depth={35} count={1100} factor={2.2} saturation={0.2} fade speed={0.4} />
      <TransformControls object={graph} mode="translate" space="world" enabled={moveMode} showX={moveMode} showY={moveMode} showZ={moveMode} size={0.85}
        onMouseDown={() => { dragActive.current = true; }}
        onMouseUp={() => { dragActive.current = false; }}
      />
      <group ref={graph}>
        {visibleNodes.flatMap(node => (node.children || []).filter(child => visibleNodeIds.has(child.id)).map(child => {
          const childPosition = nodeMap.get(child.id)?.position || node.position;
          return (
            <Connection
              key={`${node.id}-${child.id}`}
              from={node.position}
              to={childPosition}
              color={node.color}
              active={connectedIds.has(node.id) && connectedIds.has(child.id)}
            />
          );
        }))}
        {visibleNodes.map(node => (
          <MindNode
            key={node.id}
            node={node}
            visible
            selected={selectedId === node.id}
            hovered={hoveredId === node.id}
            onSelect={selectNode}
            onHover={handleHover}
            showDetails={!moveMode && detailsNodeId === node.id}
            onShowDetails={onShowDetails}
          />
        ))}
      </group>
      <CameraController visibleNodes={visibleNodes} focusNode={focusNode} resetSignal={resetSignal} zoomSignal={zoomSignal} />

    </>
  );
}
