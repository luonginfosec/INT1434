import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { money } from "../utils/format";
export default function ComicRow({ comic, index }) {
  return (
    <Link to={`/comic/${comic.id}`} className="comic-row">
      <span className="rank">{String(index + 1).padStart(2, "0")}</span>
      <img src={comic.cover} alt={`Bìa ${comic.title}`} loading="lazy" />
      <div>
        <h3>{comic.title}</h3>
        <p>
          {comic.rentalCount.toLocaleString("vi-VN")} lượt thuê ·{" "}
          {money(comic.rentalPrice)}/ngày
        </p>
      </div>
      <ArrowUpRight size={20} />
    </Link>
  );
}
