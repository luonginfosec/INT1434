import { Link } from "react-router-dom";
import { ArrowUpRight, Star } from "lucide-react";
import { money } from "../utils/format";
import Badge from "./Badge";
export default function ComicCard({ comic }) {
  return (
    <article className="comic-card">
      <Link
        to={`/comic/${comic.id}`}
        className="cover-link"
        aria-label={`Xem ${comic.title}`}
      >
        <img
          src={comic.cover}
          alt={`Bìa minh họa ${comic.title}`}
          loading="lazy"
          width="400"
          height="560"
        />
        <Badge tone={comic.stock ? "green" : "gray"}>
          {comic.stock ? "Còn truyện" : "Hết truyện"}
        </Badge>
        <span className="cover-arrow">
          <ArrowUpRight size={20} />
        </span>
      </Link>
      <div className="card-body">
        <div className="card-meta">
          <span>{comic.category[0]}</span>
          <span>
            <Star size={12} fill="currentColor" />
            {comic.rating}
          </span>
        </div>
        <h3>
          <Link to={`/comic/${comic.id}`}>{comic.title}</Link>
        </h3>
        <p className="author">{comic.author}</p>
        <div className="card-bottom">
          <span>
            <strong>{money(comic.rentalPrice)}</strong>
            <small> / ngày</small>
          </span>
          <Link
            to={`/comic/${comic.id}`}
            aria-label={`Chọn thuê ${comic.title}`}
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
