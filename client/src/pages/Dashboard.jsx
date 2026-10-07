import React from 'react';
import { Link } from 'react-router-dom';
import { Network, CreditCard, ClipboardCheck, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  return (
    <>
      <section className="hero">
        <div>
          <span>KHÁM PHÁ · GHI NHỚ · VẬN DỤNG</span>
          <h1>TRIẾT HỌC<br />MÁC – LÊNIN</h1>
          <p>Khám phá 3 chương qua sơ đồ 3D · Ôn tập với flashcard · Củng cố bằng trắc nghiệm</p>
        </div>
        <div className="orbit"><b>HIỂU</b><i>↔</i><b>VẬN DỤNG</b></div>
      </section>
      <h2>Học theo cách của bạn</h2>
      <section className="cards">
        <Link to="/mindmap" className="feature">
          <Network /><h3>Sơ đồ tư duy</h3>
          <p>Khám phá 3 chương và mối liên hệ giữa các khái niệm trong không gian 3D.</p>
          <b>Khám phá <ArrowRight /></b>
        </Link>
        <Link to="/flashcards" className="feature">
          <CreditCard /><h3>Flashcard</h3>
          <p>Lật thẻ để ghi nhớ định nghĩa, quy luật và ví dụ.</p>
          <b>Ôn tập <ArrowRight /></b>
        </Link>
        <Link to="/quiz" className="feature">
          <ClipboardCheck /><h3>Trắc nghiệm ABCD</h3>
          <p>Ngân hàng 600+ câu hỏi trắc nghiệm, mỗi lượt ngẫu nhiên 30 câu.</p>
          <b>Làm bài <ArrowRight /></b>
        </Link>
      </section>
      <section className="stats">
        <div><strong>3</strong><span>chương triết học</span></div>
        <div><strong>40+</strong><span>flashcard</span></div>
        <div><strong>600+</strong><span>câu hỏi trắc nghiệm</span></div>
        <div><strong>30</strong><span>câu / lượt</span></div>
      </section>
    </>
  );
}
