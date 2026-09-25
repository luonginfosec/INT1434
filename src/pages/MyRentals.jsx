import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Package, CalendarDays } from "lucide-react";
import { useRental } from "../context/RentalContext";
import { useUser } from "../context/UserContext";
import { orderStatuses } from "../data/mockData";
import { money, dateText, addDays } from "../utils/format";
import Badge from "../components/Badge";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { useToast } from "../components/Toast";
export default function MyRentals() {
  const { orders, cancelOrder } = useRental();
  const { user } = useUser();
  const [tab, setTab] = useState("Tất cả");
  const [confirm, setConfirm] = useState(null);
  const [params] = useSearchParams();
  const toast = useToast();
  const shown = orders.filter((o) => tab === "Tất cả" || o.status === tab);
  return (
    <div className="container page">
      <div className="page-heading">
        <span className="eyebrow">GÓC BẠN ĐỌC</span>
        <h1>Đơn thuê của tôi</h1>
        <p>Theo dõi những câu chuyện bạn đã mang về.</p>
      </div>
      {!user && (
        <div className="info-note">
          Đang hiển thị đơn khách vãng lai trên trình duyệt này. Đăng nhập để
          xem đơn riêng của tài khoản.
        </div>
      )}
      <div className="tabs order-tabs" aria-label="Lọc trạng thái đơn">
        {orderStatuses.map((s) => (
          <button
            key={s}
            className={s === tab ? "active" : ""}
            aria-pressed={s === tab}
            onClick={() => setTab(s)}
          >
            {s}
            <span>
              {orders.filter((o) => s === "Tất cả" || o.status === s).length}
            </span>
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="orders-list">
          {shown.map((order) => (
            <article
              className={`panel order-card ${params.get("order") === order.id ? "highlight-order" : ""}`}
              key={order.id}
            >
              <div className="order-top">
                <div>
                  <Package size={20} />
                  <strong>{order.id}</strong>
                  <small>Đặt ngày {dateText(order.createdAt)}</small>
                </div>
                <Badge
                  tone={
                    order.status === "Đã hủy"
                      ? "gray"
                      : order.status === "Đã trả"
                        ? "green"
                        : ""
                  }
                >
                  {order.status}
                </Badge>
              </div>
              {order.items.map((item) => (
                <div className="order-item" key={item.key}>
                  <img src={item.cover} alt={`Bìa ${item.title}`} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>
                      Tập {item.volume} · {item.quantity} cuốn · {item.days}{" "}
                      ngày
                    </p>
                    <small>
                      Hạn trả:{" "}
                      {dateText(item.due || addDays(order.pickup, item.days))}
                    </small>
                  </div>
                  <strong>
                    {money(item.rentalPrice * item.days * item.quantity)}
                  </strong>
                </div>
              ))}
              <div className="order-bottom">
                <div>
                  <p>
                    <CalendarDays size={16} /> Ngày nhận:{" "}
                    {dateText(order.pickup)}
                  </p>
                  <small>{order.store}</small>
                </div>
                <div>
                  <small>
                    Tiền thuê {money(order.rental)} + cọc {money(order.deposit)}
                  </small>
                  <strong>Tổng: {money(order.rental + order.deposit)}</strong>
                </div>
              </div>
              {order.status === "Chờ nhận" && (
                <div className="cancel-row">
                  {confirm === order.id ? (
                    <>
                      <span>Bạn muốn hủy đơn này?</span>
                      <Button
                        variant="danger"
                        onClick={() => {
                          cancelOrder(order.id);
                          setConfirm(null);
                          toast("Đã hủy đơn thuê.");
                        }}
                      >
                        Đồng ý hủy
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setConfirm(null)}
                      >
                        Giữ đơn
                      </Button>
                    </>
                  ) : (
                    <Button variant="text" onClick={() => setConfirm(order.id)}>
                      Hủy đặt thuê
                    </Button>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title={`Chưa có đơn ${tab === "Tất cả" ? "thuê" : tab.toLowerCase()}`}
          description="Đơn đặt thuê của bạn sẽ xuất hiện ở đây sau khi xác nhận."
        />
      )}
      <p className="data-note">
        Các trạng thái đang thuê/đã trả trong tài khoản reader là dữ liệu mẫu.
        Bản frontend hỗ trợ tạo đơn chờ nhận và hủy đơn chờ nhận.
      </p>
    </div>
  );
}
