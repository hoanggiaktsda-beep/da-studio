import {BRAINS,CATEGORIES,LOCKS,FIELD_DEFS,createModel,getWarnings,compilePrompt,projectSnapshot,makeRenderPayload} from "./core.mjs";
const $=id=>document.getElementById(id);
const state={mode:"create",master:null,masterURL:null,models:[],expanded:null,generated:null};
const fields=["space","style","brief","size","quality","expertMode"];
const liveSettings=()=>({mode:state.mode,space:$("space").value,style:$("style").value,brief:$("brief").value,size:$("size").value,quality:$("quality").value,expertMode:$("expertMode").value,chosenBrains:[...document.querySelectorAll("[data-brain]:checked")].map(x=>x.value),locks:[...document.querySelectorAll("[data-lock]:checked")].map(x=>x.value),masterImage:state.master,models:state.models});
const text=(tag,value,cls)=>{const x=document.createElement(tag);x.textContent=value;if(cls)x.className=cls;return x};
const control=(tag,{value="",onChange,options=null,placeholder=""}={})=>{const e=document.createElement(tag);if(options){for(const v of options){const o=document.createElement("option");o.value=v;o.textContent=v;e.append(o)}}if(tag==="input")e.type="text";e.value=value;e.placeholder=placeholder;e.addEventListener("input",()=>onChange?.(e.value));return e};
function inputLabel(label,element){const l=text("label",label);l.append(element);return l}
function setMode(v){state.mode=v;for(const id of ["create","edit"])$(id+"Tab").classList.toggle("selected",id===v);$("masterHint").textContent=v==="edit"?"Bắt buộc cho chỉnh sửa ảnh hiện trạng":"Không bắt buộc khi tạo ảnh từ văn bản";$("masterLabel").textContent=v==="edit"?"+ TẢI MASTER IMAGE":"+ THÊM ẢNH THAM CHIẾU";$("renderButton").firstChild.textContent=v==="edit"?"EDIT IMAGE ":"GENERATE IMAGE "}
function updateMaster(f){if(state.masterURL)URL.revokeObjectURL(state.masterURL);state.master=f||null;state.masterURL=f?URL.createObjectURL(f):null;$("masterArea").hidden=!f;$("masterPreview").src=state.masterURL||"";$("inputView").hidden=!f;$("inputView").src=state.masterURL||"";$("inputEmpty").hidden=!!f;if(!f)$("masterInput").value=""}
function revokeRefs(m){m.references.forEach(r=>r.url&&URL.revokeObjectURL(r.url))}
function addModel(){const m=createModel();state.models.push(m);state.expanded=m.id;drawModels()}
function drawModels(){
 const holder=$("models");holder.replaceChildren();$("modelCount").textContent=state.models.length+" MODEL";
 for(const m of state.models){
  const card=text("article","","model-card"),head=text("div","","model-header");
  const check=document.createElement("input");check.type="checkbox";check.className="toggle";check.checked=m.selected;check.title="Chọn Model để áp dụng";check.addEventListener("change",()=>m.selected=check.checked);head.append(check);
  const expand=text("button","","expand");const named=text("strong",m.name||m.id),desc=text("small",m.category+" · "+m.references.length+" ảnh");expand.append(named,desc);expand.addEventListener("click",()=>{state.expanded=state.expanded===m.id?null:m.id;drawModels()});head.append(expand);
  const rm=text("button","×","remove");rm.title="Xóa Model";rm.addEventListener("click",()=>{revokeRefs(m);state.models=state.models.filter(x=>x.id!==m.id);if(state.expanded===m.id)state.expanded=null;drawModels()});head.append(rm);card.append(head);
  const body=text("div","","model-body");body.hidden=state.expanded!==m.id;
  const name=control("input",{value:m.name,onChange:v=>{m.name=v;named.textContent=v||m.id}});body.append(inputLabel("Tên Model (chỉnh tự do)",name));
  const category=control("select",{value:m.category,options:CATEGORIES,onChange:v=>{m.category=v;desc.textContent=v+" · "+m.references.length+" ảnh";drawModels()}});body.append(inputLabel("Danh mục",category));
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
  const uploadLabel=text("label","+ THÊM ẢNH","add-ref");const upload=document.createElement("input");upload.type="file";upload.accept="image/png,image/jpeg,image/webp";upload.multiple=true;upload.hidden=true;upload.addEventListener("change",()=>{for(const f of upload.files){if(!["image/jpeg","image/png","image/webp"].includes(f.type))continue;m.references.push({name:f.name,file:f,url:URL.createObjectURL(f)})}drawModels()});uploadLabel.append(upload);refs.append(uploadLabel);body.append(refs);
  card.append(body);holder.append(card);
 }
}
function showStatus(msg,error=false){$("renderStatus").textContent=msg;$("renderStatus").style.color=error?"#efa6a0":""}
function compile(){const c=liveSettings(),p=compilePrompt(c);$("promptOutput").textContent=p;$("warnings").replaceChildren(...getWarnings(c).map(w=>text("p","⚠ "+w)));return p}
function downloadText(name,content,type="text/plain"){const b=new Blob([content],{type}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2500)}
async function readDataURL(f){return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error("Không đọc được "+f.name));reader.readAsDataURL(f)})}
async function render(){
 const c=liveSettings(),prompt=compile(),w=getWarnings(c);
 if(c.mode==="edit"&&!state.master){showStatus("Chưa có Master Image để chỉnh sửa.",true);return}
 if(w.some(x=>x.startsWith("Xung đột")||x.includes("Tối đa 16"))){showStatus("Có xung đột cần giải quyết trước khi render.",true);return}
 const endpoint=$("gateway").value.trim().replace(/\/+$/,"");const token=$("studioToken").value.trim();
 if(!endpoint||!token){showStatus("Cần Gateway URL và Studio Access Token. Xem README để cấu hình.",true);return}
 if(!(/^https:\/\//.test(endpoint)||/^http:\/\/localhost(?::\d+)?$/.test(endpoint))){showStatus("Gateway phải dùng HTTPS (hoặc localhost).",true);return}
 const refs=[];if(state.master)refs.push({file:state.master,model:"MASTER",index:0});
 for(const m of state.models.filter(m=>m.selected)){m.references.forEach((r,i)=>{if(r.file)refs.push({file:r.file,model:m.id,index:i+1})})}
 if(refs.length>16){showStatus("Chỉ hỗ trợ tối đa 16 ảnh trong một lần gọi API.",true);return}
 $("renderButton").disabled=true;showStatus("Đang gửi yêu cầu tới AI Gateway…");
 try{
  const images=[];for(const r of refs)images.push({image_url:await readDataURL(r.file),source:r.model,order:r.index});
  const response=await fetch(endpoint+"/render",{method:"POST",headers:{"Content-Type":"application/json","X-Studio-Token":token},body:JSON.stringify(makeRenderPayload(c,prompt,images))});
  const result=await response.json();
  if(!response.ok)throw new Error(result.error||"Gateway error "+response.status);
  if(!result.image||typeof result.image!=="string")throw new Error("Gateway chưa trả về ảnh hợp lệ.");
  state.generated="data:"+(result.mime||"image/png")+";base64,"+result.image;
  $("resultView").src=state.generated;$("resultView").hidden=false;$("resultEmpty").hidden=true;$("downloadResult").hidden=false;
  showStatus("Đã nhận ảnh tạo từ AI.");
 }catch(e){showStatus("Render thất bại: "+(e.message||String(e)),true)}finally{$("renderButton").disabled=false}
}
for(const b of BRAINS){const card=text("div","","brain");card.append(text("b",String(b.experts.length)),text("small",b.name));$("brainGrid").append(card);
 const l=text("label","","");const c=document.createElement("input");c.type="checkbox";c.className="toggle";c.value=b.id;c.dataset.brain="true";c.checked=true;l.append(c," "+b.name+" ("+b.experts.length+")");$("manualExperts").append(l);
}
for(const l of LOCKS){const label=text("label");const checkbox=document.createElement("input");checkbox.className="toggle";checkbox.type="checkbox";checkbox.value=l;checkbox.dataset.lock="true";checkbox.checked=["Architecture","Geometry","Camera"].includes(l);label.append(checkbox," "+l);$("locks").append(label)}
$("createTab").onclick=()=>setMode("create");$("editTab").onclick=()=>setMode("edit");
$("masterInput").onchange=e=>{const f=e.target.files?.[0];if(f)updateMaster(f)};
$("clearMaster").onclick=()=>updateMaster(null);
$("addModel").onclick=addModel;
$("expertMode").onchange=()=>{$("manualExperts").hidden=$("expertMode").value!=="manual"};
$("compile").onclick=compile;
$("copyPrompt").onclick=async()=>{await navigator.clipboard.writeText(compile());showStatus("Đã sao chép prompt.")};
$("downloadPrompt").onclick=()=>downloadText("hoanggia-prompt.txt",compile());
$("exportProject").onclick=()=>downloadText("da-studio-project.json",JSON.stringify({version:"1.4",...projectSnapshot(liveSettings())},null,2),"application/json");
$("importProject").onchange=async e=>{try{const f=e.target.files?.[0];if(!f)return;const v=JSON.parse(await f.text());if(!Array.isArray(v.models))throw Error("Sai cấu trúc JSON");for(const m of state.models)revokeRefs(m);state.models=v.models.slice(0,200).map(()=>null).map((_,i)=>{const o=v.models[i],m=createModel();return {...m,...o,id:m.id,references:[],properties:o.properties&&typeof o.properties==="object"?o.properties:{},notes:(o.notes||"")+(o.references?.length?" [Cần tải lại ảnh gốc sau khi nhập JSON.]":"")}});for(const key of fields){if(typeof v[key]==="string"&&[...$(key).options||[]].length){if([...$(key).options].some(x=>x.value===v[key]))$(key).value=v[key]}else if(key==="brief"&&typeof v[key]==="string")$(key).value=v[key]}
 setMode(v.mode==="edit"?"edit":"create");drawModels();updateMaster(null);showStatus("Đã nhập cấu hình. Vì lý do bảo mật, vui lòng tải lại file ảnh gốc.");}catch(e){showStatus("Không nhập được JSON: "+e.message,true)}finally{e.target.value=""}};
$("renderButton").onclick=render;
$("downloadResult").onclick=()=>{if(!state.generated)return;const a=document.createElement("a");a.href=state.generated;a.download="hoanggia-ai-image.png";document.body.append(a);a.click();a.remove()};
setMode("create");addModel();
