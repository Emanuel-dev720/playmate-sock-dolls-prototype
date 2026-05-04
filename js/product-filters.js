/* ============================================================
   PRODUCT FILTERS
============================================================ */

function setupProductFilters() {
  const searchInput = document.getElementById("product-search");
  const categorySelect = document.getElementById("product-category-filter");

  if (!searchInput || !categorySelect) return;

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categorySelect.value;

    let filtered = products;

    if (category !== "all") {
      filtered = filtered.filter(p => p.category === category);
    }

    if (searchTerm.length > 0) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    renderProducts(filtered);
  }

  searchInput.addEventListener("input", applyFilters);
  categorySelect.addEventListener("change", applyFilters);
}
