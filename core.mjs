import {recommendVisual,resolvePhotoDirection,geographicDirection,validLocalDate} from "./design-catalog.mjs";
export const BRAINS=[
 {id:"urban",name:"Urban & Master Planning",experts:["Urban Planning Director","Regional Planning","Master Planning","Urban Morphology","Transport & Mobility","Landscape Urbanist","Environmental Planner","Infrastructure Planner","Smart City Strategist","Urban Visualization"]},
 {id:"architecture",name:"Architecture",experts:["Chief Architect","Concept Architect","Building Typology","Facade Design","Structural Logic","Building Physics","Architectural Materials","Architectural Landscape","Preservation"]},
 {id:"interior",name:"Interior",experts:["Interior Director","Space Planning","Furniture Layout","Ergonomics","Furniture Design","Material & Finish","Color & Style","Product Replacement","Interior Styling","Reference Synchronization"]},
 {id:"visual",name:"Visual / Cinematic",experts:["Creative Director","Art Director","Director of Photography","Architectural Photographer","Camera & Lens","Lighting Designer","Cinematic Lighting","Composition","Character Director","Fashion & Wardrobe","Color Grading"]},
 {id:"image",name:"Image Engine",experts:["Image Generation","Image Editing","Geometry Preservation","Multi-Reference","Render Realism"]},
 {id:"quality",name:"Quality Control",experts:["Design Quality Auditor","Spatial Consistency Auditor","Visual Quality Auditor"]}
];
export const CATEGORIES=["Sofa","Armchair","Bàn trà","Bàn ăn","Ghế ăn","Giường","Tủ","Đèn","Thảm","Rèm","Bàn làm việc","Kệ","Trang trí","Cây xanh","Vật liệu","Khác"];
export const LOCKS=["Architecture","Geometry","Camera","Furniture Layout","Materials","Lighting","Model Identity"];
export const FIELD_DEFS={
 "Sofa":[["form","Kiểu sofa",["Module","Văng","Chữ L","Chữ U","Cong","Chaise","Daybed"]],["upholstery","Bọc phủ",["Theo ảnh","Da","Linen","Velvet","Bouclé","Vải dệt"]],["frame","Khung",["Chưa xác minh","Gỗ","Plywood","Thép"]],["cushion","Đệm",["Chưa xác minh","Foam","HR Foam","Lông vũ","Hybrid"]]],
 "Armchair":[["form","Kiểu ghế",["Club","Lounge","Wingback","Tub","Swivel"]],["upholstery","Bọc phủ",["Theo ảnh","Da","Vải","Bouclé","Nhung"]]],
 "Bàn trà":[["top","Mặt bàn",["Theo ảnh","Marble","Travertine","Gỗ","Kính","Kim loại"]],["base","Chân bàn",["Theo ảnh","Trụ","Khung","Khối đặc"]]],
 "Đèn":[["fixture","Loại đèn",["Thả","Chùm","Đứng","Bàn","Tường","Spotlight"]],["cct","Nhiệt độ màu",["Theo ảnh","2700K","3000K","3500K","4000K"]]],
 "Tủ":[["door","Cánh tủ",["Phẳng","Pano","Kính","Nan","Không cánh"]],["core","Cốt vật liệu",["Chưa xác minh","MDF","HDF","Plywood","Gỗ tự nhiên"]]]
};
let seq=0;
export function createModel(){return {id:"mdl_"+Date.now().toString(36)+"_"+(++seq),name:"Model "+String(seq).padStart(2,"0"),category:"Sofa",brand:"",sku:"",target:"",material:"Theo ảnh",dimensions:"",structure:"",application:"Giữ đúng mẫu",notes:"",selected:true,properties:{},references:[]};}
export function uniqueModelID(models){return new Set(models.map(m=>m.id)).size===models.length;}
// Design AI V2: architectural domain authority outranks photography and rendering.
// Manual selection may add supporting brains but never remove mandatory domain/QC authority.
export const DESIGN_AUTHORITY={
 "Nội thất":{lead:"interior",support:["architecture","visual","image"],locks:["Architecture","Geometry","Furniture Layout"]},
 "Kiến trúc":{lead:"architecture",support:["interior","visual","image"],locks:["Architecture","Geometry"]},
 "Cảnh quan":{lead:"architecture",support:["urban","visual","image"],locks:["Geometry"]},
 "Quy hoạch đô thị":{lead:"urban",support:["architecture","visual","image"],locks:["Geometry"]}
};
export function designAuthority(space="Nội thất"){return DESIGN_AUTHORITY[space]||DESIGN_AUTHORITY["Nội thất"];}
export function selectBrains({space="Nội thất",mode="create",models=[]},expertMode="auto",chosen=[]){
 const authority=designAuthority(space);
 const ids=new Set([authority.lead,"quality","image"]);
 if(expertMode==="manual"){
   for(const id of chosen)if(BRAINS.some(b=>b.id===id))ids.add(id);
 }else{
   ids.add("visual");
   if(mode==="edit"&&models.some(m=>m.selected))ids.add("interior");
 }
 return BRAINS.filter(b=>ids.has(b.id));
}

// Structured evidence-based design audit. Thresholds are explicitly project-defined,
// not universal building codes or automatically measured from photos.
// Spatial relationships are calculated only from explicit plan coordinates in mm.
// Rectangular, axis-aligned footprints are a preliminary check, not a CAD solver.
export function auditLayout(c={}){
 const issues=[],evidence=[],items=Array.isArray(c.layoutItems)?c.layoutItems:[];
 const roomW=Number(c.roomWidthMm),roomD=Number(c.roomDepthMm);
 const hasRoom=c.roomWidthMm!==""&&c.roomDepthMm!==""&&Number.isFinite(roomW)&&Number.isFinite(roomD)&&roomW>0&&roomD>0;
 const boxes=[];
 const seen=new Set();
 const obstacles=Array.isArray(c.layoutObstacles)?c.layoutObstacles:[];
 const doors=Array.isArray(c.layoutDoors)?c.layoutDoors:[];
 for(const [label,group] of [["sản phẩm",items],["vật cản",obstacles],["cửa",doors]])for(const entry of group)if(entry?.__parseError)issues.push({severity:"error",field:"layoutJSON",message:"Dữ liệu "+label+": "+entry.__parseError});
 for(const door of doors){
  const id=String(door?.id||"cửa");
  const raw=[door?.xMm,door?.yMm,door?.widthMm,door?.depthMm];
  if(raw.some(v=>v===""||v===null||v===undefined||!Number.isFinite(Number(v)))||Number(raw[0])<0||Number(raw[1])<0||Number(raw[2])<=0||Number(raw[3])<=0){
   issues.push({severity:"error",field:"door:"+id,message:"Vùng mở cửa thiếu hoặc sai kích thước: "+id});continue;
  }
  const [x,y,w,d]=raw.map(Number);
  if(hasRoom&&(x+w>roomW||y+d>roomD))issues.push({severity:"error",field:"door:"+id,message:"Vùng mở cửa vượt ranh giới phòng: "+id});
  // Door swing clearance is represented by a conservative rectangular envelope,
  // supplied by the designer, not inferred from hinge or photo.
  boxes.push({id:"cửa:"+id,x,y,w,d,door:true});
 }

 for(const obstacle of obstacles){
  const name=String(obstacle?.id||"vật cản");
  const v=[obstacle?.xMm,obstacle?.yMm,obstacle?.widthMm,obstacle?.depthMm];
  if(v.some(n=>n===""||n===null||n===undefined||!Number.isFinite(Number(n)))||Number(v[0])<0||Number(v[1])<0||Number(v[2])<=0||Number(v[3])<=0){
   issues.push({severity:"error",field:"obstacle:"+name,message:"Vật cản có tọa độ hoặc kích thước không hợp lệ: "+name});continue;
  }
  const [x,y,w,d]=v.map(Number);
  if(hasRoom&&(x+w>roomW||y+d>roomD))issues.push({severity:"error",field:"obstacle:"+name,message:"Vật cản vượt ranh giới phòng: "+name});
  boxes.push({id:name,x,y,w,d,obstacle:true});
 }
 if(c.layoutMinimumGapMm!==""&&c.layoutMinimumGapMm!==undefined&&c.layoutMinimumGapMm!==null&&(!Number.isFinite(Number(c.layoutMinimumGapMm))||Number(c.layoutMinimumGapMm)<0))issues.push({severity:"error",field:"layoutMinimumGapMm",message:"Ngưỡng khoảng cách dự án phải là số không âm."});
 for(const item of items){
  const id=String(item?.id||item?.name||"unknown");
  if(seen.has(id))issues.push({severity:"error",field:"layout:"+id,message:"Trùng mã sản phẩm mặt bằng: "+id});
  seen.add(id);
  const raw=[item?.xMm,item?.yMm,item?.widthMm,item?.depthMm];
  if(raw.some(v=>v===""||v===null||v===undefined)||raw.some(v=>!Number.isFinite(Number(v)))){
   issues.push({severity:"error",field:"layout:"+id,message:"Dữ liệu mặt bằng thiếu hoặc sai tọa độ/kích thước của "+id});continue;
  }
  const [x,y,w,d]=raw.map(Number);
  if(x<0||y<0||w<=0||d<=0){issues.push({severity:"error",field:"layout:"+id,message:"Tọa độ/kích thước không hợp lệ: "+id});continue;}
  const b={id,x,y,w,d};boxes.push(b);
  if(hasRoom&&(x+w>roomW||y+d>roomD))issues.push({severity:"error",field:"layout:"+id,message:"Sản phẩm "+id+" vượt ranh giới phòng."});
 }
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
  const a=boxes[i],b=boxes[j];
  const dx=Math.max(0,Math.max(a.x,b.x)-Math.min(a.x+a.w,b.x+b.w));
  const dy=Math.max(0,Math.max(a.y,b.y)-Math.min(a.y+a.d,b.y+b.d));
  const overlap=a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.d&&b.y<a.y+a.d;
  if(overlap)issues.push({severity:"error",field:"pair:"+a.id+":"+b.id,message:"Hai vùng chiếm chỗ giao nhau: "+a.id+" / "+b.id});
  else {
   const gap=Math.hypot(dx,dy);
   evidence.push("Khoảng cách biên "+a.id+" / "+b.id+": "+Math.round(gap)+" mm (mặt bằng giả định)");
   const min=c.layoutMinimumGapMm;
   if(!a.obstacle&&!b.obstacle&&!a.door&&!b.door&&min!==""&&min!==undefined&&min!==null&&Number.isFinite(Number(min))&&Number(min)>=0&&gap<Number(min))
    issues.push({severity:"error",field:"pair:"+a.id+":"+b.id,message:"Khoảng cách "+a.id+" / "+b.id+" nhỏ hơn ngưỡng dự án."});
  }
 }
 // Optional explicit access/service envelope in each layout item; never infer it from an image.
 for(const item of items){
  const id=String(item?.id||item?.name||"unknown");
  const z=item?.accessZoneMm;
  if(!z){issues.push({severity:"unknown",field:"access:"+id,message:"Chưa khai báo vùng tiếp cận/thao tác trước sản phẩm "+id+"; chưa xác nhận khả năng sử dụng."});continue;}
  const raw=[z.xMm,z.yMm,z.widthMm,z.depthMm];
  if(raw.some(v=>v===""||v===null||v===undefined||!Number.isFinite(Number(v)))||Number(raw[0])<0||Number(raw[1])<0||Number(raw[2])<=0||Number(raw[3])<=0){
   issues.push({severity:"error",field:"access:"+id,message:"Vùng tiếp cận/thao tác không hợp lệ: "+id});continue;
  }
  const [x,y,w,d]=raw.map(Number);
  if(hasRoom&&(x+w>roomW||y+d>roomD))issues.push({severity:"error",field:"access:"+id,message:"Vùng thao tác vượt ranh giới phòng: "+id});
  for(const b of boxes){
   if(b.id===id)continue;
   if(x<b.x+b.w&&b.x<x+w&&y<b.y+b.d&&b.y<y+d)
    issues.push({severity:"error",field:"access:"+id+":"+b.id,message:"Vùng thao tác/tiếp cận "+id+" bị chiếm bởi "+b.id});
  }
  evidence.push("Vùng thao tác "+id+" được kiểm tra theo bao chữ nhật do người dùng khai báo.");
 }
 if(doors.length)for(const door of doors)if(!door?.swingDirection)
  issues.push({severity:"unknown",field:"doorSwing:"+String(door?.id||"cửa"),message:"Chưa khai báo hướng mở cửa; vùng bao mở cửa chỉ được kiểm tra theo tọa độ nhập."});
 if(items.length)issues.push({severity:"unknown",field:"circulation","message":"Chưa có mạng lối đi và điểm đầu/cuối được xác minh; khoảng cách giữa các đồ vật không chứng minh đường di chuyển liên tục."});
 if((items.length||obstacles.length||doors.length)&&!hasRoom)issues.push({severity:"unknown",field:"layoutRoom",message:"Chưa đủ kích thước phòng để xác minh vị trí sản phẩm."});
 if(items.length&&hasRoom&&!doors.length)issues.push({severity:"unknown",field:"layoutDoors",message:"Chưa khai báo vùng mở cửa; chưa thể kiểm tra xung đột với cửa và lối tiếp cận."});
 if(items.length&&hasRoom&&!obstacles.length)issues.push({severity:"unknown",field:"layoutObstacles",message:"Chưa khai báo cột, tường nhô hoặc vật cản; chỉ kiểm tra hình chữ nhật phòng."});
 if(items.length&&(!c.layoutMinimumGapMm&&c.layoutMinimumGapMm!==0))issues.push({severity:"unknown",field:"layoutMinimumGapMm",message:"Chưa khai báo khoảng cách tối thiểu giữa sản phẩm; chưa thể xác nhận khoảng hở sử dụng."});
 if(items.length&&boxes.length&&hasRoom)evidence.push("Kiểm tra ranh giới trên mặt bằng chữ nhật "+roomW+" × "+roomD+" mm; chưa tính cửa, tường, hướng mở, lối thoát hiểm.");
 if(doors.length)evidence.push("Vùng mở cửa do người dùng khai báo là bao hình chữ nhật, không tự tính cung quay cánh cửa.");
 if(!items.length)issues.push({severity:"unknown",field:"layoutItems",message:"Chưa có tọa độ mặt bằng sản phẩm; không thể xác nhận bố trí, va chạm hay khoảng cách."});
 return {ok:!issues.some(i=>i.severity==="error"),issues,evidence};
}
export function auditDesign(c={}){
 const issues=[],evidence=[],models=(c.models||[]).filter(m=>m.selected);
 const add=(severity,field,message)=>issues.push({severity,field,message});
 const numeric=(v)=>v===""||v===null||v===undefined?null:Number(v);
 const width=numeric(c.clearanceMm),required=numeric(c.requiredClearanceMm);
 if(required!==null){
  if(!Number.isFinite(required)||required<=0)add("error","requiredClearanceMm","Ngưỡng lối đi phải là số dương do dự án cung cấp.");
  else if(width===null)add("unknown","clearanceMm","Chưa có số đo lối đi để đối chiếu ngưỡng dự án.");
  else if(!Number.isFinite(width)||width<=0)add("error","clearanceMm","Số đo lối đi không hợp lệ.");
  else {evidence.push("Lối đi: "+width+" mm / yêu cầu dự án: "+required+" mm");if(width<required)add("error","clearanceMm","Lối đi nhỏ hơn ngưỡng dự án đã nhập.");}
 }else if(width!==null){
  if(!Number.isFinite(width)||width<=0)add("error","clearanceMm","Số đo lối đi phải là số dương hợp lệ.");
  else add("unknown","requiredClearanceMm","Chưa có ngưỡng đối chiếu; không tự kết luận lối đi đạt chuẩn.");
 }
 const roomW=numeric(c.roomWidthMm),roomD=numeric(c.roomDepthMm);
 for(const [key,v] of [["roomWidthMm",roomW],["roomDepthMm",roomD]])if(v!==null&&(!Number.isFinite(v)||v<=0))add("error",key,"Kích thước phòng phải là số dương.");
 if(roomW!==null&&roomD!==null&&roomW>0&&roomD>0&&Number.isFinite(roomW*roomD))evidence.push("Kích thước phòng: "+roomW+" × "+roomD+" mm (do người dùng cung cấp, chưa đo từ ảnh)");
 else add("unknown","roomDimensions","Chưa đủ kích thước phòng có thể kiểm chứng.");
 for(const m of models){
  const dims=String(m.dimensions||"").trim();
  if(!dims)add("unknown","model:"+m.id,"Sản phẩm "+m.name+" chưa có kích thước xác minh.");
  else {
   const match=dims.match(/^\s*(\d+(?:[.,]\d+)?)\s*[x×*]\s*(\d+(?:[.,]\d+)?)(?:\s*[x×*]\s*(\d+(?:[.,]\d+)?))?\s*(mm|cm|m)\s*$/i);
   if(!match)add("unknown","model:"+m.id,"Kích thước "+m.name+" chưa theo định dạng D × R [× C] và đơn vị mm/cm/m; không tự suy đoán.");
   else{
    const factor={mm:1,cm:10,m:1000}[match[4].toLowerCase()];
    const d=Number(match[1].replace(",","."))*factor,w=Number(match[2].replace(",","."))*factor;
    const h=match[3]===undefined?null:Number(match[3].replace(",","."))*factor;
    if(!Number.isFinite(d)||!Number.isFinite(w)||d<=0||w<=0||(h!==null&&(!Number.isFinite(h)||h<=0)))add("error","model:"+m.id,"Kích thước dài, rộng hoặc cao của sản phẩm không hợp lệ.");
    else {evidence.push(m.name+": "+d+" × "+w+" mm (khai báo, chưa xác minh catalogue)");if(roomW>0&&roomD>0&&((d>roomD||w>roomW)&&(d>roomW||w>roomD)))add("error","model:"+m.id,"Sản phẩm lớn hơn cả hai hướng phòng; cần kiểm tra lại kích thước.");}
   }
  }
  if(!m.material||["Theo ảnh","Chưa xác minh"].includes(m.material))add("unknown","material:"+m.id,"Chưa xác minh vật liệu "+m.name+"; không tự suy ra thông số kỹ thuật.");
  else evidence.push("Vật liệu khai báo "+m.name+": "+m.material+" (chưa xác minh chứng chỉ/đặc tính)");
 }
 const layout=auditLayout(c);issues.push(...layout.issues);evidence.push(...layout.evidence);
 if(!c.projectStandard)add("unknown","projectStandard","Chưa cung cấp quy chuẩn/tiêu chí nghiệm thu áp dụng; không xác nhận tuân thủ pháp lý.");
 add("unknown","constructionFeasibility","Chưa có hồ sơ khảo sát, kết cấu, MEP, kích thước thực tế và chi tiết liên kết; kết quả mặt bằng không chứng nhận khả năng thi công.");
 return {ok:!issues.some(x=>x.severity==="error"),issues,evidence};
}

export function getWarnings(c){
 const w=[];
 for(const issue of auditDesign(c).issues)if(issue.severity==="error")w.push("Xung đột: "+issue.message);
 if(c.specificDateTime&&(!validLocalDate(c)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(c.localTime||"")))w.push("Ngày/giờ địa phương không hợp lệ hoặc chưa nhập đủ (ngày, tháng, năm, giờ).");
 if(c.mode==="edit"&&!c.masterImage)w.push("Image Editor cần Master Image trước khi render.");
 if(c.mode==="edit"&&c.locks.includes("Architecture")&&/(thay đổi kiến trúc|phá tường|di chuyển tường|đổi cửa sổ|đổi kết cấu)/i.test(c.brief||""))w.push("Xung đột: Architecture Lock và yêu cầu thay đổi kiến trúc.");
 if(c.mode==="edit"&&c.locks.includes("Geometry")&&/(thay đổi kích thước|nới rộng phòng|thu hẹp phòng|đổi chiều cao trần)/i.test(c.brief||""))w.push("Xung đột: Geometry Lock và yêu cầu thay đổi hình học.");
 if(!c.brief?.trim())w.push("Chưa có mô tả thiết kế — AI sẽ dựa trên phong cách đã chọn.");
 if(!uniqueModelID(c.models))w.push("Model ID bị trùng.");
 const active=c.models.filter(m=>m.selected); 
 if(c.mode==="edit"&&c.locks.includes("Camera")&&c.camera&&c.camera!=="HG tự đề xuất"&&c.camera!=="Giữ nguyên camera ảnh gốc")w.push("Xung đột: Camera Lock đang bật nhưng góc camera yêu cầu thay đổi."); 
 if(c.mode==="edit"&&c.locks.includes("Lighting")&&c.lighting&&c.lighting!=="HG tự đề xuất"&&c.lighting!=="Giữ nguyên ánh sáng ảnh gốc")w.push("Xung đột: Lighting Lock đang bật nhưng ánh sáng yêu cầu thay đổi.");
 if(active.length&&c.mode==="edit"&&active.some(m=>!m.target?.trim()))w.push("Có Model chưa ghi rõ đối tượng/vị trí cần thay thế.");
 if(active.some(m=>!m.references?.length))w.push("Có Model chưa có ảnh tham chiếu. AI chỉ sử dụng mô tả.");
 const refs=(c.masterImage?1:0)+active.reduce((sum,m)=>sum+(m.references?.length||0),0);
 if(refs>16)w.push("Tối đa 16 ảnh trong một lần gọi API. Hãy giảm số ảnh hoặc chia lượt xử lý.");
 if(c.mode==="edit"&&c.locks.includes("Materials")&&active.some(m=>m.application==="Chỉ lấy vật liệu"))w.push("Xung đột: Materials Lock và yêu cầu chỉ thay vật liệu.");
 if(c.mode==="edit"&&c.locks.includes("Furniture Layout")&&active.some(m=>m.application==="Đổi vị trí"))w.push("Xung đột: Furniture Layout Lock và yêu cầu đổi vị trí.");
 return w;
}
export function compilePrompt(c){
 const active=c.models.filter(m=>m.selected);
 const brains=selectBrains(c,c.expertMode,c.chosenBrains);
 const authority=designAuthority(c.space);
 const audit=auditDesign(c);
 const visual=recommendVisual(c);
 const zone=c.zone==="HG tự đề xuất"?visual.zone:(c.zone||"Chưa xác định");
 const style=c.style==="HG tự đề xuất"?visual.style:c.style;
 const camera=c.camera==="HG tự đề xuất"?visual.camera:c.camera;
 const lighting=c.lighting==="HG tự đề xuất"?visual.lighting:c.lighting;
 const uniq=values=>[...new Set(values.filter(Boolean).map(v=>String(v).trim()).filter(Boolean))];
 const references=active.map(m=>{
   const props=uniq([m.category,m.brand&&m.brand!=="Không áp dụng"?m.brand:"",m.sku,m.material,m.dimensions,m.structure,m.properties,m.notes]);
   const files=(m.references||[]).map(r=>r.name).filter(Boolean);
   return [m.name||m.id,m.target?"vị trí: "+m.target:"",m.application?"áp dụng: "+m.application:"",props.length?"đặc điểm: "+props.join(", "):"",files.length?"ảnh: "+files.join(", "):""].filter(Boolean).join(" | ");
 });
 const context=uniq(["Loại không gian: "+c.space,"Khu vực: "+zone,"Phong cách: "+style,c.masterImage?"Ảnh gốc: "+c.masterImage.name:"",geographicDirection(c)]).join(". ");
 const task=uniq([c.mode==="edit"?"Chỉnh sửa ảnh gốc theo yêu cầu.":"Tạo ảnh thiết kế mới.",c.brief?.trim(),references.length?"Sản phẩm và ảnh tham chiếu (giữ đúng từng model): "+references.join("; "):""]).join(" ");
 const limits=uniq([
   c.mode==="edit"?"Giữ nguyên mọi yếu tố ngoài phạm vi chỉnh sửa.":"",
   c.locks.length?"Khóa: "+c.locks.join(", ")+".":"",
   "Ảnh tham chiếu từng sản phẩm chỉ áp dụng cho đúng sản phẩm đó; không trộn model.",
   "Không tự bịa kích thước, cấu tạo khuất hoặc xác nhận tiêu chuẩn chưa có chứng cứ.",
   audit.issues.length?"Xung đột cần kiểm tra: "+audit.issues.map(i=>i.message).join("; "):""
 ]).join(" ");
 return [
  "BỐI CẢNH: "+context,
  "VAI TRÒ: "+authority.lead+" phụ trách thiết kế; "+brains.map(b=>b.name).join(", ")+" hỗ trợ theo chuyên môn, không vượt quyền thiết kế.",
  "NHIỆM VỤ: "+task,
  "RÀNG BUỘC: "+limits,
  "KẾT QUẢ: Ảnh "+(c.mode==="edit"?"chỉnh sửa":"thiết kế")+" đúng yêu cầu, tỷ lệ "+(c.aspect||"3:2 Ngang")+", góc máy "+camera+", ánh sáng "+lighting+", vật liệu và phối cảnh chân thực; "+(c.outputType||"đầu ra hình ảnh")+"."
 ].join("\n\n");
}

// Language editors operate on the completed five-section prompt; they do not
// alter design authority, references, hard locks, or expert decisions.
export function editPromptLanguage(prompt, language="vi"){
 if(language!=="en") return prompt;
 const terms=[
  ["BỐI CẢNH:","CONTEXT:"],["VAI TRÒ:","ROLE:"],["NHIỆM VỤ:","TASK:"],["RÀNG BUỘC:","CONSTRAINTS:"],["KẾT QUẢ:","RESULT:"],
  ["Loại không gian:","Space type:"],["Khu vực:","Area:"],["Phong cách:","Style:"],["Ảnh gốc:","Source image:"],
  ["phụ trách thiết kế;","leads design;"],["hỗ trợ theo chuyên môn, không vượt quyền thiết kế.","provide domain-specific support without overriding design authority."],
  ["Tạo ảnh thiết kế mới.","Create a new design image."],["Chỉnh sửa ảnh gốc theo yêu cầu.","Edit the source image as requested."],
  ["Sản phẩm và ảnh tham chiếu (giữ đúng từng model):","Products and references (preserve each model identity):"],
  ["vị trí:","position:"],["áp dụng:","application:"],["đặc điểm:","properties:"],["ảnh:","images:"],
  ["Giữ nguyên mọi yếu tố ngoài phạm vi chỉnh sửa.","Preserve everything outside the authorized editing scope."],
  ["Khóa:","Locks:"],["Ảnh tham chiếu từng sản phẩm chỉ áp dụng cho đúng sản phẩm đó; không trộn model.","Apply each product reference only to its assigned product; never mix model identities."],
  ["Không tự bịa kích thước, cấu tạo khuất hoặc xác nhận tiêu chuẩn chưa có chứng cứ.","Do not invent dimensions or hidden construction details, or claim unverified standards."],
  ["Xung đột cần kiểm tra:","Conflicts requiring review:"],
  ["Ảnh chỉnh sửa đúng yêu cầu","Edited image matching the request"],["Ảnh thiết kế đúng yêu cầu","Designed image matching the request"],
  ["tỷ lệ","aspect ratio"],["góc máy","camera"],["ánh sáng","lighting"],["vật liệu và phối cảnh chân thực","realistic materials and perspective"],
  ["đầu ra hình ảnh","image output"],["Nội thất","Interior"],["Kiến trúc","Architecture"],["Cảnh quan","Landscape"],["Quy hoạch đô thị","Urban planning"],
  ["Không áp dụng","Not applicable"],["Chưa xác định","Not specified"],["Tự nhiên","Natural"],["Ban ngày","Daytime"],
  ["Phòng khách","Living room"],["Phòng ngủ","Bedroom"],["Phòng bếp","Kitchen"],["Phòng ăn","Dining room"],
  ["Hiện đại","Modern"],["Tối giản","Minimalist"],["Sang trọng","Luxury"],["Ảnh tham chiếu","Reference image"]
 ];
 let result=String(prompt);
 for(const [vi,en] of terms)result=result.split(vi).join(en);
 // A pure-English output must not silently discard user-entered Vietnamese.
 // Explicitly request English source descriptions when a reliable translation is unavailable.
 if(/[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/i.test(result)){
  throw new Error("English Language Expert: Some descriptions or selected values remain in Vietnamese. Please enter the design brief, product notes, and custom descriptions in English, or choose Vietnamese output. No design details were removed.");
 }
 return result;
}
export function projectSnapshot(c){return {...c,masterImage:c.masterImage?.name||null,models:c.models.map(m=>({...m,references:m.references.map(r=>({name:r.name}))}))};}
export function makeRenderPayload(c,prompt,images){return {mode:c.mode,model:"gpt-image-2",prompt,size:c.size,quality:c.quality,images};}
