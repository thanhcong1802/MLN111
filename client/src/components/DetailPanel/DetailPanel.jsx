import { BookOpen, ChevronRight, X } from 'lucide-react';

export default function DetailPanel({ node, onClose, onSelect }) {
  if (!node) return (
    <aside className="mindmap-detail">
      <div className="detail-empty">
        <BookOpen size={28} />
        <h2>Chọn một nút</h2>
        <p>Click vào một nút trong sơ đồ để xem nội dung chi tiết.</p>
      </div>
    </aside>
  );

  const chapter = node.parentId ? node.parentId.replace('chapter-', '') : '';
  const children = node.children || [];

  return (
    <aside className="mindmap-detail" style={{ '--detail-color': node.color || '#ffffff' }}>
      <button className="detail-close" type="button" onClick={onClose} aria-label="Đóng chi tiết"><X size={18} /></button>
      <div className="mindmap-detail__top">
        <span className="mindmap-detail__index">{node.depth === 0 ? '00' : String(node.depth).padStart(2, '0')}</span>
        <span className="mindmap-detail__tag">{node.size === 'leaf' ? 'NỘI DUNG' : node.depth === 0 ? 'ROOT' : 'CHỦ ĐỀ'}</span>
      </div>
      <h2>{node.title}</h2>
      <p className="mindmap-detail__subtitle">{node.description || 'Nội dung kiến thức được tổng hợp từ hệ thống triết học Mác – Lênin.'}</p>
      {children.length > 0 && (
        <div className="detail-topics">
          <h3>Các ý chính</h3>
          <ul>{children.slice(0, 8).map(child => (
            <li key={child.id}>
              <button type="button" onClick={() => onSelect(child)}><span>{child.title}</span><ChevronRight size={14} /></button>
            </li>
          ))}</ul>
        </div>
      )}
      <div className="detail-footer">
        <span>{chapter ? `Chương ${chapter}` : 'Nút trung tâm'}</span>
        <button type="button" onClick={() => onSelect(node)}>Xem chi tiết <ChevronRight size={15} /></button>
      </div>
    </aside>
  );
}
