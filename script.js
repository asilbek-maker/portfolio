// BECK portfolio interactions
(function () {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Mobile hamburger drawer ---------- */
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("site-nav");
    const backdrop = document.querySelector(".nav-backdrop");

    function setMenu(open) {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.querySelector(".menu-label").textContent = open ? "Close" : "Menu";
        nav.classList.toggle("is-open", open);
        backdrop.hidden = !open;
        document.body.classList.toggle("menu-open", open);
        if (open) nav.querySelector("a").focus();
    }

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            setMenu(toggle.getAttribute("aria-expanded") !== "true");
        });
        backdrop.addEventListener("click", function () { setMenu(false); });
        nav.addEventListener("click", function (event) {
            if (event.target.closest("a")) setMenu(false);
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && nav.classList.contains("is-open")) {
                setMenu(false);
                toggle.focus();
            }
        });
        window.matchMedia("(min-width: 641px)").addEventListener("change", function (e) {
            if (e.matches) setMenu(false);
        });
    }

    window.BECK = { reduceMotion: reduceMotion };
})();
