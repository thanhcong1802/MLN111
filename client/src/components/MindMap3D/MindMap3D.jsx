import { memo, useCallback, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './Scene';
import { getVisibleNodeIds } from '../../utils/layoutMindMap';

function MindMap3D({ nodes, selectedId, expandedIds, resetSignal, zoomSignal, onSelect, onFocus, detailsNodeId, onShowDetails }) {
  const [moveMode, setMoveMode] = useState(false);
  const visibleNodeIds = useMemo(() => getVisibleNodeIds(nodes, expandedIds), [expandedIds, nodes]);

  const handleSelect = useCallback(node => onSelect(node), [onSelect]);

  return (
    <div className="mindmap-canvas-shell">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 42, near: 0.1, far: 500 }}
        dpr={[1, 2]}
        frameloop="always"
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        shadows
        onCreated={({ gl }) => gl.setClearColor('#160d24', 1)}
      >
        <Scene
          moveMode={moveMode}
          nodes={nodes}
          visibleNodeIds={visibleNodeIds}
          selectedId={selectedId}
          resetSignal={resetSignal}
          zoomSignal={zoomSignal}
          onSelect={handleSelect}
          onFocus={onFocus}
          detailsNodeId={detailsNodeId}
          onShowDetails={onShowDetails}
        />
      </Canvas>
      <div className="canvas-hint"><span /> Drag để quay · Scroll để phóng · Click để khám phá</div>
    </div>
  );
}

export default memo(MindMap3D);
