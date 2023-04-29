// Load the Swiper library from the CDN
const swiperUrl = "https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js";

// Create a script element to load the library
const swiperScript = document.createElement("script");
swiperScript.src = swiperUrl;
swiperScript.async = true;

// Attach the script element to the document's head
document.head.appendChild(swiperScript);

// When the script has finished loading, create a new Swiper instance
swiperScript.onload = function () {
  const swiper = new Swiper('.swiper', {
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: true,

    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    keyboard: {
      enabled: true,
    },
  });
};
