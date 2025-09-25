window.addEventListener('DOMContentLoaded', () => {
  const offerCode = "offer2";

  const container = document.getElementById(`${offerCode}-sections`);
  if (!container) {
    showDebug(`❌ العنصر #${offerCode}-sections غير موجود`);
    return;
  }

  showDebug("✅ السكربت بدأ التنفيذ");

  function showDebug(msg) {
    const box = document.createElement('div');
    box.style = "background:#222;color:#eee;padding:6px;margin:6px;border:1px solid #444;font-size:14px";
    box.textContent = msg;
    document.body.appendChild(box);
  }

  function openOrder(name, price){
    const label = `${name} — ${price} AED لكل 5 بوكس`;
    window.location.href = 'order.html?product=' + encodeURIComponent(label);
  }

  fetch("https://script.google.com/macros/s/AKfycbyOcb7ygB_v1ZvK0HF5wwpBiGXYdtri_rHRYo_1UTQwyKyAh0NhDkNNMVrW6VCBD8cB/exec")
    .then(res => res.json())
    .then(data => {
      showDebug("✅ تم جلب البيانات من Google Sheets");

      const offerItems = data.filter(item => item.offer === offerCode);
      showDebug(`✅ عدد المنتجات: ${offerItems.length}`);

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
        showDebug(`🟢 ${item.name} ← ${item.price} AED`);

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
      showDebug("⚠️ خطأ في جلب البيانات: " + err.message);
      container.innerHTML = "<p>تعذر تحميل المنتجات. حاول لاحقًا.</p>";
    });
});
