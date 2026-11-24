/* app.js — Biblio-Audiophile-CD */
"use strict";

/* ---------- Utilitaires ---------- */
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function norm(s) {
  return String(s || "").toLowerCase().trim();
}

/* ---------- Recherche ---------- */
function ficheCorrespond(a, mode, q) {
  const nq = norm(q);
  if (!nq) return true;
  if (mode === "tout") {
    return (
      norm(a.version.catalogue).indexOf(nq) !== -1 ||
      (a.version.ean !== "—" && norm(a.version.ean).indexOf(nq) !== -1) ||
      norm(a.artiste).indexOf(nq) !== -1 ||
      norm(a.album).indexOf(nq) !== -1 ||
      norm(a.genre).indexOf(nq) !== -1 ||
      a.pistes.some(function (p) {
        return norm(p.titre).indexOf(nq) !== -1 || norm(p.compositeur).indexOf(nq) !== -1;
      })
    );
  }
  if (mode === "catalogue") return norm(a.version.catalogue).indexOf(nq) !== -1;
  if (mode === "ean") return a.version.ean !== "—" && norm(a.version.ean).indexOf(nq) !== -1;
  if (mode === "morceau") {
    return a.pistes.some(function (p) {
      return norm(p.titre).indexOf(nq) !== -1 || norm(p.remarque).indexOf(nq) !== -1;
    });
  }
  if (mode === "compositeur") {
    return a.pistes.some(function (p) {
      return norm(p.compositeur).indexOf(nq) !== -1;
    });
  }
  if (mode === "artiste") return norm(a.artiste).indexOf(nq) !== -1 || norm(a.album).indexOf(nq) !== -1;
  return true;
}

function renderFiches() {
  const champ = document.getElementById("champ-recherche");
  const modeSel = document.getElementById("mode-recherche");
  const q = champ.value;
  const mode = modeSel.value;
  const zone = document.getElementById("liste-fiches");
  const matches = ALBUMS.filter(function (a) { return ficheCorrespond(a, mode, q); });

  let entete = "";
  if (norm(q)) {
    const libelles = {
      tout: "tout champ", catalogue: "réf. catalogue", ean: "code EAN",
      morceau: "morceau", compositeur: "compositeur", artiste: "artiste / album"
    };
    entete = "<p class=\"resultat-info\">" + matches.length + " fiche" +
      (matches.length > 1 ? "s" : "") + " pour « " + esc(q) + " » (mode : " + libelles[mode] +
      ") — <button type=\"button\" id=\"btn-effacer\" class=\"lien\">effacer le filtre</button></p>";
  }

  if (matches.length === 0) {
    zone.innerHTML = entete + "<p class=\"aucun\">Aucune fiche ne correspond. " +
      "Vérifiez le mode de recherche (une référence catalogue exacte, « 9 60774-2 », un EAN complet comme « 074646493524 », ou un fragment de titre de morceau).</p>";
    if (norm(q)) {
      const b = document.getElementById("btn-effacer");
      if (b) b.addEventListener("click", function () {
        champ.value = "";
        renderFiches();
      });
    }
    return;
  }

  zone.innerHTML = entete + matches.map(ficheHTML).join("");
}

/* ---------- Rendu d’une fiche ---------- */
function ficheHTML(a) {
  const eanCell = a.version.ean !== "—"
    ? esc(a.version.ean)
    : "<span class=\"indispo\">non confirmé</span>";
  const html = "<article class=\"fiche\" id=\"fiche-" + esc(a.id) + "\">" +
    "<header class=\"fiche-tete\">" +
      "<h2>" + esc(a.artiste) + " — " + esc(a.album) + "</h2>" +
      "<p class=\"metas\">" + esc(a.genre) + " · " + esc(a.annee) + "</p>" +
    "</header>" +
    "<p class=\"resume\">" + esc(a.resume) + "</p>" +
    "<section class=\"partie\">" +
      "<h3>Partie 1 — La version : pressage et identification</h3>" +
      "<table class=\"refs\">" +
        "<tr><th>Éditeur</th><td>" + esc(a.version.label) + "</td></tr>" +
        "<tr><th>Référence catalogue</th><td><code>" + esc(a.version.catalogue) + "</code></td></tr>" +
        "<tr><th>Code EAN</th><td><code>" + eanCell + "</code></td></tr>" +
        "<tr><th>Score DR</th><td><span class=\"badge-dr\" title=\"Dynamique moyenne du CD\">DR " + a.version.dr + "</span> <span class=\"dr-note\">" + esc(a.version.drNote) + "</span></td></tr>" +
      "</table>" +
      "<ul class=\"identification\">" +
        a.identification.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") +
      "</ul>" +
      (a.anecdote ? "<div class=\"anecdote\"><span class=\"anecdote-titre\">Anecdote</span>" + esc(a.anecdote) + "</div>" : "") +
    "</section>" +
    "<section class=\"partie\">" +
      "<h3>Partie 2 — Les morceaux remarquables</h3>" +
      "<ul class=\"pistes\">" +
        a.pistes.map(function (p) {
          return "<li><strong>" + esc(p.titre) + "</strong> <span class=\"comp\">— " + esc(p.compositeur) + "</span>" +
            "<br><span class=\"remarque\">" + esc(p.remarque) + "</span></li>";
        }).join("") +
      "</ul>" +
    "</section>" +
  "</article>";
  return html;
}

/* ---------- Statistiques ---------- */
function majStatsAvec(matches) {
  const el = document.getElementById("stats");
  let morceaux = 0;
  const comps = {};
  matches.forEach(function (a) {
    morceaux += a.pistes.length;
    a.pistes.forEach(function (p) { comps[norm(p.compositeur)] = true; });
  });
  const nbComps = Object.keys(comps).length;
  const total = matches.length;
  el.textContent = total + " fiche" + (total > 1 ? "s" : "") + " · " + morceaux +
    " morceau" + (morceaux > 1 ? "x" : "") + " remarquable" + (morceaux > 1 ? "s" : "") +
    " · " + nbComps + " compositeur" + (nbComps > 1 ? "s" : "") +
    " (sur " + ALBUMS.length + " fiches au total)";
}

/* ---------- Version ---------- */
function initVersion() {
  const el = document.getElementById("app-version");
  el.textContent = "Version " + APP_VERSION + " · build du " + APP_BUILD_DATE +
    " à " + APP_BUILD_TIME + " (UTC)";
}

/* ---------- Initialisation ---------- */
function init() {
  initVersion();
  renderFiches();

  document.getElementById("champ-recherche").addEventListener("input", renderFiches);
  document.getElementById("mode-recherche").addEventListener("change", renderFiches);

  majStatsAvec(ALBUMS);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
