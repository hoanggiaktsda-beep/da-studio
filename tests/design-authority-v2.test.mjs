import test from "node:test";
import assert from "node:assert/strict";
import {designAuthority,selectBrains,compilePrompt,getWarnings,auditDesign,auditLayout} from "../core.mjs";
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

test("structured dimensions and project-specific clearance",()=>{
 const c={roomWidthMm:"4000",roomDepthMm:"5000",clearanceMm:"760",requiredClearanceMm:"900",projectStandard:"Approved project brief",models:[]};
 const a=auditDesign(c);assert.equal(a.ok,false);assert.ok(a.issues.some(i=>i.field==="clearanceMm"&&i.severity==="error"));
 assert.ok(a.evidence.some(x=>x.includes("4000 × 5000")));
 assert.equal(auditDesign({...c,clearanceMm:"1000"}).ok,true);
});
test("unverified dimensions and materials never become fabricated specifications",()=>{
 const a=auditDesign({models:[{id:"1",selected:true,name:"Sofa",dimensions:"",material:"Theo ảnh"}]});
 assert.ok(a.issues.some(i=>i.field==="model:1"&&i.severity==="unknown"));
 assert.ok(a.issues.some(i=>i.field==="material:1"&&i.severity==="unknown"));
 assert.ok(a.issues.some(i=>i.field==="projectStandard"));
});
test("model cannot fit room in either orientation",()=>{
 const a=auditDesign({roomWidthMm:2000,roomDepthMm:2000,models:[{id:"2",selected:true,name:"Tủ",dimensions:"2500 x 2600 mm",material:"Gỗ"}]});
 assert.equal(a.ok,false);assert.ok(a.issues.some(i=>i.field==="model:2"&&i.severity==="error"));
});

test("layout checks collisions, wall boundaries, project clearance and malformed data",()=>{
 const base={roomWidthMm:5000,roomDepthMm:4000,layoutMinimumGapMm:500};
 const item=(id,x,y,w=1000,d=700)=>({id,xMm:x,yMm:y,widthMm:w,depthMm:d});
 assert.ok(auditLayout({...base,layoutItems:[item("sofa",0,0),item("table",500,300)]}).issues.some(i=>i.field==="pair:sofa:table"));
 assert.ok(auditLayout({...base,layoutItems:[item("cabinet",4600,0)]}).issues.some(i=>i.message.includes("ranh giới")));
 assert.ok(auditLayout({...base,layoutItems:[item("sofa",0,0),item("table",1300,0)]}).issues.some(i=>i.message.includes("ngưỡng dự án")));
 assert.equal(auditLayout({...base,layoutItems:[item("sofa",0,0),item("table",1700,0)]}).ok,true);
 assert.equal(auditLayout({...base,layoutItems:[{id:"bad"}]}).ok,false);
});

test("V2.1 rejects duplicate plan identifiers and invalid gap thresholds",()=>{
 const items=[{id:"chair",xMm:0,yMm:0,widthMm:500,depthMm:500},{id:"chair",xMm:1500,yMm:0,widthMm:500,depthMm:500}];
 assert.equal(auditLayout({roomWidthMm:3000,roomDepthMm:3000,layoutItems:items}).ok,false);
 assert.ok(auditLayout({layoutMinimumGapMm:-1,layoutItems:[]}).issues.some(i=>i.field==="layoutMinimumGapMm"));
});
