import {BRAINS,CATEGORIES,LOCKS,FIELD_DEFS,createModel,getWarnings,compilePrompt,projectSnapshot,makeRenderPayload} from "./core.mjs";
import {SPACE_CATALOG,STYLE_OPTIONS,CAMERA_OPTIONS,LIGHTING_OPTIONS,ASPECT_OPTIONS,FURNITURE_BRANDS,OUTPUT_TYPES,PHOTO_DIRECTIONS,resolvePhotoDirection,recommendVisual} from "./design-catalog.mjs";
import {IMAGE_PLATFORMS,adviseImageWorkflow,resolveImageAI} from "./image-advisor.mjs";
const $=id=>document.getElementById(id);
const vn={
 "Sofa":"Ghế sofa","Armchair":"Ghế đơn","Coffee Table":"Bàn trà","Furniture":"Nội thất","Camera":"Góc máy","Lighting":"Ánh sáng","Architecture":"Kiến trúc","Geometry":"Hình học","Furniture Layout":"Bố trí nội thất","Materials":"Vật liệu","Model Identity":"Nhận diện sản phẩm",
 "Eye Level":"Tầm mắt","Low Angle":"Góc thấp","High Angle":"Góc cao","Worm's Eye View":"Góc nhìn từ dưới lên","Bird's Eye View":"Góc nhìn từ trên cao","Top-down 90°":"Nhìn thẳng từ trên xuống 90°","Aerial / Drone":"Flycam / Trên không","Isometric":"Trục đo đẳng phối","Axonometric":"Hình chiếu trục đo","One-point Perspective":"Phối cảnh một điểm tụ","Two-point Perspective":"Phối cảnh hai điểm tụ","Three-point Perspective":"Phối cảnh ba điểm tụ","Front Elevation":"Mặt đứng trước","Side Elevation":"Mặt đứng bên","Rear Elevation":"Mặt đứng sau","Corner View":"Góc nhìn từ góc phòng","Diagonal Composition":"Bố cục đường chéo","Symmetrical Central":"Đối xứng trung tâm","Wide Establishing":"Toàn cảnh rộng","Medium Shot":"Trung cảnh","Close-up Detail":"Cận cảnh chi tiết","Macro Material":"Cận cảnh vật liệu","Hero Shot":"Góc máy chủ đạo","Human Perspective":"Góc nhìn người sử dụng","Architectural Editorial":"Góc chụp tạp chí kiến trúc","Cinematic Frame":"Khung hình điện ảnh","35mm Lens":"Ống kính 35mm","50mm Lens":"Ống kính 50mm","24mm Wide":"Góc rộng 24mm","16mm Ultra-wide":"Siêu rộng 16mm","Tilt-shift Architectural":"Ống kính chỉnh phối cảnh","Panorama":"Toàn cảnh Panorama",
 "Natural Daylight":"Ánh sáng tự nhiên ban ngày","Morning Soft Light":"Ánh sáng sớm dịu","Noon Sunlight":"Nắng giữa trưa","Afternoon Daylight":"Ánh sáng chiều","Golden Hour":"Giờ vàng","Blue Hour":"Giờ xanh","Overcast Soft Light":"Trời âm u ánh sáng dịu","Cloudy Diffused":"Ánh sáng tán xạ trời mây","Dawn":"Bình minh","Dusk":"Hoàng hôn","Night Exterior":"Ngoại thất ban đêm","Night Interior":"Nội thất ban đêm","Warm Ambient 2700K":"Ánh sáng ấm 2700K","Warm White 3000K":"Trắng ấm 3000K","Neutral 3500K":"Trung tính 3500K","Neutral White 4000K":"Trắng trung tính 4000K","Cool White 5000K":"Trắng lạnh 5000K","Indirect Cove Lighting":"Hắt sáng gián tiếp","Architectural Accent":"Chiếu sáng nhấn kiến trúc","Track Spotlight":"Đèn rọi ray","Decorative Pendant":"Đèn thả trang trí","Chandelier":"Đèn chùm","Wall Washer":"Rọi tường","Linear Lighting":"Đèn tuyến tính","Softbox Studio":"Ánh sáng studio dịu","Cinematic Contrast":"Tương phản điện ảnh","Low-key":"Ánh sáng tối tương phản","High-key":"Ánh sáng sáng đều","Moody Dark":"Không khí tối trầm","Gallery Lighting":"Chiếu sáng phòng trưng bày","Hospitality Lighting":"Chiếu sáng khách sạn","Mixed Natural + Artificial":"Kết hợp sáng tự nhiên và nhân tạo","RGB Ambient":"Ánh sáng RGB",
 "Urban & Master Planning":"Quy hoạch và tổng mặt bằng","Architecture":"Kiến trúc","Interior":"Nội thất","Visual / Cinematic":"Hình ảnh và điện ảnh","Image Engine":"Bộ xử lý hình ảnh","Quality Control":"Kiểm soát chất lượng"
};
const vi=v=>vn[v]||v;
const state={mode:"create",master:null,masterURL:null,models:[],expanded:null,generated:null,renderController:null};
const MAX_IMAGE_BYTES=5_000_000;
const MAX_REQUEST_BYTES=23_000_000;
const validImage=f=>!!f&&["image/jpeg","image/png","image/webp"].includes(f.type)&&f.size<=MAX_IMAGE_BYTES;
const fields=["space","zone","furnitureBrand","outputType","photoDirection","style","camera","lighting","brief","quality","expertMode","imageAI"];
const liveSettings=()=>({mode:state.mode,space:$("space").value,zone:$("zone").value,furnitureBrand:$("furnitureBrand").value==="Thương hiệu khác (nhập tên)"?$("customBrand").value.trim():$("furnitureBrand").value,outputType:$("outputType").value,photoDirection:$("photoDirection").value,style:$("style").value,camera:$("camera").value,lighting:$("lighting").value,aspect:$("aspect").selectedOptions[0]?.textContent||"3:2 Ngang",brief:$("brief").value,size:$("aspect").value,quality:$("quality").value,expertMode:$("expertMode").value,imageAI:$("imageAI").value,chosenBrains:[...document.querySelectorAll("[data-brain]:checked")].map(x=>x.value),locks:[...document.querySelectorAll("[data-lock]:checked")].map(x=>x.value),masterImage:state.master,models:state.models});
const text=(tag,value,cls)=>{const x=document.createElement(tag);x.textContent=value;if(cls)x.className=cls;return x};
const control=(tag,{value="",onChange,options=null,placeholder=""}={})=>{const e=document.createElement(tag);if(options){for(const v of options){const o=document.createElement("option");o.value=v;o.textContent=vi(v);e.append(o)}}if(tag==="input")e.type="text";e.value=value;e.placeholder=placeholder;e.addEventListener("input",()=>onChange?.(e.value));return e};
function inputLabel(label,element){const l=text("label",label);l.append(element);return l}
function setMode(v){state.mode=v;for(const id of ["create","edit"])$(id+"Tab").classList.toggle("selected",id===v);$("masterHint").textContent=v==="edit"?"Bắt buộc khi chỉnh sửa ảnh hiện trạng":"Không bắt buộc khi tạo ảnh từ văn bản";$("masterLabel").textContent=v==="edit"?"+ TẢI ẢNH GỐC":"+ THÊM ẢNH THAM CHIẾU";$("renderButton").firstChild.textContent=v==="edit"?"CHỈNH SỬA ẢNH ":"TẠO ẢNH ";drawAdvisor()}
function updateMaster(f){if(state.masterURL)URL.revokeObjectURL(state.masterURL);state.master=f||null;state.masterURL=f?URL.createObjectURL(f):null;$("masterArea").hidden=!f;$("masterPreview").src=state.masterURL||"";$("inputView").hidden=!f;$("inputView").src=state.masterURL||"";$("inputEmpty").hidden=!!f;if(!f)$("masterInput").value="";drawAdvisor()}
function revokeRefs(m){m.references.forEach(r=>r.url&&URL.revokeObjectURL(r.url))}
function addModel(){const m=createModel();state.models.push(m);state.expanded=m.id;drawModels()}
function drawModels(){drawAdvisor();
 const holder=$("models");holder.replaceChildren();$("modelCount").textContent=state.models.length+" SẢN PHẨM";
 for(const m of state.models){
  const card=text("article","","model-card"),head=text("div","","model-header");
  const check=document.createElement("input");check.type="checkbox";check.className="toggle";check.checked=m.selected;check.title="Chọn sản phẩm để áp dụng";check.addEventListener("change",()=>{m.selected=check.checked;drawAdvisor()});head.append(check);
  const expand=text("button","","expand");const named=text("strong",m.name||m.id),desc=text("small",vi(m.category)+" · "+m.references.length+" ảnh");expand.append(named,desc);expand.addEventListener("click",()=>{state.expanded=state.expanded===m.id?null:m.id;drawModels()});head.append(expand);
  const rm=text("button","×","remove");rm.title="Xóa Model";rm.addEventListener("click",()=>{revokeRefs(m);state.models=state.models.filter(x=>x.id!==m.id);if(state.expanded===m.id)state.expanded=null;drawModels()});head.append(rm);card.append(head);
  const body=text("div","","model-body");body.hidden=state.expanded!==m.id;
  const name=control("input",{value:m.name,onChange:v=>{m.name=v;named.textContent=v||m.id}});body.append(inputLabel("Tên sản phẩm (tự đặt)",name));
  const category=control("select",{value:m.category,options:CATEGORIES,onChange:v=>{m.category=v;desc.textContent=vi(v)+" · "+m.references.length+" ảnh";drawModels()}});body.append(inputLabel("Danh mục",category));
  const row=text("div","","grid-two");
  for(const [label,key] of [["Thương hiệu","brand"],["Mã Model","sku"]])row.append(inputLabel(label,control("input",{value:m[key],onChange:v=>m[key]=v})));
  body.append(row);
  body.append(inputLabel("Đối tượng / vị trí cần thay thế",control("input",{value:m.target,onChange:v=>m.target=v,placeholder:"Ví dụ: sofa giữa phòng khách"})));
  body.append(inputLabel("Vật liệu",control("input",{value:m.material,onChange:v=>m.material=v})));
  const dims=text("div","","grid-two");dims.append(inputLabel("Kích thước / tỷ lệ",control("input",{value:m.dimensions,onChange:v=>m.dimensions=v,placeholder:"Ví dụ 2400 × 900 × 700"})),inputLabel("Kết cấu",control("input",{value:m.structure,onChange:v=>m.structure=v,placeholder:"Không xác định nếu ảnh không rõ"})));body.append(dims);
  body.append(inputLabel("Quy tắc áp dụng",control("select",{value:m.application,options:["Giữ đúng mẫu","Điều chỉnh kích thước","Chỉ lấy vật liệu","Lấy cảm hứng","Đổi vị trí"],onChange:v=>m.application=v})));
  for(const [key,label,options] of (FIELD_DEFS[m.category]||[])){
   const selected=m.properties[key]||options[0];body.append(inputLabel(label,control("select",{value:selected,options,onChange:v=>m.properties[key]=v})));
  }
  body.append(inputLabel("Ghi chú Model",control("input",{value:m.notes,onChange:v=>m.notes=v,placeholder:"Yêu cầu riêng cho Model"})));
  const reftitle=text("div","ẢNH THAM CHIẾU RIÊNG · "+m.references.length,"eyebrow");body.append(reftitle);
  const refs=text("div","","ref-grid");
  m.references.forEach((r,i)=>{const tile=text("div","","reference");if(r.url){const im=document.createElement("img");im.src=r.url;im.alt=m.name+" reference "+(i+1);tile.append(im)}tile.append(text("small",r.name));const del=text("button","×","delete-ref");del.title="Xóa ảnh";del.addEventListener("click",()=>{if(r.url)URL.revokeObjectURL(r.url);m.references.splice(i,1);drawModels()});tile.append(del);refs.append(tile)});
  const uploadLabel=text("label","+ THÊM ẢNH","add-ref");const upload=document.createElement("input");upload.type="file";upload.accept="image/png,image/jpeg,image/webp";upload.multiple=true;upload.hidden=true;upload.addEventListener("change",()=>{for(const f of upload.files){if(!validImage(f)){showStatus("Đã bỏ qua ảnh không hỗ trợ hoặc lớn hơn 5 MB.",true);continue}m.references.push({name:f.name,file:f,url:URL.createObjectURL(f)})}drawModels()});uploadLabel.append(upload);refs.append(uploadLabel);body.append(refs);
  card.append(body);holder.append(card);
 }
}
function drawAdvisor(){
 const context=liveSettings(),advice=adviseImageWorkflow(context),choice=resolveImageAI($("imageAI").value,context);
 $("aiSelection").textContent=(choice.automatic?"HG tự chọn cổng kết xuất hỗ trợ: ":"Đã chọn: ")+choice.platform.name+" · "+(choice.canRender?"Có thể tạo ảnh khi cổng OpenAI được cấu hình.":"Chưa tích hợp kết xuất trực tiếp; sử dụng prompt trên nền tảng ngoài.");
 $("renderButton").disabled=!choice.canRender||!!state.renderController;
 $("renderButton").title=choice.canRender?"Tạo ảnh qua cổng OpenAI đã cấu hình":"AI đã chọn chưa hỗ trợ tạo ảnh trực tiếp trên website";

 $("advisorSummary").textContent="HG đề xuất: "+advice.reason;
 $("advisorSteps").replaceChildren(...advice.steps.map((v,i)=>{const step=text("div","","advisor-step");step.append(text("b",String(i+1).padStart(2,"0")),text("span",v));return step}));
 $("advisorPlatforms").replaceChildren(...IMAGE_PLATFORMS.filter(p=>advice.recommendations.includes(p.id)||p.id===choice.platform.id).map(p=>{
 const card=text("article","","advisor-platform");
 if(advice.recommendations.includes(p.id))card.classList.add("recommended");
 const title=text("div","","advisor-title");title.append(text("strong",p.name));
 if(advice.recommendations.includes(p.id))title.append(text("small","HG ĐỀ XUẤT"));
 card.append(title,text("p",p.focus),text("small",p.note));
 const link=text("a","MỞ NỀN TẢNG ↗","advisor-link");link.href=p.url;link.target="_blank";link.rel="noopener noreferrer";card.append(link);return card;
 }));
}
function showStatus(msg,error=false){$("renderStatus").textContent=msg;$("renderStatus").style.color=error?"#efa6a0":""}
function compile(){const c=liveSettings(),p=compilePrompt(c);$("promptOutput").textContent=p;$("warnings").replaceChildren(...getWarnings(c).map(w=>text("p","⚠ "+w)));return p}
function downloadText(name,content,type="text/plain"){const b=new Blob([content],{type}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2500)}
async function readDataURL(f){return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error("Không đọc được "+f.name));reader.readAsDataURL(f)})}
async function render(){
 const c=liveSettings(),prompt=compile(),w=getWarnings(c);
 if(!resolveImageAI(c.imageAI,c).canRender){showStatus("AI đã chọn chưa được kết nối trực tiếp. Hãy sao chép prompt và mở nền tảng AI tương ứng.",true);return}
 if(state.master&&!validImage(state.master)){showStatus("Ảnh gốc phải là JPG/PNG/WebP và không quá 5 MB.",true);return}
 if(c.mode==="edit"&&!state.master){showStatus("Cần tải ảnh gốc trước khi chỉnh sửa.",true);return}
 if(w.some(x=>x.startsWith("Xung đột")||x.includes("Tối đa 16"))){showStatus("Có xung đột cần giải quyết trước khi tạo ảnh.",true);return}
 const endpoint=$("gateway").value.trim().replace(/\/+$/,"");const token=$("studioToken").value.trim();
 if(!endpoint||!token){showStatus("Cần địa chỉ cổng AI và mã truy cập. Xem hướng dẫn cấu hình.",true);return}
 if(!(/^https:\/\//.test(endpoint)||/^http:\/\/localhost(?::\d+)?$/.test(endpoint))){showStatus("Cổng AI phải dùng HTTPS (hoặc localhost).",true);return}
 const refs=[];if(state.master)refs.push({file:state.master,model:"MASTER",index:0});
 for(const m of state.models.filter(m=>m.selected)){m.references.forEach((r,i)=>{if(r.file)refs.push({file:r.file,model:m.id,index:i+1})})}
 if(refs.some(r=>!validImage(r.file))){showStatus("Mỗi ảnh tham chiếu phải là JPG/PNG/WebP và không quá 5 MB.",true);return}
 if(refs.length>16){showStatus("Chỉ hỗ trợ tối đa 16 ảnh trong một lần gọi API.",true);return}
 const estimatedBytes=JSON.stringify(makeRenderPayload(c,prompt,[])).length+refs.reduce((n,r)=>n+Math.ceil(r.file.size/3)*4+128,0);
 if(estimatedBytes>MAX_REQUEST_BYTES){showStatus("Tổng dung lượng ảnh vượt giới hạn gateway (~23 MB sau mã hóa). Hãy giảm số ảnh hoặc nén ảnh.",true);return}
 const controller=new AbortController();state.renderController=controller;
 $("renderButton").disabled=true;showStatus("Đang gửi yêu cầu tới cổng AI…");
 try{
  const images=[];for(const r of refs)images.push({image_url:await readDataURL(r.file),source:r.model,order:r.index});
  const response=await fetch(endpoint+"/render",{method:"POST",headers:{"Content-Type":"application/json","X-Studio-Token":token},body:JSON.stringify(makeRenderPayload(c,prompt,images)),signal:controller.signal});
  const result=await response.json();
  if(controller.signal.aborted)return;
  if(!response.ok)throw new Error(result.error||"Gateway error "+response.status);
  if(!result.image||typeof result.image!=="string")throw new Error("Gateway chưa trả về ảnh hợp lệ.");
  state.generated="data:"+(result.mime||"image/png")+";base64,"+result.image;
  $("resultView").src=state.generated;$("resultView").hidden=false;$("resultEmpty").hidden=true;$("downloadResult").hidden=false;
  showStatus("Đã nhận ảnh từ AI.");
 }catch(e){if(!controller.signal.aborted)showStatus("Không tạo được ảnh: "+(e.message||String(e)),true)}finally{if(state.renderController===controller)state.renderController=null;drawAdvisor()}
}
function populate(select,values,keep){const old=keep?select.value:null;select.replaceChildren();for(const v of values){const option=document.createElement("option");option.value=v;option.textContent=vi(v);select.append(option)}if(old&&values.includes(old))select.value=old}
function updateZone(){populate($("zone"),SPACE_CATALOG[$("space").value]||SPACE_CATALOG["Nội thất"],false)}
for(const group of [...new Set(IMAGE_PLATFORMS.map(p=>p.group))]){const g=document.createElement("optgroup");g.label=group;for(const p of IMAGE_PLATFORMS.filter(p=>p.group===group)){const o=document.createElement("option");o.value=p.id;o.textContent=p.name;g.append(o)}$("imageAI").append(g)}
$("imageAI").addEventListener("change",drawAdvisor);
$("copyForAI").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(compile());showStatus("Đã sao chép prompt cho AI được chọn.")}catch(e){showStatus("Không thể sao chép: "+e.message,true)}});
for(const [group,names] of FURNITURE_BRANDS){const g=document.createElement("optgroup");g.label=group;for(const name of names){const o=document.createElement("option");o.value=name;o.textContent=name;g.append(o)}$("furnitureBrand").append(g)}
$("furnitureBrand").value="Không áp dụng";
$("furnitureBrand").addEventListener("change",()=>{$("customBrandWrap").hidden=$("furnitureBrand").value!=="Thương hiệu khác (nhập tên)"});
populate($("outputType"),OUTPUT_TYPES,false);populate($("photoDirection"),PHOTO_DIRECTIONS,false);
function updatePhotoAdvice(){const c=liveSettings(),p=resolvePhotoDirection(c);$("photoAdvice").textContent=p.real?"Đề xuất: "+p.selected+". Ưu tiên phối cảnh thẳng, ánh sáng tự nhiên, vật liệu thật, bóng đổ đúng vật lý, hậu kỳ tinh tế; không bảo đảm ảnh AI không thể bị nhận diện.":"Giữ đặc trưng kỹ thuật của loại đầu ra đã chọn, không ép tất cả thành ảnh chụp."}
for(const id of ["outputType","photoDirection","space"])$(id).addEventListener("change",updatePhotoAdvice);
populate($("style"),STYLE_OPTIONS,false);populate($("camera"),CAMERA_OPTIONS,false);populate($("lighting"),LIGHTING_OPTIONS,false);updateZone();
for(const [label,value] of ASPECT_OPTIONS){const option=document.createElement("option");option.value=value;option.textContent=label;$("aspect").append(option)}
function updateRenderHints(){
 const opt=$("aspect").selectedOptions[0],name=opt?.textContent||"3:2 Ngang",size=$("aspect").value;
 const exact=["1:1 Vuông","3:2 Ngang","2:3 Dọc"].includes(name);
 $("aspectHint").textContent="API: "+size.replace("x","×")+(exact?" · Đúng tỷ lệ":" · Chỉ gần đúng, chưa cắt/căn lại đúng tỷ lệ");
 const descriptions={low:"Nháp: ưu tiên tốc độ và tiết kiệm chi phí.",medium:"Tiêu chuẩn: cân bằng tốc độ, chi phí và chi tiết.",high:"Cao: ưu tiên độ chi tiết; có thể chậm và tốn chi phí hơn."};
 $("qualityHint").textContent=descriptions[$("quality").value]+" Phụ thuộc AI được kết nối.";
}
$("aspect").addEventListener("change",updateRenderHints);
$("quality").addEventListener("change",updateRenderHints);
updateRenderHints();
$("space").addEventListener("change",()=>{updateZone();drawAdvisor()});
for(const b of BRAINS){const card=text("div","","brain");card.append(text("b",String(b.experts.length)),text("small",vi(b.name)));$("brainGrid").append(card);
 const l=text("label","","");const c=document.createElement("input");c.type="checkbox";c.className="toggle";c.value=b.id;c.dataset.brain="true";c.checked=true;l.append(c," "+vi(b.name)+" ("+b.experts.length+")");$("manualExperts").append(l);
}
for(const l of LOCKS){const label=text("label");const checkbox=document.createElement("input");checkbox.className="toggle";checkbox.type="checkbox";checkbox.value=l;checkbox.dataset.lock="true";checkbox.checked=["Architecture","Geometry","Camera"].includes(l);label.append(checkbox," "+vi(l));$("locks").append(label)}
$("createTab").onclick=()=>setMode("create");$("editTab").onclick=()=>setMode("edit");
$("masterInput").onchange=e=>{const f=e.target.files?.[0];if(f){if(!validImage(f)){e.target.value="";showStatus("Ảnh gốc phải là JPG/PNG/WebP và không quá 5 MB.",true);return}updateMaster(f)}};
$("clearMaster").onclick=()=>updateMaster(null);
$("addModel").onclick=addModel;
$("expertMode").onchange=()=>{$("manualExperts").hidden=$("expertMode").value!=="manual"};
$("compile").onclick=compile;
$("copyPrompt").onclick=async()=>{try{await navigator.clipboard.writeText(compile());showStatus("Đã sao chép prompt.")}catch{showStatus("Không sao chép được. Hãy chọn và sao chép văn bản trong ô prompt.",true)}};
$("downloadPrompt").onclick=()=>downloadText("hoanggia-prompt.txt",compile());
$("exportProject").onclick=()=>downloadText("da-studio-project.json",JSON.stringify({version:"2.0",...projectSnapshot(liveSettings())},null,2),"application/json");
$("importProject").onchange=async e=>{try{const f=e.target.files?.[0];if(!f)return;const v=JSON.parse(await f.text());if(!v||typeof v!=="object"||!Array.isArray(v.models))throw Error("Sai cấu trúc JSON");
 if(v.models.length>200)throw Error("Dự án có quá 200 Model");
 for(const item of v.models)if(!item||typeof item!=="object"||Array.isArray(item))throw Error("Model không hợp lệ");if(state.renderController){state.renderController.abort();state.renderController=null}for(const m of state.models)revokeRefs(m);state.models=v.models.map(()=>null).map((_,i)=>{const o=v.models[i],m=createModel();return {...m,...o,id:m.id,references:[],properties:o.properties&&typeof o.properties==="object"&&!Array.isArray(o.properties)?o.properties:{},notes:(o.notes||"")+(o.references?.length?" [Cần tải lại ảnh gốc sau khi nhập JSON.]":"")}});if(typeof v.space==="string"&&SPACE_CATALOG[v.space]){$("space").value=v.space;updateZone()}
 for(const key of fields){if(typeof v[key]==="string"&&[...$(key).options||[]].length){if([...$(key).options].some(x=>x.value===v[key]))$(key).value=v[key]}else if(key==="brief"&&typeof v[key]==="string")$(key).value=v[key]}
 if(typeof v.furnitureBrand==="string"){const known=[...$("furnitureBrand").options].some(o=>o.value===v.furnitureBrand);if(!known&&v.furnitureBrand){$("furnitureBrand").value="Thương hiệu khác (nhập tên)";$("customBrand").value=v.furnitureBrand;$("customBrandWrap").hidden=false}else{$("furnitureBrand").value=v.furnitureBrand||"Không áp dụng";$("customBrand").value="";$("customBrandWrap").hidden=true}}
 if(Array.isArray(v.chosenBrains)){for(const cb of document.querySelectorAll("[data-brain]"))cb.checked=v.chosenBrains.includes(cb.value)}
 if(Array.isArray(v.locks)){for(const cb of document.querySelectorAll("[data-lock]"))cb.checked=v.locks.includes(cb.value)}
 $("manualExperts").hidden=$("expertMode").value!=="manual";
 if(v.aspect){const option=[...$("aspect").options].find(x=>x.textContent===v.aspect);if(option)$("aspect").selectedIndex=option.index}updateRenderHints()
 state.generated=null;$("resultView").removeAttribute("src");$("resultView").hidden=true;$("resultEmpty").hidden=false;$("downloadResult").hidden=true;
 $("promptOutput").textContent="Prompt đã biên dịch sẽ hiển thị tại đây...";$("warnings").replaceChildren();
 setMode(v.mode==="edit"?"edit":"create");drawModels();updateMaster(null);updateRenderHints();updatePhotoAdvice();showStatus("Đã nhập cấu hình. Vì lý do bảo mật, vui lòng tải lại file ảnh gốc.");}catch(e){showStatus("Không nhập được JSON: "+e.message,true)}finally{e.target.value=""}};
$("renderButton").onclick=render;
$("downloadResult").onclick=()=>{if(!state.generated)return;const a=document.createElement("a");a.href=state.generated;a.download="hoanggia-ai-image.png";document.body.append(a);a.click();a.remove()};
function startNewProject(){
 if(!window.confirm("Tạo dự án mới? Prompt, Model, ảnh tham chiếu và kết quả hiện tại sẽ bị xóa. Hãy xuất dự án hoặc tải kết quả trước khi tiếp tục."))return;
 if(state.renderController){state.renderController.abort();state.renderController=null}
 for(const m of state.models)revokeRefs(m);
 state.models=[];state.expanded=null;state.generated=null;
 updateMaster(null);
 $("space").selectedIndex=0;updateZone();
 for(const id of ["style","camera","lighting","aspect","imageAI","expertMode","outputType","photoDirection"])$(id).selectedIndex=0;
 $("quality").value="medium";$("brief").value="";$("furnitureBrand").value="Không áp dụng";$("customBrand").value="";$("customBrandWrap").hidden=true;
 for(const c of document.querySelectorAll("[data-brain]"))c.checked=true;
 for(const c of document.querySelectorAll("[data-lock]"))c.checked=["Architecture","Geometry","Camera"].includes(c.value);
 $("manualExperts").hidden=true;
 $("promptOutput").textContent="Prompt đã biên dịch sẽ hiển thị tại đây...";
 $("warnings").replaceChildren();
 $("resultView").removeAttribute("src");$("resultView").hidden=true;
 $("resultEmpty").hidden=false;$("downloadResult").hidden=true;
 $("renderStatus").textContent="Sẵn sàng cho dự án mới";
 $("importProject").value="";
 setMode("create");addModel();updateRenderHints();updatePhotoAdvice();drawAdvisor();
 window.scrollTo({top:0,behavior:"smooth"});
}
$("newProject").addEventListener("click",startNewProject);
setMode("create");addModel();updatePhotoAdvice();drawAdvisor();
