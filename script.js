/* =====================================================
   CONFIGURATION – edit ONLY this block
   ===================================================== */
const CONFIG = {
  WHATSAPP_NUMBER: "212633130402",   // PLACEHOLDER: international format, no "+" (e.g. 2126XXXXXXXX)
  PHONE_NUMBER: "+212633130402",     // PLACEHOLDER: shown on the "Appeler" buttons
  FACEBOOK_URL: "https://www.facebook.com/fatma.massou.3", // PLACEHOLDER: your Facebook page link
  EMAIL: "massoufatima23@gmail.com",                         // Optional: used as a fallback if the form is not configured
  LOCATION: "Mohmmedia – cours à domicile et en ligne",                      // Optional, e.g. "Casablanca – cours à domicile et en ligne"
  PROFILE_PHOTO: "",                 // Optional, e.g. "assets/fatima.jpg"
  FORMSPREE_ENDPOINT: "https://formspree.io/f/mgavjgly", // PLACEHOLDER: your Formspree form URL
  SHOW_PRICING: false,               // true = show the "Formules" section
  PRICES: { individuel: "", pack: "", examens: "" } // e.g. "150 DH / séance" (empty = "Prix à définir")
};

/* ===================================================== */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// 1. Fill contact links everywhere
const wa = "https://wa.me/" + CONFIG.WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Bonjour Fatima, je souhaite des informations sur les cours de maths.");
$$('[data-link="whatsapp"]').forEach(a => a.href = wa);
$$('[data-link="phone"]').forEach(a => a.href = "tel:" + CONFIG.PHONE_NUMBER.replace(/\s/g, ""));
$$('[data-link="facebook"]').forEach(a => a.href = CONFIG.FACEBOOK_URL);
if (CONFIG.LOCATION) { $("#loc").textContent = CONFIG.LOCATION; }
if (CONFIG.PROFILE_PHOTO) { const p = $("#profilePhoto"); p.src = CONFIG.PROFILE_PHOTO; p.hidden = false; }

// 2. Pricing section on/off + prices
if (CONFIG.SHOW_PRICING) {
  $("#formules").hidden = false;
  $$("[data-price]").forEach(el => { const v = CONFIG.PRICES[el.dataset.price]; if (v) el.textContent = v; });
}

// 3. Mobile menu
const burger = $(".burger"), menu = $("#menu");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
});
$$("#menu a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); }));

// 4. Soft reveal on scroll
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .1 }) : null;
$$(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));

// 5. Learning corner
const tips = [
  "Pour multiplier par 5, multiplie par 10 puis divise par 2.",
  "Un nombre est divisible par 3 si la somme de ses chiffres l’est.",
  "Pour vérifier une équation, remplace x par ta solution.",
  "(a + b)² = a² + 2ab + b² : pense au double produit !",
  "Face à un problème, commence par faire un schéma."
];
let t = 0;
$("#tip").textContent = tips[0];
$("#tipBtn").addEventListener("click", () => { t = (t + 1) % tips.length; $("#tip").textContent = tips[t]; });

$("#challengeBtn").addEventListener("click", e => {
  const ans = $("#challengeAns"); ans.hidden = !ans.hidden;
  e.target.textContent = ans.hidden ? "Voir la réponse" : "Masquer la réponse";
  e.target.setAttribute("aria-expanded", !ans.hidden);
});

$$("#quiz button").forEach(b => b.addEventListener("click", () => {
  $$("#quiz button").forEach(x => x.classList.remove("good", "bad"));
  const ok = b.dataset.ok === "1";
  b.classList.add(ok ? "good" : "bad");
  $("#quizMsg").textContent = ok ? "Bravo ! 9 + 16 = 25." : "Pas tout à fait. Rappel : 3² = 9 et 4² = 16. Essaie encore !";
}));

// 6. Contact form (Formspree)
$("#form").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, msg = $("#formMsg");
  if (!f.checkValidity()) { msg.textContent = "Merci de remplir le nom du parent, le nom de l’élève et le niveau."; return; }
  if (CONFIG.FORMSPREE_ENDPOINT.includes("XXXX")) {
    msg.textContent = "Le formulaire n’est pas encore activé. Contactez Fatima directement par WhatsApp ou par téléphone.";
    return;
  }
  msg.textContent = "Envoi en cours…";
  try {
    const r = await fetch(CONFIG.FORMSPREE_ENDPOINT, { method: "POST", body: new FormData(f), headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error();
    f.reset(); msg.textContent = "Merci ! Votre demande a bien été envoyée. Fatima vous répondra bientôt.";
  } catch (_) {
    msg.textContent = "L’envoi a échoué. Merci de réessayer ou d’utiliser WhatsApp.";
  }
});
