document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  displayCart(cart);
});

function displayCart(cart) {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalElement = document.getElementById("cartTotal");

  cartItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-item");

    const itemName = document.createElement("h3");
    itemName.textContent = item.name;

    const itemImage = document.createElement("img");
    itemImage.src = item.imageSrc;
    itemImage.alt = item.name;
    itemImage.style.width = "100px";

    const itemPrice = document.createElement("p");
    itemPrice.textContent = `Price: ₹${item.price}`;

    const quantityDropdown = createQuantityDropdown(item.quantity);
    quantityDropdown.addEventListener("change", function () {
      if (this.value === "remove") {
        cart = cart.filter((cartItem) => cartItem.name !== item.name);
      } else {
        item.quantity = parseInt(this.value);
      }

      sessionStorage.setItem("cart", JSON.stringify(cart));
      displayCart(cart);
    });

    cartItemDiv.appendChild(itemName);
    cartItemDiv.appendChild(itemImage);
    cartItemDiv.appendChild(itemPrice);
    cartItemDiv.appendChild(quantityDropdown);

    cartItemsContainer.appendChild(cartItemDiv);
  });

  if (cart.length > 0) {
    const total = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    cartTotalElement.textContent = `Total: ₹${total.toFixed(2)}`;
  } else {
    cartTotalElement.textContent =
      "Your shopping cart is waiting. Give it purpose fill it with groceries, clothing, household supplies, electronics and more. Happy Shopping!";
  }
}

function createQuantityDropdown(selectedQuantity) {
  const dropdown = document.createElement("select");
  for (let i = 0; i <= 4; i++) {
    const option = document.createElement("option");
    option.value = i === 0 ? "remove" : i;
    option.textContent = i === 0 ? "0 Qty" : `${i} Qty`;
    option.selected = i === selectedQuantity;
    dropdown.appendChild(option);
  }
  return dropdown;
}

async function checkout() {
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  try {
    const response = await fetch("/stripe-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: cart }),
    });

    const session = await response.json();

    if (session.id) {
      const stripe = Stripe(
        "pk_test_51PnMK1P1s4sL0zpC8W8KRUBhJGrEZsQ0rcAJ5YM9gKnvWcitPZTfqR45BBti68l9KmLSolcZkrY2kKTTUgibS1As00yUYGJjyN"
      );
      await stripe.redirectToCheckout({ sessionId: session.id });
    } else {
      console.error("Failed to create Stripe session:", session);
    }
  } catch (error) {
    console.error("Error during checkout:", error);
  }
}
document.getElementById("checkoutBtn").addEventListener("click", checkout);

document.getElementById("buyBtn").addEventListener("click", function () {
  const buyPage = document.getElementById("buyPage");
  const contentPage = document.getElementById("contentPage");

  buyPage.style.padding = "44px";
  buyPage.style.display = "block";

  contentPage.innerHTML = `
    <h3>Enter Detail : </h3>
    <input type="text" placeholder="Enter Your Name" id="name"> <br>
    <input type="text" placeholder="Enter Your Address" id="address"> <br>
    <input type="text" placeholder="Enter Your Mobile Number" id="num"> <br>
    <h3>Payment Option :</h3>
    <select name="paymentOption" id="paymentOption">
        <option value="Google-Pay">Google-Pay</option>
        <option value="Phone-Pay">Phone-Pay</option>
        <option value="Bharat-Pay">Bharat-Pay</option>
        <option value="Cash on Delivery">Cash on Delivery</option>
    </select><br>
  `;

  let submitBtn = document.createElement("button");
  submitBtn.innerText = "Submit";

  contentPage.appendChild(submitBtn);
  submitBtn.addEventListener("click", function () {
    let name = document.getElementById("name");
    let address = document.getElementById("address");
    let num = document.getElementById("num");

    if (name.value === "" || address.value === "" || num.value === "") {
      alert("Please Enter Detail");
    } else {
      alert("Your Response Recorded");
      buyPage.style.display = "none";
    }
  });

  document.querySelector(".cross").addEventListener("click", function () {
    buyPage.style.display = "none";
  });
});
