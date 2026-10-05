// Danh mục chọn công cụ tham khảo, không phải kiểm kê đầy đủ hoặc xác nhận hỗ trợ API.
export const IMAGE_PLATFORMS=[
{id:"openai",name:"OpenAI Images",group:"Nền tảng mô hình",url:"https://platform.openai.com/docs/guides/image-generation",focus:"Tạo/chỉnh ảnh bằng prompt và ảnh tham chiếu",note:"Chỉ hỗ trợ kết xuất qua gateway OpenAI khi đã cấu hình."},
{id:"midjourney",name:"Midjourney",group:"Nền tảng tạo ảnh",url:"https://www.midjourney.com/",focus:"Concept, moodboard, thẩm mỹ",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"imagen",name:"Google Imagen",group:"Nền tảng mô hình",url:"https://cloud.google.com/vertex-ai/generative-ai/docs/image/overview",focus:"Tạo ảnh chân thực",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"gemini",name:"Gemini (tạo/chỉnh ảnh)",group:"Ứng dụng AI",url:"https://gemini.google.com/",focus:"Tạo và chỉnh ảnh trong trợ lý",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"firefly",name:"Adobe Firefly",group:"Ứng dụng AI",url:"https://firefly.adobe.com/",focus:"Thiết kế và hậu kỳ",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"flux",name:"FLUX (Black Forest Labs)",group:"Nền tảng mô hình",url:"https://bfl.ai/",focus:"Render và vật liệu",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"sd",name:"Stable Diffusion",group:"Mô hình mở / tự triển khai",url:"https://stability.ai/",focus:"Kiểm soát vùng, cấu trúc, workflow",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"ideogram",name:"Ideogram",group:"Nền tảng tạo ảnh",url:"https://ideogram.ai/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"recraft",name:"Recraft",group:"Thiết kế / vector",url:"https://www.recraft.ai/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"leonardo",name:"Leonardo AI",group:"Nền tảng tạo ảnh",url:"https://leonardo.ai/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"krea",name:"Krea AI",group:"Nền tảng tạo ảnh",url:"https://www.krea.ai/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"freepik",name:"Freepik AI",group:"Thiết kế / thư viện",url:"https://www.freepik.com/ai",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"canva",name:"Canva AI",group:"Thiết kế / thư viện",url:"https://www.canva.com/ai-image-generator/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"dreamina",name:"Dreamina",group:"Nền tảng tạo ảnh",url:"https://dreamina.capcut.com/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"seedream",name:"ByteDance Seedream",group:"Nền tảng mô hình",url:"https://www.volcengine.com/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"reve",name:"Reve Image",group:"Nền tảng tạo ảnh",url:"https://www.reve.com/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"imagineart",name:"ImagineArt",group:"Nền tảng tạo ảnh",url:"https://www.imagine.art/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"getimg",name:"getimg.ai",group:"Nền tảng tạo ảnh",url:"https://getimg.ai/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"nightcafe",name:"NightCafe",group:"Nền tảng tạo ảnh",url:"https://creator.nightcafe.studio/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"tensorart",name:"Tensor.Art",group:"Mô hình mở / tự triển khai",url:"https://tensor.art/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"civitai",name:"Civitai",group:"Mô hình mở / tự triển khai",url:"https://civitai.com/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"comfyui",name:"ComfyUI",group:"Mô hình mở / tự triển khai",url:"https://www.comfy.org/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"invoke",name:"InvokeAI",group:"Mô hình mở / tự triển khai",url:"https://invoke.ai/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"fooocus",name:"Fooocus",group:"Mô hình mở / tự triển khai",url:"https://github.com/lllyasviel/Fooocus",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"automatic1111",name:"AUTOMATIC1111 WebUI",group:"Mô hình mở / tự triển khai",url:"https://github.com/AUTOMATIC1111/stable-diffusion-webui",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"foo",name:"Microsoft Designer",group:"Thiết kế / thư viện",url:"https://designer.microsoft.com/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"bing",name:"Bing Image Creator",group:"Ứng dụng AI",url:"https://www.bing.com/images/create",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"clipdrop",name:"Clipdrop",group:"Chỉnh sửa / hậu kỳ",url:"https://clipdrop.co/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"photoroom",name:"Photoroom",group:"Chỉnh sửa / hậu kỳ",url:"https://www.photoroom.com/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"magnific",name:"Magnific AI",group:"Chỉnh sửa / hậu kỳ",url:"https://magnific.ai/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"topaz",name:"Topaz Labs",group:"Chỉnh sửa / hậu kỳ",url:"https://www.topazlabs.com/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"runway",name:"Runway (Image Tools)",group:"Chỉnh sửa / hậu kỳ",url:"https://runwayml.com/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"playground",name:"Playground AI",group:"Nền tảng tạo ảnh",url:"https://playground.com/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"seaart",name:"SeaArt AI",group:"Nền tảng tạo ảnh",url:"https://www.seaart.ai/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
{id:"openart",name:"OpenArt",group:"Nền tảng tạo ảnh",url:"https://openart.ai/",focus:"Tạo, chỉnh sửa hoặc xử lý ảnh theo khả năng từng sản phẩm",note:"Chưa tích hợp tạo ảnh trực tiếp; tính năng, chi phí và khả dụng tùy nền tảng."},
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
 const selected=selection==="auto"?"openai":selection;
 const platform=IMAGE_PLATFORMS.find(p=>p.id===selected)||IMAGE_PLATFORMS[0];
 return {platform,automatic:selection==="auto",suggested,canRender:platform.id==="openai"};
}
