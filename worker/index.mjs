/* Optional image gateway for Cloudflare Workers Free.
   NEVER put OPENAI_API_KEY or STUDIO_ACCESS_TOKEN in GitHub Pages source. */
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8",...headers}});
const bad=(message,status,headers)=>json({error:message},status,headers);
export async function handleRequest(request,env,fetcher=fetch){
 const origin=request.headers.get("Origin")||"";
 const allowed=(env.ALLOWED_ORIGIN||"").split(",").map(s=>s.trim()).filter(Boolean);
 const cors={Vary:"Origin"};
 if(origin&&allowed.includes(origin))Object.assign(cors,{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"Content-Type, X-Studio-Token","Access-Control-Allow-Methods":"POST, OPTIONS"});
 if(request.method==="OPTIONS")return allowed.includes(origin)?new Response(null,{status:204,headers:cors}):bad("Origin not allowed",403,cors);
 if(new URL(request.url).pathname!=="/render")return bad("Not found",404,cors);
 if(request.method!=="POST")return bad("Method not allowed",405,cors);
 if(!origin||!allowed.includes(origin))return bad("Origin not allowed",403,cors);
 if(!env.OPENAI_API_KEY||!env.STUDIO_ACCESS_TOKEN)return bad("Gateway is not configured",503,cors);
 if(request.headers.get("X-Studio-Token")!==env.STUDIO_ACCESS_TOKEN)return bad("Unauthorized",401,cors);
 const size=Number(request.headers.get("Content-Length")||0);
 if(size>24_000_000)return bad("Payload too large",413,cors);
 let data;try{const raw=await request.text();if(raw.length>24_000_000)return bad("Payload too large",413,cors);data=JSON.parse(raw)}catch{return bad("Invalid JSON",400,cors)}
 const {prompt,images=[],model="gpt-image-2",quality="medium",size:outputSize="1536x1024"}=data||{};
 if(typeof prompt!=="string"||!prompt.trim()||prompt.length>32000)return bad("Invalid prompt",400,cors);
 if(!Array.isArray(images)||images.length>16)return bad("Maximum 16 references",400,cors);
 if(!["1024x1024","1024x1536","1536x1024"].includes(outputSize))return bad("Unsupported image size",400,cors);
 if(!["low","medium","high"].includes(quality))return bad("Unsupported image quality",400,cors);
 if(model!=="gpt-image-2")return bad("Model not allowed",400,cors);
 for(const r of images){if(typeof r.image_url!=="string"||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(r.image_url)||r.image_url.length>6_800_000)return bad("Invalid or oversized input image",400,cors)}
 const estimatedBodySize=JSON.stringify(data).length;
 if(estimatedBodySize>23_000_000)return bad("Payload too large",413,cors);
 const hasImages=images.length>0;
 const endpoint=hasImages?"https://api.openai.com/v1/images/edits":"https://api.openai.com/v1/images/generations";
 const requestBody=hasImages?{model,prompt,images:images.map(r=>({image_url:r.image_url})),quality,size:outputSize,output_format:"png"}:{model,prompt,quality,size:outputSize,output_format:"png",n:1};
 let result;try{result=await fetcher(endpoint,{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify(requestBody)})}catch{return bad("Image service unreachable",502,cors)}
 let answer;try{answer=await result.json()}catch{return bad("Invalid image service response",502,cors)}
 if(!result.ok){const reason=typeof answer?.error?.message==="string"?answer.error.message.slice(0,350):"Image service failed";return bad(reason,result.status>=400&&result.status<600?result.status:502,cors)}
 const base64=answer?.data?.[0]?.b64_json;
 if(!base64||typeof base64!=="string")return bad("Image service returned no image",502,cors);
 return json({image:base64,mime:"image/png"},200,cors);
}
export default {fetch(request,env){return handleRequest(request,env)}};
