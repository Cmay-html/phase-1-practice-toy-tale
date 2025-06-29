let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");
  const form = document.querySelector(".add-toy-form");
  const toysURL = "http://localhost:3000/toys";

  // Show/hide toy form
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch and render all toys
  fetch(toysURL)
    .then((res) => res.json())
    .then((toys) => {
      toys.forEach(renderToy);
    });

  // Render a single toy
  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => handleLike(toy, card));

    toyCollection.appendChild(card);
  }

  // Handle the "Like" button
  function handleLike(toy, card) {
    const updatedLikes = toy.likes + 1;

    fetch(`${toysURL}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: updatedLikes }),
    })
      .then((res) => res.json())
      .then((updatedToy) => {
        toy.likes = updatedToy.likes;
        card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      });
  }

  // Handle the form submission to add a new toy
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const image = e.target.image.value;

    const newToy = {
      name,
      image,
      likes: 0,
    };

    fetch(toysURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((res) => res.json())
      .then((toy) => {
        renderToy(toy);
        form.reset();
        toyFormContainer.style.display = "none";
        addToy = false;
      });
  });
});
