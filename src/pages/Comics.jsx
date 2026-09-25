import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { comics } from "../data/mockData";
import { matches } from "../utils/format";
import ComicCard from "../components/ComicCard";
import FilterBar from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
export default function Comics() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "",
    category = params.get("category") || "",
    status = params.get("status") || "",
    sort = params.get("sort") || "popular";
  const result = useMemo(() => {
    const rows = comics.filter(
      (c) =>
        matches(c, query) &&
        (!category || c.category.includes(category)) &&
        (!status || c.status === status),
    );
    return rows.sort((a, b) =>
      sort === "price-asc"
        ? a.rentalPrice - b.rentalPrice
        : sort === "price-desc"
          ? b.rentalPrice - a.rentalPrice
          : sort === "newest"
            ? b.addedAt.localeCompare(a.addedAt)
            : sort === "title"
              ? a.title.localeCompare(b.title, "vi")
              : b.rentalCount - a.rentalCount,
    );
  }, [query, category, status, sort]);
  function change(key, value) {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  }
  return (
    <div className="container page">
      <div className="page-heading">
        <span className="eyebrow">BỘ SƯU TẬP STORYRENT</span>
        <h1>
          Tủ truyện của chúng mình<span className="title-dot">.</span>
        </h1>
        <p>
          Tìm một câu chuyện hợp với bạn. Phần còn lại, để trí tưởng tượng dẫn
          đường.
        </p>
      </div>
      <div className="catalog-layout">
        <FilterBar
          filters={{ query, category, status }}
          onChange={change}
          onReset={() => setParams({})}
        />
        <section>
          <div className="results-toolbar">
            <p>
              <strong>{result.length}</strong> đầu truyện{" "}
              {category && <span> / {category}</span>}
            </p>
            <label>
              Sắp xếp{" "}
              <select
                aria-label="Sắp xếp truyện"
                value={sort}
                onChange={(e) => change("sort", e.target.value)}
              >
                <option value="popular">Thuê nhiều nhất</option>
                <option value="newest">Mới cập nhật</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="title">Tên A–Z</option>
              </select>
            </label>
          </div>
          {result.length ? (
            <div className="comic-grid catalog-grid">
              {result.map((c) => (
                <ComicCard key={c.id} comic={c} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Chưa tìm thấy truyện phù hợp"
              description="Thử bỏ bớt bộ lọc hoặc dùng từ khóa khác."
              to="/comics"
              action="Xóa bộ lọc"
            />
          )}
          <p className="data-note">
            Ảnh bìa được thiết kế minh họa, không phải bìa phát hành. Giá, tồn
            kho và lượt thuê là dữ liệu giả lập.
          </p>
        </section>
      </div>
    </div>
  );
}
