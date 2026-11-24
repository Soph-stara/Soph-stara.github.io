// Shared behaviour: the blue ticker on top, the live system readout in the
// bottom-right corner, and the project lists.
// Add new projects to PROJECTS below; the ticker, the home page and the
// projects page all read from it.

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

const EMAIL = "sophiehamann.maxi@gmail.com";

function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// "data sonification" -> "data_sonification"
function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

// One project as a line of code: .open("Title").medium()
function projectLine(p, cls = "i1") {
    if (!p.href) {
        return `<span class="l ${cls} soon">.soon("${esc(p.title)}")</span>`;
    }
    const img = p.image ? ` data-image="${p.image}"` : "";
    return `<span class="l ${cls}">.open("<a href="${p.href}"${img}>${esc(p.title)}</a>").<a href="${p.href}"${img}>${slug(p.medium || "project")}</a>()</span>`;
}

(function () {
    // ---------- Ticker ----------

    const phrases = [
        "Researcher &amp; Artist",
        "computation",
        "feminist theory",
        "artistic research",
        `x=&gt;x.fabric("interlude")`,
        ...PROJECTS.filter(p => p.href).map(p => `<a href="${p.href}">${esc(p.title)}</a>`),
        `x=&gt;x.glitch("interlude")`,
        "commons",
        "instability",
        "care",
        "Vienna"
    ];
    const run = `<span>${phrases.join("  =&gt;  ")}  =&gt; </span>`;

    const ticker = document.createElement("header");
    ticker.className = "ticker";
    ticker.innerHTML = `<div class="ticker-track">${run}${run}</div>`;
    ticker.querySelectorAll(".ticker-track > span")[1].setAttribute("aria-hidden", "true");
    document.body.prepend(ticker);

    // ---------- System readout ----------

    const ua = navigator.userAgent;
    const os =
        /iPhone|iPad|iPod/.test(ua) ? "iOS" :
        /Android/.test(ua) ? "Android" :
        /Mac/.test(ua) ? "MacOS" :
        /Win/.test(ua) ? "Windows" :
        /Linux/.test(ua) ? "Linux" : "Unknown";
    const browser =
        /Edg\//.test(ua) ? "Edge" :
        /Firefox\//.test(ua) ? "Firefox" :
        /Chrome\//.test(ua) ? "Chrome" :
        /Safari\//.test(ua) ? "Safari" : "Unknown";

    const sys = document.createElement("aside");
    sys.className = "sys";
    sys.innerHTML = `
        ${document.body.hasAttribute("data-fabric") ?`<div class="fabric" id="fabric-container" title="move / click the fabric"></div>` : ""}
        <div>OS: ${os}<br>
        Browser: ${browser}<br>
        Screen: ${screen.width} x ${screen.height}<br>
        Cookies: ${navigator.cookieEnabled ? "Yes" : "No"}<br>
        CPU Cores: ${navigator.hardwareConcurrency || "?"}<br>
        RAM: ${navigator.deviceMemory ? navigator.deviceMemory + " GB" : "?"}<br>
        Vienna: <span id="sys-time"></span></div>
        <div class="coords">X: <span id="sys-x">0</span> | Y: <span id="sys-y">0</span></div>`;
    document.body.appendChild(sys);

    const time = sys.querySelector("#sys-time");
    const tick = () => {
        time.textContent = new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/Vienna" });
    };
    tick();
    setInterval(tick, 1000);

    const sx = sys.querySelector("#sys-x");
    const sy = sys.querySelector("#sys-y");

    // ---------- Project lists ----------

    const homeList = document.getElementById("home-projects");
    if (homeList) homeList.innerHTML = PROJECTS.filter(p => p.href).map(p => projectLine(p)).join("");

    const fullList = document.getElementById("project-list");
    if (fullList) {
        fullList.innerHTML = PROJECTS.map(p =>
            projectLine(p) + (p.text ? `<span class="l i2 dim">// ${esc(p.text)}</span>` : "")
        ).join("");
    }

    // ---------- Hover preview image ----------

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
        sx.textContent = e.clientX;
        sy.textContent = e.clientY;
        const x = Math.min(e.clientX + 24, innerWidth - preview.offsetWidth - 10);
        const y = Math.min(e.clientY + 24, innerHeight - preview.offsetHeight - 10);
        preview.style.transform = `translate(${x}px, ${y}px)`;
    });
})();
