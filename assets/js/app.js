// ===== Helpers =====
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

// ===== i18n loader (JSON) =====
const dictCache = {};
async function loadDict(lang) {
    if (dictCache[lang]) return dictCache[lang];
    const res = await fetch(`./assets/i18n/${lang}.json`);
    dictCache[lang] = await res.json();
    return dictCache[lang];
}
function applyI18n(dict) {
    $$("[data-i18n]").forEach(el => {
        const k = el.getAttribute("data-i18n");
        if (dict[k] !== undefined) el.textContent = dict[k];
    });
    $$("[data-ph]").forEach(el => {
        const k = el.getAttribute("data-ph");
        if (dict[k] !== undefined) el.placeholder = dict[k];
    });
}
async function setLang(lang) {
    const dict = await loadDict(lang);
    applyI18n(dict);

    // --- Dynamic replacements ---
    const currentYear = new Date().getFullYear();
    const startYear = 2010;
    const years = currentYear - startYear;

    // Replace placeholders like {{years}} and {{year}}
    document.body.innerHTML = document.body.innerHTML
        .replace(/\{\{years\}\}/g, years)
        .replace(/\{\{year\}\}/g, currentYear);

    document.documentElement.lang = lang === "pt" ? "pt-br" : lang;
    localStorage.setItem("lang", lang);
}

// ===== Theme toggle =====
function setTheme(mode) {
    const body = document.body;
    const logo = $("#logo");
    body.classList.toggle("light", mode === "light");
    $(".icon-sun")?.classList.toggle("hidden", mode === "light");
    $(".icon-moon")?.classList.toggle("hidden", mode !== "light");
    const swap = mode === "light" ? logo?.dataset.light : logo?.dataset.dark;
    if (logo && swap && swap !== "undefined") logo.src = swap;
    localStorage.setItem("theme", mode);
}
function toggleTheme() { setTheme(document.body.classList.contains("light") ? "dark" : "light"); }

// ===== Events & init =====
$("#themeToggle")?.addEventListener("click", toggleTheme);
$("#lang")?.addEventListener("change", (e) => setLang(e.target.value));
window.addEventListener("load", async () => {
    setTheme(localStorage.getItem("theme") || "dark");
    await setLang(localStorage.getItem("lang") || "pt");

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Auto-calculate years of experience since 2010
    const startYear = 2008;
    const experienceEl = document.getElementById('years-experience');
    if (experienceEl) {
        const currentYear = new Date().getFullYear();
        experienceEl.textContent = currentYear - startYear;
    }
});
