// Shared helpers
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load ${path}`);
  return res.json();
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function stars(n) {
  const r = Math.max(0, Math.min(5, Number(n) || 0));
  return "★".repeat(r) + "☆".repeat(5 - r);
}

function reviewCard(r) {
  return `<figure class="review">
    <div class="stars" aria-label="${esc(r.rating)} out of 5">${stars(r.rating)}</div>
    <blockquote>${esc(r.text)}</blockquote>
    <figcaption><strong>${esc(r.name)}</strong>${r.role ? `, ${esc(r.role)}` : ""}${r.business ? `<span> · ${esc(r.business)}</span>` : ""}</figcaption>
  </figure>`;
}

function contactList(c) {
  const rows = [];
  if (c.address) rows.push(`<li><span>Address</span>${esc(c.address)}</li>`);
  if (c.phone) rows.push(`<li><span>Phone</span><a href="tel:${esc(c.phone.replace(/\s/g, ""))}">${esc(c.phone)}</a></li>`);
  if (c.hours) rows.push(`<li><span>Hours</span>${esc(c.hours)}</li>`);
  if (c.website) rows.push(`<li><span>Website</span><a href="${esc(c.website)}" target="_blank" rel="noopener">${esc(c.website)}</a></li>`);
  if (c.whatsapp) rows.push(`<li><span>WhatsApp</span><a href="https://wa.me/${esc(c.whatsapp.replace(/\D/g, ""))}" target="_blank" rel="noopener">Chat with us</a></li>`);
  return `<ul class="contact-list">${rows.join("")}</ul>`;
}

function showError(err) {
  document.body.innerHTML = `<div class="error"><h1>Could not load site data</h1><p>${esc(err.message)}</p>
  <p>If you opened the file by double-clicking, please run <b>start-server.bat</b> instead (browsers block JSON files on file://).</p></div>`;
}

// Mobile nav + header shadow
document.addEventListener("click", (e) => {
  if (e.target.closest(".nav-toggle")) document.querySelector(".nav").classList.toggle("open");
  else if (e.target.closest(".nav a")) document.querySelector(".nav")?.classList.remove("open");
});
window.addEventListener("scroll", () => document.querySelector(".site-header")?.classList.toggle("solid", scrollY > 40));
