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

// Water Ball Interaction
const orb = document.querySelector('.orb');

if (orb) {
    // Physics State
    let state = {
        x: 0,
        y: 0,
        scale: 1,
        angle: 0,
        // Target values
        targetX: 0,
        targetY: 0,
        targetScale: 1,
        // Click Wobble
        wobble: 0,
        wobbleVelocity: 0
    };

    // Tracking for "Internal Flow" Gradient
    let gradient = { x: 30, y: 30 };

    // Config
    const LERP_FACTOR = 0.05; // Low for "Heavy Microbe" lag
    const MAX_DIST = 250;

    // Track Mouse relative to Orb Center
    const heroSection = document.getElementById('hero');
    let mouseAbs = { x: 0, y: 0 };
    let isInside = false;

    heroSection.addEventListener('mousemove', (e) => {
        const rect = orb.getBoundingClientRect();
        // Assume center based on initial layout or current bounding? 
        // Using getBoundingClientRect on a moving object for physics target is tricky if we want absolute mouse tracking.
        // Better: Use the Center of the Container as reference, since orb moves relative to it.
        // Actually, let's stick to the previous delta logic but apply it to targets.

        // We need a stable reference point. Let's use the parent container center (Hero Center approx).
        // Or simpler: Just calculate delta from the orb's "Rest Position".
        // Since orb is `position: relative`, `transform: translate` moves it from 0,0.
        // So we need mouse position relative to the orb's *origin*.

        // This approximates the origin:
        const x = e.clientX;
        const y = e.clientY;
        mouseAbs = { x, y };
        isInside = true;
    });

    heroSection.addEventListener('mouseleave', () => {
        state.targetX = 0;
        state.targetY = 0;
        state.targetScale = 1;
        isInside = false;
        // Reset gradient target
        gradient.x = 30;
        gradient.y = 30;
    });

    // Animation Loop
    function animate() {
        if (isInside) {
            const rect = orb.getBoundingClientRect();
            // We want the delta from the *current visual center* to the mouse
            // But for the magnetic pull, we want delta from *origin* if strictly adhering to "rest pos".
            // Let's re-calculate delta from the Orb's CENTER (current) to see if we should pull more.
            // Actually, simpler logic:
            // Delta = Mouse - Origin (center of screen/offset).
            // But Origin isn't static in scrolling.
            // Let's just use the cached rect from when it's at rest? No.

            // Let's use the offset from the *current* orb center.
            const currentCenterX = rect.left + rect.width / 2;
            const currentCenterY = rect.top + rect.height / 2;

            const dx = mouseAbs.x - currentCenterX;
            const dy = mouseAbs.y - currentCenterY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Refined Logic:
            // If distance < 250, we want to move TOWARDS mouse.
            // Target Position = Mouse Position - (some offset)? 
            // Previous logic: moveX = delta * strength. This implies moving away from rest.
            // Let's keep it simple: Target Translation is proportional to Mouse Dist from Origin.
            // But we don't have Origin easily.
            // Workaround: We add valid forces.

            if (dist < MAX_DIST) {
                // Pull force
                state.targetX += dx * 0.02; // Accumulate or set? Set is stable.
                // Let's fallback to the previous calculation which worked:
                // Delta from center -> Move proportional.
                // But we need to know where the "Center" is without the transform.
                // CenterWithoutTransform = CurrentCenter - CurrentTranslation.

                // Recover Origin logic:
                const originX = currentCenterX - state.x;
                const originY = currentCenterY - state.y;

                const deltaFromOriginX = mouseAbs.x - originX;
                const deltaFromOriginY = mouseAbs.y - originY;
                const distFromOrigin = Math.sqrt(deltaFromOriginX ** 2 + deltaFromOriginY ** 2);

                if (distFromOrigin < MAX_DIST) {
                    state.targetX = deltaFromOriginX * 0.4;
                    state.targetY = deltaFromOriginY * 0.4;

                    // Engulf Scale
                    const stretch = Math.min(distFromOrigin / 600, 0.15);
                    state.targetScale = 1 + stretch;

                    // Gradient Flow Target
                    // 30% base +/- 20%
                    gradient.x = 30 + (deltaFromOriginX / MAX_DIST) * 20;
                    gradient.y = 30 + (deltaFromOriginY / MAX_DIST) * 20;

                    // Glare
                    const xPct = 50 + (deltaFromOriginX / MAX_DIST) * 60;
                    const yPct = 50 + (deltaFromOriginY / MAX_DIST) * 60;
                    orb.style.setProperty('--mouse-x', `${xPct}%`);
                    orb.style.setProperty('--mouse-y', `${yPct}%`);
                } else {
                    state.targetX = 0;
                    state.targetY = 0;
                    state.targetScale = 1;
                    gradient.x = 30;
                    gradient.y = 30;
                }
            }
        }

        // 1. Interpolate Position (Laggy Microbe)
        state.x += (state.targetX - state.x) * LERP_FACTOR;
        state.y += (state.targetY - state.y) * LERP_FACTOR;

        // 2. Interpolate Base Scale
        state.scale += (state.targetScale - state.scale) * LERP_FACTOR;

        // 3. Click Wobble Physics (Spring)
        // Spring Force = -k * x - damping * v
        const stiffness = 0.1;
        const damping = 0.8;
        const force = -stiffness * state.wobble;
        state.wobbleVelocity += force;
        state.wobbleVelocity *= damping;
        state.wobble += state.wobbleVelocity;

        // 4. Gradient Flow Interpolation (Viscous internal fluid)
        // We assume current gradient is set via style, we can't read it easily back.
        // So strictly set it based on lerping targets if we stored current.
        // Let's just lerp the `gradient` object in place? 
        // nah, let's assume direct linear map is fine for gradient, simple ease is okay.
        // Actually, CSS transition is active on background! Let's let CSS handle background smoothing.
        // Just set the background once per frame? It might jitter if CSS is also trying.
        // Let's remove CSS transition on background earlier? 
        // User wanted smooth. CSS transition 0.5s is smoother than our lerp 0.05. 
        // BUT we need to update it here.
        if (Math.abs(state.targetX - state.x) > 0.1) {
            orb.style.background = `radial-gradient(circle at ${gradient.x}% ${gradient.y}%, var(--secondary), var(--primary))`;
        }

        // Final Transform Combine
        // Wobble adds a scale sine-like effect?
        // Let's say wobble oscillation makes it Scale X vs Y
        const wobbleX = 1 + state.wobble;
        const wobbleY = 1 - state.wobble;

        orb.style.transform = `
            translate(${state.x}px, ${state.y}px) 
            scale(${state.scale * wobbleX}, ${state.scale * wobbleY})
        `;

        requestAnimationFrame(animate);
    }
    animate();


    // Keep Click/Touch Ripple & Add Wobble Impulse
    orb.addEventListener('pointerdown', (e) => {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');

        const rect = orb.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

        orb.appendChild(ripple);

        // Trigger Physics Wobble
        // Impulse the velocity
        state.wobbleVelocity = 0.2; // Huge initial push -> Spring will oscillate it

        ripple.addEventListener('animationend', () => ripple.remove());
    });
}
