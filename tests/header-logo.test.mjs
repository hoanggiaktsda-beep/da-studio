import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const css=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
test("brand image has reserved square dimensions",()=>assert.match(html,/class="brand-logo"[^>]*width="48" height="48"/));
test("logo dimensions and header typography are constrained",()=>{assert.match(css,/\.top \.brand-logo\{[^}]*width:48px!important;[^}]*height:48px!important;/);assert.match(css,/\.top \.brand b\{[^}]*white-space:nowrap/);assert.ok(!css.includes("\\n[hidden]"))});
