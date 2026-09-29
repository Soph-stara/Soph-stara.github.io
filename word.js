// Builds the Word-for-Windows-1.0 chrome (title bar, menus, grey toolbars,
// ruler, status bar) around the page's <article class="doc">.
// Add new projects to PROJECTS below; the Project dropdown, the Document menu,
// the home page and the projects page all read from it.

const PROJECTS = [
    { title: "Place of Collective Oblivion" },
    { title: "Bauhaus and the Hafenbahnhof" },
    { title: "The Understanding Gaze" },
    {
        title: "Sound of Drugs",
        href: "sound_of_drugs.html",
        medium: "data sonification",
        text: "translating biochemical properties into sound"
    },
    {
        title: "Ode to Our Mother",
        href: "ode_to_our_mother.html",
        image: "images/ode1.png",
        medium: "poetry & photography",
        text: "a poetic reflection on care, extraction and interdependence"
    },
    {
        title: "How Algae Can Change the World",
        href: "algae.html",
        image: "images/algae1.png",
        medium: "curatorial project",
        text: "algae as a material, ecological and political actor"
    },
    {
        title: "Caliban's Daughters",
        href: "caliban_landing_page.html",
        image: "images/empress.jpg",
        medium: "interactive narrative game",
        text: "feminist history and resistance during the European witch hunts"
    },
    {
        title: "The Refusal to Resign",
        href: "refusal_to_resign.html",
        medium: "kinetic textile installation",
        text: "Donaufestival 2026, Hope4Hope"
    },
    {
        title: "Mapping Commons",
        href: "mapping_commons.html",
        image: "images/map1.png",
        medium: "interactive map",
        text: "stickers as traces of commoning in urban space"
    }
];

const PAGES = [
    { key: "home", title: "Home", href: "index.html" },
    { key: "cv", title: "CV", href: "cv.html" },
    { key: "projects", title: "Projects", href: "portfolio.html" }
];

const EMAIL = "sophiehamann.maxi@gmail.com";

(function () {
    const doc = document.querySelector("article.doc");
    const page = document.body.dataset.page || "";
    const here = location.pathname.split("/").pop() || "index.html";
    const docTitle = document.body.dataset.title || document.title;

    function esc(s) {
        return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    }

    // "&File" -> File with the F underlined, like Windows access keys
    function accel(label) {
        return label.replace(/&(.)/, "<u>$1</u>");
    }

    // ---------- Menus ----------

    function item(label, opts = {}) {
        const cls = [opts.disabled && "disabled", opts.checked && "checked"].filter(Boolean).join(" ");
        const shortcut = opts.key ? `<span class="shortcut">${opts.key}</span>` : "";
        const inner = `<span>${accel(label)}</span>${shortcut}`;
        const body = opts.href
            ? `<a href="${opts.href}">${inner}</a>`
            : `<button type="button" ${opts.action ? `data-action="${opts.action}"` : ""}>${inner}</button>`;
        return `<li class="${cls}">${body}</li>`;
    }

    const divider = `<li class="divider" role="separator"></li>`;

    const menus = [
        {
            title: "&File",
            items:
                item("&New", { disabled: true }) +
                item("&Open CV…", { href: "cv.html" }) +
                item("Open &Projects…", { href: "portfolio.html" }) +
                divider +
                item("Send &Mail…", { href: "mailto:" + EMAIL }) +
                item("&Print…", { disabled: true }) +
                divider +
                item("E&xit", { href: "index.html" })
        },
        {
            title: "&Edit",
            optional: true,
            items:
                item("&Undo", { disabled: true, key: "Alt+BkSp" }) +
                divider +
                item("Cu&t", { disabled: true, key: "Shift+Del" }) +
                item("&Copy", { disabled: true, key: "Ctrl+Ins" }) +
                item("&Paste", { disabled: true, key: "Shift+Ins" }) +
                divider +
                item("Select &All", { action: "select-all" })
        },
        {
            title: "&View",
            optional: true,
            items:
                item("&Ribbon", { action: "toggle-toolbar", checked: true }) +
                item("R&uler", { action: "toggle-ruler", checked: true }) +
                item("&Status Bar", { action: "toggle-status", checked: true })
        },
        {
            title: "&Insert",
            optional: true,
            items: item("&Page Break", { disabled: true }) + item("&Picture…", { disabled: true })
        },
        {
            title: "Forma&t",
            items:
                item("&Plain Text", { action: "fmt-plain" }) +
                item("<b>Bold</b>", { action: "fmt-bold", key: "Ctrl+B" }) +
                item("<i>Italic</i>", { action: "fmt-italic", key: "Ctrl+I" }) +
                item("<u>Underline</u>", { action: "fmt-underline", key: "Ctrl+U" }) +
                item(`<span class="outline">Outline</span>`, { action: "fmt-outline" }) +
                item(`<span class="outline shadow">Shadow</span>`, { action: "fmt-shadow" })
        },
        {
            title: "&Document",
            items: PROJECTS.map(p =>
                p.href ? item(esc(p.title), { href: p.href, checked: p.href === here })
                       : item(esc(p.title) + " (soon)", { disabled: true })
            ).join("")
        },
        {
            title: "&Utilities",
            optional: true,
            items: item("&Word Count…", { action: "word-count" })
        },
        {
            title: "&Window",
            items: PAGES.map((p, i) => item(`&${i + 1} ${p.title}`, { href: p.href, checked: p.key === page })).join("")
        },
        {
            title: "&Help",
            cls: "help",
            items: item("&About Sophie Hamann…", { action: "about" })
        }
    ];

    const menuRow = menus.map(m => `
        <div class="menu ${m.optional ? "optional" : ""} ${m.cls || ""}">
            <button type="button" class="menu-title">${accel(m.title)}</button>
            <ul class="dropdown">${m.items}</ul>
        </div>`).join("");

    // ---------- Toolbars ("ribbon") ----------

    const currentProject = PROJECTS.find(p => p.href === here);

    const navButtons = PAGES.map(p => `
        <a href="${p.href}" class="tool-btn text ${p.key === page ? "pressed" : ""}">${p.title}</a>`).join("");

    const projectOptions = `<option value="">${currentProject ? "" : "(choose a project)"}</option>` +
        PROJECTS.map(p => p.href
            ? `<option value="${p.href}" ${p.href === here ? "selected" : ""}>${esc(p.title)}</option>`
            : `<option disabled>${esc(p.title)} (soon)</option>`
        ).join("");

    const lines = widths => `<svg width="16" height="14" viewBox="0 0 16 14" shape-rendering="crispEdges">${
        widths.map(([x, w], i) => `<rect x="${x}" y="${1 + i * 3}" width="${w}" height="1.5"/>`).join("")}</svg>`;

    const toolbar = `
        <div class="toolbar">
            <div class="tool-row">
                <span class="tool-group nav-group">${navButtons}</span>
                <label class="tool-label" for="tb-project">Project:</label>
                <select id="tb-project" class="tool-select wide">${projectOptions}</select>
                <span class="tool-group">
                    <button type="button" class="tool-btn" data-action="fmt-bold" title="Bold"><b>B</b></button>
                    <button type="button" class="tool-btn" data-action="fmt-italic" title="Italic"><i>I</i></button>
                    <button type="button" class="tool-btn" data-action="fmt-underline" title="Underline"><u>U</u></button>
                    <button type="button" class="tool-btn" data-action="fmt-outline" title="Outline"><span class="outline">D</span></button>
                    <button type="button" class="tool-btn" data-action="fmt-shadow" title="Shadow"><span class="outline shadow">W</span></button>
                </span>
            </div>
            <div class="tool-row">
                <label class="tool-label" for="tb-style">Style:</label>
                <select id="tb-style" class="tool-select">
                    <option value="Geneva_9">Normal</option>
                    <option value="Chicago_12">Chicago</option>
                    <option value="Monaco">Monaco</option>
                </select>
                <label class="tool-label" for="tb-size">Pts:</label>
                <select id="tb-size" class="tool-select narrow">
                    <option>14</option><option>16</option><option>18</option>
                    <option selected>20</option><option>24</option><option>28</option>
                </select>
                <span class="tool-group">
                    <button type="button" class="tool-btn" data-action="align-left" title="Align left">${lines([[1, 14], [1, 10], [1, 14], [1, 8]])}</button>
                    <button type="button" class="tool-btn" data-action="align-center" title="Center">${lines([[1, 14], [3, 10], [1, 14], [4, 8]])}</button>
                    <button type="button" class="tool-btn" data-action="align-right" title="Align right">${lines([[1, 14], [5, 10], [1, 14], [7, 8]])}</button>
                    <button type="button" class="tool-btn" data-action="align-justify" title="Justify">${lines([[1, 14], [1, 14], [1, 14], [1, 14]])}</button>
                </span>
                <span class="tool-group">
                    <a class="tool-btn text" href="mailto:${EMAIL}" title="Send email">✉ Mail</a>
                </span>
            </div>
        </div>
        <div class="ruler" aria-hidden="true"><div class="ruler-scale"></div></div>`;

    // ---------- Assemble the application window ----------

    const app = document.createElement("div");
    app.className = "app";
    app.innerHTML = `
        <header class="app-header">
            <div class="win-title">
                <a class="sys-box" href="index.html" aria-label="Home"><span></span></a>
                <span class="win-title-text">Microsoft Word - ${esc(docTitle)}</span>
                <span class="size-box" aria-hidden="true">▼</span>
                <span class="size-box" aria-hidden="true">▲</span>
            </div>
            <nav class="menubar">${menuRow}</nav>
            ${toolbar}
        </header>
        <div class="doc-scroll"></div>
        <footer class="status-bar">
            <span class="panel" id="st-page">Pg 1</span>
            <span class="panel">Sec 1</span>
            <span class="panel" id="st-of">1/1</span>
            <span class="panel optional-panel">At</span>
            <span class="panel optional-panel">Ln</span>
            <span class="panel optional-panel">Col 1</span>
            <span class="panel fill"></span>
        </footer>`;

    const scroller = app.querySelector(".doc-scroll");
    if (doc) scroller.appendChild(doc);
    document.body.prepend(app);

    // Ruler numbers, one "inch" every 96px
    const scale = app.querySelector(".ruler-scale");
    for (let i = 0; i < 25; i++) {
        const n = document.createElement("span");
        n.textContent = i;
        n.style.left = `${i * 96}px`;
        scale.appendChild(n);
    }

    // ---------- Menu behaviour ----------
    // Click opens a menu; while one is open, hovering switches between them

    const allMenus = [...app.querySelectorAll(".menu")];
    const closeAll = () => allMenus.forEach(m => m.classList.remove("open"));

    allMenus.forEach(menu => {
        const titleBtn = menu.querySelector(".menu-title");
        titleBtn.addEventListener("click", e => {
            e.stopPropagation();
            const wasOpen = menu.classList.contains("open");
            closeAll();
            if (!wasOpen) menu.classList.add("open");
        });
        titleBtn.addEventListener("mouseenter", () => {
            if (allMenus.some(m => m.classList.contains("open"))) {
                closeAll();
                menu.classList.add("open");
            }
        });
    });

    document.addEventListener("click", closeAll);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });

    app.querySelector(".app-header").addEventListener("click", e => {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;
        runAction(btn.dataset.action, btn);
        closeAll();
    });

    app.querySelector("#tb-project").addEventListener("change", e => {
        if (e.target.value) location.href = e.target.value;
    });
    app.querySelector("#tb-style").addEventListener("change", e => runAction("font-" + e.target.value));
    app.querySelector("#tb-size").addEventListener("change", e => {
        if (doc) doc.style.fontSize = e.target.value + "px";
    });

    // ---------- Actions ----------

    const FORMATS = ["fmt-bold", "fmt-italic", "fmt-underline", "fmt-outline", "fmt-shadow"];
    const TOGGLES = { "toggle-toolbar": ".toolbar", "toggle-ruler": ".ruler", "toggle-status": ".status-bar" };

    function runAction(action, btn) {
        if (TOGGLES[action]) {
            const el = app.querySelector(TOGGLES[action]);
            el.hidden = !el.hidden;
            btn.parentElement.classList.toggle("checked", !el.hidden);
            return;
        }
        if (action === "about") {
            alertBox("Sophie Hamann — researcher & artist working across computation, feminist theory and artistic research. Vienna.");
            return;
        }
        if (!doc) return;

        if (action === "fmt-plain") {
            doc.classList.remove(...FORMATS);
        } else if (FORMATS.includes(action)) {
            doc.classList.toggle(action);
        } else if (action.startsWith("align-")) {
            doc.style.textAlign = action.slice(6);
            app.querySelectorAll("[data-action^='align-']").forEach(b =>
                b.classList.toggle("pressed", b.dataset.action === action));
        } else if (action.startsWith("font-")) {
            doc.style.fontFamily = `"${action.slice(5)}", Geneva, sans-serif`;
        } else if (action === "select-all") {
            const range = document.createRange();
            range.selectNodeContents(doc);
            const sel = getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (action === "word-count") {
            const words = doc.innerText.trim().split(/\s+/).filter(Boolean).length;
            const chars = doc.innerText.replace(/\s/g, "").length;
            alertBox(`This document contains ${words.toLocaleString()} words and ${chars.toLocaleString()} characters.`);
        }
        updateFormatState();
    }

    function updateFormatState() {
        if (!doc) return;
        const active = FORMATS.filter(f => doc.classList.contains(f));
        app.querySelectorAll(".dropdown [data-action^='fmt-']").forEach(b => {
            const a = b.dataset.action;
            const on = a === "fmt-plain" ? active.length === 0 : active.includes(a);
            b.parentElement.classList.toggle("checked", on);
        });
        app.querySelectorAll(".toolbar [data-action^='fmt-']").forEach(b => {
            b.classList.toggle("pressed", active.includes(b.dataset.action));
        });
    }

    function alertBox(message) {
        const backdrop = document.createElement("div");
        backdrop.className = "dialog-backdrop";
        backdrop.innerHTML = `
            <div class="dialog" role="alertdialog">
                <div class="win-title"><span class="win-title-text">Microsoft Word</span></div>
                <div class="dialog-inner">
                    <p>${esc(message)}</p>
                    <div class="dialog-buttons"><button type="button" class="tool-btn text">OK</button></div>
                </div>
            </div>`;
        const ok = backdrop.querySelector("button");
        ok.addEventListener("click", () => backdrop.remove());
        document.body.appendChild(backdrop);
        ok.focus();
    }

    // ---------- Status bar: "Pg 1 ... 1/3" follows scrolling, one page per screenful ----------

    const stPage = app.querySelector("#st-page");
    const stOf = app.querySelector("#st-of");
    function updateStatus() {
        const h = Math.max(scroller.clientHeight, 1);
        const pageNo = Math.floor(scroller.scrollTop / h) + 1;
        const total = Math.max(Math.ceil(scroller.scrollHeight / h), 1);
        stPage.textContent = `Pg ${pageNo}`;
        stOf.textContent = `${pageNo}/${total}`;
    }
    scroller.addEventListener("scroll", updateStatus);
    addEventListener("resize", updateStatus);
    addEventListener("load", updateStatus);

    // ---------- Projects page list ----------

    const list = document.getElementById("project-list");
    if (list) {
        list.innerHTML = PROJECTS.map((p, i) => {
            const n = String(i + 1).padStart(2, "0");
            const title = p.href
                ? `<a href="${p.href}" ${p.image ? `data-image="${p.image}"` : ""}>${esc(p.title)}</a>`
                : `<span class="soon">${esc(p.title)}</span>`;
            return `
                <li class="project-entry">
                    <div class="toc-line">
                        <span class="num">${n}</span>
                        ${title}
                        <span class="leader"></span>
                        <span class="medium">${esc(p.medium || "coming soon")}</span>
                    </div>
                    ${p.text ? `<div class="desc">${esc(p.text)}</div>` : ""}
                </li>`;
        }).join("");
    }

    // Floating preview image on hover
    const preview = document.createElement("div");
    preview.className = "preview";
    preview.innerHTML = `<img alt="">`;
    document.body.appendChild(preview);
    const previewImg = preview.querySelector("img");

    document.querySelectorAll("a[data-image]").forEach(a => {
        a.addEventListener("mouseenter", () => {
            previewImg.src = a.dataset.image;
            preview.classList.add("visible");
        });
        a.addEventListener("mouseleave", () => preview.classList.remove("visible"));
    });

    document.addEventListener("mousemove", e => {
        const x = Math.min(e.clientX + 24, innerWidth - preview.offsetWidth - 10);
        const y = Math.min(e.clientY + 24, innerHeight - preview.offsetHeight - 10);
        preview.style.transform = `translate(${x}px, ${y}px)`;
    });

    updateFormatState();
})();
