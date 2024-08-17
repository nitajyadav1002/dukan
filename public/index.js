let shops = document.getElementById("shops");
let reviews = document.getElementById("reviews");
let blogs = document.getElementById("blogs");
let contacts = document.getElementById("contacts");

shops.addEventListener("click", () => {
  shops.style.color = "rgb(0, 196, 196)";
  reviews.style.color = "white";
  blogs.style.color = "white";
  contacts.style.color = "white";
});

reviews.addEventListener("click", () => {
  reviews.style.color = "rgb(0, 196, 196)";
  shops.style.color = "white";
  blogs.style.color = "white";
  contacts.style.color = "white";
});

blogs.addEventListener("click", () => {
  blogs.style.color = "rgb(0, 196, 196)";
  reviews.style.color = "white";
  shops.style.color = "white";
  contacts.style.color = "white";
});

contacts.addEventListener("click", () => {
  contacts.style.color = "rgb(0, 196, 196)";
  reviews.style.color = "white";
  blogs.style.color = "white";
  shops.style.color = "white";
});

let icon = document.querySelector(".icon");
let ul = document.querySelector("ul");

icon.addEventListener("click", () => {
  ul.classList.toggle("showData");

  if (ul.className === "showData") {
    document.getElementById("bar").className = "fa-solid fa-xmark";
  } else {
    document.getElementById("bar").className = "fa-solid fa-bars";
  }
});

let card = document.querySelectorAll(".crd");
let pageImg = document.querySelector("#itemImg");

console.log(pageImg);
console.log(card);

function connect() {
  var email = document.getElementById("email").value.trim();
  var query = document.getElementById("query").value.trim();

  if (email === "" || query === "") {
    alert("Please fill in all fields.");
    return false;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    alert("Invalid email format.");
    return false;
  }

  fetch("/connect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      query: query,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      alert("Thanks for connecting! Your query has been sent.");
      document.getElementById("email").value = "";
      document.getElementById("query").value = "";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("There was an error. Please try again.");
    });

  return false;
}

let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

function addToCart(productName, price, imageSrc) {
  const existingProduct = cart.find((item) => item.name === productName);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      name: productName,
      price: price,
      quantity: 1,
      imageSrc: imageSrc,
    });
  }
  alert(`Product "${productName}" added to cart!`);
  updateCartDisplay();
}

function openCart() {
  sessionStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "cart.html";
}

function updateCartDisplay() {
  const cartCount = document.getElementById("cartCount");
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = totalItems > 0 ? totalItems : "";
}

let isExpanded = false;
const reviewText = document.getElementById("reviewText");
const reviewText1 = document.getElementById("reviewText1");
const reviewText2 = document.getElementById("reviewText2");

function expandReview() {
  if (!isExpanded) {
    reviewText.classList.remove("collapsed-text");
    isExpanded = true;
  }
}

function expandReview1() {
  if (!isExpanded) {
    reviewText1.classList.remove("collapsed-text");
    isExpanded = true;
  }
}

function expandReview2() {
  if (!isExpanded) {
    reviewText2.classList.remove("collapsed-text");
    isExpanded = true;
  }
}

function collapseReview() {
  if (isExpanded) {
    reviewText.classList.add("collapsed-text");
    isExpanded = false;
  }
}

function collapseReview1() {
  if (isExpanded) {
    reviewText1.classList.add("collapsed-text");
    isExpanded = false;
  }
}

function collapseReview2() {
  if (isExpanded) {
    reviewText2.classList.add("collapsed-text");
    isExpanded = false;
  }
}
function logout() {
  // Remove the 'isLoggedIn' status from localStorage
  localStorage.removeItem("isLoggedIn");
  // Redirect to login.html
  window.location.href = "login.html";
}
