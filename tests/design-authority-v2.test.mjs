import test from "node:test";
import assert from "node:assert/strict";
import {designAuthority,selectBrains,compilePrompt,getWarnings} from "../core.mjs";
for(const [space,lead] of [["Nội thất","interior"],["Kiến trúc","architecture"],["Cảnh quan","architecture"],["Quy hoạch đô thị","urban"]]){
 test(space+" keeps the design lead even when manually selecting photography",()=>{
  assert.equal(designAuthority(space).lead,lead);
  const ids=selectBrains({space,mode:"create",models:[]},"manual",["visual"]).map(x=>x.id);
  assert.ok(ids.includes(lead));assert.ok(ids.includes("quality"));assert.ok(ids.includes("visual"));
 });
}
test("compiled prompt explicitly prevents cinematography overriding design",()=>{
 const text=compilePrompt({space:"Nội thất",mode:"create",models:[],locks:[],expertMode:"manual",chosenBrains:["visual"],size:"1536x1024",quality:"medium"});
 assert.match(text,/DOMAIN AUTHORITY: interior leads/);
 assert.match(text,/AUTHORITY ORDER:/);
 assert.match(text,/cannot override space planning/);
});
test("architectural locks reject explicit incompatible design changes",()=>{
 const base={mode:"edit",space:"Nội thất",models:[],masterImage:{name:"room.png"},camera:"Giữ nguyên camera ảnh gốc",lighting:"Giữ nguyên ánh sáng ảnh gốc"};
 assert.ok(getWarnings({...base,locks:["Architecture"],brief:"Phá tường"}).some(w=>w.includes("Architecture Lock")));
 assert.ok(getWarnings({...base,locks:["Geometry"],brief:"Nới rộng phòng"}).some(w=>w.includes("Geometry Lock")));
 assert.ok(!getWarnings({...base,locks:["Architecture","Geometry"],brief:"Thay sofa"}).some(w=>w.startsWith("Xung đột")));
});
