/* ============================================================
   GLOBAL STATE
============================================================ */

let cart = [];
let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = localStorage.getItem("currentUser") || null;

/* ============================================================
   MASTER INITIALIZER
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  updateNavBar();
  loadUserCart();
  updateCartCount();

  /* ⭐ HOME PAGE INITIALIZER (required for products to load) */
  if (document.body.classList.contains("home-page")) {
    renderProducts(products);      // <-- FIXED
    setupProductFilters();
  }

  if (document.body.classList.contains("checkout-page")) {
    renderCart();
    setupShippingListeners();
    setupPaymentValidation();
    setupSameAsBilling();
    loadProfileIntoCheckout();
  }

  if (document.body.classList.contains("review-page")) {
    loadReviewOrderPage();
  }

  if (document.body.classList.contains("order-confirmation-page")) {
    loadOrderConfirmation();
  }

  if (document.body.classList.contains("auth-page")) {
    setupAuthPage();
  }
});
