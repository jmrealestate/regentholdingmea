(async function () {
  try {
    const id = new URLSearchParams(location.search).get("id");
    if (!/^[\w-]+$/.test(id || "")) throw new Error("Unknown business.");
    const company = await loadJSON("data/company.json");
    const b = await loadJSON(`data/businesses/${id}.json`);
    const others = await Promise.all(company.businesses.filter((x) => x !== id).map((x) => loadJSON(`data/businesses/${x}.json`)));

    document.title = `${b.name} | ${company.name}`;
    document.getElementById("logo").textContent = company.logoText || company.name;

    const hero = document.getElementById("hero");
    hero.style.backgroundImage = `url('${b.banner || b.cover}')`;
    hero.querySelector("small").textContent = b.category;
    hero.querySelector("h1").textContent = b.name;
    hero.querySelector("p").textContent = b.tagline;

    document.getElementById("desc").innerHTML = b.description.map((t) => `<p>${esc(t)}</p>`).join("");
    document.getElementById("highlights").innerHTML = (b.highlights || [])
      .map((h) => `<div class="highlight"><h4>${esc(h.title)}</h4><p>${esc(h.text)}</p></div>`).join("");

    document.getElementById("gallery").innerHTML = (b.gallery || [])
      .map((g, i) => `<button class="shot" data-i="${i}"><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy"></button>`).join("");

    const rev = document.getElementById("reviews");
    if (b.reviews?.length) document.getElementById("review-grid").innerHTML = b.reviews.map(reviewCard).join("");
    else rev.remove();

    document.getElementById("contact-info").innerHTML = contactList(b.contact);

    document.getElementById("other-brands").innerHTML = others
      .map((o) => `<a class="brand-card small" href="business.html?id=${encodeURIComponent(o.id)}" style="background-image:url('${esc(o.cover)}')">
        <div class="brand-info"><h3>${esc(o.name)}</h3></div></a>`).join("");
    document.getElementById("copy").textContent = `© ${new Date().getFullYear()} ${company.name}. All rights reserved.`;

    // Lightbox
    const lb = document.getElementById("lightbox"), img = lb.querySelector("img"), cap = lb.querySelector("figcaption");
    let cur = 0;
    const show = (i) => {
      cur = (i + b.gallery.length) % b.gallery.length;
      img.src = b.gallery[cur].src; img.alt = b.gallery[cur].caption; cap.textContent = b.gallery[cur].caption;
      lb.classList.add("open");
    };
    document.getElementById("gallery").addEventListener("click", (e) => {
      const s = e.target.closest(".shot"); if (s) show(+s.dataset.i);
    });
    lb.addEventListener("click", (e) => {
      if (e.target.closest(".prev")) show(cur - 1);
      else if (e.target.closest(".next")) show(cur + 1);
      else if (e.target !== img) lb.classList.remove("open");
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") lb.classList.remove("open");
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
  } catch (err) {
    showError(err);
  }
})();
