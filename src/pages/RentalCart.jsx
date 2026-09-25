import { ArrowRight, ArrowLeft, ShoppingBag } from "lucide-react";
import { useRental } from "../context/RentalContext";
import Button from "../components/Button";
import RentalItem from "../components/RentalItem";
import EmptyState from "../components/EmptyState";
import OrderSummary from "../components/OrderSummary";
export default function RentalCart() {
  const { cart, count, summary } = useRental();
  return (
    <div className="container page">
      <div className="page-heading">
        <span className="eyebrow">MỘT CHÚT THỜI GIAN CHO BẠN</span>
        <h1>
          Giỏ thuê của bạn <ShoppingBag size={31} />
        </h1>
        <p>
          {count
            ? `${count} cuốn truyện đang chờ bắt đầu hành trình mới.`
            : "Chọn vài cuốn truyện cho những ngày sắp tới."}
        </p>
      </div>
      {!cart.length ? (
        <EmptyState
          title="Giỏ thuê còn trống"
          description="Bạn chưa chọn truyện nào. Ghé tủ truyện để tìm một cuốn mình thích nhé."
        />
      ) : (
        <div className="two-column">
          <div>
            <div className="panel rental-list">
              {cart.map((item) => (
                <RentalItem key={item.key} item={item} />
              ))}
            </div>
            <p className="data-note">
              Thời gian thuê: 1–30 ngày. Số lượng mỗi đầu truyện không vượt tồn
              kho minh họa.
            </p>
            <Button to="/comics" variant="text">
              <ArrowLeft size={16} /> Tiếp tục chọn truyện
            </Button>
          </div>
          <OrderSummary summary={summary}>
            <Button to="/checkout" className="full-width">
              Tiếp tục đặt thuê <ArrowRight size={18} />
            </Button>
          </OrderSummary>
        </div>
      )}
    </div>
  );
}
