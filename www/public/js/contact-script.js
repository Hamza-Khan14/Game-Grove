document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        console.log('Menu toggled');  // Add this line for debugging
    });
});
