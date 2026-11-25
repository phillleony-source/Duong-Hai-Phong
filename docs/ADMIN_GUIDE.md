# Hướng dẫn quản trị Beng Photography

Mở `/admin/login` và đăng nhập. Tài khoản **Admin** quản lý người dùng, cài đặt và yêu cầu liên hệ. Tài khoản **Editor** quản lý ảnh, trang chủ, dịch vụ, dự án và liên kết mạng xã hội.

| Công việc | Thao tác trong Payload |
|---|---|
| Đổi video Hero | Vào **Media → Create New**, tải MP4/WebM. Mở **Homepage → Hero**, đặt **Media Type** thành **Video** và chọn **Desktop Video** và **Mobile Video**. Chọn **Poster** và **Fallback**. Sau khi lưu, kiểm tra cả desktop và điện thoại. |
| Sửa chữ ở Hero | Trong **Hero**, chỉnh **Headline**, **Accent** và **Description**. Chỉnh nhãn và đích đến trong **Primary** và **Secondary**. |
| Sửa Giới thiệu | Mở **Homepage → About**. Sửa **Heading**, **Subtitle**, **Description** và **Biography**. Chọn ảnh chính, ảnh bổ sung hoặc video. |
| Tải ảnh | Mở **Media → Create New**. Chọn JPEG, PNG, WebP hoặc AVIF. Thêm **Alt** cho từng ngôn ngữ và chỉnh điểm lấy nét nếu ảnh cần cắt. Dùng ảnh đã xuất từ RAW. |
| Tạo danh mục dịch vụ | Mở **Portfolio → Service Categories → Create New**. Nhập tên, slug chữ thường và thứ tự. Bật **Visible**. |
| Tạo hoặc sửa dịch vụ | Mở **Portfolio → Services**. Chọn danh mục, thêm tiêu đề, tóm tắt, nội dung, ảnh bìa và album. Đổi **Sort Order** để điều chỉnh thứ tự. |
| Tạo Case Study | Mở **Portfolio → Case Studies → Create New**. Điền tiêu đề, slug, ảnh hoặc video bìa, danh mục, ngày chụp, credit và nội dung. Bật **Featured** để hiện trên trang chủ. |
| Chèn ảnh vào bài viết | Trong **Content**, chọn **Single Image**, **Full Width Image**, **Two Column Images** hoặc **Image Gallery** rồi chọn ảnh từ Media. Thêm chú thích khi cần. |
| Xem trước và xuất bản | Lưu bản nháp rồi chọn **Preview** khi đã đăng nhập. Chọn **Publish** và kiểm tra **Visible** để bài xuất hiện công khai. Dùng menu trạng thái để gỡ xuất bản. |
| Sửa mạng xã hội | Mở **Communication → Social Links**. Chọn Facebook, Instagram, TikTok hoặc Zalo, nhập nhãn và URL rồi bật **Visible**. Cụm nút nổi hiện sẵn bốn nền tảng. Nút có trạng thái **Chưa có liên kết** cho đến khi lưu một liên kết hiển thị. Các kênh khác trong Payload tiếp tục dùng **Sort Order**. |
| Sửa thông tin liên hệ | Admin mở **Homepage → Contact Settings**. Sửa email công khai, điện thoại, địa điểm và email nhận thông báo. **Form Visible** điều khiển biểu mẫu. Xem yêu cầu và trạng thái gửi tại **Communication → Contact Submissions**. |
| Quản lý SEO | Điền nhóm **SEO** ở **Settings → Site Settings** hoặc trong từng dịch vụ và bài viết. Chọn ảnh chia sẻ có nội dung phù hợp và alt text. |
| Chuyển Anh–Việt | Dùng bộ chọn locale trong Admin, lưu từng bản và kiểm tra cả hai ở `/en` và `/vi`. Dịch nội dung và nhãn nút. Slug dùng chung để giữ liên kết ổn định. |

## Khi thay nội dung demo

- Trong **Homepage → About**, dùng **Featured Statement**, **Editorial Body** và **Closing Statement** để chỉnh lời dẫn, các đoạn bài viết và câu kết từng ngôn ngữ. Trường mới để trống sẽ dùng nội dung mặc định thích hợp. **Description** và **Biography** cũ tiếp tục được giữ trong Payload.
- Trong **Settings → Site Settings**, chỉnh các trường **Work Eyebrow**, **Work Heading**, **Work Action** và các trường **Footer** cho từng ngôn ngữ. Trang danh mục hiển thị tất cả dự án đã công bố.
- Trong **Homepage → Contact Settings**, chỉnh **Eyebrow**, **Description** và **Submit Label** theo locale. **Communication → Contact Submissions** có ngày chụp dự kiến, ngân sách, trạng thái xử lý, ghi chú nội bộ và trạng thái gửi email.

Tên thương hiệu, thông tin liên hệ và nội dung demo đều có thể chỉnh trong CMS. Các ảnh mẫu được chọn từ thư mục ảnh do chủ dự án cung cấp. Xác nhận quyền công bố từng ảnh, thay các URL `example.com`, hoàn thiện bản tiếng Anh và tiếng Việt rồi tắt **Is Demo** trong **Site Settings**.

## Ảnh đang được sử dụng

Để giữ nguyên tài nguyên của bài đã xuất bản và lịch sử bản nháp, CMS hiện khóa thao tác xóa ảnh và video. Có thể tải lên phiên bản mới rồi đổi mục liên kết trong các trang và bài viết. Để xóa danh mục, trước hết chuyển các mục liên quan sang danh mục khác và xử lý các bản lưu còn tham chiếu.
