const SEARCH_PAGES = [
  // アニメ
  { url: "an/2dan.html", category: "アニメ", pageName: "2Dアニメ" },
  { url: "an/3dan.html", category: "アニメ", pageName: "3Dアニメ" },
  { url: "an/anime.html", category: "アニメ", pageName: "アニメまとめ" },
  { url: "an/mtan.html", category: "アニメ", pageName: "モーションアニメ" },

  // 動画
  { url: "av/av.html", category: "動画", pageName: "動画まとめ" },
  { url: "av/fc.html", category: "動画", pageName: "FC2" },
  { url: "av/jy.html", category: "動画", pageName: "女優" },
  { url: "av/sn.html", category: "動画", pageName: "その他" },

  // 同人誌
  { url: "dz/dzA.html", category: "同人誌", pageName: "同人誌 A" },
  { url: "dz/dzB.html", category: "同人誌", pageName: "同人誌 B" },
  { url: "dz/dzburuaka.html", category: "同人誌", pageName: "同人誌 ブルアカ" },
  { url: "dz/dzC.html", category: "同人誌", pageName: "同人誌 C" },
  { url: "dz/dzD.html", category: "同人誌", pageName: "同人誌 D" },
  { url: "dz/dzE.html", category: "同人誌", pageName: "同人誌 E" },
  { url: "dz/dzmatome.html", category: "同人誌", pageName: "同人誌まとめ" },
  { url: "dz/dzS.html", category: "同人誌", pageName: "同人誌 S" },

  // 画像
  { url: "gz/2d.html", category: "画像", pageName: "2D" },
  { url: "gz/3d.html", category: "画像", pageName: "Real" },
  { url: "gz/ai.html", category: "画像", pageName: "AI" },
  { url: "gz/cos.html", category: "画像", pageName: "Cosplay" },
  { url: "gz/gazou.html", category: "画像", pageName: "画像まとめ" }
];


const input = document.getElementById("siteSearchInput");
const resultsEl = document.getElementById("siteSearchResults");
const statusEl = document.getElementById("siteSearchStatus");

let searchItems = [];

async function loadSearchData() {
  const items = [];

  for (const page of SEARCH_PAGES) {
    try {
      const response = await fetch(page.url);

      if (!response.ok) {
        console.warn(`${page.url} を読み込めませんでした`);
        continue;
      }

      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");

      doc.querySelectorAll(".work").forEach((work, index) => {
        const name = work.querySelector("h3")?.textContent.trim() || "名称未設定";
        const description = work.querySelector(".slide-description")?.textContent.trim() || "";

        const slideTitles = [...work.querySelectorAll(".swiper-slide")]
          .map((slide) => slide.getAttribute("data-title"))
          .filter(Boolean);

        const titleText = slideTitles.join(" / ");

        items.push({
          name,
          title: titleText,
          description,
          category: page.category,
          pageName: page.pageName,
          pageUrl: page.url,
          itemUrl: `${page.url}#item-${index}`
        });
      });
    } catch (error) {
      console.error(`${page.url} の読み込みに失敗`, error);
    }
  }

  searchItems = items;
  statusEl.textContent = `${searchItems.length}件のデータを読み込みました`;
}

function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, "")
    .normalize("NFKC");
}

function search(keyword) {
  const q = normalizeText(keyword);

  if (!q) {
    resultsEl.innerHTML = "";
    statusEl.textContent = `${searchItems.length}件のデータを読み込みました`;
    return;
  }

  const results = searchItems.filter((item) => {
    const target = normalizeText([
      item.name,
      item.title,
      item.description,
      item.category,
      item.pageName,
      item.pageUrl
    ].join(" "));

    return target.includes(q);
  });

  statusEl.textContent = `${results.length}件見つかりました`;

  resultsEl.innerHTML = results.map((item) => `
    <a class="search-result-card" href="${escapeHtml(item.itemUrl)}">
      <div class="search-result-category">${escapeHtml(item.category)}</div>
      <h2>${escapeHtml(item.name)}</h2>
      <p>${escapeHtml(item.title || item.description || "説明なし")}</p>
      <div class="search-result-location">
        場所：${escapeHtml(item.category)} / ${escapeHtml(item.pageName)}
      </div>
    </a>
  `).join("");
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

input.addEventListener("input", () => {
  search(input.value);
});

loadSearchData();