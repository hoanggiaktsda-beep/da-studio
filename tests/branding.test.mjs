import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const app=readFileSync(new URL("../app.mjs",import.meta.url),"utf8");
const css=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
test("official HOANGGIA AI logo is loaded locally",()=>{assert.match(html,/assets\/brand-mark\.svg/);assert.match(css,/\.brand-logo/);assert.ok(readFileSync(new URL("../assets/brand-mark.svg",import.meta.url),"utf8").includes("<svg"))});
test("core UI uses Vietnamese headings",()=>{for(const term of ["THIẾT LẬP THIẾT KẾ","THƯ VIỆN SẢN PHẨM","KHÓA THIẾT KẾ","ĐIỀU PHỐI CHUYÊN GIA","TẠO VÀ CHỈNH SỬA ẢNH","Sáng tạo không giới hạn"])assert.ok(html.includes(term),term);assert.match(html,/lang="vi"/)});
test("dynamic camera and lighting display translations keep values",()=>{for(const term of ["Góc thấp","Giờ vàng","Ánh sáng tự nhiên ban ngày","Tầm mắt"])assert.ok(app.includes(term));assert.ok(app.includes("option.value=v"))});
