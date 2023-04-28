$(document).ready(function () {
  const mobileMenu = document.querySelector(".header-mobile");
  const burgerBtn = document.querySelector(".burger-btn");

  burgerBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("header-menu-active");
    burgerBtn.classList.toggle("btn-clicked");
  });

  //Анимация
  // AOS.init();

  //Убрать ховеры и анимации на меленьких экранах
});
