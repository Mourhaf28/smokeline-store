window.addEventListener('DOMContentLoaded', () => {
  const offerCode = "offer2"; // ← تأكد أن اسم العرض مطابق للجدول

  const container = document.getElementById(`${offerCode}-sections`);
  if (!container) return;

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
      if (offerItems.length === 0) {
        container.innerHTML = "<p>لا توجد منتجات لهذا العرض.</p>";
        return;
      }

      // تقسيم حسب الأقسام
      const grouped = {};
      offerItems.forEach(item => {
        const section = item.title || "بدون تصنيف";
        if (!grouped[section]) grouped[section] = [];
        grouped[section].push(item);
      });

      Object.entries(grouped).forEach(([sectionTitle, items], idx) => {
        const section = document.createElement('div');
        section.className = 'offer-section';

        const head = document.createElement('div');
        head.className = 'sec-head';
        head.innerHTML = `<div class="sec-title">${sectionTitle}</div><div class="sec-toggle" aria-hidden="true">+</div>`;

        const list = document.createElement('div');
        list.className = 'offer-list';
        list.id = `${offerCode}-list-${idx}`;

        items.forEach((item, i) => {
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
      });

      // افتح أول قسم تلقائيًا
      const firstList = document.querySelector('.offer-list');
      if(firstList) {
        firstList.classList.add('show');
        const firstToggle = document.querySelector('.sec-head .sec-toggle');
        if(firstToggle) firstToggle.textContent = '−';
      }
    })
    .catch(err => {
      showDebug("⚠️ خطأ في جلب البيانات: " + err.message);
      container.innerHTML = "<p>تعذر تحميل المنتجات. حاول لاحقًا.</p>";
    });
});
