import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Shuffle, X } from 'lucide-react';
import './MemeBreak.css';

const memes = [
  ['TÔI: HỌC THÊM 5 PHÚT THÔI', 'Cũng là tôi, 30 phút sau: đang nghiên cứu vì sao mèo thích thùng carton.', '😼'],
  ['KHI CÔ HỎI: “CÁC EM HIỂU CHƯA?”', 'Miệng: “Dạ rồi ạ.” Não: đang kết nối lại với máy chủ…', '😵‍💫'],
  ['LƯỢNG ĐỔI DẪN ĐẾN CHẤT ĐỔI', 'Loan Anh đã tích lũy đủ lượng cá. Chất mới: mèo tròn.', '🐟'],
  ['VẬT CHẤT QUYẾT ĐỊNH Ý THỨC', 'Loan Anh: “Bát trống thì ý thức của mình chỉ nghĩ đến cá.”', '🍽️'],
  ['KẾ HOẠCH ÔN THI: RẤT BIỆN CHỨNG', 'Thực tiễn: mở giáo trình. Rồi đóng lại để lấy tinh thần.', '📚'],
  ['KHI CHỌN ĐÁP ÁN CỰC KỲ TỰ TIN', 'Đọc lại câu hỏi: “Chọn phương án KHÔNG đúng.”', '🙀'],
  ['TÔI TRƯỚC VÀ SAU KHI LẬT FLASHCARD', 'Trước: “Dễ mà!” Sau: “À… dễ nhầm.”', '🃏'],
  ['MÂU THUẪN CỦA MỘT CHÚ MÈO HAM HỌC', 'Muốn đạt điểm cao. Cũng muốn ngủ thêm 18 tiếng.', '💤'],
  ['MỘT CÂU NỮA LÀ NGHỈ', 'Loan Anh đã nghe câu này 12 lần. Mèo rất tự hào về bạn.', '💗'],
  ['KHI NÃO ĐÃ HẾT PIN', 'Nghỉ một chút nhé. Ngay cả Loan Anh cũng cần sạc bằng cá.', '🔋']
];

export default function MemeBreak({ onClose, children }) {
  const dialog = useRef(null);
  const titleId = useId();
  const [index, setIndex] = useState(() => Math.floor(Math.random() * memes.length));
  const [headline, punchline, emoji] = memes[index];

  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = overflow; };
  }, []);

  return createPortal(
    <dialog ref={dialog} className="meme-break" aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}>
      <div className="meme-break__header"><div><span>NGHỈ MỘT CHÚT CÙNG</span><h2 id={titleId}>Loan Anh 😺</h2></div><button type="button" onClick={onClose} autoFocus aria-label="Đóng meme"><X size={20} /></button></div>
      <div className={`meme-break__card mood-${index % 3}`} aria-live="polite" aria-atomic="true">
        <h3>{headline}</h3>
        <div className="meme-break__illustration">{children}<span aria-hidden="true">{emoji}</span></div>
        <p>{punchline}</p>
      </div>
      <div className="meme-break__actions">
        <button type="button" onClick={() => setIndex(current => (current + 1 + Math.floor(Math.random() * (memes.length - 1))) % memes.length)}><Shuffle size={17} /> Meme khác</button>
        <button type="button" onClick={onClose}>Học tiếp thôi!</button>
      </div>
      <p className="meme-break__note">Một chút hài hước để thư giãn — không thay thế nội dung bài học.</p>
    </dialog>, document.body
  );
}
