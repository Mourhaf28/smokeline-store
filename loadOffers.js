function loadOfferPrices(offerCode) {
  fetch("https://script.google.com/macros/s/AKfycbz2lfAaBvhqqDEeFzy4k-Bx2boWO7xbAM1VMzlgdA9-Y6AgSPWjb7WcPcuiYoPq0dmn/exec")
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter(item => item.offer === offerCode);
      filtered.forEach(item => {
        const el = document.querySelector(`[data-product="${item.name}"]`);
        if (el) {
          el.textContent = `${item.price} درهم`;
        }
      });
    })
    .catch(err => console.error("⚠️ خطأ في جلب الأسعار:", err));
    }
