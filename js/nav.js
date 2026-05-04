/* ============================================================
   NAVIGATION BAR
============================================================ */

function updateNavBar() {
  const nav = document.getElementById("nav-links");
  if (!nav) return;

  if (currentUser && users[currentUser]) {
    nav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact & Support</a>
      <a href="checkout.html">Cart (<span id="cart-count">0</span>)</a>
      <span class="welcome-text">Welcome, ${users[currentUser].name}</span>
      <a href="#" onclick="logoutUser()">Logout</a>
    `;
  } else {
    nav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact & Support</a>
      <a href="checkout.html">Cart (<span id="cart-count">0</span>)</a>
      <a href="login-signup.html">Login / Sign Up</a>
    `;
  }

  updateCartCount();
}
