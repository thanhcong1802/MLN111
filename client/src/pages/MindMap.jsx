import React, { useMemo, useState } from 'react';
import { Network, Sparkles } from 'lucide-react';
import philosophyData from '../data/philosophy.json';
import { buildMindMap } from '../utils/layoutMindMap';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Legend from '../components/Legend/Legend';
import Toolbar from '../components/Toolbar/Toolbar';
import MindMap3D from '../components/MindMap3D/MindMap3D';
import ConceptDialog from '../components/ConceptDialog';
import './mindmap.css';

const ROOT = philosophyData;
const NODES = buildMindMap(ROOT);
const INITIAL_EXPANDED = ['chapter-1', 'chapter-2', 'chapter-3'];

export default function MindMap() {
  const [selectedId, setSelectedId] = useState('root');
  const [hasSelection, setHasSelection] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState(new Set(INITIAL_EXPANDED));
  const [zoomSignal, setZoomSignal] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const nodeMap = useMemo(() => new Map(NODES.map(node => [node.id, node])), []);
  const selectedNode = nodeMap.get(selectedId) || NODES[0];
  const breadcrumb = useMemo(() => (selectedNode.path || [ROOT.id]).map(id => nodeMap.get(id)?.title || id), [selectedNode]);

  const toggleNode = id => {
    setExpandedIds(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectNode = node => {
    setHasSelection(true);
    setSelectedId(node.id);
    setExpandedIds(current => new Set([...current, ...node.path.slice(1, -1)]));
    if (node.depth > 0 && node.depth < 3) toggleNode(node.id);
  };

  const toggleAll = expanded => setExpandedIds(new Set(expanded ? NODES.filter(node => node.depth > 0).map(node => node.id) : []));

  return (
    <section className="mindmap-page">
      <header className="mindmap-page-header">
        <div>
          <span className="mindmap-hero__eyebrow"><Sparkles size={14} /> Học kiến thức theo hệ thống</span>
          <h1>{ROOT.title}</h1>
          <p>{ROOT.subtitle}</p>
        </div>
        <div className="mindmap-header-meta"><strong>3</strong><span>Chương chính</span><b>•</b><strong>20+</strong><span>Nút kiến thức</span></div>
      </header>

      <div className="mindmap-topbar">
        <Breadcrumb path={breadcrumb} />
      </div>

      <div className="mindmap-workspace">
        <div className="mindmap-stage">
          <div className="mindmap-stage__header">
            <div><span className="mindmap-stage__eyebrow"><Network size={14} /> SƠ ĐỒ TƯ DUY 3D</span><h2>Khám phá kiến thức theo quan hệ</h2></div>
            <span className="mindmap-stage__status"><i /> Đang hoạt động</span>
          </div>
          <MindMap3D nodes={NODES} selectedId={selectedId} expandedIds={expandedIds} resetSignal={resetSignal} zoomSignal={zoomSignal} onSelect={selectNode} detailsNodeId={hasSelection ? selectedId : null} onShowDetails={() => setDetailsOpen(true)} />
          <Toolbar onHome={() => setResetSignal(value => value + 1)} onZoom={value => setZoomSignal(signal => signal + value)} onExpandAll={() => toggleAll(true)} onCollapseAll={() => toggleAll(false)} />
          <Legend />
        </div>
      </div>
      {detailsOpen && <ConceptDialog node={selectedNode} onClose={() => setDetailsOpen(false)} />}
    </section>
  );
}
