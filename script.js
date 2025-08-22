document.addEventListener('DOMContentLoaded', () => {
    // Função para tratar a animação do cabeçalho ao rolar a página
    const mainHeader = document.getElementById('main-header');
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainHeader.classList.add('bg-blue-950/90', 'backdrop-blur-sm');
                mainHeader.classList.remove('bg-blue-950');
            } else {
                mainHeader.classList.add('bg-blue-950');
                mainHeader.classList.remove('bg-blue-950/90', 'backdrop-blur-sm');
            }
        });
    }

    // Função para exibir a animação das seções conforme o usuário rola a página
    const sections = document.querySelectorAll('.section-animation');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Função para abrir e fechar o menu mobile
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuButton = document.getElementById('close-menu-button');

    if (mobileMenuButton && mobileMenu && closeMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });
        closeMenuButton.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });

        // Fecha o menu mobile ao clicar em um link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Função para gerenciar os dropdowns do menu
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('span') || dropdown.querySelector('button');
        const content = dropdown.querySelector('.dropdown-menu-content');

        if (button && content) {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Impede que o clique se propague para o documento
                // Fecha outros dropdowns abertos, se existirem
                dropdowns.forEach(otherDropdown => {
                    const otherContent = otherDropdown.querySelector('.dropdown-menu-content');
                    if (otherContent && otherContent !== content) {
                        otherContent.classList.remove('active');
                    }
                });
                // Alterna o dropdown clicado
                content.classList.toggle('active');
            });
        }
    });

    // Fecha o dropdown ao clicar fora dele
    document.addEventListener('click', () => {
        dropdowns.forEach(dropdown => {
            const content = dropdown.querySelector('.dropdown-menu-content');
            if (content) {
                content.classList.remove('active');
            }
        });
    });

    // Impede que o clique no menu mobile feche o dropdown
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    // Função de otimização: Throttling
    // Limita a frequência de execução de uma função para melhorar o desempenho.
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Função para configurar os carrosséis
    function setupCarousel(carouselId, prevBtnId, nextBtnId) {
        const carousel = document.getElementById(carouselId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        if (!carousel || !prevBtn || !nextBtn) {
            return;
        }

        // Função para atualizar o estado dos botões de navegação
        const updateButtonState = () => {
            prevBtn.disabled = carousel.scrollLeft === 0;
            // A comparação com uma pequena margem de erro pode ser mais robusta
            const scrollEnd = carousel.scrollLeft + carousel.offsetWidth;
            const contentWidth = carousel.scrollWidth;
            nextBtn.disabled = Math.ceil(scrollEnd) >= contentWidth;

            // Adiciona ou remove a classe 'disabled' para estilização visual
            if (prevBtn.disabled) {
                prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
            if (nextBtn.disabled) {
                nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        };

        // Evento de clique para o botão 'próximo'
        nextBtn.addEventListener('click', () => {
            // Seleciona o primeiro card dentro do carrossel específico para o cálculo de largura
            const firstCard = carousel.querySelector('.testimonial-card') || carousel.querySelector('.activity-card');
            if (firstCard) {
                const cardWidth = firstCard.offsetWidth + 32; // 32 = 2rem para o espaçamento entre os cards
                carousel.scrollBy({
                    left: cardWidth,
                    behavior: 'smooth'
                });
            }
        });

        // Evento de clique para o botão 'anterior'
        prevBtn.addEventListener('click', () => {
            // Seleciona o primeiro card dentro do carrossel específico para o cálculo de largura
            const firstCard = carousel.querySelector('.testimonial-card') || carousel.querySelector('.activity-card');
            if (firstCard) {
                const cardWidth = firstCard.offsetWidth + 32; // 32 = 2rem para o espaçamento entre os cards
                carousel.scrollBy({
                    left: -cardWidth,
                    behavior: 'smooth'
                });
            }
        });

        // Otimização: Adiciona a função de throttling para limitar a frequência
        // de execução do evento de rolagem, melhorando o desempenho.
        carousel.addEventListener('scroll', throttle(updateButtonState, 100));

        // Inicializa o estado dos botões
        updateButtonState();
    }

    // Configura os carrosséis
    setupCarousel('activity-carousel', 'activity-prev', 'activity-next');
    setupCarousel('testimonial-carousel', 'testimonial-prev', 'testimonial-next');
});
