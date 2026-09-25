import { BookOpen } from "lucide-react";
import Button from "./Button";
export default function EmptyState({
  title,
  description,
  to = "/comics",
  action = "Khám phá tủ truyện",
}) {
  return (
    <div className="empty-state">
      <BookOpen size={44} />
      <h2>{title}</h2>
      <p>{description}</p>
      {to && <Button to={to}>{action}</Button>}
    </div>
  );
}
