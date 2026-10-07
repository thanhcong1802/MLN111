import { Link } from 'react-router-dom';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__intro">
          <div className="site-footer__title"><BookOpen size={22} /><strong>Triết học Mác – Lênin</strong></div>
          <p>Mỗi ngày hiểu thêm một chút.<br />Khám phá kiến thức, ghi nhớ và vận dụng theo cách của bạn.</p>
          <span className="site-footer__motto">KHÁM PHÁ · GHI NHỚ · VẬN DỤNG</span>
        </div>
        <div className="site-footer__links" aria-label="Liên kết học tập">
          <h2>Tiếp tục hành trình học</h2>
          <Link to="/">Trang chủ <ArrowUpRight size={15} /></Link>
          <Link to="/mindmap">Sơ đồ tư duy 3D <ArrowUpRight size={15} /></Link>
          <Link to="/flashcards">Ôn tập flashcard <ArrowUpRight size={15} /></Link>
          <Link to="/quiz">Luyện trắc nghiệm <ArrowUpRight size={15} /></Link>
        </div>
        <div className="site-footer__note">
          <span className="site-footer__accent" aria-hidden="true"><i /><i /><i /></span>
          <h2>Học chủ động, nhớ lâu hơn</h2>
          <p>Bắt đầu từ sơ đồ tổng quan, ôn lại bằng thẻ ghi nhớ và thử sức với câu hỏi trắc nghiệm.</p>
          <Link to="/mindmap" className="site-footer__cta">Khám phá sơ đồ <ArrowUpRight size={16} /></Link>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>Không gian học tập Triết học Mác – Lênin</span>
        <span>Tạo bởi: <strong>Nhóm 4</strong></span>
        <span>Giảng viên bộ môn: <strong>Kiều Văn Nam</strong></span>
      </div>
    </footer>
  );
}
