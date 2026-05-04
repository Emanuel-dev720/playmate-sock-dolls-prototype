/* ============================================================
   CART FUNCTIONS
============================================================ */

function loadUserCart() {
  if (currentUser && users[currentUser]) {
    cart = users[currentUser].cart || [];
  } else {
    cart = JSON.parse(localStorage.getItem("guestCart")) || [];
  }
}

function saveUserCart() {
  if (currentUser && users[currentUser]) {
    users[currentUser].cart = cart;
    localStorage.setItem("users", JSON.stringify(users));
  } else {
    localStorage.setItem("guestCart", JSON.stringify(cart));
  }
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });

  saveUserCart();
  updateCartCount();
  showCartPopup();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveUserCart();
  updateCartCount();
}

function changeQty(id, amount) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += amount;
  if (item.qty <= 0) return removeFromCart(id);

  saveUserCart();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

function showCartPopup() {
  const popup = document.getElementById("cart-popup");
  if (!popup) return;

  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 2000);
}
