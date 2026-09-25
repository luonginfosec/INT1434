import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
export default function SearchBar({ large = false }) {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const navigate = useNavigate();
  useEffect(() => setQuery(params.get("q") || ""), [params]);
  return (
    <form
      className={`search-bar ${large ? "large" : ""}`}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }}
    >
      <Search size={19} />
      <input
        aria-label="Tìm tên truyện, tác giả, thể loại"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm truyện, tác giả..."
      />
      <button aria-label="Tìm kiếm" type="submit">
        {large ? "Tìm kiếm" : <span>↵</span>}
      </button>
    </form>
  );
}
