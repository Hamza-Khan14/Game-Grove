document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });

    initializeParticles();
    setupDarkMode();
    setupNewsletterForm();
    setupParallaxEffect();
    setupFeatureAnimations();
    checkLoginStatus();
    setupGameCardHoverEffects();
});

function initializeParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });
}

function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const icon = darkModeToggle.querySelector('i');

    function updateDarkModeIcon() {
        icon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        updateDarkModeIcon();
    });

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateDarkModeIcon();
}

function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const submitButton = newsletterForm.querySelector('button[type="submit"]');

    // Add animation to input field
    emailInput.addEventListener('focus', () => {
        emailInput.classList.add('input-focus');
    });

    emailInput.addEventListener('blur', () => {
        emailInput.classList.remove('input-focus');
    });

    // Add hover effect to submit button
    submitButton.addEventListener('mouseover', () => {
        submitButton.classList.add('button-hover');
    });

    submitButton.addEventListener('mouseout', () => {
        submitButton.classList.remove('button-hover');
    });

    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;

        // Disable form during submission
        emailInput.disabled = true;
        submitButton.disabled = true;
        submitButton.classList.add('button-loading');

        try {
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log(`Subscribed: ${email}`);
            showNotification('Thank you for subscribing!', 'success');
            e.target.reset();

            // Success animation
            submitButton.classList.remove('button-loading');
            submitButton.classList.add('button-success');
            setTimeout(() => {
                submitButton.classList.remove('button-success');
            }, 2000);
        } catch (error) {
            showNotification('Subscription failed. Please try again.', 'error');
            submitButton.classList.remove('button-loading');
            submitButton.classList.add('button-error');
            setTimeout(() => {
                submitButton.classList.remove('button-error');
            }, 2000);
        } finally {
            // Re-enable form
            emailInput.disabled = false;
            submitButton.disabled = false;
        }
    });
}

function setupParallaxEffect() {
    window.addEventListener('scroll', function() {
        const parallax = document.querySelector('.parallax-section');
        if (parallax) {
            let scrollPosition = window.pageYOffset;
            parallax.style.backgroundPositionY = scrollPosition * 0 + 'px';
        }
    });
}

function setupFeatureAnimations() {
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', () => {
            feature.querySelector('.feature-icon').style.animation = 'pulse 0.5s infinite';
        });
        feature.addEventListener('mouseleave', () => {
            feature.querySelector('.feature-icon').style.animation = '';
        });
    });
}

async function checkLoginStatus() {
    showSpinner();
    try {
        const response = await fetch('/auth/status');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        updateLoginLink(data.isAuthenticated);
    } catch (error) {
        console.error('Error checking login status:', error);
        showNotification('Failed to check login status', 'error');
    } finally {
        hideSpinner();
    }
}

function updateLoginLink(isLoggedIn) {
    const loginLink = document.getElementById("login-link");
    if (loginLink) {
        loginLink.href = isLoggedIn ? '/profile' : '/login';
        loginLink.querySelector('i').className = isLoggedIn ? 'fas fa-user-circle' : 'fas fa-sign-in-alt';
        loginLink.childNodes[1].textContent = isLoggedIn ? ' Profile' : ' Login';
    }
}

function toggleDescription(feature) {
    feature.classList.toggle('active');
    const description = feature.querySelector('.feature-description');
    if (feature.classList.contains('active')) {
        description.style.maxHeight = description.scrollHeight + "px";
    } else {
        description.style.maxHeight = "0px";
    }
}

function setupGameCardHoverEffects() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
}

function showSpinner() {
    document.querySelector('.spinner').style.display = 'block';
}

function hideSpinner() {
    document.querySelector('.spinner').style.display = 'none';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
