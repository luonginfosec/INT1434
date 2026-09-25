import { Link } from "react-router-dom";
import { BookOpen, ArrowUpRight } from "lucide-react";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="logo">
            <BookOpen /> storyrent
          </Link>
          <p>
            Truyện hay không nhất thiết phải mua.
            <br />
            Chọn một cuốn, mở một thế giới.
          </p>
          <small>Đồ án frontend · INT1434 · 2026</small>
        </div>
        <div>
          <h4>Khám phá</h4>
          <Link to="/comics">
            Tất cả truyện <ArrowUpRight size={14} />
          </Link>
          <Link to="/comics?category=Manga">Manga Nhật Bản</Link>
          <Link to="/comics?category=Manhwa">Manhwa Hàn Quốc</Link>
        </div>
        <div>
          <h4>Góc bạn đọc</h4>
          <Link to="/my-rentals">Đơn thuê của tôi</Link>
          <Link to="/profile">Tài khoản</Link>
          <Link to="/comics?sort=newest">Có gì mới?</Link>
        </div>
        <div>
          <h4>Ghé cửa hàng</h4>
          <p>
            25 phố Sách, Cầu Giấy, Hà Nội
            <br />
            08:00 – 21:00, mỗi ngày
            <br />
            <small>Địa chỉ minh họa, không phải cửa hàng thật.</small>
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 StoryRent. Bài thực hành React.</span>
        <span>Giá, lượt thuê, đánh giá và tồn kho là dữ liệu minh họa.</span>
      </div>
    </footer>
  );
}
