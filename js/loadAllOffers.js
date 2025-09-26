window.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('#search-box input');
  const resultsContainer = document.getElementById('search-results');
  const dataURL = "https://script.google.com/macros/s/AKfycbwFvP8QP9vdwpyL_Toy6CSwyefmy_A3Fx05CKoyZI4ANN5db6BySGBKMaQxsiGafYnQ7Q/exec";

  let allProducts = [];

  // تحميل كل المنتجات من العروض
  fetch(dataURL)
    .then(res => res.json())
    .then(data => {
      allProducts = data.filter(item => {
        const offer = item.offer?.trim();
        return ["offer1", "offer2", "offer3", "offer4", "offer5", "offer6"].includes(offer);
      }).map(item => ({
        name: item.name?.trim() ?? "بدون اسم",
        price: parseFloat(item.price) || 0,
        offer: item.offer?.trim(),
        section: item.title?.trim() ?? "بدون تصنيف"
      }));
    });

  // تفعيل البحث عند الكتابة
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.trim().toLowerCase();
    showSearchResults(query);
  });

  // دالة عرض النتائج
  function showSearchResults(query) {
    resultsContainer.innerHTML = "";

    if (!query) return;

    const isNumeric = !isNaN(query);
    const qNum = parseFloat(query);

    const results = allProducts.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const priceMatch = isNumeric && Math.abs(item.price - qNum) <= 20;
      return nameMatch || priceMatch;
    });

    if (results.length === 0) {
      resultsContainer.innerHTML = "<p>لا توجد نتائج مطابقة.</p>";
      return;
    }

    results.forEach(item => {
      const row = document.createElement('div');
      row.className = 'offer-item';
      row.tabIndex = 0;

      const name = document.createElement('div');
      name.className = 'title';
      name.textContent = item.name;

      const price = document.createElement('div');
      price.className = 'price';
      price.textContent = item.price + ' AED';

      const meta = document.createElement('div');
      meta.className = 'note';
      meta.textContent = `عرض: ${item.offer} — قسم: ${item.section}`;

      row.appendChild(name);
      row.appendChild(price);
      row.appendChild(meta);

      row.addEventListener('click', () => {
        const label = `${item.name} — ${item.price} AED لكل 5 بوكس`;
        window.location.href = 'order.html?product=' + encodeURIComponent(label);
      });

      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const label = `${item.name} — ${item.price} AED لكل 5 بوكس`;
          window.location.href = 'order.html?product=' + encodeURIComponent(label);
        }
      });

      resultsContainer.appendChild(row);
    });
  }
});
