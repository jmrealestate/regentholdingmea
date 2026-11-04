(async function () {
  try {
    const company = await loadJSON("data/company.json");
    const brands = await Promise.all(company.businesses.map((id) => loadJSON(`data/businesses/${id}.json`)));
    document.title = company.name;

    // Header
    document.getElementById("logo").textContent = company.logoText || company.name;

    // Hero
    const hero = document.getElementById("hero");
    hero.style.backgroundImage = `url('${company.hero.image}')`;
    hero.querySelector("h1").textContent = company.hero.title;
    hero.querySelector("p").textContent = company.hero.subtitle;
    hero.querySelector(".btn").textContent = company.hero.buttonText;

    // Brands
    document.getElementById("brands-title").textContent = company.businessesSection.title;
    document.getElementById("brands-sub").textContent = company.businessesSection.subtitle;
    document.getElementById("brand-grid").innerHTML = brands
      .map((b) => `<a class="brand-card" href="business.html?id=${encodeURIComponent(b.id)}" style="background-image:url('${esc(b.cover)}')">
          <div class="brand-info"><small>${esc(b.category)}</small><h3>${esc(b.name)}</h3><p>${esc(b.tagline)}</p><span class="more">Explore →</span></div>
        </a>`)
      .join("");

    // About
    document.getElementById("about-title").textContent = company.about.title;
    document.getElementById("about-text").innerHTML = company.about.text.map((t) => `<p>${esc(t)}</p>`).join("");
    document.getElementById("stats").innerHTML = company.about.stats
      .map((s) => `<div><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join("");

    // Reviews
    document.getElementById("reviews-title").textContent = company.reviews.title;
    document.getElementById("review-grid").innerHTML = company.reviews.items.map(reviewCard).join("");

    // Location + Contact
    const loc = company.location, c = company.contact;
    document.getElementById("location-title").textContent = loc.title;
    document.getElementById("map").innerHTML = `<iframe src="${esc(loc.mapEmbed)}" loading="lazy" title="Map" allowfullscreen></iframe>`;
    document.getElementById("location-address").innerHTML = `${esc(loc.address)} · <a href="${esc(loc.mapLink)}" target="_blank" rel="noopener">Open in Google Maps</a>`;
    document.getElementById("contact-title").textContent = c.title;
    document.getElementById("contact-info").innerHTML = contactList(c);

    // Footer
    document.getElementById("social").innerHTML = Object.entries(c.social || {})
      .map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}</a>`).join("");
    document.getElementById("copy").textContent = `© ${new Date().getFullYear()} ${company.name}. All rights reserved.`;
    document.getElementById("footer-brands").innerHTML = brands
      .map((b) => `<a href="business.html?id=${encodeURIComponent(b.id)}">${esc(b.name)}</a>`).join("");
  } catch (err) {
    showError(err);
  }
})();
