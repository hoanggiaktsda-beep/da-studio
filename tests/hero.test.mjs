import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");const css=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
test("editorial hero structure and accessible heading",()=>{assert.match(html,/section class="hero" aria-labelledby="heroTitle"/);assert.match(html,/<h1 id="heroTitle">/);assert.match(html,/class="hero-art" aria-hidden="true"/);assert.match(html,/Tư duy thiết kế/);assert.doesNotMatch(html,/class="hero-outline"/)});
test("hero responsive and isolated from workspace controls",()=>{assert.match(css,/\.hero-art-frame/);assert.match(css,/@media\(max-width:800px\)/);assert.match(html,/id="createTab"/);assert.match(html,/id="editTab"/)});
