import { Eye, EyeOff } from "lucide-react";
export default function FormField({
  label,
  name,
  error,
  show,
  onToggle,
  type = "text",
  ...props
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <span className={type === "password" ? "password-wrap" : "input-wrap"}>
        <input
          id={name}
          name={name}
          type={type === "password" && show ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            onClick={onToggle}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </span>
      {error && (
        <small className="field-error" id={`${name}-error`}>
          {error}
        </small>
      )}
    </div>
  );
}
