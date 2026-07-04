
document.querySelectorAll(".work").forEach((work, index) => {
  if (!work.id) {
    work.id = `item-${index}`;
  }
});

function scrollToCurrentHashItem() {
  if (!location.hash) return;

  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!target) return;

  requestAnimationFrame(() => {
    target.scrollIntoView({ block: "start" });
  });
}

scrollToCurrentHashItem();
window.addEventListener("hashchange", scrollToCurrentHashItem);


// 画像の遅延読み込み
document.querySelectorAll("img").forEach((img) => {
  img.setAttribute("loading", "lazy");
});

// Swiperがあるページだけ動かす
if (typeof Swiper !== "undefined") {
  document.querySelectorAll(".swiper").forEach((el) => {
    const workEl = el.closest(".work");
    if (!workEl) return;

    const descEl = workEl.querySelector(".slide-description");
    const linkEl = workEl.querySelector(".sw-link");

    new Swiper(el, {
      slidesPerView: 1,
      loop: true,
      on: {
        slideChange: function () {
          const activeSlide = this.slides[this.activeIndex];
          if (!activeSlide) return;

          const title = activeSlide.getAttribute("data-title");
          const url = activeSlide.getAttribute("data-url");

          if (descEl && title) {
            descEl.textContent = title;
          }

          if (linkEl && url) {
            linkEl.href = url;
          }
        },
      },
    });
  });
}

// スクロールしたらサブナビを隠す
const subNav = document.querySelector(".nav-sub");

if (subNav) {
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      subNav.classList.add("hide");
    } else {
      subNav.classList.remove("hide");
    }

    lastScrollY = currentScrollY;
  });
}