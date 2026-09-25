import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, LogOut, UserRound } from "lucide-react";
import { useUser } from "../context/UserContext";
import { validateProfile } from "../utils/validation";
import { useToast } from "../components/Toast";
import FormField from "../components/FormField";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
export default function Profile() {
  const { user, updateProfile, logout } = useUser();
  return user ? (
    <ProfileForm
      key={user.id}
      user={user}
      updateProfile={updateProfile}
      logout={logout}
    />
  ) : (
    <div className="container page">
      <EmptyState
        title="Góc riêng của bạn đọc"
        description="Đăng nhập để xem và chỉnh sửa hồ sơ cá nhân."
        to="/auth"
        action="Đăng nhập / Đăng ký"
      />
    </div>
  );
}
function ProfileForm({ user, updateProfile, logout }) {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState(user);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  function submit(e) {
    e.preventDefault();
    const next = validateProfile(data);
    setErrors(next);
    if (Object.keys(next).length) return;
    try {
      updateProfile({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),
      });
      setEditing(false);
      toast("Đã lưu hồ sơ của bạn.");
    } catch (error) {
      setErrors({ email: error.message });
    }
  }
  return (
    <div className="container page">
      <div className="page-heading">
        <span className="eyebrow">GÓC BẠN ĐỌC</span>
        <h1>Hồ sơ cá nhân</h1>
        <p>Một chút thông tin để mỗi lần nhận truyện thuận tiện hơn.</p>
      </div>
      <div className="profile-layout">
        <aside className="panel profile-card">
          <div className="avatar">
            {user.name.split(" ").at(-1).slice(0, 1)}
          </div>
          <h2>{user.name}</h2>
          <p>@{user.username}</p>
          <span className="badge">Thành viên StoryRent</span>
          <Button variant="outline" to="/my-rentals">
            Xem đơn thuê
          </Button>
          <Button
            variant="text"
            onClick={() => {
              logout();
              navigate("/");
              toast("Đã đăng xuất.");
            }}
          >
            <LogOut size={16} /> Đăng xuất
          </Button>
        </aside>
        <form className="panel profile-form" noValidate onSubmit={submit}>
          <div className="section-title">
            <h2>
              <UserRound size={20} /> Thông tin tài khoản
            </h2>
            {!editing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(true)}
              >
                <Pencil size={15} /> Chỉnh sửa
              </Button>
            )}
          </div>
          <div className="form-grid">
            {[
              ["name", "Họ và tên"],
              ["username", "Tên tài khoản"],
              ["email", "Email"],
              ["phone", "Số điện thoại"],
              ["address", "Địa chỉ"],
            ].map(([name, label]) => (
              <FormField
                key={name}
                label={label}
                name={name}
                value={data[name]}
                type={
                  name === "email" ? "email" : name === "phone" ? "tel" : "text"
                }
                readOnly={!editing || name === "username"}
                onChange={(e) => setData({ ...data, [name]: e.target.value })}
                error={errors[name]}
              />
            ))}
          </div>
          {editing && (
            <div className="button-row">
              <Button type="submit">Lưu thay đổi</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setData(user);
                  setErrors({});
                  setEditing(false);
                }}
              >
                Hủy chỉnh sửa
              </Button>
            </div>
          )}
          <p className="data-note">
            Tên tài khoản không thể thay đổi. Hồ sơ được lưu tại trình duyệt
            đang sử dụng.
          </p>
        </form>
      </div>
    </div>
  );
}
