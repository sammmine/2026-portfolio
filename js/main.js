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
        });
    });
});
