$(document).ready(function () {
  var currentPosts = [];
  const cardsBox = document.querySelector(".articles__box");
  //модальные окна
  var modalOverlay = $(".modal__overlay");
  var modalDialog = $(".modal__dialog");
  const mobileMenu = document.querySelector(".header-mobile");
  const burgerBtn = document.querySelector(".burger-btn");

  //для вывода по хэштегам
  const hashList = document.querySelector(".hash-list-section");
  const hashListHeader = document.querySelector(".hash-list-header");
  const articlesTitle = document.querySelector(".articles__title");

  //для пагинации
  const pagination = document.querySelector(".articles__pagination");

  //для поиска по статьям
  const searchInput = document.querySelector(".search__input-pc");
  const searchButton = document.querySelector(".search__button-pc");
  const searchInputMob = document.querySelector(".search__input-mobile");
  const searchButtonMob = document.querySelector(".search__button-mobile");

  //слушатель на родительский блок для динамических статей
  $(cardsBox).on("click", ".articles__card", (e) => {
    const index = e.currentTarget.dataset.index;
    document.location.assign("../categories/article.html?&" + index);
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

  //слушатель для кликов по хэшам в мобильном меню
  hashListHeader.addEventListener("click", (e) => {
    let elem = e.target;
    if (elem.closest(".hash-list__item")) {
      setTimeout(() => {
        modalOverlay.removeClass("modal__overlay--visible");
        modalDialog.removeClass("modal__dialog--visible");
        mobileMenu.classList.toggle("header-menu-active");
        burgerBtn.classList.toggle("btn-clicked");
      }, 400);

      getData("hash", elem.textContent.toLowerCase());
    }
  });

  //слушатель для кликов по хэшам
  hashList.addEventListener("click", (e) => {
    let elem = e.target;
    if (elem.closest(".hash-list__item")) {
      getData("hash", elem.textContent.toLowerCase());
      // getData(elem.textContent.toLowerCase);
    }
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

  //для отрисовки карточек
  const renderCards = (array) => {
    cardsBox.innerHTML = "";

    array.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("articles__card");
      card.setAttribute("data-index", item.id);
      card.innerHTML = `                
          <div class="card-top">
            <img class="card-top__img" src=${item.img}>
            <p class="card-top__hash">${item.hash.join(", ")}</p>
          </div>

          <div class="card-bottom">
            <span class="card-bottom__date">${item.date}</span>
            <h2 class="card-bottom__title">${item.title}</h2>
            <p class="card-bottom__description">${item.description}</p>
          </div>`;

      cardsBox.append(card);
    });
  };

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

  const getData = (opt, value) => {
    fetch("../db/db.json")
      .then((res) => res.json())
      .then((dbObj) => {
        //сортировка статей по дате
        const array = dbObj.sort(function (a, b) {
          let dateA = new Date(a.date),
            dateB = new Date(b.date);
          return dateB - dateA;
        });

        let forRender = [];

        switch (opt) {
          case "type":
            forRender = array.filter((item) => item.type === value);
            break;
          case "hash":
            forRender = array.filter((item) => item.hash.includes(value));
            break;
          case "title":
            forRender = array.filter((item) => item.title.toLowerCase().includes(value));
            break;
        }

        if (forRender.length > 0) {
          if (opt === "type") {
            switch (value) {
              case "analytics":
                articlesTitle.textContent = "Аналитика";
                break;
              case "interviews":
                articlesTitle.textContent = "Собеседования";
                break;
              default:
                articlesTitle.textContent = value[0].toUpperCase() + value.slice(1);
                break;
            }
          } else if (opt === "title") {
            articlesTitle.textContent = 'по запросу "' + value + '" найдено:';
          } else {
            articlesTitle.textContent = value.toUpperCase();
          }
          articlesTitle.classList.remove("categories__title--mess");

          const postPerPage = 6; //вывожу по 6 шт
          const allPages = Math.ceil(forRender.length / postPerPage);
          renderPagination(allPages);

          currentPosts = forRender;
          //определяю откуда по куда выводить статьи, выводим только первую порцию
          let postPortion = forRender.slice(0, postPerPage);
          renderCards(postPortion);
        } else {
          cardsBox.innerHTML = "";
          pagination.innerHTML = "";
          switch (opt) {
            case "type":
              articlesTitle.textContent = "В данном разделе пока нет статей";
              articlesTitle.classList.add("categories__title--mess");
              break;
            case "hash":
              articlesTitle.textContent = "По данному хэштегу пока нет статей";
              articlesTitle.classList.add("categories__title--mess");
              break;
            case "title":
              categoriesTitle.textContent = "По вашему запросу ничего не найдено";
              break;
          }
        }
      });
  };

  //два параметра - где искать, что искать
  // getData(opt, value);

  const currentUrl = window.location.pathname;
  const lastPartUrl = currentUrl.split("/").pop();
  const postType = lastPartUrl.substring(0, lastPartUrl.length - 5);

  getData("type", postType);
});
