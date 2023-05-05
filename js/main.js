$(document).ready(function () {
  const mobileMenu = document.querySelector(".header-mobile");
  const burgerBtn = document.querySelector(".burger-btn");

  const signInBtn = document.querySelector(".signin-btn");
  const closeModalBtn = document.querySelector(".modal__close");

  //для вывода нужной статьи в article.html
  const currentUrl = window.location.pathname;

  const renderArticle = (article) => {
    document.querySelector(".comments").style.display = "block";

    const content = document.createElement("div");
    content.classList.add("article__content");
    content.innerHTML = `
            <div class="article__img-block">
              <img class="article__img" src="${article.img}">
              <p class="article__hash-name">${article.hash.join(", ")}</p>
            </div>
            <div class="article__bottom">
              <span class="article__data">${article.date}</span>
              <h1 class="categories__title article__title">${article.title}</h1>
              <p class="article__text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro, necessitatibus
                nostrum laudantium amet, voluptate facere debitis consectetur molestias voluptatem neque maxime vel
                sequi
                obcaecati quam quibusdam? Laboriosam commodi aliquid ipsum tenetur cupiditate, fugit nihil, nostrum a
                repudiandae accusamus magni veritatis hic perferendis nemo animi rerum minus temporibus quasi minima
                voluptatibus labore. Nostrum eligendi suscipit ut facilis unde vel iure eaque. Error eos corporis eaque
                dolorum, modi nihil architecto tempora veniam atque qui soluta ut quasi sunt iste vitae in recusandae
                repellat, beatae nisi reprehenderit quam. Quas ab corrupti perspiciatis ducimus quis assumenda tenetur
                exercitationem repellat id, beatae sit nemo. Quaerat.</p>
              <p class="article__text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam officiis alias
                magnam perferendis provident ea nostrum, beatae aspernatur doloribus possimus placeat rerum suscipit eos
                aut ratione eveniet consequatur, sapiente aliquid ullam harum? Labore eligendi vel, sed sunt repellat,
                accusantium debitis aliquam ratione a asperiores tempore consectetur magnam nam repudiandae! Molestias
                adipisci assumenda possimus provident optio itaque praesentium porro blanditiis debitis rem ipsam
                aliquid
                fuga molestiae ipsa quasi eaque aliquam neque voluptas, reiciendis corporis esse in dolor ea soluta.
                Corrupti voluptatibus dolorem pariatur adipisci earum, consequatur voluptates, at vitae ipsa possimus
                quibusdam error assumenda aspernatur! Reiciendis delectus necessitatibus iure! Dolorem, at.</p>
            </div>
        `;

    document.querySelector(".article-box").append(content);
  };

  if (currentUrl.includes("article")) {
    const index = decodeURIComponent(location.search).split("&").pop();

    fetch("../db/db.json")
      .then((res) => res.json())
      .then((dbObj) => {
        const article = dbObj.filter((item) => item.id === index);
        renderArticle(article[0]);
      });
  }

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

  //для открытия модалки по кнопке подписки
  if (currentUrl.includes("contacts")) {
    document.querySelector(".subscr-btn").addEventListener("click", (e) => {
      if (document.querySelector(".subscr-input").classList.contains("valid")) {
        openModal();
        document.querySelector(".modal__form").style.display = "none";
        document.querySelector(".modal__title").innerHTML = `Спасибо!<br>Подписка успешно оформлена!`;
      }
    });
  }

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
        footerEmail: {
          required: "Пожалуйста, укажите ваш email",
          email: "Ваш email должен быть в формате name@domain.com",
        },
        footerName: {
          required: "Пожалуйста, укажите ваше имя",
          minlength: "Длина имени должна быть не менее 2 символов",
        },
        footerMessage: {
          required: "Пожалуйста, введите текст сообщения",
        },
        modalEmail: {
          required: "Пожалуйста, укажите email",
          email: "Ваш email должен иметь формат name@domain.com",
        },
        modalPass: {
          required: "Пожалуйста, укажите пароль",
          minlength: "Длина пароля должена быть не менее 5 символов",
          maxlength: "Длина пароля не должна превышать 20 символов",
        },
        subscrEmail: {
          required: "Пожалуйста, укажите ваш email",
          email: "Ваш email должен иметь формат name@domain.com",
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
});
