// offline data
db.enablePersistence().catch(function (err) {
  if (err.code == "failed-precondition") {
    // probably multible tabs open at once
    console.log("persistance failed");
  } else if (err.code == "unimplemented") {
    // lack of browser support for the feature
    console.log("persistance not available");
  }
});

const articles = document.querySelector(".recipes");

// Create and Delete article's functions
function renderArticle(data, id) {
  const html = `<div class="card-panel recipe white row" data-id="${id}">
        <img src="/img/giglio-logo.png" alt="giglio logo" />
        <div class="recipe-details">
          <div class="recipe-title">${data.title} </div>
          <div class="recipe-ingredients">${data.description}</div>
          <div class="recipe-delete">
            <i class="material-icons" data-id="${id}">delete_outline </i>
          </div>
        </div>
      </div>`;

  articles.innerHTML += html;
}

function removeArticle(id) {
  const article = document.querySelector(`.recipe[data-id="${id}"]`);
  article.remove();
}
// real-time listener
db.collection("articles").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      renderArticle(change.doc.data(), change.doc.id);
    }
    if (change.type === "removed") {
      removeArticle(change.doc.id);
    }
  });
});

// Add new recipe
const form = document.querySelector("form");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const article = {
    title: form.title.value,
    description: form.desc.value,
  };

  db.collection("articles")
    .add(article)
    .catch((err) => {
      console.log(err);
    });

  form.title.value = "";
  form.desc.value = "";
});

// Delete article

const articleContainer = document.querySelector(".recipes");
articleContainer.addEventListener("click", (evt) => {
  if (evt.target.tagName === "I") {
    const id = evt.target.getAttribute("data-id");
    db.collection("articles").doc(id).delete();
  }
});
