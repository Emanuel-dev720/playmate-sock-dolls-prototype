/* ============================================================
   AUTH SYSTEM
============================================================ */

function setupAuthPage() {
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");

  if (loginBtn) loginBtn.addEventListener("click", loginUser);
  if (signupBtn) signupBtn.addEventListener("click", createAccount);
}

function createAccount() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim().toLowerCase();
  const address = document.getElementById("signup-address").value.trim();
  const city = document.getElementById("signup-city").value.trim();
  const state = document.getElementById("signup-state").value.trim();
  const zip = document.getElementById("signup-zip").value.trim();

  if (!name || !email || !address || !city || !state || !zip)
    return alert("Please fill out all fields.");

  if (users[email]) return alert("An account with this email already exists.");

  users[email] = { name, email, address, city, state, zip, cart: [] };
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created! You can now log in.");
}

function loginUser() {
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  if (!users[email]) return alert("No account found with that email.");

  currentUser = email;
  localStorage.setItem("currentUser", currentUser);

  const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
  if (guestCart.length > 0) {
    users[currentUser].cart = mergeCarts(users[currentUser].cart, guestCart);
    localStorage.removeItem("guestCart");
    localStorage.setItem("users", JSON.stringify(users));
  }

  loadUserCart();
  updateNavBar();
  window.location.href = "index.html";
}

function mergeCarts(userCart, guestCart) {
  const merged = [...userCart];
  guestCart.forEach(g => {
    const existing = merged.find(i => i.id === g.id);
    if (existing) existing.qty += g.qty;
    else merged.push(g);
  });
  return merged;
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  cart = [];
  updateNavBar();
  window.location.href = "index.html";
}
