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


    /* ---------- Smooth scrolling (Lenis) ---------- */
    let lenis = null;
    if (!reduceMotion && window.Lenis) {
        lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
        (function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        })(performance.now());
    }

    // In-page links: smooth scroll, then move keyboard focus to the target
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const id = link.getAttribute("href");
            const target = id.length > 1 && document.querySelector(id);
            if (!target) return;
            event.preventDefault();
            if (lenis) lenis.scrollTo(target, { offset: -16 });
            else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
            history.replaceState(null, "", id);
            if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
        });
    });

    /* ---------- Scroll progress bar ---------- */
    const progress = document.querySelector(".scroll-progress");
    function updateProgress() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    }
    if (progress) {
        window.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();
    }

    /* ---------- Reveal on scroll ---------- */
    const revealTargets = document.querySelectorAll(
        ".section-heading, .card, .project-feature, .stats li, .archive-link, .contact, .editor"
    );
    if (!reduceMotion && "IntersectionObserver" in window) {
        document.documentElement.classList.add("js-reveal");
        const revealer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        revealTargets.forEach(function (el, i) {
            el.style.setProperty("--delay", (i % 4) * 70 + "ms");
            if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
            else revealer.observe(el);
        });
    }

    /* ---------- Highlight the current section in the nav ---------- */
    const navLinks = Array.from(document.querySelectorAll(".nav a[href^='#']"));
    if ("IntersectionObserver" in window && navLinks.length) {
        const spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (a) {
                    a.classList.toggle("is-current", a.getAttribute("href") === "#" + entry.target.id);
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });
        navLinks.forEach(function (a) {
            const section = document.querySelector(a.getAttribute("href"));
            if (section) spy.observe(section);
        });
    }

    window.BECK = { reduceMotion: reduceMotion };
})();
