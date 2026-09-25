import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { money } from "../utils/format";
import { useRental } from "../context/RentalContext";
export default function RentalItem({ item }) {
  const { updateItem, removeItem } = useRental();
  return (
    <article className="rental-item">
      <img src={item.cover} alt={`Bìa ${item.title}`} />
      <div className="rental-info">
        <Link to={`/comic/${item.id}`}>
          <h3>{item.title}</h3>
        </Link>
        <p>
          Tập {item.volume} · {money(item.rentalPrice)}/ngày
        </p>
        <div className="rental-controls">
          <label>
            Số lượng
            <input
              aria-label={`Số lượng ${item.title} tập ${item.volume}`}
              type="number"
              min="1"
              max={item.stock}
              value={item.quantity}
              onChange={(e) =>
                updateItem(item.key, { quantity: e.target.value })
              }
            />
          </label>
          <label>
            Số ngày thuê
            <input
              aria-label={`Số ngày thuê ${item.title} tập ${item.volume}`}
              type="number"
              min="1"
              max="30"
              value={item.days}
              onChange={(e) => updateItem(item.key, { days: e.target.value })}
            />
          </label>
        </div>
      </div>
      <div className="rental-price">
        <strong>{money(item.rentalPrice * item.days * item.quantity)}</strong>
        <small>Cọc: {money(item.deposit * item.quantity)}</small>
        <button
          className="text-danger"
          onClick={() => removeItem(item.key)}
          aria-label={`Xóa ${item.title} tập ${item.volume}`}
        >
          <Trash2 size={15} /> Xóa
        </button>
      </div>
    </article>
  );
}
