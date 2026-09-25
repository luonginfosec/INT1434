import Button from "../components/Button";
export default function NotFound() {
  return (
    <div className="container not-found">
      <span className="error-code">404</span>
      <span className="eyebrow">CÓ VẺ BẠN ĐÃ LẬT NHẦM TRANG</span>
      <h1>Câu chuyện này chưa có trên kệ.</h1>
      <p>
        Đường dẫn không tồn tại hoặc mã truyện chưa đúng.
        <br />
        Cùng quay lại và tìm một câu chuyện khác nhé.
      </p>
      <div className="button-row">
        <Button to="/">Về trang chủ</Button>
        <Button variant="outline" to="/comics">
          Khám phá tủ truyện
        </Button>
      </div>
    </div>
  );
}
