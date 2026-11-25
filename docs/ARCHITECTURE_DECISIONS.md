# Quyết định kiến trúc

## ADR-01 · 2026-11-23 · Ứng dụng và CMS

Brief yêu cầu SSR, giao diện công khai và Admin trong cùng ứng dụng. Dùng Next.js App Router và Payload Admin có sẵn. Route groups tách layout công khai, layout Admin và chuyển hướng ở root. Phương án tách hai ứng dụng đòi hỏi thêm API và đồng bộ xác thực. Trang công khai đọc bằng Local API với `overrideAccess: false` để dùng chung quy tắc truy cập với REST và hiển thị nội dung mới khi tải trang.

Các gói Payload dùng cùng bản 3.94.1 với Next.js 16.4.6. Node.js 24.15.0 của máy chưa đáp ứng yêu cầu, nên môi trường kiểm thử dùng Node.js 24.22.3 cài cục bộ. [Payload installation](https://payloadcms.com/docs/getting-started/installation)

## ADR-02 · 2026-11-23 · PostgreSQL và migration

Dùng adapter PostgreSQL chính thức của Payload. Lưu migration trong mã nguồn và tắt schema push để quy trình release có thể xem trước thay đổi SQL. Gói PostgreSQL Windows cục bộ dùng cho QA vì Docker Engine chưa chạy. Compose và Dockerfile phục vụ thiết lập thông thường. 

## ADR-03 · 2026-11-23 · Ảnh và video

Payload lưu tệp vào thư mục cục bộ khi phát triển, hoặc bucket S3-compatible khi cung cấp cấu hình. Sharp tạo biến thể WebP có chiều rộng 640, 1120 và 1920 pixel dựa trên độ phân giải gốc. Bản demo dùng ảnh từ ba nhóm tệp chủ dự án cung cấp. Các tệp gốc nằm riêng và bản WebP được dùng để seed.

Hero chọn ảnh hoặc video riêng theo viewport. Ảnh nền được hiển thị trước, tiếp tục hiện khi video lỗi và phục vụ người dùng bật giảm chuyển động. Với video production, chọn file đã chuyển mã trong Media hoặc điền URL HTTPS của file MP4/WebM từ nhà cung cấp. Dùng quy trình chuyển mã của nhà cung cấp để xuất Media renditions. Xóa media bị khóa trong Admin để lưu ảnh đang được tham chiếu trong cả bài và bản nháp.

## ADR-04 · 2026-11-23 · Xác thực và liên hệ

Dùng hai vai trò Payload là Admin và Editor. Khởi tạo Admin đầu tiên qua CLI và khóa PostgreSQL để tránh hai lần khởi tạo đồng thời. Preview bản nháp dùng phiên đăng nhập Payload.

POST liên hệ kiểm tra origin, kích thước dữ liệu, Zod, honeypot và số lượt theo cửa sổ 10 phút trong PostgreSQL. Proxy có thể cung cấp header IP tin cậy để áp dụng giới hạn theo địa chỉ đã băm. Lưu yêu cầu trước khi gọi Resend để quản trị viên vẫn nhận được nội dung khi nhà cung cấp gặp lỗi. Chỉ Admin có quyền đọc danh sách yêu cầu và email nhận thông báo.

## ADR-05 · 2026-11-23 · Bản địa hóa và SEO

Dùng locale của Payload ở các trường nội dung và route `/[locale]` cho giao diện. Slug dùng chung để đổi ngôn ngữ ngay trên trang chi tiết. Root mặc định chuyển đến `/en` và dùng lựa chọn ngôn ngữ đã lưu khi có. Font Playfair Display cùng Be Vietnam Pro được phục vụ từ WOFF2 tích hợp trong ứng dụng. Cờ **Is Demo** hiện thông báo demo và ngăn lập chỉ mục khi dữ liệu mẫu còn được sử dụng.

## ADR-06 · 2026-11-23 · Motion và carousel

Dùng Motion cho chuyển động khi cuộn và Embla cho carousel. Dùng CSS cho hiệu ứng nhẹ trên Hero và khi hover. Tôn trọng `prefers-reduced-motion`. Chưa có cảnh nào cần timeline GSAP hoặc WebGL qua Three.js/React Three Fiber.

## ADR-07 · 2026-11-23 · Triển khai

Dùng Node.js lâu dài hoặc container với PostgreSQL và bucket riêng. Triển khai tĩnh sẽ mất Admin, SSR và POST liên hệ. Chuẩn bị Dockerfile, Compose và hướng dẫn biến môi trường. Lần thực hiện này chạy local vì brief yêu cầu thiết lập, kiểm thử và chuẩn bị phát hành.

## ADR-08 · 2026-11-23 · Phiên bản có bản vá

Ghim Sharp 0.35.5. Dùng overrides theo phạm vi cho DOMPurify trong Monaco Editor và Happy DOM trong Lexical headless để lấy bản vá trong khi giữ các gói Payload cùng phiên bản. [Sharp advisory](https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w) [DOMPurify advisory](https://github.com/cure53/DOMPurify/security/advisories/GHSA-cg2g-xh64-v4q7) [Happy DOM advisory](https://github.com/capricorn86/happy-dom/security/advisories/GHSA-834v-8h66-3h79)

## ADR-09 · 2026-11-23 · Bản biên tập V2 và dữ liệu cũ

Migration V2 chỉ thêm trường localized, cột và enum. Giao diện ưu tiên nội dung đã chỉnh trong Payload. Văn bản V2 tập trung ở bộ nội dung mặc định, dùng cho trường còn trống hoặc giá trị demo V1 đã biết. V1 vẫn nằm trong database. Các database demo tạo mới lưu văn bản V2 bằng seed sẵn có.

Danh mục dự án dùng `/[locale]/case-studies`, giữ các URL theo slug và thêm danh mục vào sitemap. Dock chỉ gắn một lần trong layout theo locale. Endpoint liên hệ tiếp tục lưu trước khi gửi email, trả riêng kết quả thông báo, và giữ các trường ghi chú và trạng thái bên trong quyền Admin.

## ADR-10 · 2026-11-23 · Carousel và phân trang dự án

Trang chủ dùng Embla và truy vấn tối đa sáu dự án được đánh dấu nổi bật, theo thứ tự CMS. Khi chưa đánh dấu dự án nào, hiển thị tối đa sáu dự án đã xuất bản. Danh mục dùng phân trang phía Payload, 12 mục một trang, với `?page=` từ trang hai. Đổi ngôn ngữ giữ số trang. Truy vấn lưới và carousel chỉ lấy trường cần để dựng thẻ, còn trang chi tiết vẫn đọc bài đầy đủ. Không cần đổi schema.

## ADR-11 · 2026-11-23 · Đích liên kết mạng xã hội

Cụm nổi dành sẵn vị trí cho Facebook, Instagram, TikTok và Zalo. Mỗi vị trí trở thành liên kết khi bản ghi công khai trong Payload có URL hợp lệ. Nút chờ có trạng thái vô hiệu và nhãn theo ngôn ngữ hiện tại. Mở rộng hai enum để lưu TikTok, giữ cấu trúc và dữ liệu liên kết hiện có.
