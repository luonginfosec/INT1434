import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
page.setDefaultTimeout(15000);
const base=process.env.BASE_URL||'http://127.0.0.1:5173';
const errors=[];page.on('pageerror',error=>errors.push(error.message));
async function go(path){await page.goto(base+path);await page.waitForLoadState('networkidle');}
try{
await go('/comic/one-piece');await page.getByRole('button',{name:'Thêm vào giỏ thuê'}).click();await go('/rental-cart');
const quantity=page.getByRole('spinbutton',{name:'Số lượng One Piece tập 1',exact:true});const days=page.getByRole('spinbutton',{name:'Số ngày thuê One Piece tập 1',exact:true});
await quantity.fill('999');await expect(quantity).toHaveValue('12');await days.fill('99');await expect(days).toHaveValue('30');await days.fill('-1');await expect(days).toHaveValue('1');
await go('/comic/one-piece');await page.getByRole('button',{name:'Tập 2',exact:true}).click();await page.getByRole('button',{name:'Thêm vào giỏ thuê'}).click();await expect(page.getByRole('status')).toContainText('đạt tồn kho');
await go('/rental-cart');await expect(page.locator('.rental-item')).toHaveCount(1);await page.getByRole('button',{name:'Xóa One Piece tập 1',exact:true}).click();await expect(page.getByRole('heading',{name:'Giỏ thuê còn trống'})).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:'Giỏ thuê còn trống'})).toBeVisible();
console.log('PASS stock cap, day bounds, different volume at stock cap, remove and persist empty cart');
await go('/comic/conan');await page.getByRole('button',{name:'Thêm vào giỏ thuê'}).click();await go('/checkout');await page.getByLabel('Họ và tên',{exact:true}).fill('Bạn đọc kiểm thử');await page.getByLabel('Số điện thoại',{exact:true}).fill('0901234567');await page.getByLabel('Email',{exact:true}).fill('test@example.com');await page.getByLabel('Ngày nhận',{exact:true}).fill('2020-01-01');await page.getByRole('button',{name:'Xác nhận đặt thuê'}).click();await expect(page.getByText('Chọn ngày nhận từ hôm nay đến 30 ngày tới.')).toBeVisible();
console.log('PASS invalid pickup date cannot create an order');
await go('/comics');await page.getByLabel('Tìm trong tủ truyện',{exact:true}).pressSequentially('Naruto',{delay:30});await expect(page.locator('.comic-card')).toHaveCount(1);await expect(page.locator('.comic-card h3')).toHaveText('Naruto');
await page.evaluate(()=>{localStorage.setItem('storyrent.cart','{invalid-json');localStorage.setItem('storyrent.user','{invalid-json');});await go('/rental-cart');await expect(page.getByRole('heading',{name:'Giỏ thuê còn trống'})).toBeVisible();
console.log('PASS typed catalog search and invalid localStorage JSON fallback');
assert.deepEqual(errors,[]);
}finally{await browser.close();}
