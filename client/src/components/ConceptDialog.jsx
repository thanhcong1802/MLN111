import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, Lightbulb, X } from 'lucide-react';
import { conceptDetails } from '../data/conceptDetails';
import './ConceptDialog.css';

export default function ConceptDialog({ node, onClose }) {
  const dialog = useRef(null);
  const titleId = useId();
  const [explanation, example] = conceptDetails[node.title];

  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    <dialog ref={dialog} className="concept-dialog" aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}>
      <div className="concept-dialog__header">
        <span className="concept-dialog__eyebrow">KHÁM PHÁ KHÁI NIỆM</span>
        <button type="button" onClick={onClose} aria-label="Đóng chi tiết" autoFocus><X size={20} /></button>
      </div>
      <h2 id={titleId}>{node.title}</h2>
      <section className="concept-dialog__explanation">
        <h3><BookOpen size={19} /> Giải thích</h3>
        <p>{explanation}</p>
      </section>
      <section className="concept-dialog__example">
        <h3><Lightbulb size={19} /> Ví dụ minh họa</h3>
        <p>{example}</p>
      </section>
      <div className="concept-dialog__footer"><span>Ví dụ minh họa giúp ghi nhớ khái niệm.</span><button type="button" onClick={onClose}>Quay lại sơ đồ</button></div>
    </dialog>, document.body
  );
}
