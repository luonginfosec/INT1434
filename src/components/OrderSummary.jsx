import { ShieldCheck } from "lucide-react";
import { money } from "../utils/format";
export default function OrderSummary({ summary, children }) {
  return (
    <aside className="order-summary">
      <h2>Thông tin đặt thuê</h2>
      <div>
        <span>Tiền thuê</span>
        <strong>{money(summary.rental)}</strong>
      </div>
      <div>
        <span>Tiền cọc hoàn lại</span>
        <strong>{money(summary.deposit)}</strong>
      </div>
      <div className="summary-total">
        <span>Tổng khi nhận truyện</span>
        <strong>{money(summary.rental + summary.deposit)}</strong>
      </div>
      {children}
      <p className="summary-note">
        <ShieldCheck size={19} /> Tiền cọc được hoàn khi trả đủ truyện, đúng
        tình trạng. Thanh toán tại cửa hàng.
      </p>
    </aside>
  );
}
