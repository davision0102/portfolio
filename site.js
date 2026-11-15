// Entrée du titre + révélation des images au scroll. Sans JS, tout reste visible.
(function () {
  var root = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Photos de la page À propos : elles partent empilées au centre, puis se déploient.
  var stage = document.querySelector(".fan-free");
  if (stage) {
    var box = stage.getBoundingClientRect(), cx = box.left + box.width / 2, cy = box.top + box.height / 2;
    stage.querySelectorAll(".ph").forEach(function (p) {
      var r = p.getBoundingClientRect();
      p.style.setProperty("--dx", Math.round(cx - (r.left + r.width / 2)) + "px");
      p.style.setProperty("--dy", Math.round(cy - (r.top + r.height / 2)) + "px");
    });
    stage.classList.add("fan-armed");
  }

  var go = function () { root.classList.add("ready"); };
  requestAnimationFrame(function () { requestAnimationFrame(go); });
  setTimeout(go, 120); // filet de sécurité si l'onglet est en arrière-plan

  var els = document.querySelectorAll(".clip-reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  els.forEach(function (e) { io.observe(e); });
})();

// Bouton « Copier mon email » (fonctionne aussi sans animations).
(function () {
  document.querySelectorAll(".copy-mail").forEach(function (btn) {
    var label = btn.querySelector(".copy-label"), status = document.querySelector(".copy-status"), mail = btn.dataset.mail, t, orig = label.textContent;
    btn.addEventListener("click", function () {
      var done = function (ok) {
        label.textContent = ok ? "Email copié ✓" : orig;
        if (status) status.textContent = ok ? mail + " a été copié." : "Copie impossible : écris-moi à " + mail;
        clearTimeout(t); t = setTimeout(function () { label.textContent = orig; if (status) status.textContent = ""; }, 2500);
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(mail).then(function () { done(true); }, function () { window.location.href = "mailto:" + mail; });
      else { window.location.href = "mailto:" + mail; }
    });
  });
})();

// Bouton clair / sombre : mémorise le choix, sinon suit le réglage de l'appareil.
(function () {
  var root = document.documentElement, btn = document.querySelector(".ft-theme");
  if (!btn) return;
  var meta = document.querySelectorAll('meta[name="theme-color"]');
  var label = function () {
    var dark = root.getAttribute("data-theme") === "dark";
    btn.setAttribute("aria-label", dark ? "Passer en mode clair" : "Passer en mode sombre");
    var l = btn.querySelector(".ft-theme-label"); if (l) l.textContent = dark ? "Mode clair" : "Mode sombre";
    meta.forEach(function (m) { m.setAttribute("content", dark ? "#0b0f1a" : "#ffffff"); });
  };
  label();
  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    label();
  });
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  var follow = function (e) {
    var saved; try { saved = localStorage.getItem("theme"); } catch (err) {}
    if (saved !== "light" && saved !== "dark") { root.setAttribute("data-theme", e.matches ? "dark" : "light"); label(); }
  };
  if (mq.addEventListener) mq.addEventListener("change", follow);
})();
