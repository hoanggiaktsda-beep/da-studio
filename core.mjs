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
export function getWarnings(c){
 const w=[];
 if(c.specificDateTime&&(!validLocalDate(c)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(c.localTime||"")))w.push("Ngày/giờ địa phương không hợp lệ hoặc chưa nhập đủ (ngày, tháng, năm, giờ).");
 if(c.mode==="edit"&&!c.masterImage)w.push("Image Editor cần Master Image trước khi render.");
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
 const refNames=active.map(m=>({id:m.id,name:m.name,category:m.category,brand:m.brand||"Unverified",sku:m.sku||"Unverified",target:m.target||"Not specified",material:m.material,dimensions:m.dimensions,structure:m.structure,application:m.application,properties:m.properties,notes:m.notes,references:m.references.map((r,i)=>({order:i+1,filename:r.name}))}));
 const lines=[
 "HOANGGIA AI — DESIGN INTELLIGENCE ENGINE V1.4",
 "ROLE: Professional architecture, urban planning, interior design and photorealistic visual production.",
 "TASK: "+(c.mode==="edit"?"EDIT EXISTING MASTER IMAGE":"CREATE NEW IMAGE"),
 "SPACE: "+c.space,"SPECIFIC ZONE: "+(c.zone==="HG tự đề xuất"?recommendVisual(c).zone:(c.zone||"Not specified")),"STYLE: "+(c.style==="HG tự đề xuất"?recommendVisual(c).style:c.style),"REQUESTED ASPECT: "+(c.aspect||"3:2 Ngang"),"API RENDER SIZE: "+c.size,"QUALITY: "+c.quality,
 "CAMERA: "+(c.camera==="HG tự đề xuất"?recommendVisual(c).camera:(c.camera||"Eye Level")),
 "LIGHTING: "+(c.lighting==="HG tự đề xuất"?recommendVisual(c).lighting:(c.lighting||"Natural Daylight")),
 "ASPECT RULE: Preserve the requested composition. When the image API does not support the exact requested aspect, use the nearest supported size and warn the user; do not falsely label the output aspect.",
 "DESIGN BRIEF: "+(c.brief?.trim()||"Produce a coherent professional architecture/interior design."),
 "INTERIOR BRAND DIRECTION: "+(c.furnitureBrand||"Không áp dụng"),
 "GEOGRAPHIC & ENVIRONMENTAL CONTEXT: "+geographicDirection(c),
 "OUTPUT MEDIUM: "+(c.outputType||"HG tự đề xuất"),
 "PHOTOGRAPHY DIRECTOR: "+resolvePhotoDirection(c).selected,
 "PHOTOGRAPHY QUALITY GUIDANCE: "+resolvePhotoDirection(c).guide,
 "BRAND RULE: Brand is a design reference only. Do not claim official products, exact catalog models, verified authenticity or protected brand identity without supplied visual/product evidence. Per-Model references and verified product identity override global inspiration.",
 "EXPERT ORCHESTRATOR: "+c.expertMode,
 "DOMAIN AUTHORITY: "+authority.lead+" leads design decisions. Supporting brains may advise but cannot override space planning, dimensions, architecture, technical feasibility, or approved materials.",
 "AUTHORITY ORDER: verified project constraints and hard locks > domain lead > supporting material/lighting experts > photographic/cinematic presentation.",
 "DOMAIN QC: if inputs conflict with locked geometry, use or feasibility, flag the conflict rather than silently modifying the design.",
 "ACTIVE BRAINS: "+brains.map(b=>b.name+" ("+b.experts.length+" expert roles)").join("; "),
 "EXPERT DECISION: assess spatial logic, product scale, material behavior, lighting physics, camera composition; check conflicts before execution.",
 "MASTER IMAGE: "+(c.masterImage?.name||"none"),
 "HARD LOCKS: "+(c.locks.join("; ")||"none"),
 "MULTI-MODEL REFERENCES:",
 JSON.stringify(refNames,null,2),
 "REFERENCE MAPPING: The FIRST input image is the MASTER when provided. Each following image is assigned to its precise MODEL ID and reference order, by the uploaded manifest. Never merge identities or materials across different Models without explicit authorization.",
 "EDIT RULES: Preserve all locked geometry, architecture, openings, floor plan, camera and perspective. Apply only requested changes. Fit product size to existing space without altering locked architecture.",
 "REALISM: Physically credible material, scale, contact shadows, illumination and perspective. Do not invent unseen construction specifications or make up brand/model identities.",
 "QC: Review hard locks, multi-model isolation, composition, geometry, design feasibility, duplicate objects and artifacts."
 ];
 return lines.join("\n");
}
export function projectSnapshot(c){return {...c,masterImage:c.masterImage?.name||null,models:c.models.map(m=>({...m,references:m.references.map(r=>({name:r.name}))}))};}
export function makeRenderPayload(c,prompt,images){return {mode:c.mode,model:"gpt-image-2",prompt,size:c.size,quality:c.quality,images};}
