let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and render existing toys
  fetchToys();

  // Handle form submission to add a new toy
  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0
      })
    })
      .then(res => res.json())
      .then(newToy => {
        renderToyCard(newToy);
        toyForm.reset();
      });
  });
});

// Fetch all toys from server
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => {
      toys.forEach(renderToyCard);
    });
}

// Render a single toy card
function renderToyCard(toy) {
  const toyCollection = document.getElementById("toy-collection");

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  // Like button event
  const likeBtn = card.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => handleLike(toy, card));

  toyCollection.appendChild(card);
}

// Handle like button click
function handleLike(toy, card) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ likes: newLikes })
  })
    .then(res => res.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes;
      card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
    });
}
