import {
  ArrowRight,
  BookOpen,
  Wallet,
  CalendarCheck,
  Store,
  Sparkles,
} from "lucide-react";
import { comics } from "../data/mockData";
import ComicCard from "../components/ComicCard";
import ComicRow from "../components/ComicRow";
import CategoryCard from "../components/CategoryCard";
import Button from "../components/Button";
const featured = [
  "one-piece",
  "spy-family",
  "frieren",
  "conan",
  "solo-leveling",
  "blue-lock",
].map((id) => comics.find((c) => c.id === id));
function SectionTitle({ eyebrow, title, to = "/comics" }) {
  return (
    <div className="section-title">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <Button to={to} variant="text">
        Xem tất cả <ArrowRight size={17} />
      </Button>
    </div>
  );
}
export default function Home() {
  return (
    <div className="container home">
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-label">
            <Sparkles size={15} /> TỦ TRUYỆN CHO NHỮNG NGÀY THẢNH THƠI
          </div>
          <h1>
            Mượn truyện.
            <br />
            Mở <em>thế giới.</em>
          </h1>
          <p>
            Từ những chuyến phiêu lưu bất tận đến câu chuyện đời thường. Truyện
            bạn thích, luôn có chỗ trên kệ của chúng mình.
          </p>
          <div className="hero-buttons">
            <Button to="/comics">
              Khám phá tủ truyện <ArrowRight size={18} />
            </Button>
            <a className="hero-link" href="#how-it-works">
              Thuê truyện thế nào?
            </a>
          </div>
          <div className="hero-proof">
            <span className="mini-avatars">
              S<span>R</span>
              <span>♡</span>
            </span>
            <div>
              <strong>Đọc nhiều hơn, chi ít hơn</strong>
              <small>Chỉ từ 2.500đ / cuốn / ngày</small>
            </div>
          </div>
        </div>
        <div
          className="hero-art"
          aria-label="Tuyển tập bìa minh họa của StoryRent"
        >
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <span className="art-word">
            READ
            <br />& REPEAT.
          </span>
          <img
            className="hero-book book-left"
            src="/covers/one-piece.svg"
            alt="Bìa minh họa One Piece"
          />
          <img
            className="hero-book book-right"
            src="/covers/spy-family.svg"
            alt="Bìa minh họa Spy x Family"
          />
          <div className="floating-note">
            <BookOpen size={22} />
            <span>
              Chuyện hay đang chờ<strong>Bắt đầu từ một cuốn.</strong>
            </span>
          </div>
          <span className="hero-star">✳</span>
        </div>
      </section>
      <section
        id="how-it-works"
        className="benefit-strip"
        aria-label="Cách thuê truyện"
      >
        {[
          [BookOpen, "24 đầu truyện", "Nhiều thế giới để khám phá"],
          [Wallet, "Từ 2.500đ/ngày", "Chọn thời gian vừa đủ"],
          [CalendarCheck, "Đặt trước online", "Chọn truyện và ngày nhận"],
          [Store, "Nhận tại cửa hàng", "Kiểm tra truyện rồi thanh toán"],
        ].map(([Icon, title, text]) => (
          <div key={title}>
            <Icon size={24} />
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
          </div>
        ))}
      </section>
      <section className="section">
        <SectionTitle eyebrow="GỢI Ý TỪ STORYRENT" title="Hôm nay, đọc gì?" />
        <div className="comic-grid featured-grid">
          {featured.map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>
      </section>
      <section className="section categories-section">
        <SectionTitle
          eyebrow="CHỌN THEO TÂM TRẠNG"
          title="Một thể loại, một thế giới"
        />
        <div className="category-grid">
          {["Phiêu lưu", "Tình cảm", "Trinh thám", "Fantasy"].map(
            (name, index) => (
              <CategoryCard
                key={name}
                name={name}
                index={index}
                count={comics.filter((c) => c.category.includes(name)).length}
              />
            ),
          )}
        </div>
      </section>
      <section className="popular-section">
        <div className="popular-intro">
          <span className="eyebrow">TRÊN KỆ KHÔNG LÂU</span>
          <h2>
            Những cuốn
            <br />
            được tìm đọc
            <br />
            <em>nhiều nhất.</em>
          </h2>
          <p>Một vài gợi ý cho lần ghé thăm đầu tiên của bạn.</p>
          <Button variant="outline" to="/comics?sort=popular">
            Xem bảng tuyển chọn <ArrowRight size={16} />
          </Button>
          <span className="decorative-star">✳</span>
        </div>
        <div className="popular-list">
          {[...comics]
            .sort((a, b) => b.rentalCount - a.rentalCount)
            .slice(0, 5)
            .map((comic, index) => (
              <ComicRow key={comic.id} comic={comic} index={index} />
            ))}
        </div>
      </section>
      <section className="section">
        <SectionTitle
          eyebrow="VỪA GHÉ LÊN KỆ"
          title="Truyện mới cập nhật"
          to="/comics?sort=newest"
        />
        <div className="comic-grid featured-grid">
          {[...comics]
            .reverse()
            .slice(0, 6)
            .map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
        </div>
      </section>
      <section className="closing-banner">
        <div>
          <span className="eyebrow">HẸN BẠN Ở STORYRENT</span>
          <h2>Dành một khoảng nhỏ cho việc đọc.</h2>
          <p>Chọn truyện hôm nay, nhận tại cửa hàng vào ngày bạn muốn.</p>
        </div>
        <Button to="/comics">
          Tìm cuốn đầu tiên <ArrowRight size={18} />
        </Button>
      </section>
    </div>
  );
}
