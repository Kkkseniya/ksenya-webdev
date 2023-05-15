$(document).ready(function () {
  var currentPosts = [];
  const currentUrl = window.location.pathname;
  //модальные окна
  var modalOverlay = $(".modal__overlay");
  var modalDialog = $(".modal__dialog");
  const mobileMenu = document.querySelector(".header-mobile");
  const burgerBtn = document.querySelector(".burger-btn");

  // const cardsBox = document.querySelector(".articles__box"); //categories-articles
  const categoriesArticles = document.querySelector(".categories-articles"); //это для вывода блока для хэшей
  const categoriesBlock = document.querySelector(".categories__block"); //это блок который всегда на этой странице
  const portfolioBlock = document.querySelector(".portfolio-block"); //это блок который всегда на странице портфолио
  const contactsBlock = document.querySelector(".contacts-block"); //это блок который всегда на странице контактов
  const articleContent = document.querySelector(".article-box");
  const comments = document.querySelector(".comments");

  //для страницы портфолио открытие по кнопке
  const portfolioBtns = document.querySelectorAll(".portfolio__btn");
  const fullDescriptions = document.querySelectorAll(".portfolio__full-description");
  const contentWrappers = document.querySelectorAll(".content-wrapper");
  const portfolioImgs = document.querySelectorAll(".portfolio-btn-img");
  const portfolioTexts = document.querySelectorAll(".portfolio-btn-text");

  //для вывода по хэштегам
  const hashList = document.querySelector(".hash-list-section");
  const categoriesTitle = document.querySelector(".categories__title");
  const hashListHeader = document.querySelector(".hash-list-header");

  //для пагинации
  const pagination = document.querySelector(".articles__pagination");
  pagination.innerHTML = "";

  //для поиска по статьям
  const searchInput = document.querySelector(".search__input-pc");
  const searchButton = document.querySelector(".search__button-pc");
  const searchInputMob = document.querySelector(".search__input-mobile");
  const searchButtonMob = document.querySelector(".search__button-mobile");

  //слушатель на родительский блок для динамических статей
  $(categoriesArticles).on("click", ".articles__card", (e) => {
    const index = e.currentTarget.dataset.index;
    document.location.assign("/categories/article.html?&" + index);
  });

  //слушатель на кнопку для строки поиска
  searchButton.addEventListener("click", () => {
    getData("title", searchInput.value.toLowerCase());
  });

  searchButtonMob.addEventListener("click", () => {
    setTimeout(() => {
      modalOverlay.removeClass("modal__overlay--visible");
      modalDialog.removeClass("modal__dialog--visible");
      mobileMenu.classList.toggle("header-menu-active");
      burgerBtn.classList.toggle("btn-clicked");
    }, 400);
    getData("title", searchInputMob.value.toLowerCase());
  });

  //функция рендера пагинации
  const renderPagination = (pageCount) => {
    pagination.style.display = "flex"; //
    pagination.innerHTML = "";
    for (let i = 0; i < pageCount; i++) {
      const listItem = document.createElement("li");
      listItem.classList.add("articles__page");
      listItem.innerText = i + 1;
      pagination.append(listItem);
    }
  };

  //кнопка на странице портфолио, которая разворачивает/сворачивает описание
  portfolioBtns.forEach((item, index) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      contentWrappers[index].classList.toggle("position-start");
      fullDescriptions[index].classList.toggle("hide-class");
      portfolioImgs[index].classList.toggle("image-rotate");
      if (fullDescriptions[index].classList.contains("hide-class")) {
        portfolioTexts[index].textContent = "Подробнее";
      } else {
        portfolioTexts[index].textContent = "Скрыть";
      }
    });
  });

  //слушатель на клик по пагинации
  pagination.addEventListener("click", (e) => {
    if (e.target.closest(".articles__page")) {
      const currentPage = +e.target.textContent; //записываем как число

      const postPerPage = 6; //вывожу по 6 шт

      let start = (currentPage - 1) * postPerPage;
      let end = start + postPerPage;
      let postPortion = currentPosts.slice(start, end);
      renderCards(postPortion);
    }
  });

  hashListHeader.addEventListener("click", (e) => {
    let elem = e.target;
    if (elem.closest(".hash-list__item")) {
      setTimeout(() => {
        modalOverlay.removeClass("modal__overlay--visible");
        modalDialog.removeClass("modal__dialog--visible");
        mobileMenu.classList.toggle("header-menu-active");
        burgerBtn.classList.toggle("btn-clicked");
      }, 400);
      // categoriesBlock.style.display = "none";
      switch (true) {
        case currentUrl.includes("portfolio"):
          portfolioBlock.style.display = "none";
          break;
        case currentUrl.includes("contacts"):
          contactsBlock.style.display = "none";
          break;
        case currentUrl.includes("article"):
          articleContent.style.display = "none";
          comments.style.display = "none";
          break;
        default:
          categoriesBlock.style.display = "none";
          break;
      }

      categoriesArticles.style.display = "grid";

      getData("hash", elem.textContent.toLowerCase());

      //рендер пагинации
      if (currentPosts.length > 0) {
        const postPerPage = 6; //вывожу по 6 шт
        let postPortion = currentPosts.slice(0, postPerPage);
        renderCards(postPortion);

        const allPages = Math.ceil(currentPosts.length / postPerPage);
        renderPagination(allPages);
      }
    }
  });

  hashList.addEventListener("click", (e) => {
    let elem = e.target;
    if (elem.closest(".hash-list__item")) {
      // categoriesBlock.style.display = "none";
      switch (true) {
        case currentUrl.includes("portfolio"):
          portfolioBlock.style.display = "none";
          break;
        case currentUrl.includes("contacts"):
          contactsBlock.style.display = "none";
          break;
        case currentUrl.includes("article"):
          articleContent.style.display = "none";
          comments.style.display = "none";
          break;
        default:
          categoriesBlock.style.display = "none";
          break;
      }
      categoriesArticles.style.display = "grid";

      getData("hash", elem.textContent.toLowerCase());

      //рендер пагинации
      if (currentPosts.length > 0) {
        const postPerPage = 6; //вывожу по 6 шт
        let postPortion = currentPosts.slice(0, postPerPage);
        renderCards(postPortion);

        const allPages = Math.ceil(currentPosts.length / postPerPage);
        renderPagination(allPages);
      }
    }
  });

  //для отрисовки карточек
  const renderCards = (array) => {
    categoriesArticles.innerHTML = "";

    array.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("articles__card");
      card.setAttribute("data-index", item.id);
      card.innerHTML = `      
          <a class="toarticle"></a>
          <div class="card-top">
            <img class="card-top__img" src=${item.img}>
            <p class="card-top__hash">${item.hash.join(", ")}</p>
          </div>

          <div class="card-bottom">
            <span class="card-bottom__date">${item.date}</span>
            <h2 class="card-bottom__title">${item.title}</h2>
            <p class="card-bottom__description">${item.description}</p>
          </div>`;

      categoriesArticles.append(card);
    });
  };

  const getData = (opt, attribute) => {
    fetch("../db/db.json")
      .then((res) => res.json())
      .then((dbObj) => {
        //сортировка статей по дате
        const array = dbObj.sort(function (a, b) {
          let dateA = new Date(a.date),
            dateB = new Date(b.date);
          return dateB - dateA;
        });

        //opt - может быть hash или title
        let forRender = [];
        switch (opt) {
          case "hash":
            forRender = array.filter((item) => item.hash.includes(attribute));
            break;
          case "title":
            forRender = array.filter((item) => item.title.toLowerCase().includes(attribute));
            break;
          default:
            forRender = array;
            break;
        }
        //const forRender = attribute ? array.filter((item) => item.opt.includes(attribute)) : array;

        if (forRender.length > 0) {
          // if (opt === "title") {
          // categoriesBlock.style.display = "none";
          switch (true) {
            case currentUrl.includes("portfolio"):
              portfolioBlock.style.display = "none";
              break;
            case currentUrl.includes("contacts"):
              contactsBlock.style.display = "none";
              break;
            case currentUrl.includes("article"):
              articleContent.style.display = "none";
              comments.style.display = "none";
              break;
            default:
              categoriesBlock.style.display = "none";
              break;
          }
          categoriesArticles.innerHTML = "";
          categoriesArticles.style.display = "grid";
          renderCards(forRender);

          if (opt === "title" && attribute) {
            categoriesTitle.textContent = 'по запросу "' + attribute + '" найдено:';
          } else {
            categoriesTitle.textContent = attribute.toUpperCase();
          }
          categoriesTitle.classList.remove("categories__title--mess");

          currentPosts = forRender;

          const postPerPage = 6; //вывожу по 6 шт
          let postPortion = forRender.slice(0, postPerPage);
          renderCards(postPortion);

          const allPages = Math.ceil(forRender.length / postPerPage);
          renderPagination(allPages);
          //} else {
          //if (attribute) {
          // categoriesTitle.textContent = attribute.toUpperCase();
          //}
          //}

          // categoriesTitle.style.fontSize = "32px";
          // categoriesTitle.classList.remove("categories__title--mess");

          // currentPosts = forRender;
        } else {
          categoriesArticles.innerHTML = "";
          pagination.innerHTML = "";

          if (opt === "title") {
            categoriesTitle.textContent = "По вашему запросу ничего не найдено";
            // categoriesBlock.style.display = "none";
            switch (true) {
              case currentUrl.includes("portfolio"):
                portfolioBlock.style.display = "none";
                break;
              case currentUrl.includes("contacts"):
                contactsBlock.style.display = "none";
                break;
              case currentUrl.includes("article"):
                articleContent.style.display = "none";
                comments.style.display = "none";
                break;
              default:
                categoriesBlock.style.display = "none";
                break;
            }
            categoriesTitle.classList.add("categories__title--mess");
          } else if (opt === "hash") {
            categoriesTitle.textContent = "По данному хэштегу пока нет статей";
            // categoriesTitle.style.fontSize = "26px";
            categoriesTitle.classList.add("categories__title--mess");
          } else {
            categoriesTitle.textContent = "В данном разделе пока нет статей";
            categoriesTitle.classList.add("categories__title--mess");
          }
        }
      });
  };
});
