function loadOfferPrices(offerCode) {
  fetch("https://script.google.com/macros/s/AKfycbz2lfAaBvhqqDEeFzy4k-Bx2boWO7xbAM1VMzlgdA9-Y6AgSPWjb7WcPcuiYoPq0dmn/exec")
    .then(res => res.json())
    .then(data => {
      const offerPrices = data.filter(item => item.offer === offerCode);

      console.log("✅ العرض:", offerCode);
      console.log("✅ عدد المنتجات:", offerPrices.length);
      console.log("✅ أسماء المنتجات:", offerPrices.map(p => p.name));

      offerPrices.forEach(item => {
        const allMatches = document.querySelectorAll('.price');
        allMatches.forEach(el => {
          const title = el.previousElementSibling?.textContent?.trim();
          if (title && (item.name.includes(title) || title.includes(item.name))) {
            el.textContent = `${item.price} درهم`;
          }
        });
      });
    })
    .catch(err => console.error("⚠️ خطأ في جلب الأسعار:", err));
}
