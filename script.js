// Initialize Lucide Icons
lucide.createIcons();

// Smooth Animation on Scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-section'); // Add initial class
    observer.observe(section);
});

// Mobile Menu Toggle (Basic)
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        // Toggle logic for mobile menu - can expand this later
        // For now, simple console log or alert as placeholder if needed,
        // but let's implement a simple visibility toggle.
        const isFlex = navLinks.style.display === 'flex';
        
        if (!isFlex) {
            navLinks.style.display = 'flex';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.flexDirection = 'column';
            navLinks.style.background = 'rgba(5,5,5,0.95)';
            navLinks.style.padding = '20px';
            navLinks.style.alignItems = 'center';
        } else {
            navLinks.style.display = 'none'; // Note: this might conflict with desktop media query reset if resized
            navLinks.removeAttribute('style'); // Better to remove inline styles to let CSS take over
        }
    });
}
