// BECK — interactions
// Sections: theme, mobile menu, smooth scroll, current section, terminal, case studies, copy email.
(function () {
    "use strict";

    var root = document.documentElement;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Theme: paper / blueprint ---------- */
    var themeBtn = document.querySelector(".theme-toggle");

    function applyTheme(theme) {
        root.dataset.theme = theme;
        var blueprint = theme === "blueprint";
        themeBtn.setAttribute("aria-pressed", String(blueprint));
        themeBtn.querySelector(".theme-label").textContent = blueprint ? "Paper" : "Blueprint";
        themeBtn.setAttribute("aria-label", blueprint ? "Switch to paper theme" : "Switch to blueprint theme");
        document.querySelector('meta[name="theme-color"]').setAttribute("content", blueprint ? "#14304D" : "#ECEEF0");
    }

    function setTheme(theme) {
        applyTheme(theme);
        try { localStorage.setItem("beck-theme", theme); } catch (e) {}
    }

    if (themeBtn) {
        applyTheme(root.dataset.theme === "blueprint" ? "blueprint" : "paper");
        themeBtn.addEventListener("click", function () {
            setTheme(root.dataset.theme === "blueprint" ? "paper" : "blueprint");
        });
    }

    /* ---------- Mobile menu ---------- */
    var menuBtn = document.querySelector(".menu-toggle");
    var nav = document.getElementById("site-nav");
    var backdrop = document.querySelector(".nav-backdrop");

    function setMenu(open) {
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.querySelector(".menu-label").textContent = open ? "Close" : "Menu";
        nav.classList.toggle("is-open", open);
        backdrop.hidden = !open;
        document.body.classList.toggle("menu-open", open);
        if (open) nav.querySelector("a").focus();
    }

    if (menuBtn && nav) {
        menuBtn.addEventListener("click", function () {
            setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
        });
        backdrop.addEventListener("click", function () { setMenu(false); });
        nav.addEventListener("click", function (e) {
            if (e.target.closest("a")) setMenu(false);
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && nav.classList.contains("is-open")) {
                setMenu(false);
                menuBtn.focus();
            }
        });
        window.matchMedia("(min-width: 761px)").addEventListener("change", function (e) {
            if (e.matches) setMenu(false);
        });
    }

    /* ---------- Smooth scrolling ---------- */
    var lenis = null;
    if (!reduceMotion && window.Lenis) {
        lenis = new window.Lenis({ duration: 1.05, smoothWheel: true });
        (function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        })(performance.now());
    }

    function scrollToTarget(target) {
        if (lenis) lenis.scrollTo(target, { offset: -76 });
        else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
    }

    document.addEventListener("click", function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) return;
        var id = link.getAttribute("href");
        var target = id.length > 1 && document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        history.replaceState(null, "", id === "#top" ? location.pathname : id);
        scrollToTarget(target);
    });

    /* ---------- Highlight the current section in the nav ---------- */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
    if ("IntersectionObserver" in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (a) {
                    var on = a.getAttribute("href") === "#" + entry.target.id;
                    a.classList.toggle("is-current", on);
                    if (on) a.setAttribute("aria-current", "location");
                    else a.removeAttribute("aria-current");
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });
        ["top", "about", "journey", "skills", "work", "beyond", "exploring", "contact"].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) spy.observe(el);
        });
    }

    /* ---------- The BECK terminal ---------- */
    var log = document.querySelector(".terminal-log");
    var form = document.querySelector(".terminal-form");
    var input = document.getElementById("terminal-input");

    // Each command returns lines. A line is a string, or [text, className], or {text, href}.
    var commands = {
        help: function () {
            return [
                ["Available commands:", "t-muted"],
                ["  whoami    who is behind BECK", "t-out"],
                ["  projects  what I've built", "t-out"],
                ["  journey   how I got here", "t-out"],
                ["  skills    what I can do", "t-out"],
                ["  now       what I'm exploring", "t-out"],
                ["  contact   how to reach me", "t-out"],
                ["  theme     switch paper / blueprint", "t-out"],
                ["  clear     clear the screen", "t-out"]
            ];
        },
        whoami: function () {
            return [
                ["Asilbek", "t-key"],
                "Computer Engineering student",
                "Front-end developer",
                "Aspiring AI engineer",
                ["Building ideas into things people can use.", "t-muted"]
            ];
        },
        projects: function () {
            return [
                { text: "01 Overlap — campus community platform", href: "#work" },
                { text: "02 PharmVault — pharmacy stock manager", href: "#work" },
                { text: "03 Life Agent — my life tracker with an AI coach", href: "#work" },
                { text: "04 Browser API playground — six demos", href: "#work" },
                { text: "05 Book Finder — Open Library search", href: "#work" },
                { text: "06 Accessibility audit — 95 to 100", href: "#work" },
                ["Open a project card to read its case study.", "t-muted"]
            ];
        },
        journey: function () {
            return [
                ["[built]    fundamentals: HTML, CSS", "t-out"],
                ["[built]    interactive sites: JavaScript, DOM", "t-out"],
                ["[built]    APIs and browser technologies", "t-out"],
                ["[building] real-world projects", "t-key"],
                ["[next]     AI and intelligent applications", "t-muted"]
            ];
        },
        skills: function () {
            return [
                ["frontend   HTML5  CSS3  JavaScript  (React: practising)", "t-out"],
                ["web        Fetch  Web Storage  Browser APIs  Forms", "t-out"],
                ["tools      Git  GitHub  VS Code  DevTools  Lighthouse", "t-out"],
                ["exploring  Python  AI  Machine learning", "t-key"]
            ];
        },
        now: function () {
            return [
                ["You are here: Python", "t-key"],
                "Next: machine learning fundamentals",
                "Then: AI engineering",
                ["Goal: useful AI applications", "t-muted"]
            ];
        },
        contact: function () {
            return [
                { text: "email   asilbek@gachon.ac.kr", href: "mailto:asilbek@gachon.ac.kr" },
                { text: "github  github.com/asilbek-maker", href: "https://github.com/asilbek-maker" }
            ];
        },
        theme: function () {
            var next = root.dataset.theme === "blueprint" ? "paper" : "blueprint";
            setTheme(next);
            return [["Theme set to " + next + ".", "t-muted"]];
        },
        clear: function () {
            log.textContent = "";
            return [];
        }
    };

    // A few friendly aliases
    commands.ls = commands.projects;
    commands.about = commands.whoami;
    commands.hire = commands.contact;

    function print(line) {
        var p = document.createElement("p");
        if (typeof line === "string") {
            p.className = "t-out";
            p.textContent = line;
        } else if (Array.isArray(line)) {
            p.className = line[1];
            p.textContent = line[0];
        } else {
            var a = document.createElement("a");
            a.href = line.href;
            a.textContent = line.text;
            if (line.href.indexOf("http") === 0) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
            p.appendChild(a);
        }
        log.appendChild(p);
    }

    function run(raw) {
        var cmd = raw.trim().toLowerCase();
        if (!cmd) return;
        var echo = document.createElement("p");
        echo.className = "t-cmd";
        echo.textContent = cmd;
        log.appendChild(echo);

        var name = cmd.split(/\s+/)[0];
        var handler = commands[name];
        var lines = handler
            ? handler()
            : [["Command not found: " + name + ". Type help to see what you can run.", "t-muted"]];
        lines.forEach(print);
        log.scrollTop = log.scrollHeight;
    }

    if (form && log && input) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            run(input.value);
            input.value = "";
        });

        document.querySelectorAll(".terminal-shortcuts button").forEach(function (btn) {
            btn.addEventListener("click", function () { run(btn.dataset.cmd); });
        });

        // One orchestrated moment on load: type "whoami" and run it
        var intro = "whoami";
        if (reduceMotion) {
            run(intro);
        } else {
            var i = 0;
            setTimeout(function typeIntro() {
                input.value = intro.slice(0, ++i);
                if (i < intro.length) setTimeout(typeIntro, 90);
                else setTimeout(function () { run(intro); input.value = ""; }, 260);
            }, 700);
        }
    }

    /* ---------- Case-study dialogs ---------- */
    var lastTrigger = null;

    document.querySelectorAll("[data-case]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var dialog = document.getElementById(btn.dataset.case);
            if (!dialog || typeof dialog.showModal !== "function") return;
            lastTrigger = btn;
            dialog.showModal();
            if (lenis) lenis.stop();
            dialog.querySelector(".case-close").focus();
        });
    });

    document.querySelectorAll("dialog.case").forEach(function (dialog) {
        dialog.querySelector(".case-close").addEventListener("click", function () { dialog.close(); });
        // Click on the dimmed backdrop closes it
        dialog.addEventListener("click", function (e) {
            if (e.target === dialog) dialog.close();
        });
        dialog.addEventListener("close", function () {
            if (lenis) lenis.start();
            if (lastTrigger) lastTrigger.focus();
        });
    });

    /* ---------- Copy email ---------- */
    var status = document.querySelector(".copy-status");
    document.querySelectorAll("[data-copy]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var text = btn.dataset.copy;
            if (!navigator.clipboard) {
                status.textContent = "Copying isn’t available here. The address is " + text + ".";
                return;
            }
            navigator.clipboard.writeText(text).then(function () {
                status.textContent = "Email copied: " + text;
            }, function () {
                status.textContent = "Couldn’t copy automatically. The address is " + text + ".";
            });
        });
    });
})();
