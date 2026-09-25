# Tài nguyên và dữ liệu

- 24 file `public/covers/*.svg` là bìa **minh họa tự thiết kế bằng SVG** cho bài thực hành. Không dùng hình nhân vật, logo nhà xuất bản hay ảnh bìa thương mại tải từ bên ngoài. Tên truyện giúp người xem nhận diện dữ liệu, không thể hiện quan hệ với tác giả/nhà xuất bản.
- Mã tạo lại bìa: `node scripts/generate-covers.mjs`. Mỗi bìa kết hợp chữ, màu và hình học; tất cả file đã được đưa vào source nên không cần chạy script để mở app.
- `public/favicon.svg` là biểu tượng sách tự vẽ. Biểu tượng trong giao diện thuộc gói `lucide-react` (ISC); xem giấy phép của package trong node_modules hoặc repository [Lucide](https://github.com/lucide-icons/lucide).
- Font UI: Segoe UI (nếu máy có), Arial, sans-serif. Không tải Google Fonts hay file font bên ngoài.
- Dữ liệu truyện: tên và tác giả thực; phần giới thiệu là mô tả ngắn viết cho project. Các số liệu giao dịch/tồn kho/đánh giá, tập khả dụng, địa chỉ cửa hàng và hồ sơ mẫu không phải dữ liệu kinh doanh thật.
- Ảnh chụp do kiểm thử giao diện tạo ra trong `report/images/` và kết quả trong `test-results/` được bỏ qua bởi Git, không thuộc tài nguyên chạy ứng dụng.
