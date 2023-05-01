$(document).ready(function () {
  const cardsBox = document.querySelector(".articles__box");

  //для вывода по хэштегам
  const hashList = document.querySelector(".hash-list-section");
  const hashListHeader = document.querySelector(".hash-list-header");
  const articlesTitle = document.querySelector(".articles__title");

  hashListHeader.addEventListener("click", (e) => {
    let elem = e.target;
    if (elem.closest(".hash-list__item")) {
      getData("hash", elem.textContent.toLowerCase());
    }
  });

  hashList.addEventListener("click", (e) => {
    let elem = e.target;
    if (elem.closest(".hash-list__item")) {
      getData("hash", elem.textContent.toLowerCase());
      // getData(elem.textContent.toLowerCase);
    }
  });

  //для отрисовки карточек
  const renderCards = (array) => {
    cardsBox.innerHTML = "";

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

      cardsBox.append(card);
    });
  };

  // const getDataFront = (type) => {};

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
        if (opt === "type") {
          forRender = array.filter((item) => item.type === value);
        } else {
          forRender = array.filter((item) => item.hash.includes(value));
        }

        if (forRender.length > 0) {
          if (opt === "type") {
            articlesTitle.textContent = value[0].toUpperCase() + value.slice(1);
          } else {
            articlesTitle.textContent = value.toUpperCase();
          }
          articlesTitle.classList.remove("categories__title--mess");
          renderCards(forRender);
        } else {
          cardsBox.innerHTML = "";
          if (opt === "type") {
            articlesTitle.textContent = "В данном разделе пока нет статей";
            articlesTitle.classList.add("categories__title--mess");
            //font-size: 26px;
          } else {
            articlesTitle.textContent = "По данному хэштегу пока нет статей";
            articlesTitle.classList.add("categories__title--mess");
          }
        }
      });
  };

  //два параметра - где искать, что искать
  // getData(opt, value);

  const currentUrl = window.location.pathname;
  if (currentUrl.includes("frontend")) {
    getData("type", "frontend");
  } else {
    getData("type", "backend");
  }
});
