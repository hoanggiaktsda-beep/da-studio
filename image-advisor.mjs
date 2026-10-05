// Curated reference catalogue, not a live ranking or API integration.
export const IMAGE_PLATFORMS=[
{id:"openai",name:"OpenAI Images",focus:"Tạo và chỉnh sửa theo chỉ dẫn",url:"https://platform.openai.com/docs/guides/image-generation",tags:["edit","references","precision"],note:"Gateway hiện tại chỉ được viết cho OpenAI; cần cấu hình riêng và trả phí API."},
{id:"midjourney",name:"Midjourney",focus:"Khám phá ý tưởng, moodboard và phong cách",url:"https://www.midjourney.com/",tags:["concept","style"],note:"Tham khảo và chuyển prompt sang nền tảng ngoài; chưa kết nối tạo ảnh trực tiếp."},
{id:"imagen",name:"Google Imagen",focus:"Ý tưởng hình ảnh và thể hiện chi tiết",url:"https://cloud.google.com/vertex-ai/generative-ai/docs/image/overview",tags:["concept","precision"],note:"Chưa kết nối API Google."},
{id:"firefly",name:"Adobe Firefly",focus:"Quy trình sáng tạo, chỉnh sửa và hậu kỳ",url:"https://firefly.adobe.com/",tags:["edit","style"],note:"Chưa kết nối API Adobe."},
{id:"flux",name:"FLUX",focus:"Khám phá chất liệu, phong cách và render",url:"https://bfl.ai/",tags:["concept","style","precision"],note:"Chưa kết nối FLUX."},
{id:"sd",name:"Stable Diffusion",focus:"Workflow kiểm soát cấu trúc, vùng ảnh và tham chiếu",url:"https://stability.ai/",tags:["edit","references","precision"],note:"Phụ thuộc phiên bản và workflow cụ thể; chưa kết nối."}
];
export function adviseImageWorkflow({mode="create",space="Nội thất",masterImage=null,models=[]}={}){
const active=models.filter(m=>m.selected);const hasRefs=active.some(m=>m.references?.length)||!!masterImage;
const edit=mode==="edit";const recommendations=edit?["openai","sd","firefly"]:hasRefs?["openai","flux","sd"]:space==="Quy hoạch đô thị"?["flux","midjourney","openai"]:["midjourney","openai","imagen"];
const steps=edit?["Giữ ảnh Master làm nguồn không gian","Khóa camera và hình học","Gán từng ảnh tham chiếu cho đúng sản phẩm","Chỉnh sửa chọn lọc và kiểm tra sai lệch"]:hasRefs?["Xác định mục tiêu ảnh và phong cách","Phân tách ảnh tham chiếu theo từng Model","Tạo prompt có cấu trúc và kiểm tra ánh sáng","Kết xuất và đối chiếu tỷ lệ, vật liệu"]:["Xác định không gian và phong cách","Chọn góc máy, thời gian và ánh sáng","Tạo các phương án concept","Đánh giá bố cục, tính khả thi và độ chân thực"];
return {recommendations,steps,reason:edit?"Ưu tiên công cụ hỗ trợ chỉnh sửa có ảnh gốc, bảo toàn bố cục và kiểm soát vùng thay đổi.":hasRefs?"Ưu tiên hệ thống hỗ trợ ảnh tham chiếu và độ nhất quán của sản phẩm.":"Ưu tiên khám phá concept, kiểm soát phong cách và độ chân thực."};
}

export function resolveImageAI(selection,context){
 const advice=adviseImageWorkflow(context);
 const suggested=advice.recommendations[0];
 const selected=selection==="auto"?suggested:selection;
 const platform=IMAGE_PLATFORMS.find(p=>p.id===selected)||IMAGE_PLATFORMS[0];
 return {platform,automatic:selection==="auto",suggested,canRender:platform.id==="openai"};
}
