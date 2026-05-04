/* ============================================================
   PRODUCT LISTING
============================================================ */

function renderProducts(productArray) {
  const container = document.getElementById("product-list");
  if (!container) return;

  container.innerHTML = "";

  productArray.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button type="button" data-product-id="${product.id}">
        Add to Cart
      </button>
    `;

    card.querySelector("button").addEventListener("click", () => addToCart(product.id));
    container.appendChild(card);
  });
}
