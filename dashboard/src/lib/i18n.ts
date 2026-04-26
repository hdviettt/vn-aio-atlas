// Translations for the dashboard. Keep keys flat and stable; both
// languages must have every key.

export type Lang = "en" | "vi";

export const SUPPORTED_LANGS: Lang[] = ["en", "vi"];

export function isLang(v: string | undefined): v is Lang {
  return v === "en" || v === "vi";
}

type Strings = Record<string, { en: string; vi: string }>;

export const t: Strings = {
  // Header / filter
  header_eyebrow: {
    en: "atlas · preliminary findings",
    vi: "atlas · kết quả sơ bộ",
  },
  header_title: {
    en: "Vietnam AI Overview Atlas",
    vi: "Atlas AI Overview Việt Nam",
  },
  header_lede: {
    en: "An empirical study of how Google's AI Overviews behave on Vietnamese commercial search, backed by",
    vi: "Nghiên cứu thực nghiệm về cách AI Overviews của Google hoạt động trên thị trường tìm kiếm thương mại Việt Nam, dựa trên",
  },
  header_lede_q: {
    en: "query observations and",
    vi: "lượt quan sát truy vấn và",
  },
  header_lede_c: {
    en: "citation events from December 2025 through April 2026.",
    vi: "lượt trích nguồn từ tháng 12/2025 đến tháng 4/2026.",
  },

  filter_all: {
    en: "all verticals",
    vi: "tất cả ngành",
  },
  filter_viewing: {
    en: "viewing:",
    vi: "đang xem:",
  },

  stat_rows: { en: "rows", vi: "dòng" },
  stat_aio_positive: { en: "aio-positive", vi: "có aio" },
  stat_aio_subtotal: { en: "of total", vi: "tổng số" },
  stat_distinct_queries: { en: "distinct queries", vi: "truy vấn khác nhau" },
  stat_brand_projects: { en: "brand projects", vi: "dự án thương hiệu" },
  stat_verticals: { en: "verticals", vi: "ngành" },
  stat_citations: { en: "citations", vi: "lượt trích" },
  stat_citations_sub: {
    en: "across all AIO answers",
    vi: "trên tất cả câu trả lời AIO",
  },
  stat_from: { en: "from", vi: "từ" },
  stat_to: { en: "to", vi: "đến" },

  // F1
  f1_eyebrow: { en: "finding 1", vi: "phát hiện 1" },
  f1_title: {
    en: "AI Overviews appear 2.5× more often on long-tail queries than head terms",
    vi: "AI Overview xuất hiện gấp 2.5 lần trên truy vấn dài so với từ khóa chính",
  },
  f1_takeaway: {
    en: "Queries of 10+ words get an AI Overview 80.8% of the time; 1–2 word queries only 32.8%. The relationship is monotonic across all five buckets — long-tail queries are the AIO-rich tail of Vietnamese commercial search.",
    vi: "Truy vấn từ 10 từ trở lên có AI Overview ở 80.8% trường hợp; truy vấn 1–2 từ chỉ 32.8%. Mối quan hệ tăng đều qua cả năm nhóm — truy vấn dài chính là phần đậm đặc AIO của tìm kiếm thương mại Việt Nam.",
  },
  f1_y_label: {
    en: "AIO presence rate (%)",
    vi: "Tỷ lệ xuất hiện AIO (%)",
  },

  // F2
  f2_eyebrow: { en: "finding 2", vi: "phát hiện 2" },
  f2_title: {
    en: "40% of AI Overview citations come from outside the organic top 10",
    vi: "40% trích nguồn AI Overview đến từ ngoài top 10 organic",
  },
  f2_takeaway: {
    en: "Across 153K AIO-positive SERPs, an average AIO cites 7.4 distinct domains; only 4.3 of those rank in the organic top 10. The remaining 40% come from lower ranks or aren't ranked organically for that query at all.",
    vi: "Trên 153 nghìn SERP có AIO, một AIO trung bình trích 7.4 domain khác nhau; chỉ 4.3 trong số đó nằm trong top 10 organic. 40% còn lại đến từ thứ hạng thấp hơn hoặc thậm chí không xếp hạng cho truy vấn đó.",
  },
  f2_rows_analyzed: { en: "rows analyzed", vi: "số dòng phân tích" },
  f2_avg_cited: { en: "avg cited / query", vi: "trích trung bình / truy vấn" },
  f2_avg_overlap: { en: "avg overlap", vi: "trùng lặp trung bình" },
  f2_pct_top10: { en: "% in top-10", vi: "% trong top-10" },

  // F3
  f3_eyebrow: { en: "finding 3", vi: "phát hiện 3" },
  f3_title: {
    en: "Banks own their queries deeply. UGC platforms get cited thinly.",
    vi: "Ngân hàng sở hữu sâu các truy vấn. Nền tảng UGC bị trích nông.",
  },
  f3_takeaway: {
    en: "Citation density (citations / distinct keywords) splits cleanly: Vietnamese banks like Techcombank (4.71) and MB (4.39) are cited multiple times within the same AI Overview answer. Facebook (1.87) and YouTube (1.65) appear in many SERPs but rarely cited deeply — a measurable AIO devaluation of UGC content.",
    vi: "Mật độ trích nguồn (số lần trích / số từ khóa) tách thành hai cụm rõ rệt: ngân hàng Việt Nam như Techcombank (4.71) và MB (4.39) được trích nhiều lần trong cùng một câu trả lời AIO. Facebook (1.87) và YouTube (1.65) xuất hiện trên nhiều SERP nhưng hiếm khi được trích sâu — một sự xuống giá đo lường được của nội dung UGC trong AIO.",
  },
  f3_x_label: { en: "AIO citations", vi: "Lượt trích AIO" },

  // F4
  f4_eyebrow: { en: "finding 4", vi: "phát hiện 4" },
  f4_title: {
    en: "AI Overview length is roughly stable over five months",
    vi: "Độ dài AI Overview gần như ổn định trong năm tháng",
  },
  f4_takeaway: {
    en: "Weekly average AIO length drifted from ~4,300 chars to ~4,200 chars (−2.8%) over December 2025 → April 2026. Real but small. Reported as a null finding.",
    vi: "Độ dài AIO trung bình theo tuần giảm từ ~4.300 ký tự xuống ~4.200 ký tự (−2.8%) từ tháng 12/2025 đến tháng 4/2026. Có thật nhưng nhỏ. Báo cáo như một kết quả null.",
  },

  // F5
  f5_eyebrow: { en: "finding 5", vi: "phát hiện 5" },
  f5_title: {
    en: "AIO presence varies dramatically by client vertical",
    vi: "Sự xuất hiện AIO khác biệt rõ rệt theo ngành khách hàng",
  },
  f5_takeaway: {
    en: "Education (83%), healthcare (81%), and banking (77%) trigger AI Overviews far more than retail (34%) or construction (48%). Information-heavy verticals are AIO-saturated; commercial / transactional verticals are not.",
    vi: "Giáo dục (83%), y tế (81%), và ngân hàng (77%) kích hoạt AI Overview nhiều hơn hẳn so với bán lẻ (34%) hay xây dựng (48%). Các ngành nặng thông tin bão hòa AIO; các ngành thương mại / giao dịch thì không.",
  },
  f5_x_label: { en: "AIO presence (%)", vi: "Tỷ lệ AIO (%)" },

  // F6
  f6_eyebrow: { en: "finding 6", vi: "phát hiện 6" },
  f6_title: {
    en: "Each vertical has its own AIO citation hierarchy",
    vi: "Mỗi ngành có thứ bậc trích nguồn AIO riêng",
  },
  f6_takeaway: {
    en: "The top cited domains within each vertical reveal who owns AIO citations in their market. Banks dominate banking; Long Châu / Vinmec / Medlatec dominate healthcare; GHN / Viettel Post / GHTK own logistics.",
    vi: "Các domain được trích nhiều nhất trong từng ngành cho biết ai đang sở hữu AIO ở thị trường đó. Ngân hàng thống trị ngân hàng; Long Châu / Vinmec / Medlatec thống trị y tế; GHN / Viettel Post / GHTK sở hữu logistics.",
  },

  // F7
  f7_eyebrow: { en: "finding 7", vi: "phát hiện 7" },
  f7_title: {
    en: "Citation concentration varies dramatically by vertical",
    vi: "Mức độ tập trung trích nguồn khác biệt rõ rệt theo ngành",
  },
  f7_takeaway: {
    en: "In jewelry and healthcare, the top 10 domains capture ~46–49% of all AIO citations — concentrated markets. In construction and software, the top 10 only capture 13–15% — long-tail markets. The same SEO playbook can't work in both.",
    vi: "Trong trang sức và y tế, top 10 domain chiếm ~46–49% tổng số trích nguồn AIO — thị trường tập trung. Trong xây dựng và phần mềm, top 10 chỉ chiếm 13–15% — thị trường đuôi dài. Một kịch bản SEO không thể áp dụng cho cả hai.",
  },
  f7_x_label: {
    en: "% of citations going to top 10 domains",
    vi: "% lượt trích vào top 10 domain",
  },

  // F8
  f8_eyebrow: { en: "finding 8", vi: "phát hiện 8" },
  f8_title: {
    en: "In long-tail verticals, ranking organically isn't enough",
    vi: "Ở các ngành đuôi dài, xếp hạng organic là chưa đủ",
  },
  f8_takeaway: {
    en: "The global F2 number (59% AIO ↔ top-10 overlap) hides a clean split. Healthcare (67%), banking (61%): AIO mostly cites organic top-10. Tourism (47%), education (51%): AIO reaches well outside top-10 to find sources.",
    vi: "Con số F2 toàn cục (59% trùng AIO ↔ top-10) che giấu một sự phân hóa rõ rệt. Y tế (67%), ngân hàng (61%): AIO chủ yếu trích từ top-10 organic. Du lịch (47%), giáo dục (51%): AIO vươn ra ngoài top-10 để tìm nguồn.",
  },
  f8_x_label: {
    en: "% of AIO citations also in organic top-10",
    vi: "% trích AIO cũng nằm trong top-10 organic",
  },

  // F9
  f9_eyebrow: { en: "finding 9", vi: "phát hiện 9" },
  f9_title: {
    en: "Sitelinks are the single largest signal of AIO citation",
    vi: "Sitelinks là tín hiệu mạnh nhất cho việc được trích AIO",
  },
  f9_takeaway: {
    en: "URLs with sitelinks are cited 3.1× more often than URLs without (13.2% vs 4.2%). Cited URLs rank ~5 positions higher on average (rank 8.5 vs 13.5). Title and description length differences are tiny (~3%) and not the lever to pull.",
    vi: "URL có sitelinks được trích nhiều gấp 3.1 lần URL không có (13.2% so với 4.2%). URL được trích xếp hạng cao hơn trung bình ~5 vị trí (rank 8.5 so với 13.5). Khác biệt về độ dài tiêu đề và mô tả rất nhỏ (~3%) — không phải đòn bẩy nên kéo.",
  },
  f9_caption: {
    en: "Sample: 10,000 random AIO-positive SERPs → 179,201 organic URLs (45,878 cited, 133,323 uncited). has_price excluded due to a known SQL extraction bug; fix landed in pull.py for the next refresh.",
    vi: "Mẫu: 10.000 SERP có AIO ngẫu nhiên → 179.201 URL organic (45.878 được trích, 133.323 không trích). has_price bị loại do lỗi trích xuất SQL đã biết; bản sửa đã vào pull.py cho lần làm mới tiếp theo.",
  },
  f9_label_cited: { en: "cited", vi: "có trích" },
  f9_label_uncited: { en: "uncited", vi: "không trích" },

  // Per-vertical view banner
  vertical_banner_prefix: {
    en: "Filtering all findings to vertical:",
    vi: "Đang lọc tất cả kết quả theo ngành:",
  },
  vertical_banner_clear: {
    en: "← back to all verticals",
    vi: "← quay lại tất cả ngành",
  },

  // Footer
  footer_intro: {
    en: "Workspace led by",
    vi: "Workspace được dẫn dắt bởi",
  },
  footer_role: {
    en: "(AI lead at",
    vi: "(AI lead tại",
  },
  footer_after_role: {
    en: "). Dataset is SEONGON's; methodology and analysis are mine.",
    vi: "). Dữ liệu thuộc SEONGON; phương pháp và phân tích là của tôi.",
  },
  footer_code: { en: "Code:", vi: "Mã nguồn:" },
  footer_findings: { en: "Findings doc:", vi: "Tài liệu kết quả:" },
};

export function tx(lang: Lang, key: keyof typeof t): string {
  return t[key]?.[lang] ?? t[key]?.en ?? key;
}
