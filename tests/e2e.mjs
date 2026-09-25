import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "chrome",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "vi-VN",
});
const page = await context.newPage();
page.setDefaultTimeout(15000);
const failures = [];
const checks = [];
page.on("pageerror", (error) => failures.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") failures.push(message.text());
});
mkdirSync("report/images", { recursive: true });
mkdirSync("test-results", { recursive: true });
async function go(path) {
  await page.goto(base + path);
  await page.waitForLoadState("networkidle");
}
async function shot(name) {
  await page.screenshot({ path: `report/images/${name}.png`, fullPage: false });
}
async function pass(name) {
  checks.push(name);
  console.log(`PASS ${name}`);
}
async function layout() {
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    `page overflow: ${page.url()} @ ${page.viewportSize().width}`,
  );
  await page.locator("img").evaluateAll((images) =>
    Promise.all(
      images.map((img) => {
        img.loading = "eager";
        return img.decode().catch(() => {});
      }),
    ),
  );
  assert.equal(
    await page
      .locator("img")
      .evaluateAll(
        (images) =>
          images.filter((img) => !img.complete || img.naturalWidth === 0)
            .length,
      ),
    0,
    "broken image",
  );
}
try {
  await go("/");
  await shot("home");
  await layout();
  await pass("Home and all original cover images load");
  await page.getByRole("search").getByRole("textbox").fill("tham tu");
  await page.getByRole("button", { name: "Tìm kiếm", exact: true }).click();
  await page.waitForURL("**/search?q=tham%20tu");
  await expect(page.locator(".comic-card")).toHaveCount(1);
  await pass("Header search, accent normalization and URL query");
  await go("/search");
  await expect(
    page.getByText("Mỗi chuyến phiêu lưu bắt đầu bằng một từ khóa"),
  ).toBeVisible();
  await go("/search?q=zzzznotfound");
  await expect(page.locator(".comic-card")).toHaveCount(0);
  await pass("Search empty and no-results states");
  await go("/comics");
  await page.getByRole("radio", { name: "Trinh thám", exact: true }).click();
  await expect(page.locator(".comic-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Đặt lại" }).click();
  await page
    .getByLabel("Tình trạng", { exact: true })
    .selectOption("unavailable");
  await expect(page.locator(".comic-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Đặt lại" }).click();
  await page
    .getByRole("combobox", { name: "Sắp xếp truyện" })
    .selectOption("price-asc");
  await expect(page.locator(".comic-card h3").first()).toHaveText("Doraemon");
  await shot("catalog");
  await pass("Category/status filters, reset and price sort");
  await go("/comic/chainsaw-man");
  assert.ok(
    await page
      .getByRole("button", { name: "Tạm hết truyện", exact: true })
      .isDisabled(),
  );
  await go("/comic/one-piece");
  await page.getByRole("button", { name: "Tập 2", exact: true }).click();
  await shot("detail");
  await page.getByRole("button", { name: "Thêm vào giỏ thuê" }).click();
  await go("/rental-cart");
  await page
    .getByRole("spinbutton", {
      name: "Số ngày thuê One Piece tập 2",
      exact: true,
    })
    .fill("10");
  await page
    .getByRole("spinbutton", { name: "Số lượng One Piece tập 2", exact: true })
    .fill("2");
  await page.reload();
  await page.waitForLoadState("networkidle");
  assert.equal(
    await page
      .getByRole("spinbutton", {
        name: "Số ngày thuê One Piece tập 2",
        exact: true,
      })
      .inputValue(),
    "10",
  );
  assert.ok(
    (await page.locator(".summary-total strong").textContent())
      .replace(/\s/g, "")
      .includes("240.000"),
  );
  await shot("cart");
  await pass(
    "Detail volume choice, unavailable state, cart quantity/days, exact total and persistence",
  );
  await go("/checkout");
  await page.getByRole("button", { name: "Xác nhận đặt thuê" }).click();
  await expect(page.getByText("Vui lòng nhập họ tên.")).toBeVisible();
  await page.getByLabel("Họ và tên", { exact: true }).fill("Trần Bạn Đọc");
  await page.getByLabel("Số điện thoại", { exact: true }).fill("0912345678");
  await page.getByLabel("Email", { exact: true }).fill("bandoc@example.com");
  await shot("checkout");
  await page.getByRole("button", { name: "Xác nhận đặt thuê" }).click();
  await expect(
    page.getByRole("heading", { name: "Đã ghi nhận đặt thuê!" }),
  ).toBeVisible();
  await shot("success");
  await page.getByRole("link", { name: "Xem đơn thuê", exact: true }).click();
  await expect(page.locator(".order-card")).toHaveCount(1);
  await page.reload();
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".order-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Hủy đặt thuê", exact: true }).click();
  await page.getByRole("button", { name: "Đồng ý hủy" }).click();
  await page.getByRole("button", { name: /^Đã hủy/ }).click();
  await expect(page.locator(".order-card")).toHaveCount(1);
  await pass(
    "Checkout validation, order creation, persistence and cancellation",
  );
  await go("/rental-cart");
  await expect(
    page.getByRole("heading", { name: "Giỏ thuê còn trống" }),
  ).toBeVisible();
  await go("/auth");
  await page.getByRole("button", { name: "Đăng ký", exact: true }).click();
  await page
    .getByRole("button", { name: "Tạo tài khoản", exact: true })
    .click();
  await expect(page.getByText("Email chưa đúng định dạng.")).toBeVisible();
  await shot("auth-validation");
  await page.getByLabel("Họ và tên", { exact: true }).fill("Lê Bạn Đọc");
  await page.getByLabel("Số điện thoại", { exact: true }).fill("0987654321");
  await page
    .getByLabel("Email", { exact: true })
    .fill("new-reader@example.com");
  await page.getByLabel("Tên đăng nhập", { exact: true }).fill("new_reader");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("NewReader2026");
  await page.getByLabel("Xác nhận mật khẩu", { exact: true }).fill("wrong");
  await page
    .getByRole("button", { name: "Tạo tài khoản", exact: true })
    .click();
  await expect(
    page.getByText("Mật khẩu xác nhận chưa trùng khớp."),
  ).toBeVisible();
  await page
    .getByLabel("Xác nhận mật khẩu", { exact: true })
    .fill("NewReader2026");
  await page
    .getByRole("button", { name: "Tạo tài khoản", exact: true })
    .click();
  await page.waitForURL(base + "/");
  await go("/my-rentals");
  await expect(page.locator(".order-card")).toHaveCount(0);
  await pass("Registration validation, account creation and order isolation");
  await go("/profile");
  await page.getByRole("button", { name: "Chỉnh sửa", exact: true }).click();
  await page.getByLabel("Địa chỉ", { exact: true }).fill("Hà Đông, Hà Nội");
  await page.getByRole("button", { name: "Lưu thay đổi" }).click();
  await page.reload();
  await page.waitForLoadState("networkidle");
  assert.equal(
    await page.getByLabel("Địa chỉ", { exact: true }).inputValue(),
    "Hà Đông, Hà Nội",
  );
  await shot("profile");
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await go("/auth");
  await page.getByLabel("Tên đăng nhập", { exact: true }).fill("new_reader");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("WrongPass2026");
  await page
    .locator(".auth-form form")
    .getByRole("button", { name: "Đăng nhập", exact: true })
    .click();
  await expect(
    page.getByText("Tên đăng nhập hoặc mật khẩu chưa đúng."),
  ).toBeVisible();
  await page.getByLabel("Mật khẩu", { exact: true }).fill("NewReader2026");
  await page
    .getByRole("button", { name: "Hiện mật khẩu", exact: true })
    .click();
  assert.equal(
    await page.getByLabel("Mật khẩu", { exact: true }).getAttribute("type"),
    "text",
  );
  await page
    .locator(".auth-form form")
    .getByRole("button", { name: "Đăng nhập", exact: true })
    .click();
  await page.waitForURL(base + "/");
  await pass(
    "Profile persistence, logout, wrong/correct password and password visibility",
  );
  await go("/profile");
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await go("/auth");
  await page.getByRole("button", { name: "Điền tài khoản mẫu" }).click();
  await shot("auth");
  await page
    .locator(".auth-form form")
    .getByRole("button", { name: "Đăng nhập", exact: true })
    .click();
  await page.waitForURL(base + "/");
  await go("/my-rentals");
  await shot("orders");
  for (const state of ["Chờ nhận", "Đang thuê", "Đã trả", "Đã hủy"]) {
    await page.getByRole("button", { name: new RegExp("^" + state) }).click();
    await expect(page.locator(".order-card")).toHaveCount(1);
  }
  await pass("Demo account and all rental status filters");
  const routes = [
    "/",
    "/comics",
    "/search?q=Fantasy",
    "/comic/one-piece",
    "/rental-cart",
    "/checkout",
    "/my-rentals",
    "/auth",
    "/profile",
    "/not-a-page",
    "/comic/not-a-comic",
  ];
  for (const width of [1440, 900, 390, 320]) {
    await page.setViewportSize({ width, height: width >= 900 ? 1000 : 844 });
    for (const route of routes) {
      await go(route);
      await layout();
    }
    if (width === 900) {
      await go("/");
      await shot("tablet");
    }
    if (width === 390) {
      await go("/");
      await shot("mobile");
      await page.getByRole("button", { name: "Mở menu", exact: true }).click();
      await expect(
        page.getByRole("navigation", { name: "Điều hướng chính" }),
      ).toBeVisible();
      await page
        .getByRole("navigation")
        .getByRole("link", { name: "Tủ truyện", exact: true })
        .click();
      await page.waitForURL("**/comics");
      assert.equal(
        await page
          .getByRole("button", { name: "Mở menu", exact: true })
          .getAttribute("aria-expanded"),
        "false",
      );
    }
  }
  await pass(
    "All 10 routes + unknown comic: refresh, images and overflow at 1440/900/390/320 px; mobile menu",
  );
  assert.deepEqual(failures, []);
  await pass("No browser console errors or page errors");
} finally {
  writeFileSync(
    "test-results/e2e.json",
    JSON.stringify(
      { date: new Date().toISOString(), checks, consoleErrors: failures },
      null,
      2,
    ),
  );
  await browser.close();
}
