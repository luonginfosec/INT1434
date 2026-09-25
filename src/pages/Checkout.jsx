import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, CheckCircle2, MapPin } from "lucide-react";
import { useRental } from "../context/RentalContext";
import { useUser } from "../context/UserContext";
import { stores } from "../data/mockData";
import { dateText, localDate, money, addDays } from "../utils/format";
import { validateProfile } from "../utils/validation";
import FormField from "../components/FormField";
import OrderSummary from "../components/OrderSummary";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
export default function Checkout() {
  const { cart, summary, placeOrder } = useRental();
  const { user } = useUser();
  const [data, setData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    pickup: localDate(),
    store: stores[0],
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const locked = useRef(false);
  function change(e) {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors((previous) => ({
      ...previous,
      [e.target.name]: undefined,
      submit: undefined,
    }));
  }
  function submit(e) {
    e.preventDefault();
    if (locked.current) return;
    const next = validateProfile(data);
    if (
      !data.pickup ||
      data.pickup < localDate() ||
      data.pickup > addDays(localDate(), 30)
    )
      next.pickup = "Chọn ngày nhận từ hôm nay đến 30 ngày tới.";
    if (!stores.includes(data.store)) next.store = "Vui lòng chọn cửa hàng.";
    setErrors(next);
    if (Object.keys(next).length) return;
    locked.current = true;
    try {
      setSuccess(placeOrder(data));
    } catch (error) {
      setErrors({ submit: error.message });
      locked.current = false;
    }
  }
  if (success)
    return (
      <div className="container page">
        <section className="success-panel">
          <span className="success-icon">
            <CheckCircle2 size={50} />
          </span>
          <span className="eyebrow">HẸN BẠN TẠI CỬA HÀNG</span>
          <h1>Đã ghi nhận đặt thuê!</h1>
          <p>
            Mã đơn của bạn: <strong>{success.id}</strong>
          </p>
          <div className="success-details">
            <p>
              <strong>Ngày nhận</strong>
              {dateText(success.pickup)}
            </p>
            <p>
              <strong>Cửa hàng</strong>
              {success.store}
            </p>
            <p>
              <strong>Thanh toán khi nhận</strong>
              {money(success.rental + success.deposit)}
            </p>
          </div>
          <p>
            Đơn giả lập đã được lưu trên trình duyệt này. Chưa có giao dịch hay
            email thực tế.
          </p>
          <div className="button-row">
            <Button to={`/my-rentals?order=${success.id}`}>Xem đơn thuê</Button>
            <Button variant="outline" to="/comics">
              Tiếp tục khám phá
            </Button>
          </div>
        </section>
      </div>
    );
  if (!cart.length)
    return (
      <div className="container page">
        <EmptyState
          title="Chưa có truyện để đặt thuê"
          description="Thêm truyện vào giỏ trước khi xác nhận."
        />
      </div>
    );
  return (
    <div className="container page">
      <div className="page-heading">
        <span className="eyebrow">CHỈ CÒN MỘT BƯỚC NỮA</span>
        <h1>Xác nhận đặt thuê</h1>
        <p>Kiểm tra thông tin để chúng mình chuẩn bị truyện cho bạn.</p>
      </div>
      <div className="checkout-steps">
        <span>
          <Check size={16} /> Chọn truyện
        </span>
        <span className="active">02 · Thông tin nhận</span>
        <span>03 · Hoàn tất</span>
      </div>
      <form noValidate onSubmit={submit} className="two-column">
        <div className="panel checkout-form">
          <h2>Thông tin người nhận</h2>
          {!user && (
            <p className="info-note">
              Bạn đang đặt với tư cách khách. <Link to="/auth">Đăng nhập</Link>{" "}
              trước khi xác nhận nếu muốn lưu đơn vào tài khoản.
            </p>
          )}
          <div className="form-grid">
            {[
              ["name", "Họ và tên", "text"],
              ["phone", "Số điện thoại", "tel"],
              ["email", "Email", "email"],
            ].map(([name, label, type]) => (
              <FormField
                key={name}
                name={name}
                label={label}
                type={type}
                value={data[name]}
                onChange={change}
                error={errors[name]}
                required
                autoComplete={
                  name === "name" ? "name" : name === "phone" ? "tel" : "email"
                }
              />
            ))}
          </div>
          <h2>
            <MapPin size={20} /> Nhận truyện tại cửa hàng
          </h2>
          <div className="form-grid">
            <FormField
              name="pickup"
              label="Ngày nhận"
              type="date"
              min={localDate()}
              max={addDays(localDate(), 30)}
              value={data.pickup}
              onChange={change}
              error={errors.pickup}
              required
            />
            <label className="field">
              Cửa hàng nhận
              <select name="store" value={data.store} onChange={change}>
                {stores.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            Ghi chú (không bắt buộc)
            <textarea
              name="note"
              maxLength={500}
              rows="3"
              value={data.note}
              onChange={change}
              placeholder="Ví dụ: Mình ghé lấy sau 17 giờ."
            />
          </label>
          <h2>Truyện đã chọn</h2>
          <div className="checkout-items">
            {cart.map((item) => (
              <div key={item.key}>
                <img src={item.cover} alt={`Bìa ${item.title}`} />
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    Tập {item.volume} · {item.quantity} cuốn · {item.days} ngày
                  </small>
                  <small>
                    Hạn trả:{" "}
                    {dateText(addDays(data.pickup || localDate(), item.days))}
                  </small>
                </span>
                <strong>
                  {money(item.rentalPrice * item.days * item.quantity)}
                </strong>
              </div>
            ))}
          </div>
        </div>
        <OrderSummary summary={summary}>
          {errors.submit && (
            <p role="alert" className="field-error">
              {errors.submit}
            </p>
          )}
          <Button type="submit" className="full-width">
            Xác nhận đặt thuê <Check size={18} />
          </Button>
          <Link className="back-link" to="/rental-cart">
            Quay lại giỏ thuê
          </Link>
        </OrderSummary>
      </form>
    </div>
  );
}
