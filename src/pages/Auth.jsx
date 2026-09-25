import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { validateAuth } from "../utils/validation";
import { useUser } from "../context/UserContext";
import { useToast } from "../components/Toast";
import FormField from "../components/FormField";
import Button from "../components/Button";
export default function Auth() {
  const [register, setRegister] = useState(false);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirm: "",
  });
  const user = useUser();
  const navigate = useNavigate();
  const toast = useToast();
  async function submit(e) {
    e.preventDefault();
    const next = validateAuth(data, register);
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      if (register) await user.register(data);
      else await user.login(data.username, data.password);
      toast(
        register
          ? "Tạo tài khoản thành công. Chào mừng bạn!"
          : "Đăng nhập thành công. Chào bạn trở lại!",
      );
      navigate("/");
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setBusy(false);
    }
  }
  const fields = register
    ? [
        ["name", "Họ và tên", "text"],
        ["phone", "Số điện thoại", "tel"],
        ["email", "Email", "email"],
        ["username", "Tên đăng nhập", "text"],
        ["password", "Mật khẩu", "password"],
        ["confirm", "Xác nhận mật khẩu", "password"],
      ]
    : [
        ["username", "Tên đăng nhập", "text"],
        ["password", "Mật khẩu", "password"],
      ];
  return (
    <div className="container auth-page">
      <section className="auth-art">
        <BookOpen size={36} />
        <span className="eyebrow">CHÀO MỪNG ĐẾN VỚI STORYRENT</span>
        <h1>
          Một tài khoản.
          <br />
          Vô vàn
          <br />
          <em>câu chuyện.</em>
        </h1>
        <p>
          Lưu những chuyến phiêu lưu của bạn,
          <br />
          bắt đầu từ một cuốn truyện.
        </p>
        <div className="auth-books">
          <img src="/covers/frieren.svg" alt="Bìa minh họa Frieren" />
          <img src="/covers/one-piece.svg" alt="Bìa minh họa One Piece" />
        </div>
        <small>Bản thực hành React · Dữ liệu lưu trên trình duyệt</small>
      </section>
      <section className="auth-form">
        <div className="tabs">
          <button
            className={!register ? "active" : ""}
            aria-pressed={!register}
            onClick={() => {
              setRegister(false);
              setErrors({});
            }}
          >
            Đăng nhập
          </button>
          <button
            className={register ? "active" : ""}
            aria-pressed={register}
            onClick={() => {
              setRegister(true);
              setErrors({});
            }}
          >
            Đăng ký
          </button>
        </div>
        <h2>{register ? "Gặp bạn ở trang đầu tiên." : "Chào bạn trở lại."}</h2>
        <p>
          {register
            ? "Tạo tài khoản để theo dõi các đơn thuê của mình."
            : "Một câu chuyện hay đang chờ bạn tiếp tục."}
        </p>
        <form noValidate onSubmit={submit}>
          <div className={register ? "form-grid" : ""}>
            {fields.map(([name, label, type]) => (
              <FormField
                key={name}
                name={name}
                label={label}
                type={type}
                value={data[name]}
                onChange={(e) => setData({ ...data, [name]: e.target.value })}
                error={errors[name]}
                show={show}
                onToggle={() => setShow(!show)}
                required
                autoComplete={
                  type === "password"
                    ? register
                      ? "new-password"
                      : "current-password"
                    : name === "name"
                      ? "name"
                      : name === "phone"
                        ? "tel"
                        : name
                }
              />
            ))}
          </div>
          {errors.submit && (
            <p role="alert" className="field-error">
              {errors.submit}
            </p>
          )}
          <Button type="submit" className="full-width" disabled={busy}>
            {busy ? "Đang xử lý..." : register ? "Tạo tài khoản" : "Đăng nhập"}
            <ArrowRight size={18} />
          </Button>
        </form>
        {!register && (
          <div className="demo-account">
            <strong>Khám phá bằng tài khoản mẫu</strong>
            <span>reader / StoryRent2026</span>
            <button
              onClick={() =>
                setData({
                  ...data,
                  username: "reader",
                  password: "StoryRent2026",
                })
              }
            >
              Điền tài khoản mẫu →
            </button>
          </div>
        )}
        <p className="data-note">
          Đăng nhập giả lập, không kết nối máy chủ. Hãy dùng thông tin và mật
          khẩu dành riêng cho bài demo.
        </p>
      </section>
    </div>
  );
}
