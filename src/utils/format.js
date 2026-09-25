export const money = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value,
  );
export const dateText = (value) =>
  new Date(value + (value.length === 10 ? "T12:00:00" : "")).toLocaleDateString(
    "vi-VN",
  );
export const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function addDays(value, days) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return localDate(date);
}
export const totals = (items) =>
  items.reduce(
    (sum, item) => ({
      rental: sum.rental + item.rentalPrice * item.days * item.quantity,
      deposit: sum.deposit + item.deposit * item.quantity,
    }),
    { rental: 0, deposit: 0 },
  );
export const matches = (comic, query) =>
  normalize(
    `${comic.title} ${comic.author} ${comic.category.join(" ")}`,
  ).includes(normalize(query));
export const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, Math.trunc(Number(value)) || min));
