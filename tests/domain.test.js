import test from "node:test";
import assert from "node:assert/strict";
import {
  totals,
  normalize,
  matches,
  addDays,
  clamp,
} from "../src/utils/format.js";
import { validateAuth, validateProfile } from "../src/utils/validation.js";
import { comics } from "../src/data/mockData.js";

test("rental charges multiply days and quantity; deposit does not multiply days", () => {
  assert.deepEqual(
    totals([
      { rentalPrice: 4000, deposit: 80000, quantity: 2, days: 7 },
      { rentalPrice: 3000, deposit: 60000, quantity: 1, days: 3 },
    ]),
    { rental: 65000, deposit: 220000 },
  );
  assert.deepEqual(totals([]), { rental: 0, deposit: 0 });
});
test("Vietnamese search supports accents, authors and categories", () => {
  assert.equal(normalize("  THÁM TỬ ĐẸP  "), "tham tu dep");
  assert.ok(
    matches(
      comics.find((c) => c.id === "conan"),
      "tham tu",
    ),
  );
  assert.ok(matches(comics[0], "Eiichiro"));
  assert.ok(matches(comics[0], "phieu luu"));
  assert.ok(!matches(comics[0], "zzzznotfound"));
});
test("return dates cross month/year boundaries", () => {
  assert.equal(addDays("2026-12-29", 7), "2027-01-05");
  assert.equal(addDays("2028-02-28", 1), "2028-02-29");
});
test("quantity/day input uses finite integers within limits", () => {
  assert.equal(clamp("", 1, 30), 1);
  assert.equal(clamp("-5", 1, 30), 1);
  assert.equal(clamp(999, 1, 30), 30);
  assert.equal(clamp(2.9, 1, 30), 2);
});
test("registration rejects blank/invalid data and nonmatching confirmation", () => {
  const empty = validateAuth({}, true);
  assert.ok(
    empty.name &&
      empty.email &&
      empty.phone &&
      empty.username &&
      empty.password,
  );
  const data = {
    name: "Bạn đọc",
    email: "reader2@example.com",
    phone: "0912345678",
    username: "reader2",
    password: "Example2026",
    confirm: "different",
  };
  assert.ok(validateAuth(data, true).confirm);
  data.confirm = data.password;
  assert.deepEqual(validateAuth(data, true), {});
  assert.ok(validateProfile({ ...data, email: "invalid" }).email);
});
test("catalog has unique ids, valid volumes and both availability states", () => {
  assert.equal(comics.length, 24);
  assert.equal(new Set(comics.map((c) => c.id)).size, 24);
  assert.ok(
    comics.every(
      (c) => c.rentalPrice > 0 && c.deposit >= 0 && c.volumes.length > 0,
    ),
  );
  assert.ok(comics.some((c) => c.stock === 0));
});
