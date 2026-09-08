document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav_link");
    const menuToggle = document.getElementById("menu-toggle");
    const filterButtons = document.querySelectorAll(".project_filters .filter");
    const projectCards = document.querySelectorAll(".grid .card");

    // Close hamburger menu if clicked
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (menuToggle && menuToggle.checked) {
                menuToggle.checked = false;
            }
        });
    });

    // Dynamic Folder Shape Generator
    function updateFolderShapes() {
        projectCards.forEach((card) => {
            if (card.style.display === "none") return;

            let svg = card.querySelector(".card_folder_bg");
            if (!svg) {
                svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("class", "card_folder_bg");
                svg.setAttribute("aria-hidden", "true");
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("class", "folder_path");
                svg.appendChild(path);
                card.insertBefore(svg, card.firstChild);
            }

            const path = svg.querySelector("path");
            const w = card.offsetWidth;
            const h = card.offsetHeight;
            if (w === 0 || h === 0) return;

            const indexWrap = card.querySelector(".card_index_wrap");
            const labelWidth = indexWrap ? indexWrap.offsetWidth : 140;

            const r = 12; // corner radius
            const tabH = 16; // height difference between tab and shelf
            const slope = 20; // width of S-curve transition

            // Tab width fits label comfortably
            const tabW = Math.min(Math.max(labelWidth + 24, 130), w - slope - r * 2);

            // S-curve control points
            const cp1x = tabW + slope * 0.45;
            const cp1y = 0.5;
            const cp2x = tabW + slope * 0.55;
            const cp2y = tabH + 0.5;
            const endSlopeX = tabW + slope;
            const endSlopeY = tabH + 0.5;

            const minX = 0.5;
            const minY = 0.5;
            const maxX = w - 0.5;
            const maxY = h - 0.5;

            const d = [
                `M ${minX},${r + minY}`,
                `A ${r} ${r} 0 0 1 ${r + minX},${minY}`,
                `L ${tabW},${minY}`,
                `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endSlopeX},${endSlopeY}`,
                `L ${maxX - r},${endSlopeY}`,
                `A ${r} ${r} 0 0 1 ${maxX},${endSlopeY + r}`,
                `L ${maxX},${maxY - r}`,
                `A ${r} ${r} 0 0 1 ${maxX - r},${maxY}`,
                `L ${minX + r},${maxY}`,
                `A ${r} ${r} 0 0 1 ${minX},${maxY - r}`,
                "Z"
            ].join(" ");

            svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
            path.setAttribute("d", d);
        });
    }

    // Initial calculation
    requestAnimationFrame(updateFolderShapes);
    window.addEventListener("load", updateFolderShapes);
    window.addEventListener("resize", updateFolderShapes);

    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => {
            updateFolderShapes();
        });
        projectCards.forEach((card) => resizeObserver.observe(card));
    }

    // Filter
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            const selectedFilter = button.getAttribute("data-filter");

            projectCards.forEach((card) => {
                const cardTag = card.getAttribute("data-tags");
                if (selectedFilter === "all" || cardTag === selectedFilter) {
                    card.style.display = "";
                    card.style.animation = "none";
                    void card.offsetHeight; // trigger reflow for smooth re-animation
                    card.style.animation = "";
                } else {
                    card.style.display = "none";
                }
            });

            requestAnimationFrame(updateFolderShapes);
        });
    });
});
