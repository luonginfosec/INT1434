import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
export default function CategoryCard({ name, index, count }) {
  return (
    <Link
      to={`/comics?category=${encodeURIComponent(name)}`}
      className={`category-card category-${index % 4}`}
    >
      <span className="category-number">0{index + 1}</span>
      <h3>{name}</h3>
      <span>
        {count} đầu truyện <ArrowUpRight size={18} />
      </span>
    </Link>
  );
}
