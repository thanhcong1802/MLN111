export default function Breadcrumb({ path }) {
  if (!path.length) return null;
  return (
    <nav className="mindmap-breadcrumb" aria-label="Vị trí hiện tại">
      <span>Triết học Mác – Lênin</span>
      {path.slice(1).map((item, index) => (
        <span key={`${item}-${index}`}><i>/</i><strong>{item}</strong></span>
      ))}
    </nav>
  );
}
