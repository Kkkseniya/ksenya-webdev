$(document).ready(function () {
  var currentPosts = [];
  // const cardsBox = document.querySelector(".articles__box"); //categories-articles
  const categoriesArticles = document.querySelector(".categories-articles");
  const categoriesBlock = document.querySelector(".categories__block");

  //для вывода по хэштегам
  const hashList = document.querySelector(".hash-list-section");
  const categoriesTitle = document.querySelector(".categories__title");
  const hashListHeader = document.querySelector(".hash-list-header");

  //для пагинации
  const pagination = document.querySelector(".articles__pagination");
  pagination.innerHTML = "";

  //функция рендера пагинации
  const renderPagination = (pageCount) => {
    pagination.innerHTML = "";
    for (let i = 0; i < pageCount; i++) {
      const listItem = document.createElement("li");
      listItem.classList.add("articles__page");
      listItem.innerText = i + 1;
      pagination.append(listItem);
    }
  };

  //слушатель на клик по пагинации
  pagination.addEventListener("click", (e) => {
    if (e.target.closest(".articles__page")) {
      const currentPage = +e.target.textContent; //записываем как число

      const postPerPage = 6; //вывожу по 6 шт

      let start = (currentPage - 1) * postPerPage; //как получить currentPage??? в эту функцию
      let end = start + postPerPage;
      let postPortion = currentPosts.slice(start, end);
      renderCards(postPortion);
    }
  });

  hashListHeader.addEventListener("click", (e) => {
    let elem = e.target;
    if (elem.closest(".hash-list__item")) {
      categoriesBlock.style.display = "none";
      categoriesArticles.style.display = "grid";

      getData(elem.textContent.toLowerCase());

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
      categoriesBlock.style.display = "none";
      categoriesArticles.style.display = "grid";

      getData(elem.textContent.toLowerCase());

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
      card.innerHTML = `      
          <a href="/categories/article.html" class="toarticle"></a>
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

  const getData = (attribute) => {
    fetch("../db/db.json")
      .then((res) => res.json())
      .then((dbObj) => {
        //сортировка статей по дате
        const array = dbObj.sort(function (a, b) {
          let dateA = new Date(a.date),
            dateB = new Date(b.date);
          return dateB - dateA;
        });

        const forRender = attribute ? array.filter((item) => item.hash.includes(attribute)) : array;

        if (forRender.length > 0) {
          if (attribute) {
            categoriesTitle.textContent = attribute.toUpperCase();
          }
          // categoriesTitle.style.fontSize = "32px";
          categoriesTitle.classList.remove("categories__title--mess");

          currentPosts = forRender;
        } else {
          categoriesArticles.innerHTML = "";
          pagination.innerHTML = "";
          if (attribute) {
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

  getData();
});
