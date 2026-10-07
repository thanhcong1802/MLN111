export function searchNodes(root, query) {
  const normalized = String(query || '').trim().toLocaleLowerCase('vi-VN');
  if (!normalized) return [];

  const results = [];
  const visit = (node, path = []) => {
    const searchable = `${node.title} ${node.description || ''}`.toLocale('vi-VN').toLowerCase();
    if (searchable.includes(normalized)) {
      results.push({
        id: node.id,
        title: node.title,
        description: node.description || '',
        path: [...path, node.title]
      });
    }
    for (const child of node.children || []) visit(child, [...path, node.title]);
  };

  visit(root);
  return results.slice(0, 12);
}

export function getAncestors(root, targetId) {
  const ancestors = [];
  const visit = (node, path = []) => {
    if (node.id === targetId) return [...path, node];
    for (const child of node.children || []) {
      const found = visit(child, [...path, node]);
      if (found) return found;
    }
    return null;
  };
  return visit(root) || [];
}
