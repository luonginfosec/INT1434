import { useEffect, useState } from "react";
export function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}
export function useStorage(key, initial, validate = () => true) {
  const [value, setValue] = useState(() => {
    const saved = readStorage(key, initial);
    return validate(saved) ? saved : initial;
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* The current session remains usable if storage is unavailable. */
    }
  }, [key, value]);
  return [value, setValue];
}
export async function passwordHash(password, salt) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${salt}:${password}`),
  );
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
