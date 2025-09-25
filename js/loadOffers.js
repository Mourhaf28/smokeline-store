window.addEventListener('DOMContentLoaded', () => {
  const offerCode = "offer2";
  const container = document.getElementById(`${offerCode}-sections`);
  if (!container) return;

  function debug(msg) {
    const box = document.createElement('div');
    box.style = "background:#222;color:#0f0;padding:6px;margin:6px;border:1px solid #444;font-size:14px";
    box.textContent = msg;
    document.body.appendChild(box);
  }

  function openOrder(name, price){
    const label = `${name} — ${price} AED لكل 5 بوكس`;
    window.location.href = 'order.html?product=' + encodeURIComponent(label);
  }

  fetch("https://script.google.com/macros/s/AKfycbwFvP8QP9vdwpyL_Toy6CSwyefmy_A3Fx05CKoyZI4ANN5db6BySGBKMaQxsiGafYnQ7Q/exec")
    .then(res => res.json())
    .then(data => {
      const offerItems = data.filter(item => item.offer?.trim() === offerCode);
      debug(`📦 عدد المنتجات لهذا العرض: ${offerItems.length}`);

      if (offerItems.length === 0) {
        container.innerHTML = "<p>لا توجد منتجات لهذا العرض.</p>";
        return;
      }

      // عرض أسماء الأعمدة المقروءة فعليًا
      const keys = Object.keys(offerItems[0]);
      debug("🧩 الأعمدة المقروءة: " + keys.join(", "));

      // عرض أول 5 منتجات لهذا العرض
      offerItems.slice(0, 5).forEach((item, i) => {
        debug(`🔍 المنتج ${i + 1}: ${item.name} | القسم: ${item.title}`);
      });

      // تصنيف حسب القسم مع توحيد الكتابة
      const grouped = {};
      const displayNames = {};
      offerItems.forEach(item => {
        const raw = item.title ?? "بدون تصنيف";
        const key = raw.trim().toLowerCase();
        displayNames[key] = raw.trim();
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      });

      Object.entries(grouped).forEach(([key, items], idx) => {
        const sectionTitle = displayNames[key];
        debug(`📂 قسم: ${sectionTitle} | عدد المنتجات: ${items.length}`);

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

      const firstList = document.querySelector('.offer-list');
      if(firstList) {
        firstList.classList.add('show');
        const firstToggle = document.querySelector('.sec-head .sec-toggle');
        if(firstToggle) firstToggle.textContent = '−';
      }
    })
    .catch(err => {
      debug("⚠️ خطأ في جلب البيانات: " + err.message);
      container.innerHTML = "<p>تعذر تحميل المنتجات. حاول لاحقًا.</p>";
    });
});
