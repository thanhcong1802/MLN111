const chapters = [
  { title: 'Khái luận về triết học', color: '#FB923C' },
  { title: 'Chủ nghĩa duy vật biện chứng', color: '#A78BFA' },
  { title: 'Chủ nghĩa duy vật lịch sử', color: '#2DD4BF' }
];

export default function Legend() {
  return (
    <div className="mindmap-legend">
      <span className="mindmap-legend__title">CHƯƠNG</span>
      <div>
        {chapters.map(chapter => (
          <span key={chapter.color}><i style={{ background: chapter.color }} />{chapter.title}</span>
        ))}
      </div>
    </div>
  );
}
