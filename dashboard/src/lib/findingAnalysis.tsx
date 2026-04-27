import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";

/**
 * Finding-by-finding "what this means" + "method note" content. Kept
 * separate from i18n.ts so this lives where it's read (page.tsx) and
 * the i18n module stays a flat dictionary.
 *
 * Each entry is data-grounded: claims here can be derived directly
 * from the finding's chart. No speculation beyond what the numbers
 * support.
 */

type Bilingual = { en: string; vi: string };
type FindingId =
  | "f1"
  | "f2"
  | "f3"
  | "f4"
  | "f5"
  | "f6"
  | "f7"
  | "f8"
  | "f9"
  | "f10"
  | "f11"
  | "f12"
  | "f13";

type Entry = {
  meaning: Bilingual;
  method: Bilingual;
};

const data: Record<FindingId, Entry> = {
  f1: {
    meaning: {
      en: "Long-tail queries (10+ words) are essentially AIO-default; short queries trigger an AIO less than half the time. The implication is structural: an SEO program weighted toward high-volume head terms is increasingly competing for SERP real estate that AIO is taking away. Long-tail content optimized for citation is the more efficient surface to invest in — both because AIO is more likely to appear and because the citation pool is less crowded.",
      vi: "Truy vấn đuôi dài (10+ từ) gần như luôn kích hoạt AIO; truy vấn ngắn thì chưa đến nửa. Hệ quả mang tính cấu trúc: một chương trình SEO tập trung vào từ khóa volume cao đang ngày càng phải cạnh tranh với chính AIO trên SERP. Nội dung đuôi dài tối ưu để được trích dẫn là mặt phẳng đầu tư hiệu quả hơn — vừa vì AIO có khả năng xuất hiện cao hơn, vừa vì pool trích dẫn ít chen chúc hơn.",
    },
    method: {
      en: "AIO presence rate = % of distinct (query × snapshot) observations where an AIO answer was detected. Buckets are query word counts; \"10+\" includes any query with 10 or more words.",
      vi: "Tỷ lệ AIO = % các quan sát (truy vấn × snapshot) duy nhất mà phát hiện AIO. Nhóm chia theo số từ trong truy vấn; \"10+\" gồm truy vấn ≥10 từ.",
    },
  },

  f2: {
    meaning: {
      en: "Roughly six in ten AIO citations route to URLs that aren't in the organic top-10 for that query. That's a structural break from the SEO playbook of the last decade — page-1 ranking was the proxy for visibility; for AIO citation, it's necessary but no longer sufficient. The relevance signal AIO uses is correlated with classical Google ranking, but distinct from it. Practically: a winning AIO strategy is not just a winning SEO strategy run harder.",
      vi: "Khoảng 6/10 trích dẫn AIO đi đến URL không có mặt trong top-10 organic của truy vấn đó. Đây là một đứt gãy có tính cấu trúc với playbook SEO trong thập kỷ qua — xếp hạng trang 1 từng là đại diện cho khả năng hiển thị; đối với trích dẫn AIO, nó vẫn cần thiết nhưng không còn đủ. Tín hiệu liên quan mà AIO dùng có tương quan, nhưng khác biệt với, điểm xếp hạng truyền thống. Nói thẳng: chiến lược AIO thắng không phải chiến lược SEO thắng được chạy mạnh hơn.",
    },
    method: {
      en: "Top-10 = the first 10 organic results below AIO/featured snippets/sitelinks/ads. \"pct_cited_in_top10\" is the share of AIO-cited URLs that also appear in this band; the complement is the outside-top-10 share shown in the chart.",
      vi: "Top-10 = 10 kết quả organic đầu tiên (loại trừ AIO/featured snippet/sitelinks/ads). \"pct_cited_in_top10\" là tỷ lệ URL được AIO trích cũng xuất hiện trong dải này; phần bù chính là thị phần ngoài top-10 trong biểu đồ.",
    },
  },

  f3: {
    meaning: {
      en: "The leaderboard tells a topical-authority story. Banking and pharma anchor the top because Vietnamese commercial search is heavy in those verticals AND because deep-domain content is harder to substitute. Volume-leader sites like Facebook and YouTube under-perform on a per-query basis: cited often, but spread across many distinct queries. Citation density (citations divided by distinct queries) is the metric that separates \"broadly cited\" from \"specifically authoritative.\"",
      vi: "Bảng xếp hạng kể câu chuyện về uy tín chuyên ngành. Ngân hàng và dược phẩm đứng đầu vì tìm kiếm thương mại Việt Nam tập trung nhiều ở các ngành này VÀ vì nội dung chuyên sâu khó thay thế. Các domain volume-leader như Facebook và YouTube kém hiệu quả khi tính theo từng truy vấn: được trích nhiều nhưng dàn trải. Mật độ trích dẫn (số lượt trích / truy vấn riêng biệt) phân biệt \"trích nhiều\" với \"uy tín cụ thể\".",
    },
    method: {
      en: "Citation density = total citations ÷ distinct queries cited on. Filtered to domains with ≥30 distinct queries to avoid one-hit specialists skewing the ranking.",
      vi: "Mật độ trích = tổng lượt trích ÷ số truy vấn riêng biệt mà domain xuất hiện. Lọc domain có ≥30 truy vấn để tránh các trường hợp ngẫu nhiên làm lệch bảng xếp hạng.",
    },
  },

  f4: {
    meaning: {
      en: "Stability is the headline. Across 5 months, weekly AIO answer length (avg, p50, p90) has barely moved. This suggests Google's content shape for AIO is mature — not in active product iteration. For practitioners, it's a useful planning anchor: assume the current AIO length norms (around 1,200 chars on average, 1,800+ at p90) will hold over the next planning cycle. Where AIO is changing right now is in coverage (which queries surface AIO) and in citation share, not in the shape of the answer itself.",
      vi: "Tính ổn định là tiêu điểm. Trong 5 tháng, độ dài AIO theo tuần (avg, p50, p90) gần như không đổi. Điều này gợi ý cấu trúc nội dung AIO của Google đã trưởng thành — không còn trong giai đoạn lặp tích cực. Đối với nhà thực hành, đây là điểm neo lập kế hoạch: giả định chuẩn độ dài AIO hiện tại (khoảng 1,200 ký tự trung bình, 1,800+ ở p90) sẽ duy trì qua chu kỳ lập kế hoạch tiếp theo. Nơi AIO đang thay đổi hiện tại là phạm vi (truy vấn nào kích hoạt AIO) và thị phần trích, không phải cấu trúc của câu trả lời.",
    },
    method: {
      en: "Length = markdown character count of the AIO answer body, excluding the rendered text of cited URL anchors. p50 / avg / p90 are weekly aggregates over all AIO-positive observations in the corpus.",
      vi: "Độ dài = số ký tự markdown của thân câu trả lời AIO, không tính text của URL trích. p50 / avg / p90 là tổng hợp theo tuần trên toàn bộ dòng AIO-positive trong corpus.",
    },
  },

  f5: {
    meaning: {
      en: "A ~50pp spread between vertical extremes means there is no single GEO playbook. Information-heavy verticals — banking, healthcare — where Google is comfortable summarizing get AIO almost everywhere. Commercial verticals where Google must hedge legal, health, or financial risk get AIO much less. Plan AIO investment around the verticals you actually serve, not the corpus-wide mean. Two organizations operating in different verticals can both run \"a smart GEO program\" and end up at completely different opportunity sizes.",
      vi: "Khoảng cách ~50pp giữa hai cực ngành nghĩa là không tồn tại playbook GEO duy nhất. Các ngành nặng thông tin — ngân hàng, y tế — nơi Google thoải mái tóm tắt thì có AIO ở hầu khắp. Các ngành thương mại nơi Google phải dè dặt với rủi ro pháp lý, y tế, tài chính thì có AIO ít hơn nhiều. Lập kế hoạch đầu tư AIO theo ngành bạn thực sự phục vụ, không phải theo trung bình toàn corpus. Hai tổ chức hoạt động ở các ngành khác nhau cùng chạy \"chương trình GEO thông minh\" có thể kết thúc ở quy mô cơ hội hoàn toàn khác nhau.",
    },
    method: {
      en: "Filtered to verticals with ≥1K rows for statistical stability. Same metric as F1: % of (query × snapshot) observations within the vertical where an AIO was detected.",
      vi: "Lọc các ngành có ≥1K dòng để đảm bảo ổn định thống kê. Cùng metric như F1: % quan sát (truy vấn × snapshot) trong ngành có phát hiện AIO.",
    },
  },

  f6: {
    meaning: {
      en: "Within each vertical, citation leaders are often domain-specialists, not the global top-3. This is the long-tail-of-authority pattern: dominate one vertical with deep, specialized content and you can lead AIO citation share inside that category without needing large cross-domain brand presence. The corollary for new entrants is a cleaner playbook than \"compete on everything\" — pick one vertical, win it on depth, expand later.",
      vi: "Trong mỗi ngành, đứng đầu trích dẫn thường là chuyên gia của ngành, không phải top-3 toàn cục. Đây là pattern \"uy tín đuôi dài\": thống trị một ngành bằng nội dung chuyên sâu và bạn có thể dẫn đầu thị phần trích AIO trong nhóm đó mà không cần thương hiệu xuyên ngành lớn. Hệ quả cho người mới gia nhập là một playbook sạch hơn \"cạnh tranh mọi thứ\" — chọn một ngành, thắng bằng chiều sâu, rồi mở rộng.",
    },
    method: {
      en: "Top 5 by raw citation count per vertical, then ranked. No filter on global domain authority — small specialists appear here if they win on citation count within the vertical.",
      vi: "Top 5 theo số lượt trích thô trong từng ngành, rồi xếp hạng. Không lọc theo độ uy tín domain toàn cục — chuyên gia nhỏ vẫn xuất hiện nếu thắng theo số lượt trích trong ngành.",
    },
  },

  f7: {
    meaning: {
      en: "When a vertical's top-10 takes more than 90% of citations, the market is essentially closed for new entrants — citation share is locked. When it takes less than 50%, share is up for grabs and small-domain GEO investment can pay off. The strategic question is binary: are you in a closed market or an open one? This single number probably matters more than any other for GEO budget allocation, because it tells you whether incremental effort can move the citation needle at all.",
      vi: "Khi top-10 của ngành chiếm hơn 90% lượt trích, thị trường gần như đã đóng với người mới — thị phần trích đã bị khóa. Khi chỉ chiếm dưới 50%, thị phần còn để giành và đầu tư GEO của các domain nhỏ có thể có lãi. Câu hỏi chiến lược mang tính nhị phân: bạn đang ở thị trường đóng hay mở? Con số này có thể quan trọng hơn bất kỳ yếu tố nào khác để phân bổ ngân sách GEO, vì nó cho biết liệu nỗ lực gia tăng có thể dịch chuyển kim chỉ trích dẫn hay không.",
    },
    method: {
      en: "Top-10 share = sum of citations going to the 10 most-cited domains in the vertical, divided by total citations in that vertical. Computed over the full study window.",
      vi: "Thị phần top-10 = tổng lượt trích đến 10 domain được trích nhiều nhất trong ngành, chia cho tổng lượt trích của ngành. Tính trên toàn bộ cửa sổ nghiên cứu.",
    },
  },

  f8: {
    meaning: {
      en: "This is F2 (citations outside top-10) split by vertical. Where AIO/top-10 overlap is low — around 30% — AIO is reaching past the organic top-10 frequently, meaning even a high-ranking site can be invisible to AIO citation. In those verticals, traditional SEO won't capture AIO citation share alone; you need to specifically optimize for citation likelihood. The signal-level evidence for what \"specifically optimize\" looks like is in F9 (overall) and F11 (per-vertical).",
      vi: "Đây là F2 (trích ngoài top-10) chia theo ngành. Nơi tỷ lệ trùng AIO/top-10 thấp — khoảng 30% — AIO thường vươn ra ngoài top-10 organic, nghĩa là ngay cả site xếp hạng cao cũng có thể không được AIO trích. Ở các ngành đó, SEO truyền thống một mình không đủ để giành thị phần trích AIO; bạn cần tối ưu cụ thể cho khả năng được trích. Bằng chứng ở mức tín hiệu cho biết \"tối ưu cụ thể\" trông như thế nào nằm ở F9 (toàn cục) và F11 (theo ngành).",
    },
    method: {
      en: "% of AIO-cited URLs in the vertical that also appear in the organic top-10 for the same query. Computed per vertical over all AIO-positive observations with ≥30 in the vertical.",
      vi: "% URL được AIO trích trong ngành cũng xuất hiện trong top-10 organic cho cùng truy vấn. Tính theo ngành trên toàn bộ quan sát AIO-positive có ≥30 trong ngành.",
    },
  },

  f9: {
    meaning: {
      en: "Strong organic signals — sitelinks, ratings, structured data — correlate with higher AIO citation probability. Directionality matters: sitelinks don't cause AIO citation, but the same domains earning sitelinks tend to be cited more often. Treat these features as proxies for the overall authority signal AIO is sensitive to. The practical recommendation isn't \"engineer sitelinks into your SERP\" — it's the underlying authority work that earns sitelinks in the first place. Investments that compound across SEO and GEO simultaneously are the most efficient ones.",
      vi: "Tín hiệu organic mạnh — sitelinks, rating, structured data — có tương quan với xác suất được AIO trích cao hơn. Hướng quan hệ quan trọng: sitelinks không gây ra trích AIO, nhưng các domain có sitelinks thường được trích nhiều hơn. Xem các đặc trưng này như đại diện cho tín hiệu uy tín tổng thể mà AIO nhạy cảm. Khuyến nghị thực tế không phải \"chế ra sitelinks trong SERP của bạn\" — đó là công việc uy tín nền tảng tạo ra sitelinks ngay từ đầu. Các khoản đầu tư cộng hưởng đồng thời cho cả SEO và GEO là hiệu quả nhất.",
    },
    method: {
      en: "For each feature, computes the mean among cited URLs vs the mean among uncited URLs (in the same SERP query universe). Relative diff = (cited − uncited) ÷ uncited × 100. A diff of +50% means cited URLs score 1.5× the uncited mean.",
      vi: "Với mỗi đặc trưng, tính trung bình trên URL được trích so với trung bình trên URL không được trích (trong cùng tập truy vấn SERP). Chênh lệch tương đối = (cited − uncited) ÷ uncited × 100. Chênh +50% nghĩa là URL được trích ghi điểm 1.5× trung bình URL không được trích.",
    },
  },

  f10: {
    meaning: {
      en: "Healthcare AIOs are 2–3× longer than jewelry AIOs and cite more sources. The likely cause: Google holds a higher truth-bar for medical and financial answers — more text, more citations, more hedging. The operational implication: in verbose-AIO verticals, your content needs more substantive depth than competitors to clear the threshold AIO is using to summarize. Skimpy content in healthcare or banking is doubly disadvantaged — first it doesn't rank, then if it ranks it doesn't get cited.",
      vi: "AIO ngành y tế dài gấp 2-3 lần AIO trang sức và trích nhiều nguồn hơn. Nguyên nhân khả dĩ: Google đặt ngưỡng độ chân thực cao hơn cho câu trả lời y tế và tài chính — nhiều text, nhiều trích, nhiều dè dặt. Hệ quả vận hành: trong các ngành AIO dài dòng, nội dung của bạn cần có chiều sâu thực chất hơn đối thủ để vượt qua ngưỡng AIO dùng để tóm tắt. Nội dung sơ sài trong y tế hay ngân hàng bị thiệt thòi kép — đầu tiên không xếp hạng, nếu xếp hạng thì không được trích.",
    },
    method: {
      en: "avg_md_chars and avg_refs_per_aio aggregated per vertical across all AIO-positive observations. Excludes verticals with <50 AIO observations.",
      vi: "avg_md_chars và avg_refs_per_aio tổng hợp theo ngành trên toàn bộ quan sát AIO-positive. Loại các ngành có <50 quan sát AIO.",
    },
  },

  f11: {
    meaning: {
      en: "A single signal — sitelinks, rating, price markup — does not have uniform weight across verticals. Banking values different things than lifestyle. Use the heatmap as a directional pointer to where investment in a given signal is likely to compound, not as a recipe. As a rough rule, cells where the diff exceeds 30% (cited-favoring direction) are reasonable bets; below 10%, the signal is closer to noise. The strongest cell on the board — sitelinks in banking — is what every banking domain should be optimizing toward first.",
      vi: "Một tín hiệu — sitelinks, rating, đánh dấu giá — không có trọng số đồng nhất giữa các ngành. Ngân hàng coi trọng những thứ khác với lifestyle. Dùng heatmap như chỉ hướng cho biết đầu tư vào một tín hiệu cụ thể có khả năng cộng hưởng ở đâu, không phải công thức. Quy tắc thô: ô có chênh vượt 30% (theo hướng có lợi cho cited) là khả thi; dưới 10%, tín hiệu gần như nhiễu. Ô mạnh nhất trên bảng — sitelinks trong ngân hàng — là cái mọi domain ngân hàng nên tối ưu đầu tiên.",
    },
    method: {
      en: "Each cell = relative_diff_pct = (cited mean − uncited mean) ÷ uncited mean × 100. Rank-style features (avg_rank_absolute) and price are inverted in display so that lower raw values — better — render as positive cells.",
      vi: "Mỗi ô = relative_diff_pct = (trung bình cited − trung bình uncited) ÷ trung bình uncited × 100. Đặc trưng dạng xếp hạng (avg_rank_absolute) và price được đảo dấu khi hiển thị để giá trị thô thấp — tốt hơn — hiện thành ô dương.",
    },
  },

  f12: {
    meaning: {
      en: "Across 5 months, vertical hierarchies are sticky. The exception — Techcombank's +2.8pp gain in banking AIO share — was the only meaningful movement, suggesting that even small share gains require sustained content effort. Don't expect overnight gains; the citation order is closer to a slow incumbent battle than a fast disruption play. The implication for investment timing: GEO is a multi-quarter game, not a campaign. Returns compound on continuity, not on burst.",
      vi: "Trong 5 tháng, thứ tự ngành rất ổn định. Ngoại lệ — Techcombank tăng +2.8pp thị phần AIO ngân hàng — là dịch chuyển có ý nghĩa duy nhất, gợi ý rằng ngay cả những gain nhỏ cũng cần nỗ lực nội dung liên tục. Đừng kỳ vọng share gains qua đêm; thứ tự trích gần với cuộc chiến lâu dài giữa các incumbent hơn là một cuộc đột phá nhanh. Hệ quả cho thời gian đầu tư: GEO là trận đấu nhiều quý, không phải chiến dịch. Lợi nhuận cộng hưởng theo tính liên tục, không phải theo sự bùng nổ.",
    },
    method: {
      en: "Monthly share = vertical's per-month citations ÷ total monthly citations × 100. Sparkline shows the share trajectory month-over-month; the delta column is last_month − first_month, in percentage points.",
      vi: "Thị phần tháng = lượt trích trong tháng của ngành ÷ tổng lượt trích tháng × 100. Sparkline thể hiện quỹ đạo thị phần theo tháng; cột delta là tháng_cuối − tháng_đầu, đơn vị điểm phần trăm.",
    },
  },

  f13: {
    meaning: {
      en: "Cross-vertical citation leadership is rare. Most top-cited domains lead inside a single vertical — they're domain specialists, not cross-domain authorities. The few domains that appear in the top-5 of multiple verticals are almost always generic platforms (Wikipedia, government sites, large publishers) rather than commercial brands. The strategic implication: don't aim to win citations across every vertical — pick one and dominate it. Cross-vertical reach, when it happens, is a byproduct of being a platform, not of running a clever GEO program.",
      vi: "Lãnh đạo trích dẫn xuyên ngành là hiếm. Hầu hết domain top được trích chỉ dẫn đầu trong một ngành — họ là chuyên gia của ngành, không phải uy tín xuyên ngành. Một vài domain xuất hiện trong top-5 của nhiều ngành gần như luôn là nền tảng chung (Wikipedia, trang chính phủ, nhà xuất bản lớn) thay vì thương hiệu thương mại. Hệ quả chiến lược: đừng nhắm thắng trích dẫn ở mọi ngành — chọn một và thống trị. Phạm vi xuyên ngành, khi xảy ra, là hệ quả của việc là nền tảng, không phải của chương trình GEO khôn khéo.",
    },
    method: {
      en: "Derived from F6 (top-cited per vertical). For each domain that appears in F6's leaderboards, count distinct verticals where its rank_in_vertical ≤ 5. Sort descending. The top of the chart shows domains with the broadest cross-vertical reach.",
      vi: "Suy ra từ F6 (top trích theo ngành). Với mỗi domain có mặt trong các bảng xếp hạng F6, đếm số ngành riêng biệt mà rank_in_vertical ≤ 5. Sắp xếp giảm dần. Đỉnh biểu đồ là domain có phạm vi xuyên ngành rộng nhất.",
    },
  },
};

export function findingMeaning(id: FindingId, lang: Lang): string {
  return data[id].meaning[lang];
}

export function findingMethod(id: FindingId, lang: Lang): string {
  return data[id].method[lang];
}

/**
 * Replace bare "F1"–"F12" references in a sentence with anchor links
 * to the corresponding finding section. Returns a ReactNode array
 * suitable for direct rendering.
 */
export function linkifyFindingRefs(text: string): ReactNode {
  // Match F1–F13 (real anchors); later refs like "F14+" stay as text.
  const parts = text.split(/(\bF(?:[1-9]|1[0-3])\b)/g);
  return parts.map((part, i) => {
    if (/^F(?:[1-9]|1[0-3])$/.test(part)) {
      const id = part.toLowerCase();
      return (
        <a
          key={i}
          href={`#${id}`}
          className="text-accent decoration-line-strong underline-offset-2 hover:underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

