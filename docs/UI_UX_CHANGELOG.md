# Thay đổi giao diện BENG. V2

| Phần | Trước V2 | Thay đổi và responsive | Payload và giới hạn | Tệp chính |
|---|---|---|---|---|
| Hero và Header | Chữ, nhãn và vùng bấm trên mobile hơi sát. | Cân chỉnh cỡ chữ, khoảng dòng, vùng bấm và chuyển nền header. Giữ ảnh toàn màn và CTA. | Media, chữ, lớp phủ và CTA dùng dữ liệu cũ. Hero hiện dùng ảnh khi chưa chọn video. | `src/styles/site.css`, `src/components/site.tsx` |
| About | Tiểu sử ngắn, bố cục 50/50. | Bố cục 45/55, ảnh trước trên mobile, lời dẫn nghiêng, bốn đoạn và câu kết. | Ba trường localized mới. Dữ liệu V1 và ảnh có sẵn được giữ lại. Copy V2 làm mặc định cho trường trống và bản demo cũ đã biết. | `src/lib/editorial-copy.ts`, `src/lib/content.ts`, `src/cms/schema.ts`, `src/components/site.tsx` |
| Dịch vụ | Carousel dùng kích thước chữ và caption cũ. | Chuẩn hóa dòng phân cách, nhịp ảnh/chữ. Mobile giữ phần xem trước của thẻ kế tiếp. | Giữ Embla, tài liệu dịch vụ, URL và ổn định điều hướng bàn phím. | `src/styles/site.css`, `src/components/site.tsx` |
| Case Studies | Khoảng trống do các cột lệch nhau, CTA chưa có trang đích. | Hai cột cân nhau từ tablet, ảnh ngang theo số lượng lẻ, một cột ở mobile. Có danh mục, trạng thái rỗng và nhịp bài chi tiết mới. | Giữ dữ liệu bài, chín khối, trạng thái xuất bản và URL cũ. Dùng điểm lấy nét của Media khi có. | `src/components/site.tsx`, `src/components/detail.tsx`, `src/components/media.tsx`, `src/app/(frontend)/[locale]/case-studies/page.tsx` |
| Contact | Demo ẩn form. CMS thiếu ngày chụp và ngân sách. | Panel Ivory trên Espresso, trường bắt buộc có trạng thái lỗi và focus, bố cục xếp dọc trên mobile nhỏ. | PostgreSQL lưu ngày, ngân sách và trạng thái, Admin có ghi chú nội bộ. Ngân sách dùng các khoảng VND. Khi chưa bật email, xác nhận lưu và hiển thị trạng thái email riêng. | `src/components/interactive.tsx`, `src/app/(payload)/api/contact/route.ts`, `src/cms/schema.ts`, `src/lib/contact.ts` |
| Social Dock | SiteFrame gắn dock từ từng trang, mobile chưa có bấm ngoài. | Một dock trên layout công khai. Desktop có tooltip khi hover/focus, mobile có nhãn, bấm ngoài và Escape để đóng. | Chỉ dùng liên kết an toàn. Nếu CMS chưa có kênh thật, nút dẫn về phần liên hệ khi phần đó hiện hữu. | `src/app/(frontend)/[locale]/layout.tsx`, `src/components/site.tsx`, `src/components/interactive.tsx` |
| Footer | Ba nhóm liên kết nhỏ thiếu CTA. | CTA lớn, nhận diện, Khám phá, Kết nối và thanh cuối. CTA xếp trên các cột khi hẹp. | Copy V2 chỉnh trong Site Settings. Đích lấy từ phần Liên hệ hoặc email hợp lệ, địa chỉ minh họa V1 được bỏ khỏi giao diện công khai. | `src/cms/schema.ts`, `src/components/site.tsx`, `src/styles/site.css` |

## Xác minh theo thành phần

- **Hero và Header** · Kiểm tra video lỗi, ảnh dự phòng, menu, locale và kích thước màn hình.
- **About** · Kiểm tra bốn đoạn mặc định và chỉnh lời dẫn trong Payload theo từng locale.
- **Dịch vụ** · Kiểm tra Embla và khoảng cách giữa nút điều hướng với dock.
- **Case Studies** · Kiểm tra layout ba thẻ, danh mục, chuyển locale, bài chi tiết và chín loại khối.
- **Contact** · Kiểm tra lỗi trường, lưu ngày/ngân sách, quyền Admin và hạn mức mặc định. Resend thật chưa được cấu hình.
- **Social Dock** · Kiểm tra trang chủ, cả hai loại trang chi tiết, bấm ngoài và Escape. Bản demo dùng đích Contact cho tới khi có kênh thật.
- **Footer** · Kiểm tra CTA, câu giới thiệu đã duyệt, bố cục mobile và việc loại bỏ email minh họa.

Chi tiết lượt chạy và ảnh chụp có trong [TEST_RESULTS.md](TEST_RESULTS.md).

## Dự án chọn lọc · 23/11/2026

Trang chủ chuyển từ lưới đứng sang một hàng carousel. Kéo ngang hoặc dùng nút Trước/Sau để xem tối đa sáu dự án. Nút **Khám phá tất cả dự án** mở danh mục, nơi mỗi trang giữ lưới tối đa 12 thẻ. Cờ **Featured** và thứ tự dự án vẫn lấy từ Payload.
