<script>
window.addEventListener('DOMContentLoaded', () => {
  const offerCode = "offer1"; // ← غيّر حسب العرض المطلوب
  const container = document.getElementById(`${offerCode}-sections`);
  if (!container) {
    console.error(`❌ العنصر #${offerCode}-sections غير موجود`);
    return;
  }

  function openOrder(name, price){
    const label = `${name} — ${price} AED لكل 5 بوكس`;
    window.location.href = 'order.html?product=' + encodeURIComponent(label);
  }

  fetch("https://script.google.com/macros/s/AKfycbz2lfAaBvhqqDEeFzy4k-Bx2boWO7xbAM1VMzlgdA9-Y6AgSPWjb7WcPcuiYoPq0dmn/exec")
    .then(res => res.json())
    .then(data => {
      const offerItems = data.filter(item => item.offer === offerCode);
      if (offerItems.length === 0) {
        container.innerHTML = "<p>لا توجد منتجات لهذا العرض.</p>";
        return;
      }

      const section = document.createElement('div');
      section.className = 'offer-section';

      const head = document.createElement('div');
      head.className = 'sec-head';
      head.innerHTML = `<div class="sec-title">منتجات ${offerCode}</div><div class="sec-toggle" aria-hidden="true">+</div>`;

      const list = document.createElement('div');
      list.className = 'offer-list show';
      list.id = `${offerCode}-list`;

      offerItems.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'offer-item';
        row.tabIndex = 0;

        const t = document.createElement('div');
        t.className = 'title';
        t.textContent = item.name;

        const p = document.createElement('div');
        p.className = 'price';
        p.textContent = item.price + ' AED';

        row.appendChild(t);
        row.appendChild(p);
        row.addEventListener('click', () => openOrder(item.name, item.price));
        row.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') openOrder(item.name, item.price);
        });

        list.appendChild(row);
      });

      head.addEventListener('click', () => {
        const open = list.classList.toggle('show');
        head.querySelector('.sec-toggle').textContent = open ? '−' : '+';
      });

      section.appendChild(head);
      section.appendChild(list);
      container.appendChild(section);
    })
    .catch(err => {
      console.error("⚠️ خطأ في جلب المنتجات:", err);
      container.innerHTML = "<p>تعذر تحميل المنتجات. حاول لاحقًا.</p>";
    });
});
</script>
