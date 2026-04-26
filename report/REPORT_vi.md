# Hiện trạng AI Search tại Việt Nam

### Nghiên cứu thực nghiệm về cách Google AI Overview hoạt động trên thị trường tìm kiếm thương mại Việt Nam, từ tháng 12/2025 đến tháng 4/2026

**Tác giả:** Hoàng Đức Việt, AI Lead, SEONGON
**Trạng thái:** Bản dự thảo v0.1 (sơ bộ; chờ duyệt pháp lý/ẩn danh)
**Dashboard trực tiếp:** [vn-aio-atlas-dashboard-production.up.railway.app](https://vn-aio-atlas-dashboard-production.up.railway.app)
**Mã nguồn & hạ tầng dữ liệu:** [github.com/hdviettt/vn-aio-atlas](https://github.com/hdviettt/vn-aio-atlas)

> **Phiên bản tiếng Anh:** [REPORT.md](./REPORT.md). Bản dịch tiếng Việt đầy đủ tất cả các phần đang được hoàn thiện ở phiên bản v0.2. Hiện tại tài liệu này dịch trọn vẹn phần Tóm tắt Điều hành, Lý do nghiên cứu, và Phương pháp luận; các Phần 1–7 dịch tóm lược, mời tham khảo bản tiếng Anh để có nội dung đầy đủ.

---

## Tóm tắt Điều hành

Dựa trên **244.323 lượt quan sát truy vấn** trải dài qua **264 dự án thương hiệu** thuộc 12 ngành thương mại, nghiên cứu này theo dõi cách tính năng AI Overview (AIO) của Google đang định hình lại bức tranh tìm kiếm thương mại Việt Nam từ tháng 12/2025 đến tháng 4/2026.

Năm phát hiện nổi bật:

1. **AI Overview hiện xuất hiện trên 63% truy vấn thương mại Việt Nam**, với tỷ lệ tăng mạnh theo độ dài truy vấn: 32,8% với truy vấn 1–2 từ, 80,8% với truy vấn 10+ từ. Truy vấn dài mang tính thông tin — vốn là mục tiêu chuyển đổi cao của các đội SEO — nay là phần phễu mà AIO bao phủ dày đặc nhất.

2. **40% trích nguồn AIO đến từ ngoài top 10 organic**. Trên 153 nghìn SERP có AIO, một AIO trung bình trích 7,4 domain khác nhau, nhưng chỉ 4,3 trong số đó nằm trong top 10 organic. Xếp hạng organic vẫn hữu ích — nhưng một phần đáng kể trích nguồn AIO đến từ những nguồn không hề xếp hạng cho truy vấn đó.

3. **Hành vi trích nguồn AIO khác biệt về chất giữa các thị trường**. Trong y tế (67%), ngân hàng (61%), và fintech (64%), trích nguồn AIO và top-10 organic gắn chặt với nhau. Trong du lịch (47%), giáo dục (51%), và phần mềm (52%), AIO vươn ra ngoài top-10 để tìm nguồn. Cùng một kịch bản SEO không thể áp dụng cho cả hai chế độ.

4. **Sitelinks là tín hiệu mạnh nhất cho việc được trích AIO**. Các URL có sitelinks (tín hiệu cho thấy Google đã ghi nhận uy tín cấu trúc của site) được trích **gấp 3,1 lần** so với URL không có (13,2% so với 4,2%). Vị trí xếp hạng trung bình của URL được trích là 8,5 so với 13,5 ở URL không trích — hiệu ứng có thật nhưng nhỏ hơn. Khác biệt về độ dài tiêu đề và mô tả không đáng kể (~3%), cho thấy tối ưu meta tag không phải đòn bẩy cho việc được trích AIO ở thị trường này.

5. **Mức độ tập trung cấp ngành dao động từ "winner-take-all" đến "đuôi dài"**. Trong trang sức và y tế, top 10 domain được trích chiếm 46–49% tổng trích nguồn AIO trong ngành. Trong xây dựng và phần mềm, top 10 chỉ chiếm 13–15%. Chiến lược thương hiệu phải được hiệu chỉnh theo mức độ tập trung cấu trúc của ngành mục tiêu.

---

## Lý do nghiên cứu này tồn tại

Đến tháng 4/2026, AI Overview của Google đã vượt qua ngưỡng mà nó không còn là một tính năng phụ — nó là phản hồi mặc định cho phần lớn truy vấn thông tin trong thị trường thương mại Việt Nam. Tuy nhiên, hầu hết hướng dẫn được công bố cho thương hiệu và agency Việt Nam về AIO vẫn mang tính giai thoại hoặc vay mượn từ các benchmark thị trường tiếng Anh.

Nghiên cứu này lấp khoảng trống đó. Dựa trên hệ thống scraping SERP nội bộ của SEONGON — chạy liên tục qua 264 dự án khách hàng đang hoạt động trải khắp mọi ngành thương mại lớn ở Việt Nam — báo cáo trình bày bức tranh thực nghiệm có quy mô đầu tiên về cách AIO thực sự vận hành tại thị trường này.

Mục đích không phải vận động chính sách. AIO không xấu cho thương hiệu Việt Nam, cũng không tốt một cách phổ quát. Mục đích là **đo lường**: thiết lập một baseline mà các nghiên cứu tương lai có thể xây dựng lên, và làm rõ những phát hiện trái ngược — hoặc xác nhận — các giả định vận hành mà các agency và đội SEO in-house đang đặt ra.

---

## Phương pháp luận

### Bộ dữ liệu

**Nguồn:** Hệ thống tracking SERP nội bộ của SEONGON, được hỗ trợ bởi DataForSEO API. Hệ thống chạy trên Google Việt Nam (mã location 2704, mã ngôn ngữ `vi`) định kỳ, chủ yếu phục vụ các hợp đồng khách hàng trả phí.

**Khối lượng sau xử lý:** 231.365 dòng kết quả từ khóa trải qua 264 dự án thương hiệu, bao phủ 80.264 truy vấn thương mại Việt Nam khác nhau. Trong đó, 148.006 (64%) cho ra AI Overview tại thời điểm thu thập.

**Khoảng thời gian:** 02/12/2025 → 24/04/2026 (~5 tháng).

**Nội dung mỗi dòng:** Mỗi dòng mang đầy đủ phản hồi DataForSEO API cho một (truy vấn, snapshot) — SERP organic với tất cả tiêu đề, URL, mô tả, breadcrumb, các flag cấu trúc (sitelinks, FAQ, rating, featured snippet); AI Overview được render dưới dạng markdown; và danh sách trích nguồn đầy đủ với URL, domain, đoạn trích, và vị trí.

### Xử lý dữ liệu và ẩn danh hóa

Để tạo bộ dữ liệu sẵn sàng công bố:

1. **Loại bỏ truy vấn chứa thương hiệu.** Bất kỳ truy vấn nào chứa tên thương hiệu khách hàng SEONGON đều bị loại. ~5,3% dòng (12.909 dòng) bị xóa.
2. **Loại truy vấn synthetic.** Truy vấn test do LLM tạo, chuỗi malformed (dấu chấm đầu, tab, số đơn lẻ), và truy vấn dạng URL bị lọc bỏ (~0,0% dòng).
3. **Gắn nhãn ngành.** Mỗi dự án được map sang một trong 12 ngành (ngân hàng, fintech, y tế, dược, bán lẻ, FMCG, xây dựng, logistics, giáo dục, lifestyle, phần mềm, du lịch) cộng thêm `unknown` (ngành chưa xác định) bao phủ ~3,6% dòng. Việc gắn nhãn dùng kỹ thuật khớp chuỗi con của domain + tên thương hiệu + tên dự án, có review thủ công cho các trường hợp mơ hồ.
4. **Chỉ công bố ở cấp độ tổng hợp.** Tất cả số liệu báo cáo trong nghiên cứu này được tổng hợp ở cấp ngành hoặc cấp domain. Không SERP khách hàng thô, truy vấn cụ thể, hay metric per-client nào được công bố.

### Hạn chế của bộ dữ liệu

Bộ dữ liệu được thu thập cho công việc khách hàng nội bộ của SEONGON, không phải mẫu ngẫu nhiên đại diện cho tìm kiếm Việt Nam. Có ba thiên lệch sau:

- **Tỷ lệ ngành phản ánh tệp khách hàng SEONGON.** Xây dựng (21% dòng đã clean) và ngân hàng (20%) được đại diện nhiều hơn so với mẫu ngẫu nhiên VN. Y tế và FMCG có đại diện tốt; nông nghiệp, dịch vụ công, giải trí thì rất ít.
- **Tỷ lệ truy vấn phản ánh mục tiêu SEO đang chạy.** Các truy vấn được chọn để track thường có tính thương mại hoặc gắn liền thương hiệu, không phải toàn bộ những gì người dùng thực sự tìm.
- **Snapshot không đồng đều theo thời gian.** Một số dự án quét hàng tuần; một số chỉ quét một lần. Xu hướng tổng hợp được tính trọng số theo số lần quét, không phải theo tầm quan trọng truy vấn.

Những thiên lệch này không vô hiệu hóa các phát hiện — chúng giới hạn các phát hiện. Khi một phát hiện nhạy cảm với thiên lệch, nghiên cứu này sẽ chỉ ra rõ ràng.

### Khả năng tái lập

Mọi con số trong nghiên cứu này đều có thể tính lại từ một schema Postgres công khai (`atlas.*`) được populate bởi một pipeline mở:

```
SEONGON Supabase (nguồn) → data/raw/*.parquet → data/clean/meta.parquet → atlas.* tables → findings
```

Mã nguồn: [github.com/hdviettt/vn-aio-atlas](https://github.com/hdviettt/vn-aio-atlas). Các script pipeline (`scripts/run_pull.py`, `scripts/run_clean.py`, `scripts/run_load.py`, `scripts/run_findings.py`) tái lập toàn bộ phân tích trên một bộ dữ liệu được làm mới.

---

## Phần 1 — AIO phổ biến đến mức nào trên tìm kiếm thương mại Việt Nam?

### Tóm tắt: 63% truy vấn được track có AIO; tỷ lệ tăng mạnh theo độ dài truy vấn.

| Độ dài truy vấn (từ) | Số dòng | Tỷ lệ AIO |
|---|---:|---:|
| 1–2 từ | 5.353 | **32,8%** |
| 3–4 từ | 50.955 | 46,0% |
| 5–6 từ | 90.211 | 64,6% |
| 7–9 từ | 74.818 | 75,4% |
| 10+ từ | 10.028 | **80,8%** |

Truy vấn 10+ từ có khả năng kích hoạt AIO **gấp 2,5 lần** truy vấn 1–2 từ. Mỗi nhóm bổ sung đều có bước tăng đáng kể.

Phát hiện này mâu thuẫn với một kiểu lời khuyên đang lưu hành trong giới SEO Việt Nam — rằng AIO chủ yếu là tính năng cho từ khóa "head" và truy vấn đuôi dài vẫn được "miễn nhiễm". Trong thị trường thương mại Việt Nam, **đuôi dài chính là nơi AIO hung hãn nhất**.

### Ý nghĩa vận hành

Từ khóa đuôi dài về truyền thống là khu vực chuyển đổi cao cho operator SEO — chúng rẻ hơn để rank, có ý định thương mại cao, và cho thấy nhu cầu người dùng với độ cụ thể cao. Dữ liệu ở đây cho thấy phân khúc phễu này hiện là phần bão hòa AIO nhất, có nghĩa:

- Trang nhắm đến truy vấn đuôi dài đối mặt với rủi ro thay thế cao hơn từ tiêu thụ AIO.
- Nội dung "trả lời được" mà AIO tổng hợp khả năng được lấy từ những trang đang rank tốt trên truy vấn đuôi dài.
- Thương hiệu tối ưu nội dung cho ý định đuôi dài nên kỳ vọng AIO làm trung gian hành trình người dùng — không bypass họ, mà định hình lại click-through.

---

## Phần 2 — AIO lấy nguồn từ đâu?

### Tóm tắt: AIO trung bình trích 7,4 domain; ~40% trong số đó đến từ ngoài top 10 organic.

| Chỉ số | Giá trị |
|---|---:|
| Trung bình domain trích / AIO | 7,4 |
| Trung bình domain top-10 organic | 7,9 |
| Trùng lặp trung bình | 4,3 |
| **% domain trích cũng nằm trong top-10 organic** | **59,4%** |

40,6% còn lại của trích nguồn AIO đến từ những nguồn xếp hạng dưới vị trí 10 hoặc không xếp hạng cho truy vấn đó.

### Hệ quả

Hai sự thật vận hành theo:

- **Xếp hạng organic vẫn hữu ích cho việc được trích AIO.** Khung "rank tốt → được trích" không sai — nó chỉ chưa đủ.
- **Có một cuộc chơi riêng cho việc được trích AIO mà chỉ tương quan một phần với xếp hạng truyền thống.** Domain được trích AIO mà không rank organic thường là chuyên ngành hoặc nguồn uy tín cao (tham chiếu ngành, nguồn chính thức, chuyên gia chủ đề ngách).

Pattern này *không* đồng đều giữa các ngành — xem Phần 4.

---

## Phần 3 — Mật độ trích nguồn: Ngân hàng so với nền tảng UGC

### Tóm tắt: Ngân hàng Việt Nam sở hữu sâu các truy vấn của họ. Nền tảng UGC bị trích nông.

Phát hiện nổi lên không định trước từ dữ liệu: khi xếp theo tổng trích nguồn AIO, các domain được trích nhiều nhất trong tìm kiếm thương mại Việt Nam tách rõ thành hai cụm khi tính **mật độ trích nguồn** — số lần trích chia cho số từ khóa khác nhau.

| Domain | Lượt trích | Số từ khóa | Mật độ |
|---|---:|---:|---:|
| techcombank.com | 25.991 | 5.513 | **4,71** |
| nhathuoclongchau.com.vn | 22.639 | 9.765 | 2,32 |
| www.vinmec.com | 15.634 | 7.166 | 2,18 |
| **www.facebook.com** | **14.719** | **7.878** | **1,87** |
| timo.vn | 14.255 | 3.950 | 3,61 |
| **www.youtube.com** | **13.070** | **7.924** | **1,65** |
| www.vpbank.com.vn | 12.862 | 3.094 | 4,16 |
| www.mbbank.com.vn | 8.797 | 2.003 | **4,39** |
| acb.com.vn | 8.579 | 2.103 | 4,08 |

Hai cụm xuất hiện rõ:

- **Domain ngân hàng** (Techcombank, MB, VPBank, HDBank, ACB, SeABank) ở mật độ 3,4–4,7. Khi xuất hiện, chúng được trích nhiều lần trong cùng một câu trả lời AI Overview — dấu hiệu AIO coi đây là nguồn sâu, đáng tin cho các truy vấn mà chúng được nhắc đến.
- **Nền tảng UGC** (Facebook 1,87, YouTube 1,65) xuất hiện trên nhiều SERP (số từ khóa cao) nhưng hiếm khi được trích sâu trong bất kỳ câu trả lời nào.

Với cùng một lần xuất hiện, AIO dường như **xuống giá nội dung UGC**. Facebook xuất hiện trong 7.878 SERP truy vấn khác nhau nhưng chỉ nhận 1,87 trích nguồn mỗi truy vấn khi được trích. Trong khi đó, Techcombank xuất hiện trong 5.513 truy vấn và được trích 4,71 lần mỗi truy vấn. Đây là khoảng cách đáng kể.

### Ý nghĩa

Cho thương hiệu Việt Nam đang cân nhắc "có nên đầu tư vào nội dung YouTube/Facebook để tăng visibility AIO?", dữ liệu gợi ý: **có lẽ là không — ít nhất là không phải kế chính.** AIO dường như ưu tiên nguồn chuyên ngành, chính thức, hoặc thương hiệu hơn là các nền tảng UGC chung, ngay cả trong các thị trường mà UGC được rank organic mạnh.

---

## Phần 4 — Điều gì khiến URL được trích?

Câu hỏi vận hành quan trọng nhất: *với điều kiện URL đã xuất hiện trên SERP có AIO, đặc trưng nào dự đoán việc nó được trích trong câu trả lời AIO?*

Mẫu ngẫu nhiên 10.000 SERP có AIO được lấy (cho ra 179.201 URL organic — 45.878 được trích, 133.323 không trích).

| Đặc trưng | Được trích | Không trích | Δ (tương đối) |
|---|---:|---:|---:|
| **rank_absolute** | 8,55 | 13,52 | **−36,8%** |
| **% có sitelinks** | 13,15% | 4,20% | **+213,3%** |
| % có rating | 10,66% | 9,71% | +9,8% |
| Độ dài tiêu đề trung bình | 51,0 ký tự | 49,5 ký tự | +3,1% |
| Độ dài mô tả trung bình | 157,3 ký tự | 153,7 ký tự | +2,4% |

**Hai tín hiệu quan trọng:**

1. **Xếp hạng vẫn giúp ích, nhưng không cần phải top-3.** URL được trích xếp hạng trung bình ở vị trí 8,5; URL không trích ở 13,5. Giá trị biên của việc đẩy từ rank 5 lên rank 1 cho mục đích AIO citation nhỏ hơn đáng kể so với CTR organic.

2. **Sitelinks là tín hiệu nhị phân mạnh nhất trong bộ dữ liệu.** URL có sitelinks được trích **gấp 3,1 lần** URL không có (13,2% so với 4,2%). Sitelinks không phải feature bạn tối ưu trực tiếp — chúng được hưởng, qua việc Google ghi nhận uy tín cấu trúc của site. Hệ quả rõ ràng: AIO ưa chuộng các domain mà Google đã phân loại là uy tín.

### Hệ quả vận hành

1. **Rank tốt, nhưng đừng tối ưu quyết liệt cho top-3.** Đầu tư biên để dời từ rank 5 lên rank 1 nên dùng cho mục dưới đây.
2. **Xây dựng để đạt sitelinks.** Các động thái cấu trúc giúp đạt sitelinks — phân cấp site rõ, trang category phân biệt, internal linking báo hiệu navigation chính, hành vi tìm kiếm anchor-by-brand — cũng tương quan với AIO citation. Đây là động thái có đòn bẩy cao nhất mà dữ liệu nổi lên.

---

## Phần 5 — Hệ quả theo ngành

*(Sẽ được viết đầy đủ trong v0.2. Tham khảo bản tiếng Anh để có outline sơ bộ cho từng ngành: ngân hàng & fintech, y tế & dược, xây dựng & vật liệu, giáo dục, du lịch.)*

---

## Phần 6 — Hệ quả vận hành cho operator SEO

*(Sẽ được viết đầy đủ trong v0.2. Bốn động thái ưu tiên dựa trên Phần 1–4: dừng tối ưu thoát AIO ngắn-hạn, ưu tiên đạt sitelinks, hiệu chỉnh theo độ tập trung của ngành, bỏ UGC như kế chính cho AIO.)*

---

## Phần 7 — Hạn chế và câu hỏi mở

Phần này có chủ ý minh bạch.

### Những gì nghiên cứu này không thể trả lời

- **Quan hệ nhân quả**, chỉ có tương quan. Tương quan giữa sitelinks và AIO citation không chứng minh đạt sitelinks gây ra tỷ lệ trích tăng.
- **Tác động lên CTR**. Bộ dữ liệu ghi lại liệu AIO có xuất hiện và nó trích gì, không phải liệu user click vào URL được trích.
- **Tác động lên chuyển đổi**. Cùng lưu ý mở rộng.
- **Time-series của thị phần trích nguồn**. Cửa sổ 5 tháng đủ cho xu hướng mô tả, không đủ cho khẳng định nhân quả về cách hành vi AIO đang tiến hóa.

### Hạn chế đã biết của phân tích

- **Tỷ lệ ngành thiên về tệp khách hàng SEONGON.** Xây dựng và ngân hàng được đại diện quá mức.
- **F4 (độ dài AIO theo thời gian) là phát hiện null.** −2,8% drift trong 5 tháng dưới ngưỡng nhiễu.
- **F9 loại bỏ `has_price`** do lỗi trích xuất SQL đã biết.
- **Kích thước mẫu khác nhau.** F9 dùng mẫu ngẫu nhiên 10.000 SERP. F2 và F3 dùng đầy đủ 153 nghìn SERP.

### Phiên bản tiếp theo nên trả lời

- **Tái lập F9 theo từng ngành.** Khác biệt cited-vs-uncited có đồng đều giữa các ngành không?
- **Time-series share-of-voice trích nguồn.** Domain dominant trong từng ngành có ổn định hay đang dịch chuyển?
- **Tác động click-through và chuyển đổi.** Join với analytics traffic của khách hàng hợp tác sẽ làm rõ tác động doanh thu thực sự.
- **So sánh với thị trường tiếng Anh.** Nơi nào hành vi AIO Việt Nam phản chiếu tiếng Anh, và nơi nào khác biệt?

---

## Về tác giả

**Hoàng Đức Việt** là AI Lead tại SEONGON, một agency SEO Việt Nam. Phương pháp luận, phân tích, và việc viết nghiên cứu này là của ông. Bộ dữ liệu thuộc SEONGON, được sử dụng với sự cho phép cho mục đích công bố tổng hợp.

**SEONGON** là agency tiếp thị số tại Hà Nội, chuyên về SEO và content marketing cho các khách hàng doanh nghiệp Việt Nam. Hệ thống tracking SERP nội bộ tạo ra bộ dữ liệu này chạy như một phần của các hợp đồng khách hàng trả phí.

Liên hệ: hoangducviet@seongon.com hoặc qua [hoangducviet.work](https://hoangducviet.work).

---

*Trạng thái: Bản dự thảo v0.1 (tiếng Việt rút gọn). Phần 1–4 và 7 dịch đầy đủ. Phần 5 và 6 tóm lược; nội dung chi tiết sẽ có ở v0.2. Báo cáo đầy đủ sẽ được phát hành sau khi SEONGON hoàn tất rà soát pháp lý/ẩn danh.*

*Cập nhật lần cuối: tháng 4/2026.*
