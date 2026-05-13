/* ============================================================
   SHIPPING LISTENERS
============================================================ */

function setupShippingListeners() {
  const zipInput = document.getElementById("ship-zip");
  const radios = document.querySelectorAll("input[name='shipping-method']");

  if (zipInput) zipInput.addEventListener("input", renderCart);
  radios.forEach(r => r.addEventListener("change", renderCart));
}

function calculateShipping(zip) {
  if (!zip || zip.length < 1) return 0;

  const firstDigit = zip[0];

  if ("01234".includes(firstDigit)) return 8.95;
  if ("567".includes(firstDigit)) return 10.95;
  if ("89".includes(firstDigit)) return 12.95;

  return 10.95;
}

/* ============================================================
   PAYMENT VALIDATION
============================================================ */

function setupPaymentValidation() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("card-name").value.trim();
    const number = document.getElementById("card-number").value.trim();
    const exp = document.getElementById("card-exp").value.trim();
    const cvv = document.getElementById("card-cvv").value.trim();

    if (name.length < 2) return alert("Please enter the cardholder name.");
    if (!/^[0-9]{16}$/.test(number)) return alert("Card number must be 16 digits.");
    if (!/^[0-9]{2}\/[0-9]{2}$/.test(exp)) return alert("Expiration must be MM/YY.");
    if (!/^[0-9]{3,4}$/.test(cvv)) return alert("CVV must be 3 or 4 digits.");

    alert("Card details look good. Click Review Order to continue.");
  });
}

/* ============================================================
   CHANGE QUANTITY
============================================================ */

function changeQty(id, amount) {
  id = id.toString();

  const item = cart.find(i => i.id == id);
  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id != id);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

/* ============================================================
   REMOVE FROM CART (FIXED)
============================================================ */

function removeFromCart(id) {
  id = id.toString();
  cart = cart.filter(item => item.id != id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

/* ============================================================
   RENDER CART (CHECKOUT PAGE)
============================================================ */

function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-message">(Your Cart is Empty)</p>`;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id == item.id);
    if (!product) return;

    subtotal += product.price * item.qty;

    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="cart-item-details">
        <p class="cart-item-name">${product.name}</p>
        <p class="cart-item-price">$${product.price.toFixed(2)}</p>
        <p class="cart-item-extended">Line Total: $${(product.price * item.qty).toFixed(2)}</p>

        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty('${product.id}', -1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${product.id}', 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart('${product.id}')">Remove</button>
        </div>
      </div>
    `;

    container.appendChild(row);
  });

  const tax = subtotal * 0.05;

  const zip = document.getElementById("ship-zip")?.value || "";
  const shipping = calculateShipping(zip);

  const method = document.querySelector("input[name='shipping-method']:checked")?.value;
  const expedited = method === "expedited" ? 15.0 : 0;

  const total = subtotal + tax + shipping + expedited;

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  localStorage.setItem("lastZip", zip);
  localStorage.setItem("lastShippingMethod", method || "standard");

  const subtotalLabel = document.querySelector(".cart-summary h3");
  if (subtotalLabel) {
    subtotalLabel.textContent = `Subtotal (${itemCount} items):`;
  }

  const subEl = document.getElementById("cart-subtotal");
  const taxEl = document.getElementById("cart-tax");
  const shipEl = document.getElementById("cart-shipping");
  const expEl = document.getElementById("cart-expedited");
  const totalEl = document.getElementById("cart-total");

  if (subEl) subEl.textContent = subtotal.toFixed(2);
  if (taxEl) taxEl.textContent = tax.toFixed(2);
  if (shipEl) shipEl.textContent = shipping.toFixed(2);
  if (expEl) expEl.textContent = expedited.toFixed(2);
  if (totalEl) totalEl.textContent = total.toFixed(2);
}

/* ============================================================
   SAME AS BILLING
============================================================ */

function setupSameAsBilling() {
  const checkbox = document.getElementById("same-as-billing");
  const shipSection = document.getElementById("shipping-section");

  if (!checkbox || !shipSection) return;

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      document.getElementById("ship-address").value = document.getElementById("bill-address").value;
      document.getElementById("ship-city").value = document.getElementById("bill-city").value;
      document.getElementById("ship-state").value = document.getElementById("bill-state").value;
      document.getElementById("ship-zip").value = document.getElementById("bill-zip").value;

      shipSection.classList.add("shipping-disabled");
    } else {
      shipSection.classList.remove("shipping-disabled");
    }
  });
}

/* ============================================================
   PROFILE AUTOFILL
============================================================ */

function loadProfileIntoCheckout() {
  if (!currentUser || !users[currentUser]) return;

  const profile = users[currentUser];

  const nameEl = document.getElementById("cust-name");
  const emailEl = document.getElementById("cust-email");

  if (nameEl) nameEl.value = profile.name || "";
  if (emailEl) emailEl.value = profile.email || "";

  const billAddress = document.getElementById("bill-address");
  const billCity = document.getElementById("bill-city");
  const billState = document.getElementById("bill-state");
  const billZip = document.getElementById("bill-zip");

  if (billAddress) billAddress.value = profile.address || "";
  if (billCity) billCity.value = profile.city || "";
  if (billState) billState.value = profile.state || "";
  if (billZip) billZip.value = profile.zip || "";

  const shipAddress = document.getElementById("ship-address");
  const shipCity = document.getElementById("ship-city");
  const shipState = document.getElementById("ship-state");
  const shipZip = document.getElementById("ship-zip");

  if (shipAddress) shipAddress.value = profile.address || "";
  if (shipCity) shipCity.value = profile.city || "";
  if (shipState) shipState.value = profile.state || "";
  if (shipZip) shipZip.value = profile.zip || "";
}

/* ============================================================
   SUBMIT ORDER
============================================================ */

function submitOrder() {
  const order = {
    number: Math.floor(100000 + Math.random() * 900000),
    email: currentUser && users[currentUser] ? users[currentUser].email : "guest",
    total: document.getElementById("review-total")?.textContent || "0.00",
    items: cart
  };

  localStorage.setItem("lastOrder", JSON.stringify(order));

  cart = [];
  saveUserCart();

  window.location.href = "order-confirmation.html";
}

/* ============================================================
   RESTORE CHECKOUT FORM DATA + FORCE DEFAULT SHIPPING
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("checkoutFormData");

  if (saved) {
    const data = JSON.parse(saved);

    const map = {
      "bill-address": data.billAddress,
      "bill-city": data.billCity,
      "bill-state": data.billState,
      "bill-zip": data.billZip,
      "ship-address": data.shipAddress,
      "ship-city": data.shipCity,
      "ship-state": data.shipState,
      "ship-zip": data.shipZip
    };

    for (const id in map) {
      const el = document.getElementById(id);
      if (el) el.value = map[id];
    }

    const method = data.shippingMethod || "standard";
    const radio = document.querySelector(`input[name='shipping-method'][value='${method}']`);
    if (radio) radio.checked = true;
  }

  const defaultMethod = document.querySelector("input[name='shipping-method']:checked");
  if (defaultMethod) {
    defaultMethod.dispatchEvent(new Event("change"));
  }

  renderCart();
});

/* ============================================================
   REVIEW ORDER BUTTON — VALIDATION + SAVE FORM
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const reviewBtn = document.getElementById("go-review-order");
  if (!reviewBtn) return;

  reviewBtn.addEventListener("click", () => {

    if (cart.length === 0) {
      alert("Your cart is empty. Add items before reviewing your order.");
      return;
    }

    const requiredShipping = [
      "bill-address", "bill-city", "bill-state", "bill-zip",
      "ship-address", "ship-city", "ship-state", "ship-zip"
    ];

    for (const id of requiredShipping) {
      const el = document.getElementById(id);
      if (!el || el.value.trim() === "") {
        alert("Please complete all shipping and billing fields before continuing.");
        return;
      }
    }

    const name = document.getElementById("card-name").value.trim();
    const number = document.getElementById("card-number").value.trim();
    const exp = document.getElementById("card-exp").value.trim();
    const cvv = document.getElementById("card-cvv").value.trim();

    if (name.length < 2 ||
        !/^[0-9]{16}$/.test(number) ||
        !/^[0-9]{2}\/[0-9]{2}$/.test(exp) ||
        !/^[0-9]{3,4}$/.test(cvv)) {
      alert("Please enter valid payment information before continuing.");
      return;
    }

    const formData = {
      billAddress: document.getElementById("bill-address").value,
      billCity: document.getElementById("bill-city").value,
      billState: document.getElementById("bill-state").value,
      billZip: document.getElementById("bill-zip").value,
      shipAddress: document.getElementById("ship-address").value,
      shipCity: document.getElementById("ship-city").value,
      shipState: document.getElementById("ship-state").value,
      shipZip: document.getElementById("ship-zip").value,
      shippingMethod: document.querySelector("input[name='shipping-method']:checked")?.value || "standard"
    };

    localStorage.setItem("checkoutFormData", JSON.stringify(formData));

    window.location.href = "review-order.html";
  });
});
