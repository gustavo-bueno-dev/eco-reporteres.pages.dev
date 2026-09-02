document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");
    const navLinks = document.querySelectorAll(".main-nav a");
    const ticker = document.querySelector(".ticker-content");
    const revealElements = document.querySelectorAll(
        ".report-card, .data-card, .energy-card, .interview-card, .school-card, .source-card"
    );

    // Menu mobile
    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
            menuToggle.classList.toggle("active");

            const expanded = menuToggle.classList.contains("active");
            menuToggle.setAttribute("aria-expanded", expanded);
        });
    }

    // Fechar menu ao clicar em um link
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (nav) nav.classList.remove("active");
            if (menuToggle) {
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    });

    // Rolagem suave
    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (targetId && targetId.startsWith("#")) {
                const target = document.querySelector(targetId);

                if (target) {
                    event.preventDefault();

                    const headerHeight = header
                        ? header.offsetHeight
                        : 0;

                    const targetPosition =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        headerHeight -
                        15;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // Header ao rolar
    function updateHeader() {
        if (!header) return;

        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader);
    updateHeader();

    // Destaque do link ativo no menu
    const sections = document.querySelectorAll("main section[id]");

    function updateActiveLink() {
        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 180;

            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");

            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();

    // Relógio/data da reportagem
    const currentDate = document.querySelector(".current-date");

    if (currentDate) {
        const today = new Date();

        currentDate.textContent = today.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }

    // Ticker de notícias
    if (ticker) {
        const messages = [
            "Energia solar ganha espaço na matriz elétrica brasileira.",
            "Tecnologias renováveis podem ajudar escolas e comunidades.",
            "Eficiência energética também faz parte de um futuro sustentável.",
            "Fontes renováveis reduzem a dependência de combustíveis fósseis.",
            "Ciência e educação são fundamentais para a transição energética."
        ];

        let messageIndex = 0;

        setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;

            ticker.classList.add("changing");

            setTimeout(() => {
                ticker.textContent = messages[messageIndex];
                ticker.classList.remove("changing");
            }, 250);
        }, 5000);
    }

    // Animação dos elementos ao aparecerem na tela
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observerInstance.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {
            element.classList.add("reveal");
            observer.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }

    // Contadores dos dados
    const counters = document.querySelectorAll("[data-counter]");

    if ("IntersectionObserver" in window && counters.length > 0) {
        const counterObserver = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const element = entry.target;
                    const target = Number(
                        element.getAttribute("data-counter")
                    );

                    if (Number.isNaN(target)) return;

                    const duration = 1500;
                    const startTime = performance.now();

                    function animateCounter(currentTime) {
                        const progress = Math.min(
                            (currentTime - startTime) / duration,
                            1
                        );

                        const easedProgress =
                            1 - Math.pow(1 - progress, 3);

                        const currentValue =
                            target * easedProgress;

                        element.textContent =
                            currentValue.toFixed(1).replace(".", ",");

                        if (progress < 1) {
                            requestAnimationFrame(animateCounter);
                        } else {
                            element.textContent =
                                target.toFixed(1).replace(".", ",");
                        }
                    }

                    requestAnimationFrame(animateCounter);
                    observerInstance.unobserve(element);
                });
            },
            {
                threshold: 0.5
            }
        );

        counters.forEach((counter) => {
            counterObserver.observe(counter);
        });
    }

    // Botões que levam às reportagens
    const reportButtons = document.querySelectorAll(
        "[data-scroll-target]"
    );

    reportButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetId =
                button.getAttribute("data-scroll-target");

            const target = document.querySelector(targetId);

            if (target) {
                const headerHeight = header
                    ? header.offsetHeight
                    : 0;

                window.scrollTo({
                    top:
                        target.offsetTop -
                        headerHeight -
                        15,
                    behavior: "smooth"
                });
            }
        });
    });

    // Atualização automática do ano no rodapé
    const yearElements = document.querySelectorAll(".current-year");

    yearElements.forEach((element) => {
        element.textContent = new Date().getFullYear();
    });

    // Acessibilidade: tecla ESC fecha o menu
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (nav) nav.classList.remove("active");

            if (menuToggle) {
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        }
    });

    // Efeito de entrada da página
    document.body.classList.add("page-loaded");
});