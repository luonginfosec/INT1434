import { createContext, useContext } from "react";
import { comics, stores } from "../data/mockData";
import { useStorage } from "../utils/storage";
import { addDays, clamp, localDate, totals } from "../utils/format";
import { useUser } from "./UserContext";
const RentalContext = createContext(null);
const seedOrders = ["Chờ nhận", "Đang thuê", "Đã trả", "Đã hủy"].map(
  (status, index) => {
    const comic = comics[index];
    const pickup = addDays(localDate(), -index * 9);
    const item = {
      ...comic,
      quantity: 1,
      days: 7,
      volume: 1,
      key: `${comic.id}-1`,
    };
    return {
      id: `SR-DEMO-00${index + 1}`,
      owner: "demo",
      createdAt: pickup,
      pickup,
      due: addDays(pickup, 7),
      store: stores[0],
      status,
      items: [item],
      ...totals([item]),
      customer: {
        name: "Nguyễn Minh An",
        phone: "0901234567",
        email: "reader@example.com",
      },
      note: "Đơn minh họa cho tài khoản demo.",
    };
  },
);
const validCart = (value) =>
  Array.isArray(value) &&
  value.every(
    (i) =>
      comics.some((c) => c.id === i.id) &&
      Number.isInteger(i.days) &&
      i.days >= 1 &&
      i.days <= 30 &&
      Number.isInteger(i.quantity) &&
      i.quantity >= 1 &&
      typeof i.key === "string",
  );
export function RentalProvider({ children }) {
  const { user } = useUser();
  const [cart, setCart] = useStorage("storyrent.cart", [], validCart);
  const [orders, setOrders] = useStorage(
    "storyrent.orders",
    seedOrders,
    (value) =>
      Array.isArray(value) &&
      value.every((o) => typeof o.id === "string" && Array.isArray(o.items)),
  );
  function addItem(comic, volume, days) {
    const count = cart
      .filter((i) => i.id === comic.id)
      .reduce((n, i) => n + i.quantity, 0);
    if (count >= comic.stock)
      throw new Error("Số lượng đã chọn đạt tồn kho minh họa.");
    const key = `${comic.id}-${volume}`;
    setCart((previous) =>
      previous.some((i) => i.key === key)
        ? previous.map((i) =>
            i.key === key
              ? { ...i, quantity: i.quantity + 1, days: clamp(days, 1, 30) }
              : i,
          )
        : [
            ...previous,
            { ...comic, key, volume, days: clamp(days, 1, 30), quantity: 1 },
          ],
    );
  }
  function updateItem(key, changes) {
    const item = cart.find((i) => i.key === key);
    if (!item) return;
    const comic = comics.find((c) => c.id === item.id);
    const other = cart
      .filter((i) => i.id === item.id && i.key !== key)
      .reduce((n, i) => n + i.quantity, 0);
    setCart((previous) =>
      previous.map((i) =>
        i.key === key
          ? {
              ...i,
              days: clamp(changes.days ?? i.days, 1, 30),
              quantity: clamp(
                changes.quantity ?? i.quantity,
                1,
                comic.stock - other,
              ),
            }
          : i,
      ),
    );
  }
  function placeOrder(customer) {
    if (!cart.length) throw new Error("Giỏ thuê đang trống.");
    const order = {
      id: `SR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      owner: user?.id || "guest",
      createdAt: localDate(),
      pickup: customer.pickup,
      due: addDays(customer.pickup, Math.max(...cart.map((i) => i.days))),
      store: customer.store,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      note: customer.note,
      status: "Chờ nhận",
      items: cart.map((i) => ({ ...i, due: addDays(customer.pickup, i.days) })),
      ...totals(cart),
    };
    setOrders((previous) => [order, ...previous]);
    setCart([]);
    return order;
  }
  const myOrders = orders.filter((o) => o.owner === (user?.id || "guest"));
  function cancelOrder(id) {
    setOrders((previous) =>
      previous.map((o) =>
        o.id === id &&
        o.owner === (user?.id || "guest") &&
        o.status === "Chờ nhận"
          ? { ...o, status: "Đã hủy" }
          : o,
      ),
    );
  }
  return (
    <RentalContext.Provider
      value={{
        cart,
        orders: myOrders,
        addItem,
        updateItem,
        removeItem: (key) => setCart((p) => p.filter((i) => i.key !== key)),
        placeOrder,
        cancelOrder,
        summary: totals(cart),
        count: cart.reduce((n, i) => n + i.quantity, 0),
      }}
    >
      {children}
    </RentalContext.Provider>
  );
}
export const useRental = () => useContext(RentalContext);
