export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export const isPhone = (value) =>
  /^(0\d{9}|\+84\d{9})$/.test(value.replace(/[ .-]/g, ""));
export function validateProfile(data) {
  const errors = {};
  if (!data.name?.trim()) errors.name = "Vui lòng nhập họ tên.";
  if (!isEmail(data.email || "")) errors.email = "Email chưa đúng định dạng.";
  if (!isPhone(data.phone || ""))
    errors.phone = "Nhập số điện thoại Việt Nam hợp lệ.";
  return errors;
}
export function validateAuth(data, register) {
  const errors = register ? validateProfile(data) : {};
  if (!data.username?.trim()) errors.username = "Vui lòng nhập tên đăng nhập.";
  else if (register && !/^[a-zA-Z0-9_]{3,24}$/.test(data.username))
    errors.username = "Dùng 3–24 chữ, số hoặc dấu gạch dưới.";
  if ((data.password || "").length < 8)
    errors.password = "Mật khẩu cần ít nhất 8 ký tự.";
  if (register && data.confirm !== data.password)
    errors.confirm = "Mật khẩu xác nhận chưa trùng khớp.";
  return errors;
}
