# INT1434 - Lập trình Web

## Bài thực hành 1: StoryRent

Giao diện website cửa hàng cho thuê truyện bằng ReactJS (Vite + React Router). Hỗ trợ tìm kiếm, lọc truyện, chọn tập, thêm vào giỏ thuê, đặt thuê và theo dõi đơn. Mã nguồn nằm ngay tại thư mục gốc repository.

### Hướng dẫn chạy

Yêu cầu **Node.js 22.12 trở lên** và npm.

```bash
git clone https://github.com/luonginfosec/INT1434.git
cd INT1434
npm ci
npm run dev
```

Mở **http://127.0.0.1:5173** trên trình duyệt. Nếu cổng đang được sử dụng, mở địa chỉ Vite hiển thị trong terminal.

Tài khoản mẫu: **`reader` / `StoryRent2026`** (hoặc chọn “Điền tài khoản mẫu” ở trang đăng nhập).

Ứng dụng chỉ có frontend, dùng dữ liệu mô phỏng và lưu dữ liệu trên trình duyệt bằng `localStorage`; không cần backend, cơ sở dữ liệu hay file `.env`. Đăng nhập và đặt thuê phục vụ demo, chưa kết nối thanh toán thực tế.

### Build và kiểm thử

```bash
npm run build      # tạo bản build trong dist/
npm run preview    # xem bản build tại http://127.0.0.1:4173
npm test           # kiểm thử logic
```

### Cấu trúc chính

```text
src/              # Component, trang, dữ liệu mẫu, CSS và logic ứng dụng
public/           # Ảnh bìa truyện, favicon và cấu hình redirect Netlify
scripts/          # Script tạo ảnh bìa SVG
tests/            # Kiểm thử logic và giao diện
index.html        # Điểm vào ứng dụng
package.json      # Dependency và lệnh chạy
package-lock.json # Khóa phiên bản dependency
vite.config.js    # Cấu hình Vite
vercel.json       # Cấu hình route khi deploy Vercel
```

