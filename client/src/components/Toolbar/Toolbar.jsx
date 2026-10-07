import { Expand, Eye, Home, Minus, Plus } from 'lucide-react';

export default function Toolbar({ onHome, onZoom, onExpandAll, onCollapseAll }) {
  return (
    <div className="mindmap-toolbar" aria-label="Thanh điều khiển sơ đồ">
      <button type="button" onClick={onHome} title="Về trang chủ"><Home size={17} /><span>Home</span></button>
      <span className="toolbar-divider" />
      <button type="button" onClick={() => onZoom(1)} title="Phóng gần"><Plus size={17} /><span>Zoom +</span></button>
      <button type="button" onClick={() => onZoom(-1)} title="Thuộc xa"><Minus size={17} /><span>Zoom −</span></button>
      <span className="toolbar-divider" />
      <button type="button" onClick={onExpandAll} title="Mở toàn bộ"><Expand size={17} /><span>Expand All</span></button>
      <button type="button" onClick={onCollapseAll} title="Thu gọn"><Eye size={17} /><span>Collapse All</span></button>
    </div>
  );
}
