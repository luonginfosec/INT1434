import { createContext, useContext } from "react";
import { passwordHash, useStorage } from "../utils/storage";
const UserContext = createContext(null);
const demoUser = {
  id: "demo",
  name: "Nguyễn Minh An",
  username: "reader",
  email: "reader@example.com",
  phone: "0901234567",
  address: "Hà Nội",
};
export function UserProvider({ children }) {
  const [user, setUser] = useStorage(
    "storyrent.user",
    null,
    (value) => value === null || typeof value?.id === "string",
  );
  const [accounts, setAccounts] = useStorage(
    "storyrent.accounts",
    [],
    Array.isArray,
  );
  async function register(data) {
    if (
      data.username.toLowerCase() === "reader" ||
      accounts.some(
        (a) =>
          a.username.toLowerCase() === data.username.toLowerCase() ||
          a.email.toLowerCase() === data.email.toLowerCase(),
      )
    )
      throw new Error("Tên đăng nhập hoặc email đã được sử dụng.");
    const salt = crypto.randomUUID();
    const profile = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      username: data.username.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      address: "",
    };
    const hash = await passwordHash(data.password, salt);
    setAccounts((previous) => [...previous, { ...profile, salt, hash }]);
    setUser(profile);
  }
  async function login(username, password) {
    if (username.toLowerCase() === "reader" && password === "StoryRent2026") {
      const saved = accounts.find((a) => a.id === "demo");
      setUser(saved ? strip(saved) : demoUser);
      return;
    }
    const account = accounts.find(
      (a) => a.username.toLowerCase() === username.trim().toLowerCase(),
    );
    if (
      !account ||
      !account.hash ||
      (await passwordHash(password, account.salt)) !== account.hash
    )
      throw new Error("Tên đăng nhập hoặc mật khẩu chưa đúng.");
    setUser(strip(account));
  }
  function strip(account) {
    const { id, name, username, email, phone, address } = account;
    return { id, name, username, email, phone, address };
  }
  function updateProfile(profile) {
    if (
      accounts.some(
        (a) =>
          a.id !== user.id &&
          a.email.toLowerCase() === profile.email.toLowerCase(),
      )
    )
      throw new Error("Email đã được dùng bởi tài khoản khác.");
    const next = { ...user, ...profile };
    setUser(next);
    setAccounts((previous) =>
      previous.some((a) => a.id === user.id)
        ? previous.map((a) => (a.id === user.id ? { ...a, ...next } : a))
        : [...previous, next],
    );
  }
  return (
    <UserContext.Provider
      value={{
        user,
        register,
        login,
        logout: () => setUser(null),
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export const useUser = () => useContext(UserContext);
