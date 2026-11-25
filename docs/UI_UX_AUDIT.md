# Kiểm tra giao diện BENG. trước V2

Kiểm tra localhost trước khi sửa bằng Chrome ở 1440 × 900 và 390 × 844, kết hợp đọc layout, CSS, Payload schema và endpoint liên hệ.

| Phần | Quan sát trước thay đổi | Hướng xử lý |
|---|---|---|
| Header và Hero | Ảnh toàn màn, ngôn ngữ và CTA hoạt động. Chữ Hero sát dòng ở mobile, nhãn điều hướng và chỉ dẫn cuộn khá nhỏ. | Giữ ảnh, CTA và dự phòng. Điều chỉnh lớp phủ, cỡ chữ, khoảng cách và vùng bấm. |
| About | Chỉ có một đoạn giới thiệu ngắn trong bố cục 50/50. | Dành 55% cho chữ, thêm lời dẫn, bài viết và câu kết. Tận dụng ảnh hiện có. |
| Dịch vụ | Embla đang hoạt động, CSS ảnh và khoảng cách caption dùng chung với dự án. | Giữ Embla, chuẩn hóa ảnh/caption và nhịp giữa các section. |
| Case Studies | Cột lệch nhau bằng margin, ảnh cuối bị thu nhỏ và tạo khoảng trống. CTA xem tất cả chưa có đích. | Lưới hai cột, ảnh ngang phủ hai cột theo số lượng, tạo trang danh mục và giữ URL bài viết. |
| Trang chi tiết | Các khối editorial, credit và liên kết trước/sau đã có. Chiều rộng bài và bố cục ảnh còn thiếu nhất quán. | Điều chỉnh tiêu đề, ảnh, caption và điều hướng qua CSS. |
| Liên hệ | Localhost chạy chế độ demo nên ẩn form. Form CMS thiếu ngày chụp và ngân sách, cùng màu với phần nền. | Panel sáng, xác thực song ngữ, lưu hai trường mới ở PostgreSQL và phân biệt trạng thái email. |
| Social Dock | Có trên trang chủ và chi tiết nhờ SiteFrame. Mobile đóng bằng Escape nhưng chưa đóng khi bấm ngoài. | Chuyển lên layout theo locale, lọc URL và xử lý điều hướng bàn phím. |
| Footer | Chủ yếu là ba cột liên kết và email demo. Chưa có lời mời bắt đầu dự án. | Thêm CTA, nhận diện, cột khám phá/kết nối và thanh cuối. |

Migration chỉ thêm cột và enum. Các URL cũ, bản ghi, JSON nội dung và thư mục ảnh được giữ nguyên. Nội dung biên tập V2 là giá trị mặc định khi trường chưa có dữ liệu, có thể chỉnh trong Payload.
