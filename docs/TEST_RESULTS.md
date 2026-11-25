# Kết quả kiểm thử

## 23/11/2026 · Môi trường và cơ sở dữ liệu

| Phạm vi | Lệnh | Kết quả |
|---|---|---|
| Runtime | `node -v` và `npm -v` | Máy có Node 24.15.0 và npm 11.12.1. Dùng Node 24.22.3 cài cục bộ cho QA. |
| PostgreSQL | `docker info` | Docker CLI có sẵn nhưng Engine chưa chạy. Dùng PostgreSQL Windows 18.7 cục bộ ở cổng 55432. |
| Schema và CMS | `payload generate:types`, `payload generate:importmap`, `payload migrate` | Tạo type/import map và áp dụng hai migration thành công. Chạy lại trên database trống sau khi cập nhật phụ thuộc. |
| Nội dung minh họa | `SEED_DEMO=true npm run seed` | Seed thành công trên database mới. Driver pg ghi cảnh báo deprecation khi seed. |
| Admin đầu tiên | `npm run admin:init` | Tạo tài khoản thử nghiệm, sau đó xác minh đăng nhập hợp lệ và mật khẩu sai bằng Playwright. |

## 23/11/2026 · Kiểm tra mã và build

| Phạm vi | Lệnh | Kết quả |
|---|---|---|
| TypeScript | `next typegen` và `tsc --noEmit` | Đạt với strict mode. |
| ESLint | `eslint .` | Đạt. |
| Vitest | `vitest run` | 12/12. Kiểm tra locale, URL an toàn, video embed, bộ lọc biểu mẫu và giới hạn kích thước request. |
| Next.js dev | `next dev` và `GET /en` | Server khởi động và trả 200 với PostgreSQL cục bộ. |
| Next.js production | `next build` và `next start` | Build thành công và server production khởi động với biến môi trường QA. Build không cần kết nối database. |
| Audit production | `npm audit --omit=dev --audit-level=critical` | Lần đầu có 11 cảnh báo. Sau khi cập nhật Sharp, DOMPurify và Happy DOM, còn 5 mục trung bình theo chuỗi Drizzle Kit/esbuild, 0 cao, 0 nghiêm trọng. |

## 23/11/2026 · Playwright Chromium

`playwright test --reporter=line` trên server chạy bằng `next start`, kết nối PostgreSQL cục bộ. **8/8 đạt.**

1. Trang chủ Anh–Việt, đổi ngôn ngữ và lưu lựa chọn, kiểm tra tràn ngang ở 320/375/390/768/1024/1440/1920 px, menu và dock bằng bàn phím, ảnh Hero, font và carousel.
2. Chi tiết dịch vụ, bài editorial, đổi locale và lỗi 404.
3. Đăng nhập Admin, từ chối mật khẩu sai, từ chối tạo người dùng hoặc đọc yêu cầu liên hệ khi chưa đăng nhập.
4. Quyền Editor, tải ảnh, tạo/sửa/xóa dịch vụ, khóa xóa danh mục đang được dùng, preview, xuất bản và render chín khối, CRUD liên kết xã hội.
5. Gửi yêu cầu qua biểu mẫu, lưu PostgreSQL, từ chối dữ liệu sai và origin khác.
6. Tải WebM QA vào Media, cấu hình Hero, ngắt request video và xác nhận ảnh dự phòng còn hiển thị.
7. Kiểm tra sitemap và robots khi tắt cờ demo, gồm URL ở hai locale và loại trừ Admin/Preview.
8. Gửi sáu yêu cầu đồng thời từ một địa chỉ QA tin cậy. Năm yêu cầu trả 201 và yêu cầu còn lại trả 429.

Các lượt đầu phát hiện bộ chọn test đổi tên khi menu mở, nhãn email trùng với liên kết và endpoint cập nhật Globals của Payload dùng POST. Một lượt dev đo viewport trong lúc CSS/resize chưa ổn định. Đã cập nhật locator, phương thức HTTP và chờ layout ổn định, rồi chạy lại trên production build.

## 23/11/2026 · Kiểm tra hiển thị và hiệu năng cục bộ

Đo một lần mỗi viewport bằng Chrome headless trên production server cục bộ, dùng nội dung demo và giảm chuyển động. Không mô phỏng mạng hoặc CPU.

| Trang | Viewport | LCP | Layout shift khi tải | Ảnh Hero đã truyền |
|---|---:|---:|---:|---:|
| `/en` | 1440 × 900 | 416 ms | 0,00101 | 79.850 byte |
| `/vi` | 390 × 844 | 292 ms | 0,00050 | 48.606 byte |

Đã xem ảnh chụp desktop và mobile để kiểm tra độ đọc, cắt ảnh và dấu tiếng Việt. Chưa đo Lighthouse, dữ liệu người dùng thực, lưu trữ S3, Docker image hoặc gửi email qua Resend.

## 23/11/2026 lúc 13:18 UTC+7 · Kiểm tra V2

| Phạm vi | Lệnh hoặc phương pháp | Kết quả |
|---|---|---|
| Schema | `payload generate:types`, `payload migrate:create editorial_v2`, `payload migrate` | Đạt. Migration chỉ thêm trường và enum. Áp dụng vào database local hiện có và database kiểm thử riêng. |
| Kiểm tra mã | `next typegen`, `tsc --noEmit`, `eslint .`, `next build` | Đạt trên Node.js 24.22.3. |
| Vitest | `vitest run` | 13/13. Thêm trường hợp ngày nhuận, ngày không hợp lệ và ngân sách ngoài danh sách. |
| Playwright Chromium | `playwright test --reporter=line` qua `next start` | 9 đạt, 1 bỏ qua. Ca bỏ qua yêu cầu proxy gửi header IP tin cậy. |
| Rate limit mặc định | POST song song trên bản build V2 với database riêng | 30 request vào bước kiểm tra sau hạn mức, request thứ 31 trong nhóm bị chặn theo quota với 429 và `Retry-After: 600`. Test dùng ID dịch vụ không tồn tại để tránh lưu lời nhắn mẫu. |
| URL cục bộ | HTTP GET | `/vi`, `/en`, `/vi/case-studies` và `/admin/login` trả 200. |

Playwright đã thử tiếng Việt và tiếng Anh tại 320, 375, 390, 768, 1024, 1440 và 1920 px. Bộ test kiểm tra nút carousel trên mobile nằm ngoài vùng của dock, dock có trên trang chủ và trang chi tiết, lưới ba dự án, chuyển locale trong danh mục, CTA Footer, About cập nhật theo locale qua Payload và cả chín khối bài viết. Form đã lưu ngày, ngân sách và trạng thái mới trong PostgreSQL, đồng thời xác nhận rõ khi dịch vụ email chưa cấu hình. Quyền xem lời nhắn vẫn giới hạn ở Admin.

Chrome ghi 16 ảnh gồm Hero, About, dịch vụ, dự án, Contact, footer và hai loại trang chi tiết. Đã sửa bố cục khi rà ảnh, gồm điểm cắt ảnh ngang, khoảng cách để dock tránh nút carousel và ẩn skip link cho tới khi được focus. [Ảnh lưới desktop](../.tooling/v2-en-projects.png) · [Ảnh form mobile](../.tooling/v2-vi-contact.png)

## 23/11/2026 · Carousel và danh mục dự án

- TypeScript, ESLint và production build đạt. Vitest 13/13. Playwright 9 đạt, 1 bỏ qua do bài proxy yêu cầu IP header tin cậy.
- Chromium với database kiểm thử chứa 50 dự án đã xuất bản xác nhận trang chủ chỉ dựng sáu thẻ. Danh mục tải lần lượt 12, 12, 12, 12 và 2 dự án. Có đủ 50 URL riêng biệt, đổi ngôn ngữ giữ trang năm, trang sáu trả 404.

## 23/11/2026 lúc 13:48 UTC+7 · Cụm nút mạng xã hội

- Áp dụng migration thêm TikTok cho nền tảng và biểu tượng trên PostgreSQL cục bộ. ESLint và production build đạt. Vitest 13/13.
- Playwright 9 đạt, 1 bỏ qua do môi trường local thiếu header IP từ proxy. Đã kiểm tra bốn nút chờ ở menu mobile, lưu TikTok trong Payload và thấy liên kết thật xuất hiện trên web. Trang tiếng Việt trả HTTP 200 với đủ bốn nút chờ.

## 24/11/2026 · Khởi chạy dự án (PostgreSQL + Next.js Dev)

| Dịch vụ | Địa chỉ / Lệnh | Trạng thái |
|---|---|---|
| PostgreSQL | `127.0.0.1:55432` | Đã khởi động với dữ liệu `.tooling/pgdata` (khớp với `.env.local`). |
| Next.js Dev | `http://localhost:3000` | Sẵn sàng (Turbopack, Next.js 16.4.6). |
| Route `/vi` | `curl.exe -I http://127.0.0.1:3000/vi` | HTTP/1.1 200 OK. |
| Route `/en` | `curl.exe -I http://127.0.0.1:3000/en` | HTTP/1.1 200 OK. |
| Route `/admin` | `curl.exe -I http://127.0.0.1:3000/admin` | HTTP/1.1 200 OK. |

## 24/11/2026 · Kiểm tra Dòng thông báo Marquee (Announcement Bar)

| Phạm vi | Phương pháp / Lệnh | Kết quả |
|---|---|---|
| Migration | `payload migrate:create add_announcement` và `payload migrate` | Tạo migration `20261124_044421_add_announcement` và áp dụng thành công (49ms). |
| Types | `next typegen && tsc --noEmit` | Strict mode đạt 100%. |
| Lint | `eslint .` | Đạt (0 errors, 0 warnings). |
| Vitest | `vitest run` | 13/13 passed. |
| Hiển thị Desktop (1440×900) | Playwright Chromium headless | [announcement-marquee.png](../.tooling/announcement-marquee.png) hiển thị dải marquee trên cùng, badge "THÔNG BÁO", các dấu phân cách `✦`, nền `--dark`, chữ `--ivory`. |
| Hiển thị Mobile (390×844) | Playwright Chromium headless | [announcement-marquee-mobile.png](../.tooling/announcement-marquee-mobile.png) vừa vặn, không tràn lề, menu mở không bị đè. |
| Admin CMS | `curl.exe -I http://127.0.0.1:3000/admin/globals/announcement` | HTTP/1.1 200 OK. |

## 24/11/2026 · Kiểm tra Quy trình làm việc (Process Section)

| Phạm vi | Phương pháp / Lệnh | Kết quả |
|---|---|---|
| Migration | `payload migrate:create add_process` và `payload migrate` | Tạo migration `20261124_045452_add_process` và áp dụng thành công (113ms). |
| Types | `next typegen && tsc --noEmit` | Strict mode đạt 100%. |
| Lint | `eslint .` | Đạt (0 errors, 0 warnings). |
| Vitest | `vitest run` | 13/13 passed. |
| Hiển thị Desktop (1440×900) | Playwright Chromium headless | [process-desktop-vi.png](../.tooling/process-desktop-vi.png) hiển thị chuẩn tiêu đề "Quy trình làm việc", timeline 5 bước kết nối ngang, các card bo góc với số bước, phụ đề và mô tả tiếng Việt; kéo ngang tự do mượt mà. |
| Hiển thị Mobile (390×844) | Playwright Chromium headless | [process-mobile-vi.png](../.tooling/process-mobile-vi.png) hiển thị hàng nút số `01`-`05`, card vừa tầm mắt và card tiếp theo hé lộ ở bên phải mời gọi vuốt chạm. |
| Admin CMS | `curl.exe -I http://127.0.0.1:3000/admin/globals/process` | HTTP/1.1 200 OK. |

## 24/11/2026 · Kiểm tra Cuộn dọc chuyển thành cuộn ngang cho Quy trình (Wheel-to-Horizontal Scroll)

| Phạm vi | Phương pháp / Lệnh | Kết quả |
|---|---|---|
| Types | `next typegen && tsc --noEmit` | Strict mode đạt 100% (0 lỗi). |
| Lint | `eslint .` | Đạt 100% (0 lỗi, 0 cảnh báo). |
| Vitest | `vitest run` | 13/13 passed. |
| Cuộn chuột dọc trên Desktop (1440×900) | Playwright `page.mouse.wheel(0, 500)` và `wheel(0, 700)` | Khi người dùng lăn chuột xuống, section `#process` ghim chặt trong khung nhìn (`260vh` track) và tịnh tiến mượt mà: ban đầu `translateX(0px)` (bước 01), sau khi lăn chuột 500px dịch chuyển thành `translateX(-220px)` (bước 02 kích hoạt), sau 1200px đạt `translateX(-623px)` (bước 04 kích hoạt). |
| Click chuyển bước trên Timeline | Playwright `page.locator('.process-node').nth(4).click()` | Trang cuộn êm đến cuối rãnh, `translateX(-829px)`, bước 05 kích hoạt sáng viền và số `05` nổi bật. |
| Chụp ảnh xác thực | Playwright screenshots | Đã lưu ảnh chụp 4 giai đoạn cuộn: `process-scroll-step1.png`, `process-scroll-step2.png`, `process-scroll-step3.png`, `process-scroll-step5.png`. |
| Hiển thị Mobile (<= 820px) | CSS Media Query | Tự động bỏ ghim `260vh`, chiều cao trở về `auto`, hàng thẻ hỗ trợ vuốt chạm bằng tay với `scroll-snap-type: x mandatory`. |

## 24/11/2026 · Kiểm tra Khắc phục khoảng trống dài ở Quy trình & Tối ưu cuộn chuột

| Phạm vi | Phương pháp / Lệnh | Kết quả |
|---|---|---|
| Chiều cao Section | Đo `offsetHeight` qua Playwright | Giảm từ 2340px xuống còn 821px (vừa khít nội dung 5 thẻ + timeline + tiêu đề). |
| Khoảng cách `#process` và `#work` | Đo khoảng cách tọa độ `boundingBox` | `Gap: 0px`. Hoàn toàn loại bỏ khoảng trống đen dài giữa 2 section. |
| Lăn chuột ngang trực tiếp | Playwright `carousel.hover()` + `mouse.wheel(0, 300)` | Bắt sự kiện wheel dọc chuyển thành cuộn ngang: `scrollLeft` chuyển tức thì từ `0` sang `300px`. |
| Cuộn thoát rãnh tự nhiên | Playwright `wheel` tại biên `scrollLeft >= maxScroll` | Cho phép sự kiện lăn chuột dọc tiếp tục cuộn trang xuống phần Dự án (`#work`). |
| Types / Lint / Test | `npm run typecheck && npm run lint && npm test` | Typecheck strict đạt 100%, ESLint 0 lỗi 0 cảnh báo, Vitest 13/13 passed. |

## 24/11/2026 · Kiểm tra Contact Form & Footer mới, chuyển đổi thương hiệu Dương Hải Phong (DHP)

| Phạm vi | Phương pháp / Lệnh | Kết quả |
|---|---|---|
| Types | `next typegen && tsc --noEmit` | Đạt 100% (0 lỗi). |
| Lint | `eslint .` | Đạt 100% (0 lỗi, 0 cảnh báo). |
| Vitest | `vitest run` | 13/13 passed. |
| Kiểm tra chuỗi thương hiệu | Playwright quét Regex `/Beng/gi` trên cả `/vi` và `/en` | `vi: 0 matches`, `en: 0 matches`. Toàn bộ đã chuyển sang "Dương Hải Phong" / "DHP". |
| Gửi biểu mẫu Contact Form | Playwright điền form và submit | Gửi thành công, UI hiển thị "Yêu cầu của bạn đã được ghi nhận." |
| Cơ sở dữ liệu PostgreSQL | Truy vấn `SELECT * FROM contact_submissions` | Ghi nhận bản ghi mới với đầy đủ `name`, `phone`, `email`, `facebook_url`, `consent: true`, `message`. |
| Hiển thị Contact Desktop (1440×1000) | Playwright Chromium | [contact-section-new.png](../.tooling/contact-section-new.png) hiển thị chính xác theo ảnh mẫu 1 (cột trái thông tin + Google Maps studio card, cột phải card Đăng ký tư vấn 2 cột + checkbox + nút gửi pill). |
| Hiển thị Footer Desktop (1440×1000) | Playwright Chromium | [footer-new.png](../.tooling/footer-new.png) hiển thị panel bo tròn 3 tầng theo ảnh mẫu 2 (tầng 1 gồm 6 mạng xã hội Facebook, Instagram, Threads, TikTok, Flickr, Zalo; tầng 2 gồm 5 liên kết chính sách; tầng 3 gồm copyright Dương Hải Phong và nút cuộn lên đầu trang tròn). |
| Hiển thị Mobile (390×844) | Playwright Chromium | [contact-section-mobile.png](../.tooling/contact-section-mobile.png) và [footer-mobile.png](../.tooling/footer-mobile.png) co giãn linh hoạt, không tràn ngang, các nút bấm vừa ngón tay. |

## 24/11/2026 · Kiểm tra và Tinh chỉnh Giao diện Mobile (Contact Form & Header Offset)

| Phạm vi | Phương pháp / Lệnh | Kết quả |
|---|---|---|
| Bù lề đỉnh màn hình | `scroll-margin-top` trên `.contact-form-card`, `#consultation-form` | Khắc phục triệt để tình trạng tiêu đề `Đăng ký tư vấn` và nhãn `Tên` bị che khuất dưới thanh topbar cố định khi cuộn đến hoặc focus. |
| Bố cục 2 cột gọn trên mobile | Viewport 390×844 Chromium | `Tên` & `Số điện thoại`, `Email` & `URL Facebook` bố trí 2 cột tinh gọn, giảm ~200px chiều cao cuộn, toàn bộ form vừa vặn trong 1 khung nhìn màn hình. |
| Cụm nút mạng xã hội mobile | `grid-template-columns: repeat(3, 1fr)` | 3 nút Facebook, Instagram, TikTok nằm trên 1 hàng duy nhất thay vì 3 hàng dọc, tiết kiệm ~110px chiều dài. |
| Điều hướng menu mobile | Click `.navigation a[href$="#contact"]` | Cuộn êm đến `#contact`, điểm dừng có khoảng cách đệm thoáng đãng bên dưới topbar (xem `mobile-nav-to-contact-final.png`). |
| Types / Lint / Test | `npm run typecheck && npm run lint && npm test` | Typecheck strict 100%, ESLint 0 lỗi 0 cảnh báo, Vitest 13/13 passed. |


## 25/11/2026 · Kiểm tra Bo tròn nút và hình ảnh (`src/styles/site.css`)

| Phạm vi | Phương pháp / Lệnh | Kết quả |
|---|---|---|
| Lint | `npm run lint` | Đạt (0 lỗi, 0 cảnh báo). |
| Vitest | `npm test` | Đạt (13/13 passed). |

## 25/11/2026 · Kiểm tra bổ sung Gradient (`src/styles/site.css`)

| Phạm vi | Phương pháp / Lệnh | Kết quả |
|---|---|---|
| Lint | `npm run lint` | Đạt (0 lỗi, 0 cảnh báo). |
| Vitest | `npm test` | Đạt (13/13 passed). |

## 25/11/2026 · Kiểm tra bổ sung Background Gradient cho các Section (`src/styles/site.css`)

| Phạm vi | Phương pháp / Lệnh | Kết quả |
|---|---|---|
| Lint | `npm run lint` | Đạt (0 lỗi, 0 cảnh báo). |
| Vitest | `npm test` | Đạt (13/13 passed). |

## 25/11/2026 · Kiểm tra 5 trang Chính sách (`src/lib/policies.ts`, `policies/[slug]`)

| Phạm vi | Phương pháp / Lệnh | Kết quả |
|---|---|---|
| TypeScript | `npm run typecheck` | Đạt (0 lỗi). |
| Lint | `npm run lint` | Đạt (0 lỗi, 0 cảnh báo). |
| Vitest | `npm test` | Đạt (13/13 passed). |

## 25/11/2026 · Kiểm tra Lưới 3 cột × 4 hàng & Phân trang số (`case-studies`)

| Phạm vi | Phương pháp / Lệnh | Kết quả |
|---|---|---|
| TypeScript | `npm run typecheck` | Đạt (0 lỗi). |
| Lint | `npm run lint` | Đạt (0 lỗi, 0 cảnh báo). |
| Vitest | `npm test` | Đạt (13/13 passed). |

## 25/11/2026 · Kiểm tra Hero Slideshow 3 ảnh (`HeroMedia`)

| Phạm vi | Phương pháp / Lệnh | Kết quả |
|---|---|---|
| TypeScript | `npm run typecheck` | Đạt (0 lỗi). |
| Lint | `npm run lint` | Đạt (0 lỗi, 0 cảnh báo). |
| Vitest | `npm test` | Đạt (13/13 passed). |

## 25/11/2026 · Kiểm tra Carousel Dịch vụ (`Carousel`, `site.css`)

| Phạm vi | Phương pháp / Lệnh | Kết quả |
|---|---|---|
| TypeScript | `npm run typecheck` | Đạt (0 lỗi). |
| Lint | `npm run lint` | Đạt (0 lỗi, 0 cảnh báo). |
| Vitest | `npm test` | Đạt (13/13 passed). |
