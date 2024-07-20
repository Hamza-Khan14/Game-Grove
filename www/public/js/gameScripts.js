function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.body.style.marginRight = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.body.style.marginRight = "0";
}

document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.menu-icon');
    const sidebar = document.getElementById('mySidebar');
    const closeBtn = document.querySelector('.close-btn');

    menuIcon.addEventListener('click', openNav);
    closeBtn.addEventListener('click', closeNav);

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.style.width = "0";
            document.body.style.marginRight = "0";
        }
    });
});
