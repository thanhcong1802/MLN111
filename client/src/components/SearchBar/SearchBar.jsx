import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { searchNodes } from '../../utils/searchNodes';

export default function SearchBar({ root, onSelect }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchNodes(root, query), [query, root]);

  const selectResult = result => {
    onSelect(result.id);
    setQuery('');
  };

  return (
    <div className="search-control">
      <Search size={18} />
      <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm kiếm nội dung..." aria-label="Tìm kiếm nội dung" />
      {query && <button type="button" onClick={() => setQuery('')} aria-label="Xóa tìm kiếm"><X size={16} /></button>}
      {query && (
        <div className="search-results">
          {results.length ? results.map(result => (
            <button key={result.id} type="button" onClick={() => selectResult(result)}>
              <span>{result.title}</span>
              <small>{result.path.join(' > ')}</small>
            </button>
          )) : <div className="search-empty">Không tìm thấy nội dung nào.</div>}
        </div>
      )}
    </div>
  );
}
