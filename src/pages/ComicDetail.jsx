import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Store,
  ChevronRight,
} from "lucide-react";
import { comics } from "../data/mockData";
import { money } from "../utils/format";
import { useRental } from "../context/RentalContext";
import { useToast } from "../components/Toast";
import Button from "../components/Button";
import Badge from "../components/Badge";
import ComicCard from "../components/ComicCard";
import NotFound from "./NotFound";
export default function ComicDetail() {
  const { id } = useParams();
  const comic = comics.find((c) => c.id === id);
  return comic ? <Detail key={id} comic={comic} /> : <NotFound />;
}
function Detail({ comic }) {
  const [volume, setVolume] = useState(1);
  const [days, setDays] = useState(7);
  const { addItem } = useRental();
  const toast = useToast();
  const related = comics
    .filter(
      (c) =>
        c.id !== comic.id &&
        c.category.some(
          (tag) => comic.category.includes(tag) && tag !== "Manga",
        ),
    )
    .slice(0, 4);
  function add() {
    try {
      addItem(comic, volume, days);
      toast(`Đã thêm ${comic.title} · tập ${volume} vào giỏ thuê.`);
    } catch (error) {
      toast(error.message);
    }
  }
  return (
    <div className="container page">
      <div className="breadcrumbs">
        <Link to="/">Trang chủ</Link>
        <ChevronRight size={14} />
        <Link to="/comics">Tủ truyện</Link>
        <ChevronRight size={14} />
        <span>{comic.title}</span>
      </div>
      <section className="detail-layout">
        <div className="detail-cover">
          <img src={comic.cover} alt={`Bìa minh họa ${comic.title}`} />
          <small>Bìa minh họa do StoryRent thiết kế</small>
        </div>
        <div className="detail-content">
          <div className="chips">
            {comic.category.map((c) => (
              <Link key={c} to={`/comics?category=${encodeURIComponent(c)}`}>
                <Badge>{c}</Badge>
              </Link>
            ))}
            <Badge tone={comic.stock ? "green" : "gray"}>
              {comic.stock ? `Còn ${comic.stock} cuốn` : "Tạm hết truyện"}
            </Badge>
          </div>
          <h1>{comic.title}</h1>
          <p className="detail-author">
            Tác giả: <strong>{comic.author}</strong>
          </p>
          <div className="rating">
            <Star size={17} fill="currentColor" />
            <strong>{comic.rating}/5</strong>
            <span>
              · {comic.rentalCount.toLocaleString("vi-VN")} lượt thuê · số liệu
              minh họa
            </span>
          </div>
          <p className="description">{comic.description}</p>
          <div className="price-panel">
            <div>
              <small>Giá thuê mỗi cuốn</small>
              <p>
                <strong>{money(comic.rentalPrice)}</strong> / ngày
              </p>
            </div>
            <div>
              <small>Tiền cọc hoàn lại</small>
              <p>{money(comic.deposit)} / cuốn</p>
            </div>
          </div>
          <fieldset className="volume-picker">
            <legend>
              Chọn tập truyện{" "}
              <span>· {comic.volumes.length} tập trong danh mục demo</span>
            </legend>
            <div>
              {comic.volumes.map((v) => (
                <button
                  key={v}
                  aria-pressed={v === volume}
                  onClick={() => setVolume(v)}
                  className={v === volume ? "selected" : ""}
                >
                  Tập {v}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="detail-rental">
            <label className="field">
              Thời gian thuê
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              >
                {[3, 7, 14, 30].map((d) => (
                  <option key={d} value={d}>
                    {d} ngày
                  </option>
                ))}
              </select>
            </label>
            <p>
              Tiền thuê dự kiến
              <strong>{money(comic.rentalPrice * days)}</strong>
              <small>Chưa gồm tiền cọc</small>
            </p>
          </div>
          <Button disabled={!comic.stock} onClick={add} className="full-width">
            <ShoppingBag size={19} />
            {comic.stock ? "Thêm vào giỏ thuê" : "Tạm hết truyện"}
          </Button>
          <div className="detail-policies">
            <span>
              <Store size={17} /> Nhận tại cửa hàng
            </span>
            <span>
              <ShieldCheck size={17} /> Hoàn cọc khi trả truyện
            </span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-title">
          <div>
            <span className="eyebrow">CÙNG GU ĐỌC</span>
            <h2>Có thể bạn cũng thích</h2>
          </div>
          <Link to="/comics">Xem tủ truyện →</Link>
        </div>
        <div className="comic-grid related-grid">
          {related.map((c) => (
            <ComicCard key={c.id} comic={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
