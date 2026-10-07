import { useEffect, useRef, useState } from 'react';
import { Heart, Fish, Moon, Play, X, Cat, Smile, MessageCircle } from 'lucide-react';
import MemeBreak from './MemeBreak';
import './WebCat.css';

const clampPosition = position => ({
  x: Math.max(Math.min(40, window.innerWidth - 144), Math.min(window.innerWidth - 144, position.x)),
  y: Math.max(Math.min(240, window.innerHeight - 230), Math.min(window.innerHeight - 230, position.y))
});

const stories = [
  'Hôm qua mình đăng ký lớp yoga. Cô bảo làm tư thế con mèo. Mình nằm xuống ngủ. Cô bảo: em hiểu bài hơi sâu.',
  'Mình mở sách ra học. Một con cá trong đầu hỏi: “Có ăn được không?” Mình bảo không. Nó đi. Sự tập trung cũng đi theo.',
  'Mình mua đồng hồ báo thức để dậy sớm. Giờ nhà có hai đứa: một đứa kêu, một đứa ngủ. Phân công lao động rất rõ ràng.',
  'Mình đi phỏng vấn. Người ta hỏi điểm mạnh. Mình đáp: ngủ ở mọi địa hình. Điểm yếu? Không có địa hình nào để thức.',
  'Mình định tiết kiệm cá. Nhưng cá bảo: sống là phải biết tận hưởng. Mình thấy lập luận thuyết phục nên ăn hết.',
  'Có người hỏi sao mình thích thùng carton. Mình đáp: nhà có bốn bức tường, không cần trả tiền. Kinh tế học của mèo.',
  'Mình đặt mật khẩu là “sai”. Mỗi lần quên, máy nhắc: mật khẩu của bạn sai. Công nghệ thật biết quan tâm.',
  'Hôm nay mình tập chạy bộ. Chạy được ba bước thì nhớ: mình là mèo nhà, không phải vận động viên. Thế là về giữ nhà.',
  'Mình định học nhóm với ba con mèo. Kết quả: một đứa ngủ, hai đứa nhìn chim. Mình làm nhóm trưởng vì ngủ trước.',
  'Mình nghe nói kiến thức là sức mạnh. Mình nằm lên giáo trình để hấp thụ. Đến giờ chỉ hấp thụ được hơi ấm.'
];

function CatDrawing({ sleeping, happy }) {
  return (
    <svg viewBox="0 0 120 110" aria-hidden="true">
      <ellipse cx="59" cy="101" rx="39" ry="5" fill="#831843" opacity=".15" />
      <path className="web-cat__tail" d="M86 83 Q113 83 106 56 Q104 49 99 54" fill="none" stroke="#dc9aa9" strokeWidth="11" strokeLinecap="round" />
      <ellipse cx="62" cy="77" rx="29" ry="24" fill="#f4c6cb" stroke="#a75b78" strokeWidth="2" />
      <ellipse cx="57" cy="82" rx="17" ry="17" fill="#fff1eb" />
      <g className="web-cat__head">
        <path d="M28 44 L25 9 Q39 10 49 27 L70 27 Q83 10 96 9 L91 46" fill="#f4c6cb" stroke="#a75b78" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M31 17 L34 35 L45 29 M89 17 L76 29 L87 36" fill="#e88dab" />
        <ellipse cx="60" cy="46" rx="34" ry="28" fill="#f4c6cb" stroke="#a75b78" strokeWidth="2" />
        <path d="M54 21 L56 30 M65 21 L63 30" stroke="#dc9aa9" strokeWidth="4" strokeLinecap="round" />
        {sleeping || happy ? <g fill="none" stroke="#593448" strokeWidth="3" strokeLinecap="round"><path d={sleeping ? 'M39 44 Q45 49 51 44' : 'M39 46 Q45 37 51 46'} /><path d={sleeping ? 'M69 44 Q75 49 81 44' : 'M69 46 Q75 37 81 46'} /></g> : <g className="web-cat__eyes" fill="#593448"><ellipse cx="45" cy="44" rx="4" ry="6" /><ellipse cx="75" cy="44" rx="4" ry="6" /><circle cx="46" cy="42" r="1.5" fill="#fff" /><circle cx="76" cy="42" r="1.5" fill="#fff" /></g>}
        <ellipse cx="36" cy="54" rx="7" ry="4" fill="#ec8dac" opacity=".7" /><ellipse cx="84" cy="54" rx="7" ry="4" fill="#ec8dac" opacity=".7" />
        <path d="M56 49 Q60 46 64 49 L60 54 Z" fill="#be185d" />
        <path d="M60 54 Q57 61 52 56 M60 54 Q63 61 68 56" fill="none" stroke="#593448" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 51 L13 47 M29 56 L12 57 M90 51 L107 47 M91 56 L108 57" stroke="#a75b78" strokeWidth="1.7" strokeLinecap="round" />
      </g>
      <path d="M39 92 Q35 103 47 103 L54 103 M68 103 L78 103 Q86 102 81 92" fill="#fff1eb" stroke="#a75b78" strokeWidth="2" strokeLinecap="round" />
      <path d="M43 68 Q60 76 77 68" fill="none" stroke="#be185d" strokeWidth="5" />
      <circle cx="60" cy="73" r="5" fill="#fbbf24" stroke="#b7791f" strokeWidth="1" />
    </svg>
  );
}

export default function WebCat() {
  const [position, setPosition] = useState(() => clampPosition({ x: window.innerWidth - 150, y: window.innerHeight - 310 }));
  const [hidden, setHidden] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [menu, setMenu] = useState(false);
  const [memeOpen, setMemeOpen] = useState(false);
  const [message, setMessage] = useState('Meo! Mình là Loan Anh. Bấm vào mình để chơi nhé!');
  const [happy, setHappy] = useState(false);
  const [walking, setWalking] = useState(false);
  const [direction, setDirection] = useState(1);
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);
  const storyIndex = useRef(Math.floor(Math.random() * stories.length));
  const timers = useRef(new Set());
  const later = (callback, delay) => {
    const timer = window.setTimeout(() => { timers.current.delete(timer); callback(); }, delay);
    timers.current.add(timer);
    return timer;
  };

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(''), message.length > 80 ? 11000 : 4500);
    return () => window.clearTimeout(timer);
  }, [message]);
  useEffect(() => {
    const resize = () => { setWalking(false); setPosition(current => clampPosition(current)); };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  useEffect(() => {
    if (hidden || sleeping || menu || dragging || happy || memeOpen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => {
      if (document.hidden) return;
      setPosition(current => {
        const next = clampPosition({ x: current.x + (Math.random() - .5) * 260, y: current.y + (Math.random() - .5) * 100 });
        setDirection(next.x >= current.x ? 1 : -1);
        return next;
      });
      setWalking(true);
      later(() => setWalking(false), 2200);
    }, 7500);
    return () => window.clearInterval(interval);
  }, [hidden, sleeping, menu, dragging, happy, memeOpen]);

  const tellStory = () => {
    storyIndex.current = (storyIndex.current + 1) % stories.length;
    setWalking(false);
    setMessage(stories[storyIndex.current]);
  };

  useEffect(() => {
    if (hidden || sleeping || menu || dragging || happy || memeOpen || message) return;
    const timer = window.setInterval(() => {
      if (document.hidden || document.querySelector('dialog[open]')) return;
      storyIndex.current = (storyIndex.current + 1) % stories.length;
      setWalking(false);
      setMessage(stories[storyIndex.current]);
    }, 40000 + Math.random() * 35000);
    return () => window.clearInterval(timer);
  }, [hidden, sleeping, menu, dragging, happy, memeOpen, message]);

  const interact = action => {
    setWalking(false);
    if (action === 'sleep') {
      setSleeping(value => !value);
      setMessage(sleeping ? 'Dậy rồi! Học tiếp cùng nhau nhé.' : 'Zzz… Mình nghỉ một chút nhé.');
    } else {
      setSleeping(false);
      setHappy(true);
      setMessage(action === 'feed' ? 'Măm măm! Cảm ơn bạn đã cho mình ăn cá.' : 'Purr… Thích quá! Bạn học giỏi lắm!');
      later(() => setHappy(false), 2400);
    }
  };

  if (hidden) return <button className="web-cat-restore" type="button" onClick={() => { setHidden(false); setPosition(current => clampPosition(current)); }} aria-label="Hiện mèo Loan Anh" title="Hiện mèo Loan Anh"><Cat size={20} /></button>;

  return (
    <><div className={`web-cat ${walking ? 'is-walking' : ''} ${dragging ? 'is-dragging' : ''} ${sleeping ? 'is-sleeping' : ''}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>
      {message && <div className="web-cat__bubble" role="status">{message}</div>}
      {sleeping && <span className="web-cat__zzz" aria-hidden="true">Zzz</span>}
      {happy && <span className="web-cat__heart" aria-hidden="true">♥</span>}
      <button className="web-cat__character" type="button" aria-label="Mèo Loan Anh: kéo để di chuyển, bấm để tương tác" aria-expanded={menu}
        onPointerDown={event => {
          if (event.button !== 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          const bounds = event.currentTarget.parentElement.getBoundingClientRect();
          drag.current = { startX: event.clientX, startY: event.clientY, x: bounds.left, y: bounds.top, moved: false };
          setPosition({ x: bounds.left, y: bounds.top });
          setWalking(false);
          setDragging(true);
        }}
        onPointerMove={event => {
          if (!drag.current) return;
          const dx = event.clientX - drag.current.startX;
          const dy = event.clientY - drag.current.startY;
          if (Math.abs(dx) + Math.abs(dy) > 5) drag.current.moved = true;
          setPosition(clampPosition({ x: drag.current.x + dx, y: drag.current.y + dy }));
        }}
        onPointerUp={() => { setDragging(false); }}
        onPointerCancel={() => { drag.current = null; setDragging(false); }}
        onClick={() => {
          if (!drag.current?.moved) setMenu(value => !value);
          drag.current = null;
        }}>
        <div className="web-cat__drawing" style={{ transform: `scaleX(${direction})` }}><CatDrawing sleeping={sleeping} happy={happy} /></div>
      </button>
      <span className="web-cat__name">Loan Anh</span>
      <button className="web-cat__meme-shortcut" type="button" title="Meme thư giãn" aria-label="Xem meme thư giãn" onClick={() => { setMemeOpen(true); setMenu(false); setWalking(false); }}><Smile size={16} /></button>
      {menu && <div className="web-cat__menu" aria-label="Chơi cùng Loan Anh">
        <button type="button" title="Vuốt ve" aria-label="Vuốt ve mèo" onClick={() => interact('pet')}><Heart size={17} /></button>
        <button type="button" title="Cho ăn" aria-label="Cho mèo ăn cá" onClick={() => interact('feed')}><Fish size={17} /></button>
        <button type="button" title={sleeping ? 'Đánh thức' : 'Cho ngủ'} aria-label={sleeping ? 'Đánh thức mèo' : 'Cho mèo ngủ'} onClick={() => interact('sleep')}>{sleeping ? <Play size={17} /> : <Moon size={17} />}</button>
        <button type="button" title="Meme thư giãn" aria-label="Xem meme thư giãn cùng Loan Anh" onClick={() => { setMemeOpen(true); setMenu(false); setWalking(false); }}><Smile size={17} /></button>
        <button type="button" title="Kể chuyện tào lao" aria-label="Loan Anh kể chuyện tào lao" onClick={() => { setMenu(false); tellStory(); }}><MessageCircle size={17} /></button>
        <button type="button" title="Ẩn mèo" aria-label="Ẩn mèo" onClick={() => { setHidden(true); setMenu(false); }}><X size={17} /></button>
      </div>}
    </div>
    {memeOpen && <MemeBreak onClose={() => setMemeOpen(false)}><CatDrawing sleeping={false} happy /></MemeBreak>}</>
  );
}
