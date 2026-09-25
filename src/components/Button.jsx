import { Link } from "react-router-dom";
export default function Button({
  to,
  variant = "",
  className = "",
  children,
  ...props
}) {
  const classes = `button ${variant ? `button-${variant}` : ""} ${className}`;
  return to ? (
    <Link to={to} className={classes} {...props}>
      {children}
    </Link>
  ) : (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
