// HOANGGIA CAMERA AI V1.1 — photography-purpose and mount-aware equipment selector
const STYLES=[
["interior","Nội thất","Không gian, phòng khách, showroom","14–35mm; phối cảnh tự nhiên"],
["architecture","Kiến trúc","Mặt tiền, biệt thự, công trình","Góc rộng / Tilt-Shift; đường đứng thẳng"],
["bokeh","Xóa phông","Chủ thể sắc nét, hậu cảnh mềm","Khẩu lớn; 35–135mm"],
["furniture","Sản phẩm nội thất","Sofa, bàn, ghế, giường","35–85mm; bảo toàn tỷ lệ"],
["macro","Chi tiết vật liệu","Da, vải, gỗ, đá, đường may","Macro lấy nét gần"],
["cinematic","Cinematic Luxury","Chiều sâu, cảm xúc điện ảnh","24–85mm; ánh sáng có chủ đích"],
["flycam","Flycam · Góc nhìn trên cao","Toàn cảnh công trình, quy hoạch, phối cảnh từ trên cao","Góc nhìn aerial; giữ hình khối công trình chính xác"]
];
const db=[
["Sony","FE",["A7R V","A1 II","A7 IV","A7CR","A7S III","A9 III","A7 III","A7C II","A7R IV","A7R III"],[
["FE 16–35mm F2.8 GM II","interior architecture"],["FE 12–24mm F2.8 GM","interior architecture"],["FE 20mm F1.8 G","interior architecture cinematic"],["FE 24mm F1.4 GM","interior architecture cinematic"],["FE 35mm F1.4 GM","interior furniture bokeh cinematic"],["FE 50mm F1.4 GM","furniture bokeh cinematic"],["FE 50mm F1.2 GM","furniture bokeh cinematic"],["FE 85mm F1.4 GM II","furniture bokeh cinematic"],["FE 135mm F1.8 GM","bokeh furniture"],["FE 90mm F2.8 Macro G OSS","macro"],["FE 70–200mm F2.8 GM OSS II","bokeh furniture"],["FE 24–70mm F2.8 GM II","interior furniture cinematic"]]],
["Canon","RF",["EOS R5 Mark II","EOS R5","EOS R6 Mark II","EOS R6 Mark III","EOS R3","EOS R1","EOS R8","EOS R6","EOS R5 C","EOS R"],[
["RF 15–35mm F2.8 L IS USM","interior architecture"],["RF 14–35mm F4 L IS USM","interior architecture"],["RF 10–20mm F4 L IS STM","interior architecture"],["RF 24mm F1.8 Macro IS STM","interior cinematic"],["RF 35mm F1.4 L VCM","interior furniture bokeh cinematic"],["RF 50mm F1.2 L USM","furniture bokeh cinematic"],["RF 85mm F1.2 L USM","furniture bokeh cinematic"],["RF 100mm F2.8 L Macro IS USM","macro"],["RF 24–70mm F2.8 L IS USM","interior furniture cinematic"],["RF 70–200mm F2.8 L IS USM","bokeh furniture"],["TS-E 17mm f/4L + ngàm EF–EOS R","architecture"],["TS-E 24mm f/3.5L II + ngàm EF–EOS R","architecture"]]],
["Nikon","Z",["Z8","Z9","Z7 II","Z6 III","Z6 II","Zf","Z5","Z5 II","Z7","Z6"],[
["NIKKOR Z 14–24mm f/2.8 S","interior architecture"],["NIKKOR Z 17–28mm f/2.8","interior architecture"],["NIKKOR Z 20mm f/1.8 S","interior architecture cinematic"],["NIKKOR Z 24mm f/1.8 S","interior cinematic"],["NIKKOR Z 35mm f/1.8 S","interior furniture bokeh cinematic"],["NIKKOR Z 50mm f/1.8 S","furniture bokeh cinematic"],["NIKKOR Z 85mm f/1.2 S","furniture bokeh cinematic"],["NIKKOR Z MC 105mm f/2.8 VR S","macro"],["NIKKOR Z MC 50mm f/2.8","macro"],["NIKKOR Z 24–70mm f/2.8 S","interior furniture cinematic"],["PC NIKKOR 19mm f/4E ED + ngàm FTZ (kiểm tra điều khiển)","architecture"]]],
["Fujifilm","GF",["GFX100 II","GFX100S II","GFX100","GFX100S","GFX50S II","GFX50R"],[
["FUJINON GF20–35mm F4 R WR","interior architecture"],["FUJINON GF30mm F3.5 R WR","interior architecture"],["FUJINON GF23mm F4 R LM WR","interior architecture"],["FUJINON GF45mm F2.8 R WR","interior furniture cinematic"],["FUJINON GF55mm F1.7 R WR","furniture bokeh cinematic"],["FUJINON GF80mm F1.7 R WR","furniture bokeh cinematic"],["FUJINON GF110mm F2 R LM WR","bokeh furniture"],["FUJINON GF120mm F4 R LM OIS WR Macro","macro"]]],
["Hasselblad","XCD",["X2D 100C","907X 100C","X1D II 50C","X1D 50C"],[
["XCD 4/21","interior architecture"],["XCD 4/28P","interior architecture"],["XCD 3.5/30","interior architecture"],["XCD 2.5/38V","interior furniture cinematic"],["XCD 2.5/55V","furniture bokeh cinematic"],["XCD 1.9/80","furniture bokeh cinematic"],["XCD 2.5/90V","furniture bokeh cinematic"],["XCD 3.5/120 Macro","macro"]]],
["Leica","L",["SL3","SL2","SL2-S","SL3-S"],[
["Super-Vario-Elmarit-SL 14–24mm f/2.8 ASPH.","interior architecture"],["Super-Vario-Elmar-SL 16–35mm f/3.5–4.5 ASPH.","interior architecture"],["Summicron-SL 35mm f/2 ASPH.","interior furniture cinematic"],["Summilux-SL 50mm f/1.4 ASPH.","furniture bokeh cinematic"],["APO-Summicron-SL 75mm f/2 ASPH.","furniture bokeh cinematic"],["APO-Macro-Elmarit-TL 60mm f/2.8 ASPH. (crop mode)","macro"]]],
["Phase One","XF",["XF IQ4 150MP","XF IQ4 100MP"],[
["Schneider Kreuznach 35mm LS f/3.5","interior architecture"],["Schneider Kreuznach 55mm LS f/2.8","interior furniture"],["Schneider Kreuznach 80mm LS f/2.8","furniture cinematic"],["Schneider Kreuznach 120mm LS f/4 Macro","macro"],["Schneider Kreuznach 150mm LS f/2.8","bokeh furniture"]]]
];
const drones=[
["DJI","Camera tích hợp / ngàm DL",["Mavic 4 Pro","Air 3S","Mini 4 Pro","Inspire 3"],[
["Hasselblad 4/3 CMOS 28mm tương đương","flycam",["Mavic 4 Pro"]],["Tele 70mm / 168mm tương đương","flycam",["Mavic 4 Pro"]],
["Camera chính 24mm tương đương","flycam",["Air 3S","Mini 4 Pro"]],["Tele 70mm tương đương","flycam",["Air 3S"]],
["Zenmuse X9-8K Air · DL 18mm","flycam",["Inspire 3"]],["Zenmuse X9-8K Air · DL 24mm","flycam",["Inspire 3"]],["Zenmuse X9-8K Air · DL 35mm","flycam",["Inspire 3"]]]],
["Autel Robotics","Camera tích hợp",["EVO II Pro V3","EVO Max 4T"],[
["Camera 1-inch CMOS · 29mm tương đương","flycam",["EVO II Pro V3"]],["Camera góc rộng tích hợp","flycam",["EVO Max 4T"]]]],
["Skydio","Camera tích hợp",["X10"],[["Camera góc rộng / tele tích hợp","flycam",["X10"]]]],
["Parrot","Camera tích hợp",["ANAFI Ai"],[["Camera 48MP · 24mm tương đương","flycam",["ANAFI Ai"]]]],
["Freefly Systems","Payload phụ thuộc cấu hình",["Astro"],[["Payload camera khảo sát · kiểm tra cấu hình lắp đặt","flycam",["Astro"]]]],
["Sony","Payload chuyên dụng",["Airpeak S1"],[["Camera Sony Alpha tương thích · kiểm tra gimbal, tải trọng và lens","flycam",["Airpeak S1"]]]],
["Yuneec","Payload chuyên dụng",["H850-RTK"],[["Payload E90X · góc rộng","flycam",["H850-RTK"]]]]
];
const APERTURES=[1.2,1.4,1.8,2,2.8,3.5,4,4.5,5.6,8,11,16,22];
const preferred={interior:8,architecture:8,bokeh:1.8,furniture:5.6,macro:11,cinematic:2.8,flycam:5.6};
function minimumF(name){const values=[...name.matchAll(new RegExp("(?:f/|f|F)([0-9]+(?:[.][0-9]+)?)","g"))].map(m=>Number(m[1]));return values.length?Math.max(...values):null;}
const el=id=>document.getElementById(id);
const make=(tag,txt)=>{const n=document.createElement(tag);if(txt)n.textContent=txt;return n};
const opt=(v,t)=>{const n=make("option",t);n.value=v;return n};
const $panel=el("hgCameraAI");
if($panel){
 const mode=el("hgCamMode"),style=el("hgCamStyle"),brand=el("hgCamBrand"),body=el("hgCamBody"),lens=el("hgCamLens"),aperture=el("hgCamAperture"),focus=el("hgCamFocus"),lock=el("hgCamLock"),all=el("hgCamAll"),summary=el("hgCamSummary");
 STYLES.forEach(s=>style.append(opt(s[0],s[1]+" — "+s[2])));
 const optionsForStyle=()=>style.value==="flycam"?drones:db;
 const refillBrand=()=>{const previous=brand.value;const group=optionsForStyle();brand.replaceChildren(...group.map(d=>opt(d[0],d[0])));if(group.some(d=>d[0]===previous))brand.value=previous;};
 const purpose=()=>STYLES.find(s=>s[0]===style.value)||STYLES[0];
 const current=()=>optionsForStyle().find(d=>d[0]===brand.value)||optionsForStyle()[0];
 let manualAperture=null;
 const updateAperture=()=>{
 const min=minimumF(lens.value), drone=style.value==="flycam";
 const target=focus.value==="subject"?Math.min(preferred[style.value]||4,2.8):focus.value==="all"?Math.max(preferred[style.value]||8,8):preferred[style.value]||8;
 const valid=APERTURES.filter(v=>min===null||v>=min);
 aperture.replaceChildren();
 if(drone&&min===null){aperture.append(opt("auto","Theo camera Flycam (chưa xác minh khẩu độ)"));aperture.disabled=true;return;}
 if(!valid.length){aperture.append(opt("auto","Theo camera"));aperture.disabled=true;return;}
 valid.forEach(v=>aperture.append(opt("f/"+v,"f/"+v)));
 const best=valid.reduce((a,b)=>Math.abs(b-target)<Math.abs(a-target)?b:a,valid[0]);
 aperture.value=mode.value==="manual"&&manualAperture&&valid.some(v=>"f/"+v===manualAperture)?manualAperture:"f/"+best;
 aperture.disabled=mode.value!=="manual";
 };
 const refresh=()=>{
   const d=current(),oldBody=body.value,oldLens=lens.value;
   body.replaceChildren(...d[2].map(x=>opt(x,d[0]+" "+x)));
   if(d[2].includes(oldBody))body.value=oldBody;
   const filtered=d[3].filter(x=>(!x[2]||x[2].includes(body.value))&&(style.value==="flycam"||all.checked||x[1].split(" ").includes(style.value)));
   lens.replaceChildren(...filtered.map(x=>opt(x[0],d[0]+" "+x[0])));
   if(filtered.some(x=>x[0]===oldLens))lens.value=oldLens;
   all.closest("label").hidden=style.value==="flycam";
   updateAperture();
   summary.textContent=(mode.value==="auto"?"AI đề xuất: ":"Đang chọn: ")+d[0]+" "+body.value+" · "+d[0]+" "+(lens.value||"Chưa có lens phù hợp")+" · "+aperture.value+". "+purpose()[3]+".";
   el("hgCamManual").hidden=mode.value==="auto";
   el("hgCamAuto").hidden=mode.value!=="auto";
   el("hgCamAuto").textContent="Gợi ý theo mục đích: "+purpose()[3]+". "+d[0]+" "+body.value+" · "+(lens.value||"Chưa có lens")+". Có thể chuyển MANUAL PRO để tùy chỉnh.";
 };
 style.addEventListener("change",()=>{manualAperture=null;refillBrand();refresh();});
 [mode,brand,body,lens,focus,lock,all].forEach(n=>n.addEventListener("change",()=>{if(n!==lock&&n!==all)manualAperture=null;refresh();}));
 aperture.addEventListener("change",()=>{manualAperture=aperture.value;refresh();});
 window.hgCameraAI={
  getSnapshot:()=>({mode:mode.value,style:style.value,brand:brand.value,body:body.value,lens:lens.value,aperture:aperture.value,focus:focus.value,lock:lock.checked,showAll:all.checked}),
  restore(v){if(!v||typeof v!=="object")return;for(const [n,k] of [[mode,"mode"],[style,"style"],[brand,"brand"]])if(typeof v[k]==="string"&&[...n.options].some(o=>o.value===v[k]))n.value=v[k];refillBrand();if(typeof v.brand==="string"&&[...brand.options].some(o=>o.value===v.brand))brand.value=v.brand;refresh();for(const [n,k] of [[body,"body"],[lens,"lens"],[aperture,"aperture"],[focus,"focus"]])if(typeof v[k]==="string"&&[...n.options].some(o=>o.value===v[k]))n.value=v[k];lock.checked=v.lock!==false;all.checked=v.showAll===true;manualAperture=typeof v.aperture==="string"?v.aperture:null;refresh()},
  reset(){mode.value="auto";style.value="interior";brand.value="Sony";manualAperture=null;focus.value="all";lock.checked=true;all.checked=false;refillBrand();refresh()},
  getPrompt(lang="vi"){
   const s=purpose(),d=current(),chosen=d[3].find(x=>x[0]===lens.value);
   if(!chosen)return "";
   const focusText={auto:"AI-selected subject focus",subject:"sharp main subject with softly blurred background",all:"deep focus across the scene"}[focus.value];
   const lockText=lock.checked?"Preserve original viewpoint, framing, geometry, vertical lines and furniture proportions.":"Adjust photographic viewpoint only if explicitly required; preserve architecture and furniture proportions.";
   const en="CAMERA AI V1.2: Photography purpose: "+({interior:"interior",architecture:"architecture",bokeh:"background bokeh",furniture:"furniture product",macro:"material macro",cinematic:"cinematic luxury",flycam:"aerial architectural photography / drone shot"}[s[0]])+". Camera body: "+d[0]+" "+body.value+" ("+d[1]+" mount). Lens: "+d[0]+" "+lens.value+". Aperture target: "+(aperture.value==="auto"?"controlled by aircraft camera / unspecified":aperture.value)+" (respect physical lens aperture limits). Focus: "+focusText+". "+lockText+" Optical rendering is a photographic simulation, not a claim of actual camera capture.";
   return lang==="en"?en:"THIẾT LẬP CAMERA AI V1.2 (mô phỏng nhiếp ảnh): "+s[1]+". Thân máy: "+d[0]+" "+body.value+" (ngàm "+d[1]+"). Ống kính: "+d[0]+" "+lens.value+". Khẩu độ mục tiêu: "+(aperture.value==="auto"?"theo camera, không áp đặt khẩu độ chưa xác minh":aperture.value)+" (giới hạn theo thông số thực của lens). Lấy nét: "+({auto:"AI tự chọn chủ thể",subject:"nét chủ thể, mờ hậu cảnh",all:"nét toàn bộ không gian"}[focus.value])+". "+(lock.checked?"Khóa góc nhìn, bố cục, hình học, đường đứng và tỷ lệ nội thất.":"Chỉ thay góc nhìn khi có yêu cầu; bảo toàn kiến trúc và tỷ lệ nội thất.")+" Đây là mô phỏng quang học, không phải ảnh chụp bằng thiết bị thật.";
  }
 };
 refillBrand();refresh();
}
