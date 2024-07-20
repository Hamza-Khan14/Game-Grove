document.addEventListener('DOMContentLoaded', function() {

    const errorText = document.querySelector('.error-content h1');
    setInterval(() => {
        errorText.style.textShadow = `0 0 ${Math.random() * 10 + 5}px #4169e1, 0 0 ${Math.random() * 20 + 10}px #ff3366`;
    }, 100);

    // Smooth scroll to top when clicking "Return to Home Base"
    const homeBtn = document.querySelector('.btn-home');
    homeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setTimeout(() => {
            window.location.href = this.getAttribute('href');
        }, 500);
    });
});
