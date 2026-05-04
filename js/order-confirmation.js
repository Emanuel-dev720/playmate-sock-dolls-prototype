/* ============================================================
   ORDER CONFIRMATION PAGE
============================================================ */

function loadOrderConfirmation() {
  const order = JSON.parse(localStorage.getItem("lastOrder"));
  if (!order) return;

  const num = document.getElementById("order-number");
  const email = document.getElementById("order-email");
  const total = document.getElementById("order-total");
  const summary = document.getElementById("order-summary");

  if (num) num.textContent = order.number;
  if (email) email.textContent = order.email;
  if (total) total.textContent = order.total;

  if (!summary) return;

  summary.innerHTML = "";

  order.items.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    const div = document.createElement("div");
    div.className = "order-item";

    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="order-item-details">
        <p><strong>${product.name}</strong></p>
        <p>Quantity: ${item.qty}</p>
        <p>Price: $${product.price.toFixed(2)}</p>
        <p>Total: $${(product.price * item.qty).toFixed(2)}</p>
      </div>
    `;

    summary.appendChild(div);
  });
}
