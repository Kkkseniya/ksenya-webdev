$(document).ready(function () {
  const mobileMenu = document.querySelector(".header-mobile");
  const burgerBtn = document.querySelector(".burger-btn");

  const signInBtn = document.querySelector(".signin-btn");
  const closeModalBtn = document.querySelector(".modal__close");

  //открытие меню с мобильного устройства
  burgerBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("header-menu-active");
    burgerBtn.classList.toggle("btn-clicked");
  });

  //открытие модального окна
  function openModal() {
    var modalOverlay = $(".modal__overlay");
    var modalDialog = $(".modal__dialog");
    modalOverlay.addClass("modal__overlay--visible");
    modalDialog.addClass("modal__dialog--visible");
  }

  function closeModal(event) {
    event.preventDefault();
    var modalOverlay = $(".modal__overlay");
    var modalDialog = $(".modal__dialog");
    modalOverlay.removeClass("modal__overlay--visible");
    modalDialog.removeClass("modal__dialog--visible");
  }

  signInBtn.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);

  //закрытие модального окна по esc
  document.addEventListener("keyup", function (event) {
    if (event.key === "Escape") {
      document.querySelector(".modal__overlay").classList.remove("modal__overlay--visible");
      document.querySelector(".modal__dialog").classList.remove("modal__dialog--visible");
    }
  });

  //валидация формы
  $(".form").each(function () {
    $(this).validate({
      errorClass: "invalid-modal",
      messages: {
        // email: {
        //   required: "Пожалуйста, укажите ваш email",
        //   email: "Ваш email должен быть в формате name@domain.com",
        // },
        modalEmail: {
          required: "Пожалуйста, укажите email",
          email: "Ваш email должен иметь формат name@domain.com",
        },
        modalPass: {
          required: "Пожалуйста, укажите пароль",
          minlength: "Длина пароля должена быть не менее 5 символов",
          maxlength: "Длина пароля не должна превышать 20 символов",
        },
        // phone: {
        //   required: "Phone is required",
        //   minlength: "The number must be 11 digits long",
        // },
      },
    });
  });

  //Arrow scroll
  const upBtn = document.querySelector(".button-up");

  const show = () => {
    upBtn.classList.remove("button-up--hide");
  };

  const hide = () => {
    upBtn.classList.add("button-up--hide");
  };

  window.addEventListener("scroll", () => {
    // определяем величину прокрутки
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    // если страница прокручена больше чем на 400px, то делаем кнопку видимой, иначе скрываем
    scrollY > 400 ? show() : hide();
  });

  upBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });

  //Анимация
  // AOS.init();
});
