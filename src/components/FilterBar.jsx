import { SlidersHorizontal } from "lucide-react";
import { categories } from "../data/mockData";
export default function FilterBar({ filters, onChange, onReset }) {
  return (
    <aside className="filter-panel">
      <div className="filter-title">
        <h3>
          <SlidersHorizontal size={18} /> Bộ lọc
        </h3>
        <button onClick={onReset}>Đặt lại</button>
      </div>
      <label className="field">
        Tìm trong tủ truyện
        <input
          value={filters.query}
          onChange={(e) => onChange("q", e.target.value)}
          placeholder="Tên truyện, tác giả..."
        />
      </label>
      <fieldset>
        <legend>Thể loại</legend>
        {["Tất cả", ...categories].map((category) => (
          <label className="radio-label" key={category}>
            <input
              type="radio"
              name="category"
              checked={
                filters.category === (category === "Tất cả" ? "" : category)
              }
              onChange={() =>
                onChange("category", category === "Tất cả" ? "" : category)
              }
            />
            {category}
          </label>
        ))}
      </fieldset>
      <label className="field">
        Tình trạng
        <select
          aria-label="Tình trạng"
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
        >
          <option value="">Tất cả tình trạng</option>
          <option value="available">Còn truyện</option>
          <option value="unavailable">Hết truyện</option>
        </select>
      </label>
    </aside>
  );
}
