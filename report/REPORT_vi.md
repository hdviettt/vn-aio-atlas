# Hiện trạng AI Search tại Việt Nam

### Nghiên cứu thực nghiệm về cách Google AI Overview hoạt động trên thị trường tìm kiếm thương mại Việt Nam, từ tháng 12/2025 đến tháng 4/2026

**Tác giả:** Hoàng Đức Việt, AI Lead, SEONGON
**Trạng thái:** Bản dự thảo v0.1 (sơ bộ; chờ duyệt pháp lý/ẩn danh)
**Dashboard trực tiếp:** [vn-aio-atlas-dashboard-production.up.railway.app](https://vn-aio-atlas-dashboard-production.up.railway.app)
**Mã nguồn & hạ tầng dữ liệu:** [github.com/hdviettt/vn-aio-atlas](https://github.com/hdviettt/vn-aio-atlas)

> **Phiên bản tiếng Anh:** [REPORT.md](./REPORT.md). Bản tiếng Việt này dịch đầy đủ Tóm tắt Điều hành, Lý do nghiên cứu, Phương pháp luận, Phần 1–7. Phần 1–4 dịch tóm lược; Phần 5 (Hệ quả theo ngành) và Phần 6 (Playbook operator) dịch đầy đủ.

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

Các phát hiện tổng hợp (Phần 1–4) đúng cho toàn bộ corpus, nhưng hệ quả vận hành khác nhau rõ rệt giữa các thị trường. Một ngân hàng tham gia cuộc đua trích nguồn AIO đối mặt với bài toán khác hẳn một thương hiệu vật liệu xây dựng hoặc một đơn vị giáo dục — khác về mức tập trung, khác về độ trùng lặp với top organic, khác về tập nguồn cạnh tranh.

Phần này dịch dữ liệu cấp ngành (F5, F6, F7, F8) thành hướng dẫn hành động. Với mỗi ngành lớn, nó trả lời:

- *Mức độ phổ biến AIO trong thị trường này?* (F5)
- *Ai đang sở hữu thị phần trích nguồn AIO, và mức tập trung ra sao?* (F6, F7)
- *Xếp hạng organic có chuyển hóa thành trích nguồn không, hay AIO vươn ra xa hơn?* (F8)
- *Tư thế chiến lược (giữ thị phần / giành thị phần / tái cấu trúc để giành thị phần) phù hợp cho thương hiệu trong ngành là gì?*
- *Operator SEO trong ngành nên ưu tiên động thái chiến thuật nào?*

Các ngành được sắp xếp theo quy mô dấu chân dữ liệu trong corpus đã clean, không theo tầm quan trọng.

### 5.1 — Ngân hàng (47.405 dòng, 77% AIO)

**Cấu trúc thị trường.** Ngân hàng là ngành lớn thứ hai trong corpus và là một trong những ngành bão hòa AIO nhất (77%). Mức tập trung trích nguồn từ trung bình đến cao: top 10 domain trích chiếm 40,5% tổng trích nguồn AIO trong ngành. Trùng lặp với top-10 organic là 61% — nghĩa là 39% trích nguồn AIO đến từ ngoài top 10 organic.

**Ai đang sở hữu.** Techcombank thống trị (23.285 lượt trích trên 5.513 truy vấn khác nhau, mật độ 4,2). Tầng tiếp theo — Timo (13.343), VPBank (12.502), HDBank (10.468), Cake (9.477) — chiếm phần lớn thị phần trích còn lại. ACB, MB, SeABank, BIDV, và Prudential hoàn thiện top 10. Tổng lại đây là gần như đầy đủ bức tranh các ngân hàng bán lẻ tier-1 Việt Nam cộng với những neobank dẫn đầu.

**Tư thế chiến lược.** Phòng thủ cho người dẫn đầu; tốn kém nhưng khả thi cho thách thức. Thị trường vận hành như một tập đoàn ổn định: một số ít thương hiệu được vốn hóa tốt nắm phần lớn thị phần trích, và AIO chủ yếu xác nhận xếp hạng organic (61% overlap). Người mới gia nhập phải cạnh tranh đồng thời trên nhiều trục — paid search, organic, content marketing, cấu trúc site sinh sitelinks — để chen vào top 10.

**Ưu tiên chiến thuật cho operator SEO ngân hàng.**

1. **Sitelinks là then chốt.** Theo F9, sitelinks là tín hiệu đặc trưng mạnh nhất cho việc được trích AIO. Site ngân hàng có phân cấp navigation sâu (máy tính lãi suất, trang sản phẩm, định vị chi nhánh, FAQ) chính xác là loại site Google trao sitelinks. Đầu tư vào cấu trúc category rõ ràng trả cổ tức kép.
2. **Structured data trên trang sản phẩm.** Trang sản phẩm ngân hàng (tài khoản tiết kiệm, vay, thẻ) là mục tiêu sách giáo khoa cho structured data. Schema `Product`, `FinancialProduct`, `OfferAggregate` báo hiệu cho Google rằng trang là tham chiếu sản phẩm uy tín.
3. **Nội dung thông tin đuôi dài.** Tỷ lệ AIO tăng mạnh theo độ dài truy vấn (F1). Ngân hàng có ý định đuôi dài phong phú ("lãi suất tiết kiệm Techcombank kỳ hạn 6 tháng", "thẻ tín dụng cho người mới đi làm"). Nội dung dài uy tín cho các truy vấn này được trích; trang sản phẩm ngắn chung chung thì không.
4. **Trích dẫn nguồn uy tín cho nội dung biên tập.** Khi AIO tổng hợp một câu trả lời ngân hàng, nó dệt trích nguồn từ nhiều nguồn. Trang trích dẫn nguồn cấp một (quy định Ngân hàng Nhà nước, dữ liệu tài chính gốc) và bản thân được trích bởi domain khác có xu hướng tăng tỷ lệ trích nguồn theo thời gian.

### 5.2 — Xây dựng & Vật liệu (48.455 dòng, 48% AIO)

**Cấu trúc thị trường.** Xây dựng là ngành lớn nhất trong corpus theo dòng nhưng nằm trong nhóm ít bão hòa AIO nhất (47,7%) — một phần vì truy vấn xây dựng nghiêng về thương mại ("báo giá thang máy") thay vì thông tin. Ấn tượng hơn: xây dựng có **mức tập trung trích nguồn thấp nhất trong dataset** (top-10 = 12,8% tổng trích) trên **7.762 domain trích khác nhau**. Trùng lặp AIO ↔ top-10 là 53,5% — thấp thứ hai sau phần mềm và giáo dục.

**Ai đang sở hữu.** Các công ty thang máy thống trị tập con SEONGON track: Kalealifts (4.157), Cibeslift (3.972), Osakar (2.519), và Thang Máy Gia Đình (2.227). YouTube vào top 5 (2.123) — bất thường cho vị trí top vertical. Ngoài top 5, trích nguồn lan ra hàng nghìn nhà cung cấp vật liệu xây dựng nhỏ, nhà thầu, và site review.

**Tư thế chiến lược.** Đất chưa khai thác. Thị trường xây dựng phân mảnh cấu trúc; không thương hiệu đơn lẻ nào thống trị thị phần trích AIO. Với thương hiệu mới hoặc tầm trung, đây là ngành dễ tiếp cận nhất qua AIO — nhưng cũng đòi hỏi vận hành cao nhất, vì thắng nghĩa là xuất hiện qua hàng trăm truy vấn đuôi dài thay vì thống trị một tập nhỏ.

**Ưu tiên chiến thuật cho operator SEO xây dựng.**

1. **Độ sâu chủ đề qua các category.** Một site bao phủ mười category vật liệu xây dựng với nội dung sâu cho mỗi category sẽ vượt site bao phủ tất cả category một cách nông. Phân mảnh nghĩa là phần thưởng trích nguồn cho bề rộng + chiều sâu cao hơn ở các thị trường tập trung.
2. **Nội dung dài với bảng so sánh có cấu trúc.** AIO yêu thích trang nguồn trình bày thông tin có cấu trúc (so sánh có đánh giá, bảng spec, dải giá). Truy vấn xây dựng thường hướng so sánh; trang tổ chức so sánh sạch sẽ là dễ trích về cấu trúc.
3. **Local SEO + Google Business Profile.** Cho sản phẩm vật lý có yêu cầu lắp đặt theo vùng (thang máy, cửa sổ, cửa), tín hiệu Google Business Profile gián tiếp đưa vào AIO. GBP đã xác minh với đầy đủ thuộc tính tương quan với trích trong các truy vấn thương mại vùng.
4. **Đừng kỳ vọng chen vào top-10 nhanh.** Tập trung quá thấp (12,8%) đến mức "domain trích top-10" không phải mục tiêu trung hạn thực tế. Metric đúng là *tỷ lệ trích trên mỗi truy vấn trong sub-niche của bạn*, không phải tổng số trích tuyệt đối.

### 5.3 — FMCG & Hàng tiêu dùng (28.461 dòng, 60% AIO)

**Cấu trúc thị trường.** Bão hòa AIO trung bình (60%). Tập trung trích vừa phải (top-10 = 31,6%). Trùng lặp AIO ↔ top-10 là 62,6%. Ngành nằm giữa các thị trường có quy định nghiêm ngặt với mức tập trung cao (ngân hàng, y tế) và các thị trường đuôi dài (xây dựng, phần mềm).

**Ai đang sở hữu.** Một hỗn hợp đáng ngạc nhiên:

- **Avakids** (8.006) và **Bach Hoa Xanh** (6.478) — nhà bán lẻ đa category bao phủ FMCG.
- **Long Châu** (7.146) và **Pharmacity** — nhà thuốc, mặc dù đây là ngành FMCG. Ranh giới giữa "FMCG" và "dược" mờ trong các truy vấn về thực phẩm chức năng, sữa công thức, sản phẩm vệ sinh.
- **Điện Máy Xanh** (2.961) — bán lẻ điện máy xử lý hàng gia dụng FMCG-adjacent.
- **Vinamilk** (2.520) — nhà sản xuất FMCG đơn thương hiệu duy nhất trong top 5.

**Tư thế chiến lược.** Lai. Nhà sản xuất FMCG đối mặt với rào cản cấu trúc: phần lớn trích AIO của họ đi đến nhà bán lẻ đa kênh (Avakids, Bach Hoa Xanh) và chuỗi nhà thuốc (Long Châu, Pharmacity), không đến domain .com.vn của thương hiệu. Vinamilk là ngoại lệ chứng minh quy luật — nó chiếm thị phần trích thông qua sức mạnh thương hiệu xây dựng qua nhiều thập kỷ.

**Ưu tiên chiến thuật cho operator SEO FMCG.**

1. **Nội dung trên domain thương hiệu cho truy vấn thương hiệu.** Truy vấn tên thương hiệu ("sữa Vinamilk", "khẩu trang 3M") là các truy vấn mà .com.vn của nhà sản xuất thực sự thắng thị phần trích so với nhà bán lẻ. Xây nội dung sâu chuyên thương hiệu (thông tin sản phẩm, FAQ nhà sản xuất, chi tiết chứng nhận).
2. **Co-citation qua nhà bán lẻ.** Cho truy vấn category không thương hiệu ("sữa bột cho trẻ sơ sinh"), kế thực tế là hợp tác với hệ sinh thái Avakids / Long Châu / Bach Hoa Xanh để sản phẩm được mô tả tốt trên trang của họ — trang mà AIO thực sự trích.
3. **Nội dung công thức / use-case cho FMCG ngách.** AIO thường trích site công thức và nội dung use-case cho truy vấn nguyên liệu. Một thương hiệu bơ đậu phộng cạnh tranh trên "công thức sinh tố bơ đậu phộng" cạnh tranh với site công thức, không phải với nhà bán lẻ tạp hóa.
4. **Coi AIO như kênh nhận thức thương hiệu, không phải kênh giao dịch.** Trích AIO cho FMCG nghiêng về củng cố nhận diện thương hiệu hơn là chuyển đổi trực tiếp. Tối ưu cho điều đó — gắn thương hiệu rõ ràng trong nội dung được trích quan trọng hơn click-through.

### 5.4 — Y tế & Dược (kết hợp: 22.005 dòng, 81% AIO)

**Cấu trúc thị trường.** Trong nhóm bão hòa AIO nhất (81% kết hợp). Tập trung trích cao (top-10 = 45,6%). Trùng lặp AIO ↔ top-10 là **cao nhất trong dataset (66,9%)** — nghĩa là AIO theo sát top-10 organic trong y tế. Đây là thị trường "xếp hạng quyết định trích" mạnh nhất.

**Ai đang sở hữu.** Long Châu (11.475) và Vinmec (10.435) dẫn đầu. Medlatec (9.130), Tâm Anh (6.837), và Bệnh Viện Thu Cúc (4.470) hoàn thiện top 5. Cả năm đều là thương hiệu y tế Việt Nam lớn với vị thế tin cậy đã có: Long Châu là chuỗi nhà thuốc lớn nhất nước, Vinmec là mạng lưới bệnh viện tư cao cấp, Medlatec là nhà cung cấp dịch vụ chẩn đoán lớn, Tâm Anh là chuỗi bệnh viện chăm sóc cấp ba, và Thu Cúc là mạng lưới bệnh viện và y học thẩm mỹ.

**Tư thế chiến lược.** Phòng thủ cho người dẫn đầu. Phòng thủ vững chắc đối với thách thức. Y tế là thị trường gần nhất với "uy tín đã đạt được" mà dữ liệu cho thấy: trích AIO mạnh tương quan với xếp hạng organic, mạnh tương quan với nhận diện thương hiệu, mạnh tương quan với chứng chỉ-quy định (cấp phép bệnh viện, cấp phép nhà thuốc, chứng chỉ chuyên môn y tế).

**Ưu tiên chiến thuật cho operator SEO y tế và dược.**

1. **E-E-A-T không thể thương lượng.** Tiêu chí Trải nghiệm-Chuyên môn-Uy quyền-Tin cậy của Google áp dụng đầy đủ trong truy vấn YMYL (Tiền của bạn, Cuộc sống của bạn) — và y tế là category YMYL chuẩn mực. Bio tác giả với bác sĩ có chứng chỉ, người duyệt y tế có tên, trích dẫn nguồn cấp một (Bộ Y Tế, tạp chí khoa học phản biện) là điều kiện cơ bản.
2. **Schema y tế có cấu trúc.** Schema `MedicalCondition`, `Drug`, `MedicalGuideline`, `Hospital` được Google hỗ trợ tốt. Trang đánh dấu nội dung y tế đúng cách được tăng uy quyền.
3. **Nội dung dài về triệu chứng-điều trị.** Truy vấn dominant trong AIO y tế là thông tin: "triệu chứng tiểu đường", "cách điều trị viêm họng", "uống thuốc kháng sinh có tác dụng phụ gì". Nội dung dài, được trích dẫn tốt, được chuyên gia review cho các truy vấn này được trích; nội dung mỏng hoặc trang giao dịch hung hãn thì không.
4. **Đừng giả mạo chứng chỉ.** AIO bảo thủ trong y tế — nó có ưu tiên rõ với nguồn institutional. Một thương hiệu y tế mới không có giấy phép hoặc bác sĩ chứng chỉ sẽ vật lộn để chen vào bất kể chất lượng nội dung. Động thái đúng là xây nội dung trong khi xây vị thế chứng chỉ song song.

### 5.5 — Logistics (14.376 dòng, 75% AIO)

**Cấu trúc thị trường.** Bão hòa AIO cao (75%). Tập trung trích vừa phải (top-10 = 29,9%). Trùng lặp AIO ↔ top-10 là 57,5% — hơi dưới trung bình toàn cục. Thị trường có tập trung đáng kể nhưng không winner-take-all.

**Ai đang sở hữu.** Ba ông lớn và hai thách thức: GHN (4.862), Viettel Post (4.189), GHTK (3.398), 247Express (2.066), và Supership (1.784). Tổng năm này chiếm phần đỉnh của hệ thống trích nguồn logistics.

**Tư thế chiến lược.** Có thể bảo vệ nhưng thấm cho người dẫn đầu; khả thi cho thách thức được tài trợ tốt. Top 3 (GHN, Viettel Post, GHTK) có thị phần đáng kể nhưng không đến mức một thách thức đáng tin cậy không thể vào. Truy vấn logistics chủ yếu là giao dịch ("phí ship Hà Nội Sài Gòn", "thời gian giao hàng GHTK") và AIO trả lời chúng bằng cách tổng hợp qua nhiều nhà chuyên chở.

**Ưu tiên chiến thuật cho operator SEO logistics.**

1. **Trang dữ liệu trực tiếp mà AIO có thể trích.** Trang công bố giá ship trực tiếp hoặc cập nhật gần đây, thời gian vận chuyển, và bản đồ phủ sóng được trích vì AIO có thể trích xuất sự thật cụ thể. Trang bán hàng tĩnh được trích ít hơn.
2. **SEO cho trang tracking.** Mỗi nhà chuyên chở có truy vấn liên quan tracking khối lượng cao. Một landing page tracking nổi bật định dạng số tracking, thời gian giao hàng dự kiến, và FAQ về delay giành thị phần trích cho truy vấn tracking thương hiệu.
3. **Nội dung so sánh.** "GHN vs GHTK" và so sánh tương tự đẩy trích về nội dung tổ chức so sánh rõ ràng. Một bài so sánh trung lập có thể giành thị phần trích cho truy vấn nhà chuyên chở thương hiệu — ngay cả khi bài đó trên domain không phải nhà chuyên chở.
4. **Nội dung fulfillment vùng.** Truy vấn logistics thường mang tính vùng ("ship hàng HCM đi Hà Nội", "giao hàng tại Đà Nẵng"). Nội dung cụ thể vùng với dữ liệu địa phương hóa thắng trích so với nội dung quốc gia chung.

### 5.6 — Bán lẻ & Thương mại điện tử (14.970 dòng, 34% AIO)

**Cấu trúc thị trường.** Bão hòa AIO thấp nhất trong dataset (34%). Tập trung trích vừa phải (top-10 = 23,8%). Trùng lặp AIO ↔ top-10 là 59,7%.

**Ai đang sở hữu.** Các chuỗi bán lẻ và điện máy lớn của Việt Nam: Decathlon (1.469), Cellphones (1.118), Điện Máy Xanh (1.059), Thế Giới Di Động (1.020), FPT Shop (826). Top 5 phản ánh ai thống trị tìm kiếm bán lẻ thương hiệu Việt Nam nói chung — AIO không thay đổi bức tranh đáng kể.

**Tư thế chiến lược.** Sự xuất hiện AIO đủ thấp (34%) đến mức operator SEO bán lẻ đối mặt với rủi ro thay thế AIO ít hơn các ngành khác. Động lực cạnh tranh chính vẫn là rank organic so với các chuỗi bán lẻ lớn và sàn thương mại (Shopee, Lazada — xuất hiện ít hơn trong dataset này vì khách hàng SEONGON chủ yếu là brand-direct).

**Ưu tiên chiến thuật cho operator SEO bán lẻ.**

1. **Đừng đầu tư quá vào phòng thủ AIO.** Với chỉ 34% truy vấn bán lẻ trả về AIO, rủi ro thay thế trực tiếp đối với CTR organic thấp hơn đáng kể so với y tế hoặc ngân hàng. Phân bổ nỗ lực nên phản ánh điều này — SEO bán lẻ vẫn chủ yếu về xếp hạng và chuyển đổi, không phải giành trích AIO.
2. **Cấu trúc trang category cho truy vấn đủ điều kiện AIO.** Khi AIO xuất hiện trong bán lẻ (truy vấn lai thương mại-thông tin — "loại thuốc nhuộm tóc nào tốt nhất"), nó có xu hướng trích trang category với danh sách được biên tập thay vì trang sản phẩm cá nhân. Đầu tư vào trang category được biên tập với gắn nguồn thắng các truy vấn này.
3. **Trang thương hiệu+từ khóa.** "Quần áo trẻ em Decathlon", "iPhone 15 FPT Shop" loại truy vấn có hành vi AIO rõ — chúng trích trang category cụ thể của nhà bán lẻ thương hiệu. Xây hệ thống.
4. **Schema sản phẩm khắp nơi.** Ngay cả khi AIO không trực tiếp trích, schema Sản phẩm đưa vào carousel sản phẩm và rich result cạnh tranh với AIO cho không gian SERP.

### 5.7 — Giáo dục (10.398 dòng, 83% AIO)

**Cấu trúc thị trường.** Bão hòa AIO cao nhất trong dataset (83%). Tập trung trích vừa phải (top-10 = 18,3%) nhưng tập trung giữa các trường đại học. Trùng lặp AIO ↔ top-10 là **thấp thứ hai trong dataset (50,6%)** — AIO vươn xa khỏi top-10 để tìm nguồn cho truy vấn giáo dục.

**Ai đang sở hữu.** Các trường đại học, mọi entry top-5: Hoa Sen (1.760), HUTECH (1.546), FPT University (1.395), UEL (Trường Đại học Kinh tế - Luật, 1.380), và VinUni (1.305). Phần còn lại của top 25 bao gồm các trường đại học khác, site quy định MOET, site tổng hợp học bổng, và site review giáo dục.

**Tư thế chiến lược.** Thuộc tính institutional cao. Cuộc đua trích AIO trong giáo dục bị thống trị bởi các trường đại học được kiểm định. Người mới gia nhập không có kiểm định trường đại học (ví dụ: trung tâm ngoại ngữ, chương trình chứng chỉ chuyên môn, startup giáo dục online) đối mặt với rào cản gia nhập dốc nhất trong dataset vì top-10 hiện tại được hợp pháp hóa cấu trúc theo cách khó tái tạo.

**Ưu tiên chiến thuật cho operator SEO giáo dục.**

1. **Xây cho pool câu hỏi đuôi dài AIO.** Giáo dục có truy vấn thông tin đuôi dài phong phú ("ngành công nghệ thông tin học gì?", "trường đại học nào tốt nhất ở Việt Nam?"). 50% trích đến từ ngoài top-10, nghĩa là một trang nội dung uy tín được trích tốt có thể chen vào trích AIO mà không cần rank #1.
2. **Uy quyền tác giả trong nội dung giáo dục.** Trang có chuyên gia giáo dục có tên (trưởng khoa, trưởng phòng, nghiên cứu sinh) đính kèm có khả năng được trích cao hơn nội dung ẩn danh.
3. **Trích dẫn chính phủ/cơ quan quản lý.** Trang trích quy định Bộ Giáo dục, danh mục kiểm định trường đại học, và nguồn quản lý cấp một có được niềm tin AIO nhanh hơn trang không có.
4. **Nội dung so sánh và xếp hạng.** Nội dung "Top trường cho X" giành thị phần trích cho truy vấn so sánh trường ngay cả từ domain không phải trường đại học. Bài so sánh được nghiên cứu kỹ, hiện hành có thể chen vào tập trích AIO cho các truy vấn nơi bản thân các trường không cạnh tranh trực tiếp.

### 5.8 — Fintech & Thanh toán (15.675 dòng, 60% AIO)

**Cấu trúc thị trường.** Bão hòa trung bình (60%) với mức tập trung vừa phải (top-10 = 31,0%). Trùng lặp AIO ↔ top-10 là 64,3% — hơi trên trung bình.

**Ai đang sở hữu.** Hỗn hợp đa dạng hơn ngân hàng đúng nghĩa: VNPAY App (3.152), Vexere (2.459) — lưu ý: Vexere là du lịch/đặt vé, không hẳn fintech, nhưng được phân loại ở đây vì truy vấn liên quan luồng thanh toán — MoMo (1.962), Facebook (1.729), và Thế Giới Di Động (1.703). Hỗn hợp phản ánh tính chất mờ ranh giới của fintech Việt Nam: app thanh toán, ví điện tử, BNPL, và dịch vụ adjacent như gọi xe và đặt vé đều chồng lấn.

**Tư thế chiến lược.** Di chuyển nhanh hơn ngân hàng, tập trung hơn bán lẻ. Ngành fintech đang trong giai đoạn xáo trộn tích cực — VNPAY, MoMo, ZaloPay, và Cake đều cạnh tranh thị phần. Operator SEO trong không gian này đối mặt với phiên bản tăng tốc của động lực ngân hàng: cùng playbook (sitelinks, structured data, nội dung đuôi dài) nhưng trên timeline ngắn hơn.

**Ưu tiên chiến thuật cho operator SEO fintech.**

1. **Nội dung help + nội dung product-flow.** "Cách gửi tiền qua MoMo đến tài khoản quốc tế", "VNPAY mã lỗi 401" — đây là các truy vấn nơi phần thưởng trích AIO fintech cao nhất. Mỗi app nên sở hữu help-content riêng.
2. **Nội dung so sánh.** So sánh chéo sản phẩm ("MoMo vs ZaloPay") giành thị phần trích ngay cả cho truy vấn thương hiệu.
3. **Nội dung tuân thủ và quy định.** Fintech Việt Nam được quản lý chặt; trang giải thích vị thế quy định hiện tại (thay đổi PSD, giới hạn BNPL, yêu cầu KYC) giành trích như tham chiếu quy định uy tín.
4. **App mới hơn nên tập trung vào truy vấn tên thương hiệu + use-case.** Truy vấn chung "ví điện tử tốt nhất" bị thống trị bởi người chơi đã được củng cố. Tốt hơn giành thị phần trích trên use-case cụ thể hơn ("ví điện tử cho thanh toán ship", "ví điện tử hỗ trợ thẻ quốc tế") nơi sân chơi rộng hơn.

### 5.9 — Phần mềm & B2B (7.525 dòng, 70% AIO)

**Cấu trúc thị trường.** Bão hòa trung bình (70%). Tập trung trích là **thấp thứ hai trong dataset (top-10 = 15,1%)** trên 4.856 domain trích khác nhau. Trùng lặp AIO ↔ top-10 là 51,8% — thuộc nhóm thấp nhất. Đây là thị trường đuôi dài nơi AIO chủ động vươn ra ngoài top-10.

**Ai đang sở hữu.** Phần mềm kế toán Việt Nam và công cụ thuế thống trị: Misa AMIS (1.290), Kế Toán An Phá (931), AZTAX (500), và Thư Viện Pháp Luật (702 — kho tài liệu pháp lý). YouTube (851) xuất hiện trong top 5 — bất thường nhưng phản ánh nội dung how-to cho luồng kế toán.

**Tư thế chiến lược.** Đất tương đối chưa khai thác. Thị trường đuôi dài như phần mềm là nơi người mới gia nhập có cơ hội thực tế nhất giành thị phần trích AIO, nhưng đạt được đòi hỏi bề rộng. Ngách phần mềm kế toán có người thắng rõ; các ngách phần mềm khác (CRM, ERP, quản lý dự án) còn phân mảnh hơn.

**Ưu tiên chiến thuật cho operator SEO phần mềm/B2B.**

1. **Nội dung how-to dài cho mỗi use-case.** AIO vươn sâu vào đuôi dài cho truy vấn phần mềm. Một trang giải thích "cách xử lý X trong kế toán Việt Nam" với giọng tác giả đáng tin cậy và trích nguồn cấp một vượt landing page marketing sản phẩm hung hãn.
2. **Documentation như nội dung.** Trang documentation của các công ty phần mềm là một số nội dung được trích cao nhất trong ngành. Coi docs như nội dung (với meta tag đúng, navigation có cấu trúc, schema markup) tăng thị phần trích.
3. **Nội dung so sánh ngành.** "Phần mềm [loại] tốt nhất cho SMB Việt Nam" giành thị phần trích cho truy vấn người mua.
4. **Tham chiếu quy định.** Phần mềm kế toán/thuế Việt Nam tồn tại bên cạnh quy định chính phủ. Trang map quy định với luồng phần mềm và trích Thư Viện Pháp Luật giành trích như tham chiếu thực tiễn uy tín.

### 5.10 — Du lịch (2.337 dòng, 65% AIO)

**Cấu trúc thị trường.** Bão hòa trung bình (65%). Tập trung vừa phải (top-10 = 39,0%). Trùng lặp AIO ↔ top-10 là **thấp nhất trong dataset (46,5%)** — AIO vươn xa hơn ngoài xếp hạng organic trong du lịch hơn bất kỳ đâu.

**Ai đang sở hữu.** Hỗn hợp khác biệt so với các ngành khác: Phi Phi Brazuca (849, blog nội dung điểm đến), YouTube (809), Mundo Asia Tours (758, nhà điều hành tour — và khách hàng SEONGON), Tailandiando.com (341, site nội dung du lịch Thái Lan), và Instagram (339). Top 5 *không* có agency du lịch lớn nào của Việt Nam.

**Tư thế chiến lược.** Định hướng biên tập. Trích AIO du lịch chảy về độ sâu nội dung (nội dung điểm đến dài, lịch trình giàu ảnh) thay vì trang đặt giao dịch. Các nhà điều hành tour Việt Nam lớn đáng chú ý vắng mặt trong tập trích đỉnh — một khoảng trống chiến lược.

**Ưu tiên chiến thuật cho operator SEO du lịch.**

1. **Nội dung điểm đến dài.** Một bài nhiều nghìn từ về "lịch trình 5 ngày Bali cho khách Việt Nam" với phân tách ngày-theo-ngày có cấu trúc, ảnh, và dữ liệu giá giành thị phần trích mà landing page booking-engine không.
2. **Nội dung du lịch tiếng Việt cho điểm đến nước ngoài.** Phi Phi Brazuca và Tailandiando rank tốt chính xác vì chúng lấp một khoảng trống: nội dung tiếng Việt về điểm đến không phải Việt Nam. Nhà điều hành tour Việt Nam xuất bản nội dung điểm đến tiếng Việt cạnh tranh ở mức này.
3. **Kết hợp ảnh + structured data.** Câu trả lời AIO du lịch thường nổi bật ảnh qua carousel hình ảnh bên cạnh AIO. Trang có Image schema tốt + gắn tên nhiếp ảnh gia + schema cụ thể du lịch (Trip, TouristAttraction) giành cross-citation qua cả hai bề mặt.
4. **Hiệu ứng vươn-ra-ngoài-top-10 mạnh nhất ở đây.** Đừng over-index vào ám ảnh rank-1. Một trang nội dung du lịch được trích tốt, được chụp ảnh tốt, có cấu trúc tốt có thể chen vào trích AIO trong khi xếp vị trí 8 hoặc 9 organic.

### 5.11 — Lifestyle & Dịch vụ gia đình (8.415 dòng, 66% AIO)

**Cấu trúc thị trường.** Bão hòa trung bình (66%). Tập trung vừa phải (top-10 = 31,8%). Trùng lặp AIO ↔ top-10 là 62,3%. Đáng chú ý, các trích đỉnh của ngành lifestyle *bị thống trị bởi domain y tế* — phản ánh cách truy vấn lifestyle bão hòa vào sức khỏe.

**Ai đang sở hữu.** Long Châu (2.381), Vinmec (2.327), Medlatec (1.309), bTaskee (1.203 — app dịch vụ gia đình), và Tâm Anh (964). Bốn trong năm là domain y tế; chỉ bTaskee thực sự "lifestyle" theo nghĩa dịch vụ gia đình.

**Tư thế chiến lược.** Bị thống trị bởi nội dung sức khỏe. Thương hiệu lifestyle thuần túy cạnh tranh trên truy vấn lifestyle đối mặt với thách thức cấu trúc rằng AIO định tuyến hầu hết trích lifestyle về domain có chứng chỉ sức khỏe. Lối đi là (a) định vị adjacent — kéo truy vấn vào sub-domain lifestyle cụ thể (dịch vụ vệ sinh, decor, fitness) nơi thương hiệu lifestyle thực sự cạnh tranh — hoặc (b) chấp nhận rằng thị phần trích AIO cho truy vấn lifestyle chung đi đến nguồn có chứng chỉ sức khỏe.

**Ưu tiên chiến thuật cho operator SEO lifestyle.**

1. **Chuyên môn hóa sub-vertical.** "Lifestyle" quá rộng để cạnh tranh trực tiếp — nhưng các sub-niche cụ thể (dịch vụ nhà, huấn luyện fitness, nghi thức làm đẹp, nuôi dạy con) có tập trích ít chen chúc hơn.
2. **Định vị adjacent sức khỏe.** Nhiều thương hiệu lifestyle nằm cạnh sức khỏe (thực phẩm chức năng, wellness, fitness). Nội dung uy tín trích nghiên cứu y tế, có tác giả chứng chỉ, và tham chiếu hướng dẫn Bộ Y Tế có thể giành thị phần trích mà nội dung lifestyle thuần túy không thể.
3. **Nội dung review dịch vụ và how-to.** Thị phần trích của bTaskee được xây trên nội dung "cách vệ sinh X", "cách xử lý Y" thực tế. Mẫu này có thể tái lập.

### 5.12 — Trang sức (2.223 dòng, 56% AIO)

**Cấu trúc thị trường.** Nhỏ nhất trong các ngành lớn (2.223 dòng). Bão hòa trung bình (56%). **Tập trung cao nhất trong dataset (top-10 = 48,7%)** — gần nhất với winner-take-all trong bất kỳ ngành nào, mặc dù là thị trường nhỏ.

**Ai đang sở hữu.** Hỗn hợp đặc trưng: Goonus.io (769, blog thông tin trang sức), PNJ (567, nhà bán lẻ trang sức #1 Việt Nam), Tierra (431), Phú Quý Group (307), và DOJI (282, nhà giao dịch kim loại quý lớn). Sự hiện diện của Goonus.io ở #1 — site nội dung, không phải nhà bán lẻ — đáng chú ý.

**Tư thế chiến lược.** Cạnh tranh nhưng nứt vỡ. Mặc dù tập trung cao, vị trí #1 thuộc về site nội dung thay vì các thương hiệu bán lẻ thống trị (PNJ, DOJI). Điều này gợi ý cuộc đua trích AIO trong trang sức thưởng độ sâu thông tin hơn vị thế giao dịch. Người chơi được phòng thủ dễ tổn thương trên trục nội dung.

**Ưu tiên chiến thuật cho operator SEO trang sức.**

1. **Nội dung giáo dục hơn nội dung giao dịch.** "Cách chọn nhẫn cưới", "phân biệt vàng 18k và 24k" — truy vấn thông tin là nơi trích AIO trang sức chảy đến. Vị trí #1 của Goonus.io được xây trên điều này.
2. **Nội dung vật liệu và nghệ thuật chế tác.** AIO yêu thích nội dung giải thích *vì sao* (vì sao vật liệu này, vì sao kỹ thuật này, vì sao điểm giá này). Trang thương hiệu giải thích nghệ thuật chế tác giành trích mà trang sản phẩm thuần túy không có.
3. **Uy quyền qua chứng chỉ ngọc học.** Đề cập chứng chỉ GIA (Gemological Institute of America), nhà ngọc học có tên, và dữ liệu sản phẩm có cấu trúc đưa vào tín hiệu tin cậy AIO.

### 5.13 — Mẫu xuyên ngành

Ba mẫu nổi lên qua các ngành:

- **Domain sức khỏe hấp thụ truy vấn adjacent.** Long Châu, Vinmec, và Medlatec xuất hiện trong top 5 của *cả* y tế và lifestyle, và Long Châu cũng dẫn đầu FMCG. Domain có chứng chỉ sức khỏe kéo thị phần trích từ các category truy vấn rộng hơn.
- **YouTube xuất hiện trong các ngành phân mảnh, đuôi dài.** YouTube vào top 5 trong phần mềm, xây dựng, và du lịch — các ngành nơi top-10 chiếm ít hơn 16% trích. Tỷ lệ trích AIO của YouTube mỗi lần xuất hiện thấp (1,65), nhưng trong các thị trường đuôi dài sự hiện diện mật-độ-thấp-nhưng-rộng đó đủ để chen vào top 5.
- **Các ngành có tập trung cao cũng có overlap cao với top-10.** Y tế (tập trung 45,6%, overlap 67%) và ngân hàng (40,5%, 61%) neo một chế độ. Xây dựng (12,8%, 53,5%) và giáo dục (18,3%, 50,6%) neo chế độ ngược lại. Đây là phát hiện cấu trúc: trong các thị trường nơi AIO winner-take-all, xếp hạng organic map chặt với trích; trong các thị trường nơi trích phân mảnh, AIO vươn sâu hơn.

---

## Phần 6 — Hệ quả vận hành cho operator SEO

Phần này dịch dữ liệu thành các động thái cụ thể, được ưu tiên cho operator SEO. Nó được cấu trúc như một playbook: bắt đầu cái gì, dừng cái gì, đo cái gì. Các khuyến nghị được hiệu chỉnh theo ngành (Phần 5) — operator nên coi các ưu tiên dưới như mặc định để áp dụng trừ khi bối cảnh cụ thể của ngành ghi đè.

### 6.1 — Bốn động thái có tác động kỳ vọng lớn nhất

Bốn động thái này có đòn bẩy cao nhất qua hầu hết các ngành. Liệt kê theo thứ tự ưu tiên:

#### Động thái 1: Xây cấu trúc site giành sitelinks

**Vì sao.** Theo F9, sitelinks là tín hiệu nhị phân lớn nhất duy nhất cho việc được trích AIO trong dataset (URL có sitelinks được trích gấp 3,1 lần URL không có — 13,2% so với 4,2%). Đây là đầu tư cấu trúc, nhiều tháng, không phải thay đổi chiến thuật. Nhưng nó có tác động kỳ vọng lớn nhất của bất kỳ can thiệp đơn lẻ nào.

**Cách làm.** Sitelinks được Google trao dựa trên:

- **Phân cấp navigation rõ ràng** — site có navigation chính dễ nhận biết phản ánh cấu trúc nội dung thực tế.
- **Nhãn navigation mô tả, gắn thương hiệu** — category được đặt tên theo cách user thực sự tìm (không phải jargon nội bộ).
- **Hành vi tìm kiếm gắn thương hiệu** — user tìm "[tên thương hiệu] [sản phẩm]" thay vì chỉ "[sản phẩm]" — Google diễn giải là thương hiệu là điểm đến được công nhận cho họ truy vấn đó.
- **Internal linking phản ánh navigation user** — số inbound link cao đến trang chính từ cấu trúc menu và link contextual.

**Đo gì.** Track sitelinks qua Google Search Console (Performance report → CTR + impression cấp trang). Site giành sitelinks thấy bước nhảy về CTR truy vấn thương hiệu và tỷ lệ trích AIO đồng thời.

#### Động thái 2: Hiệu chỉnh độ sâu nội dung theo tập trung của ngành

**Vì sao.** Theo F7, tập trung trích dao động từ 12,8% (xây dựng) đến 48,7% (trang sức). Chiến lược nội dung đúng khác cơ bản qua dải này. Trong các thị trường tập trung (ngân hàng, y tế, trang sức), người phòng thủ sở hữu phần lớn thị phần trích — lối đi là độ sâu trên một định vị cụ thể. Trong các thị trường phân mảnh (xây dựng, phần mềm, giáo dục), không ai sở hữu thị phần — lối đi là bề rộng qua nhiều sub-query.

**Cách làm.**

- **Trong thị trường tập trung (top-10 ≥ 35%):** Chọn một định vị có thể bảo vệ (một dòng sản phẩm cụ thể, phân khúc khách hàng, hoặc góc nội dung) và xây độ sâu trên đó. Một vị thế hẹp, sâu, chuyên gia thắng vị thế rộng, nông, generalist.
- **Trong thị trường phân mảnh (top-10 < 25%):** Xây bề rộng qua các category. Hướng dẫn 50 trang toàn diện bao phủ mười sub-category sẽ vượt site 5 trang tập trung, vì không trang đơn lẻ nào sẽ thống trị.
- **Trong thị trường vừa phải (top-10 25–35%):** Lai. Chiến lược core-depth (3–5 định vị anh hùng) với bề rộng trong chủ đề hỗ trợ.

**Đo gì.** Tỷ lệ trích cho mỗi truy vấn được phân chia theo định vị site của bạn. Nếu site bạn xuất hiện trong 30 SERP truy vấn khác nhau nhưng chỉ được trích trong 2, định vị của bạn không giành trích — quay lại bảng vẽ về độ sâu.

#### Động thái 3: Nội dung đuôi dài hơn nội dung từ khóa chính

**Vì sao.** Theo F1, truy vấn 1–2 từ kích hoạt AIO 32,8% thời gian; truy vấn 10+ từ kích hoạt AIO 80,8% thời gian. Hai hệ quả vận hành:

1. Rủi ro thay thế đối với CTR organic từ AIO **cao nhất** trên truy vấn đuôi dài.
2. Cơ hội trích từ AIO **lớn nhất** trên truy vấn đuôi dài.

Hai sự thật này cùng nhau có nghĩa: **đuôi dài là nơi visibility AIO thực sự quan trọng**. Traffic từ khóa chính bị ảnh hưởng đáng kể ít hơn bởi AIO; traffic đuôi dài đang được định hình lại.

**Cách làm.**

- Chuyển phân bổ nguồn lực từ "rank #1 cho từ khóa chính khối lượng cao" sang "rank top-10 cho hàng trăm truy vấn đuôi dài trong khu chủ đề của bạn."
- Xây nội dung trả lời ý định thông tin đuôi dài cụ thể — "cách X cho Y" thay vì "X tốt nhất" hoặc "review X."
- Dùng công cụ keyword research hiện có (Ahrefs, Semrush, Google Search Console) để tìm truy vấn đuôi dài site bạn đã rank ở vị trí 5–15. Đây là các truy vấn nơi thị phần trích đạt được nhất.

**Đo gì.** CTR đuôi dài so với sự xuất hiện AIO. Nếu bạn xuất hiện ở rank 8 cho truy vấn đuôi dài và AIO cũng có mặt, CTR của bạn có thể thấp hơn so với truy vấn không có AIO — nhưng một trích trong AIO có thể bù tổn thất đó với tín hiệu thương hiệu.

#### Động thái 4: Bỏ kênh UGC như kế chính cho AIO

**Vì sao.** Theo F3, Facebook (mật độ trích 1,87) và YouTube (1,65) hiện diện trong nhiều SERP nhưng được trích nông. AIO dường như có hệ thống ưu tiên domain chuyên ngành hơn UGC chung.

**Cách làm.**

- Đừng đầu tư ngân sách thương hiệu vào nội dung YouTube/Facebook với mục tiêu chính là giành thị phần trích AIO. Toán không có lợi.
- Kênh UGC vẫn đóng vai trò trong (a) xây khán giả, (b) củng cố tín hiệu thương hiệu (để khi AIO trích nguồn chuyên ngành, thương hiệu được nhận diện), và (c) khám phá social-search trên các nền tảng không phải Google. Tiếp tục đầu tư UGC vì những lý do này, chỉ không phải cho trích AIO.
- Ngoại lệ: thị trường đuôi dài (xây dựng, phần mềm, du lịch) nơi YouTube chen vào top-5. Ngay cả ở đây, YouTube không phải kênh trích chính — nó là sub-priority hưởng lợi từ việc được tag tốt với mô tả, transcript, và metadata có cấu trúc.

**Đo gì.** So sánh tỷ lệ trích (trích trên truy vấn trong tập tracked của bạn) cho domain sở hữu so với nội dung YouTube/Facebook của bạn. Sự khác biệt mang tính thông tin — và gần như luôn ưu tiên domain sở hữu của bạn.

### 6.2 — Hai động thái bạn có thể đang đầu tư quá

Đây là các đầu tư SEO phổ biến, trên dataset này, trả lại ít hơn bốn động thái trên:

#### Anti-priority 1: Tối ưu xếp hạng top-3 hung hãn

**Vì sao.** Theo F9, URL được trích xếp ở vị trí 8,5 trung bình; URL không trích ở 13,5. Tăng CTR biên từ rank 1 so với 5 thực cho traffic organic, nhưng phần thưởng trích AIO gần như giống qua vị trí 1–10. Nếu mục tiêu bạn là thị phần trích AIO, đầu tư nguồn lực để dời từ vị trí 5 sang vị trí 1 tốt hơn dùng cho Động thái 1 (sitelinks) hoặc Động thái 2 (độ sâu hiệu chỉnh theo ngành).

**Lưu ý.** Đây *không* phải lập luận chống lại việc rank tốt. Đây là lập luận chống lại đầu tư biên dời từ đã-rank-tốt sang rank #1, khi đầu tư đó cạnh tranh tài nguyên với động thái cấu trúc có tác động AIO lớn hơn.

#### Anti-priority 2: Tinh chỉnh meta-title và meta-description cho AIO

**Vì sao.** Theo F9, độ dài tiêu đề trung bình khác 3,1% giữa URL được trích và không trích (51 so với 49,5 ký tự). Độ dài mô tả khác 2,4% (157 so với 154 ký tự). Đây không phải tín hiệu AIO dùng để quyết định trích cái gì.

**Lưu ý.** Meta tag vẫn quan trọng cho CTR organic (snippet hiển thị dưới URL trong search thường). Tiếp tục duy trì chúng ở chất lượng hợp lý. Chỉ đừng kỳ vọng tăng trích AIO từ việc viết lại chúng.

### 6.3 — Tổ hợp ưu tiên theo ngành

Các ngành khác nhau thưởng các động thái khác nhau. Dưới đây là trọng số ưu tiên được khuyến nghị theo ngành, từ Phần 5:

| Ngành | Sitelinks (Đ1) | Độ sâu theo ngành (Đ2) | Đuôi dài (Đ3) | Bỏ UGC (Đ4) |
|---|---|---|---|---|
| Ngân hàng | **Then chốt** | Quan trọng | Quan trọng | Quan trọng |
| Y tế | Then chốt | **Then chốt** | Then chốt | Quan trọng |
| Xây dựng | Quan trọng | **Then chốt (bề rộng)** | Quan trọng | Ít then chốt |
| Giáo dục | Quan trọng | **Then chốt** | **Then chốt** | Ít then chốt |
| Du lịch | Quan trọng | Quan trọng | **Then chốt** | Ít then chốt |
| FMCG | Quan trọng | Quan trọng | Quan trọng | **Then chốt** |
| Logistics | **Then chốt** | Quan trọng | Quan trọng | Quan trọng |
| Bán lẻ | **Then chốt** | Quan trọng | Ít then chốt | Quan trọng |
| Fintech | **Then chốt** | Quan trọng | Quan trọng | Quan trọng |
| Phần mềm | Ít then chốt | **Then chốt (bề rộng)** | **Then chốt** | Ít then chốt |
| Lifestyle | Quan trọng | Quan trọng | **Then chốt** | Quan trọng |
| Trang sức | Quan trọng | **Then chốt** | **Then chốt** | Quan trọng |

### 6.4 — Khung đo lường

Nếu bạn sẽ đầu tư liên quan AIO, đo nó. Sau đây là khung đo lường tối thiểu:

1. **Track tỷ lệ xuất hiện AIO mỗi truy vấn.** Chạy công cụ tracking SERP (DataForSEO, BrightLocal, scraper tự xây) đủ định kỳ để bắt truy vấn nào trả AIO và truy vấn nào không.
2. **Track thị phần trích cho domain bạn.** Cho truy vấn có AIO trong tập tracking, bao nhiêu phần trăm trích domain bạn? So với top đối thủ.
3. **Track trạng thái sitelinks cho trang đỉnh.** Google Search Console → Performance → cấp trang. Trang có sitelinks (hiển thị như link bổ sung dưới kết quả chính) nên được flag riêng.
4. **Track mật độ trích.** Trích / truy vấn được trích khác nhau. Mật độ trên 3 nghĩa là domain bạn được trích nhiều lần cho cùng truy vấn — dấu hiệu uy quyền sâu. Mật độ gần 1 nghĩa là bề rộng không độ sâu.
5. **Track tỷ lệ xuất hiện AIO theo độ dài truy vấn.** Bạn có đầu tư quá vào tối ưu từ khóa chính nơi sự xuất hiện AIO thấp hơn?
6. **Track trùng lặp top-10 cho ngành bạn.** Trùng lặp 67% của y tế nghĩa là AIO theo rank; 47% của du lịch nghĩa là AIO theo nội dung. Biết con số ngành bạn cho biết bao nhiêu đầu tư nên đi vào xếp hạng so với uy quyền cấu trúc.

### 6.5 — Checklist operator 90 ngày

Cho marketing hoặc lãnh đạo SEO ở thương hiệu Việt Nam tầm trung, đây là kế hoạch 90 ngày cụ thể để bắt đầu di chuyển trên AIO:

**Ngày 1–14 (Audit):**
- Chạy pull tracking SERP cho 200 truy vấn đại diện cho tập tracked của bạn.
- Xác định truy vấn nào trả AIO (tập có AIO của bạn) và truy vấn nào không.
- Cho mỗi truy vấn có AIO, xác định domain nào AIO trích (top 10 trích mỗi ngành).
- Xác định tỷ lệ trích site hiện tại của bạn và tỷ lệ của top 3 đối thủ.

**Ngày 15–30 (Chẩn đoán):**
- Cho top 3 đối thủ với thị phần trích cao, xem xét cấu trúc site họ về sitelinks, độ sâu, và topology nội dung.
- Cho mỗi truy vấn citation-gap (nơi bạn rank nhưng không được trích), xác định đặc trưng cấu trúc của URL được trích (độ dài, sitelinks, structured data, độ sâu breadcrumb).
- Thiết lập metric baseline: số sitelinks, tỷ lệ trích, mật độ trích.

**Ngày 31–60 (Xây):**
- Nếu sitelinks thiếu trên trang chính: tái cấu trúc phân cấp navigation site và internal linking để làm navigation hiển thị với Google.
- Nếu ngành bạn phân mảnh (xây dựng, phần mềm, giáo dục, du lịch): bắt đầu sprint nội dung bề rộng nhắm 30+ truy vấn đuôi dài trong subfield bạn.
- Nếu ngành bạn tập trung (ngân hàng, y tế, trang sức): chọn một định vị core và xây nội dung độ sâu xung quanh nó (8–12 bài chất lượng).
- Triển khai structured data phù hợp ngành bạn (FinancialProduct, MedicalCondition, Trip, Product, vv.).

**Ngày 61–90 (Lặp):**
- Chạy lại tracking SERP trên cùng 200 truy vấn. So tỷ lệ trích, trạng thái sitelinks, tỷ lệ xuất hiện AIO với baseline.
- Xác định động thái nào di chuyển kim đồng hồ và nhân đôi. Xác định cái nào không và phân bổ lại.
- Quyết định: domain bạn đang trên trajectory tăng thị phần trích (tỷ lệ trích +20% so với baseline), trung tính, hay suy giảm? Nếu suy giảm, leo thang đến review điều hành — đây là vấn đề chiến lược, không phải chiến thuật.

### 6.6 — Đừng làm gì

Danh sách ngắn các động thái hấp dẫn nhưng không có cơ sở dữ liệu để tránh:

- **Đừng viết nội dung "tối ưu AIO" chung chung.** AIO không thưởng nội dung viết riêng cho AIO; nó thưởng nội dung uy tín, có cấu trúc tốt, và khám phá được. Khung quan trọng là "tôi đang viết cho user" không phải "tôi đang viết cho AIO."
- **Đừng trả tiền cho dịch vụ trích AIO.** Vài agency ở Việt Nam giờ bán gói "tối ưu xếp hạng AIO". Dữ liệu không hỗ trợ can thiệp cấp trang cụ thể nhất quán di chuyển tỷ lệ trích. Động thái 1 (sitelinks) là công việc cấu trúc, nhiều tháng mà không lối tắt nào thay thế.
- **Đừng kết luận AIO đang giết traffic của bạn và dừng đầu tư SEO.** SEO tiếp tục hoạt động. AIO thay đổi nội dung nào nhận traffic, nhưng nội dung được rank tốt, được trích tốt vẫn thắng. Phản ứng đúng là đầu tư vào nội dung chất lượng trích, không phải rút khỏi organic.
- **Đừng dừng dùng hạ tầng tracking SERP agency bạn đã chạy.** Ngay cả dữ liệu SERP không hoàn hảo còn hữu ích hơn không có dữ liệu — và chất lượng dữ liệu chỉ cải thiện khi nhiều snapshot định kỳ tích lũy.
- **Đừng kỳ vọng kết quả qua đêm.** Các động thái cấu trúc khuyến nghị ở đây (sitelinks, độ sâu, bề rộng đuôi dài) cộng dồn qua nhiều tháng. Chu kỳ 90 ngày là chân trời đánh giá hữu ích tối thiểu.

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
