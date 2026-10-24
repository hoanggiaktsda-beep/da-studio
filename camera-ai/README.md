# HOANGGIA CAMERA & LENS AI · V1.1
Bản độc lập để dùng chung trong HOANGGIA AI, không làm thay đổi giao diện Design AI hiện có.

## Sử dụng
- Trang riêng: https://hoanggiaktsda-beep.github.io/da-studio/camera-ai/
- Module logic hiện hành: ../camera-ai.mjs
- Chọn kiểu ảnh, hãng, thân máy, lens, khẩu độ và chế độ lấy nét.
- Sao chép prompt hoặc xuất cấu hình JSON.

## Tích hợp ứng dụng khác
Có thể nhúng qua iframe HTTPS cùng origin:
```html
<iframe src="/da-studio/camera-ai/" title="CAMERA AI" style="width:100%;min-height:840px;border:0"></iframe>
```
Nếu ứng dụng ở origin khác, cần host trang và module trên cùng origin của ứng dụng, hoặc tạo giao tiếp message với danh sách origin tin cậy; **không** mở rộng postMessage sang '*' cho dữ liệu cấu hình.

Hoặc tích hợp DOM trực tiếp: sao chép khối #hgCameraAI và CSS #hg-camera-ai-style từ ../index.html; tải ../camera-ai.mjs như module. API trong trang: window.hgCameraAI.getSnapshot(), restore(config), reset(), getPrompt("vi"|"en").

## An toàn
Không chứa API key, không gửi ảnh hoặc cấu hình lên máy chủ; chức năng xuất JSON chạy trong trình duyệt. Module mô phỏng thiết lập quang học, không điều khiển thiết bị thật.

## Phạm vi V1.1
Thư viện mẫu hiện tại chưa phải danh mục hoàn chỉnh mọi ống kính/hệ máy. Các lựa chọn adapter và khẩu độ cần đối chiếu kỹ thuật khi dùng ngoài mô phỏng.
