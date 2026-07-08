document.addEventListener('DOMContentLoaded', () => {
    const roleTextElement = document.getElementById('role-text');
    const roles = ['Data Analyst', 'Web Developer', 'Technical Project Coordinator'];
    let roleIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;

    function typeRole() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            roleTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            roleTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }
        setTimeout(typeRole, typingSpeed);
    }
    typeRole();


    const mainHeader = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) mainHeader.classList.add('scrolled');
        else mainHeader.classList.remove('scrolled');
    });

    const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
    const mobileDrawerMenu = document.getElementById('mobile-drawer-menu');
    mobileToggleBtn.addEventListener('click', () => {
        mobileToggleBtn.classList.toggle('open');
        mobileDrawerMenu.classList.toggle('open');
    });

    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => observer.observe(el));
});