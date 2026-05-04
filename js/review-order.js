/* ============================================================
   REVIEW ORDER PAGE (VALIDATED + SAFE)
============================================================ */

function loadReviewOrderPage() {
  const reviewContainer = document.getElementById("review-items");
  if (!reviewContainer) return;

  reviewContainer.innerHTML = "";

  /* ------------------------------
     1. CART MUST HAVE ITEMS
  ------------------------------ */
  if (!cart || cart.length === 0) {
    reviewContainer.innerHTML = `<p class="empty-message">(Your Cart is Empty)</p>`;
    return;
  }

  /* ------------------------------
     2. BUILD ITEM LIST
  ------------------------------ */
  let subtotal = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    subtotal += product.price * item.qty;

    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="cart-item-details">
        <p class="cart-item-name">${product.name}</p>
        <p class="cart-item-price">$${product.price.toFixed(2)}</p>
        <p>Qty: ${item.qty}</p>
      </div>
    `;

    reviewContainer.appendChild(row);
  });

  /* ------------------------------
     3. CALCULATE TOTALS
  ------------------------------ */
  const tax = subtotal * 0.05;
  const zip = localStorage.getItem("lastZip") || "";
  const shipping = calculateShipping(zip);

  const method = localStorage.getItem("lastShippingMethod") || "standard";
  const expedited = method === "expedited" ? 15.0 : 0;

  const total = subtotal + tax + shipping + expedited;
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  /* ------------------------------
     4. UPDATE TOTAL FIELDS
  ------------------------------ */
  const subLabel = document.getElementById("review-subtotal-label");
  const taxEl = document.getElementById("review-tax");
  const shipEl = document.getElementById("review-shipping");
  const expEl = document.getElementById("review-expedited");
  const totalEl = document.getElementById("review-total");

  if (subLabel) subLabel.textContent = `Subtotal (${itemCount} items): $${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = tax.toFixed(2);
  if (shipEl) shipEl.textContent = shipping.toFixed(2);
  if (expEl) expEl.textContent = expedited.toFixed(2);
  if (totalEl) totalEl.textContent = total.toFixed(2);

  /* ------------------------------
     5. BACK BUTTON — RESTORES FORM
  ------------------------------ */
  const backBtn = document.getElementById("review-back-btn");
  if (backBtn) {
    backBtn.onclick = () => {
      window.location.href = "checkout.html";
    };
  }

  /* ------------------------------
     6. CONFIRM ORDER — VALIDATION
  ------------------------------ */
  const confirmBtn = document.getElementById("review-confirm-btn");
  if (confirmBtn) {
    confirmBtn.onclick = () => {

      // Cart must still have items
      if (!cart || cart.length === 0) {
        alert("Your cart is empty. Cannot confirm order.");
        return;
      }

      // Totals must exist
      const totalText = document.getElementById("review-total")?.textContent;
      if (!totalText || totalText.trim() === "" || totalText === "0.00") {
        alert("Order totals are missing. Cannot confirm order.");
        return;
      }

      // Everything valid → submit
      submitOrder();
    };
  }
}
