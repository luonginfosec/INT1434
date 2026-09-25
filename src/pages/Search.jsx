import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { comics } from "../data/mockData";
import { matches } from "../utils/format";
import SearchBar from "../components/SearchBar";
import ComicCard from "../components/ComicCard";
import EmptyState from "../components/EmptyState";
export default function Search() {
  const [params] = useSearchParams();
  const query = (params.get("q") || "").trim();
  const result = useMemo(
    () => comics.filter((c) => matches(c, query)),
    [query],
  );
  return (
    <div className="container page">
      <div className="search-heading">
        <span className="eyebrow">BẠN MUỐN ĐỌC GÌ?</span>
        <h1>Tìm câu chuyện tiếp theo</h1>
        <SearchBar large />
        <div className="suggestions">
          <span>Thử tìm:</span>
          {["One Piece", "Conan", "Fantasy"].map((q) => (
            <Link key={q} to={`/search?q=${encodeURIComponent(q)}`}>
              {q}
            </Link>
          ))}
        </div>
      </div>
      {!query ? (
        <EmptyState
          title="Mỗi chuyến phiêu lưu bắt đầu bằng một từ khóa"
          description="Nhập tên truyện, tác giả hoặc thể loại. Bạn có thể tìm bằng tiếng Việt không dấu."
          to={null}
        />
      ) : result.length ? (
        <>
          <div className="section-title">
            <h2>Kết quả cho “{query}”</h2>
            <span>{result.length} đầu truyện</span>
          </div>
          <div className="comic-grid search-grid">
            {result.map((c) => (
              <ComicCard key={c.id} comic={c} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title={`Không tìm thấy “${query}”`}
          description="Kiểm tra lại chính tả hoặc thử tìm theo tên tác giả, thể loại."
        />
      )}
    </div>
  );
}
