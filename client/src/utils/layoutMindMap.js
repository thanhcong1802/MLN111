// Give each subtree its own angular sector, weighted by its leaf count.
export function buildMindMap(data) {
  const nodes = [];
  const weight = node => (node.children || []).reduce((sum, child) => sum + weight(child), 0) || 1;
  const visit = (node, parent, start, end) => {
    const depth = parent ? parent.depth + 1 : 0;
    const angle = (start + end) / 2;
    const radius = depth === 0 ? 0 : depth === 1 ? 5 : depth === 2 ? 11 : 20 + (depth - 3) * 7;
    const positioned = {
      ...node, parentId: parent?.id, depth, level: depth,
      path: parent ? [...parent.path, node.id] : [node.id],
      size: depth === 0 ? 'root' : depth === 1 ? 'chapter' : depth === 2 ? 'branch' : 'leaf',
      position: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * 0.7, z: depth % 2 * 0.35 }
    };
    nodes.push(positioned);
    const children = node.children || [];
    const total = children.reduce((sum, child) => sum + weight(child), 0);
    const gap = children.length > 1 ? Math.min(0.06, (end - start) / children.length * 0.12) : 0;
    const available = end - start - gap * Math.max(0, children.length - 1);
    let cursor = start;
    children.forEach(child => {
      const span = available * weight(child) / total;
      visit(child, positioned, cursor, cursor + span);
      cursor += span + gap;
    });
  };
  visit(data, null, -Math.PI / 2, Math.PI * 1.5);
  return nodes;
}

export function getVisibleNodeIds(nodes, expandedIds) {
  const byId = new Map(nodes.map(node => [node.id, node]));
  const visible = new Set();
  const visit = node => {
    visible.add(node.id);
    if (node.depth === 0 || expandedIds.has(node.id)) {
      for (const child of node.children || []) {
        const positioned = byId.get(child.id);
        if (positioned) visit(positioned);
      }
    }
  };
  if (nodes[0]) visit(nodes[0]);
  return visible;
}

export function getNodePosition(node, nodes) {
  return nodes.find(candidate => candidate.id === node.id)?.position || { x: 0, y: 0, z: 0 };
}
