document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const menuIcon = document.querySelector('.menu-icon');
    const closeBtn = document.querySelector('.close-btn');
    const loginLink = document.getElementById("login-link");
    const sidebarLinks = document.querySelectorAll('.sidebar a:not(.close-btn)');

    function openSidebar() {
        sidebar.style.width = '250px';
        document.body.classList.add('sidebar-open');
    }

    function closeSidebar() {
        sidebar.style.width = '0';
        document.body.style.marginLeft = '0';
        document.body.classList.remove('sidebar-open');
    }

    menuIcon.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);


    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && event.target !== menuIcon) {
            closeSidebar();
        }
    });

    sidebarLinks.forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    if (loginLink) {
        loginLink.addEventListener('click', function(event) {
        });
    } else {
        console.error("Login link not found");
    }

    checkLoginStatus();
});

async function fetchUserProfile() {
    try {
        const response = await fetch('/user/profile');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        console.log('User data fetched:', userData);
        return userData;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

async function checkLoginStatus() {
    try {
        const response = await fetch('/auth/status');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        updateLoginLink(data.isAuthenticated);
    } catch (error) {
        console.error('Error checking login status:', error);
    }
}

function updateLoginLink(isLoggedIn) {
    const loginLink = document.getElementById("login-link");
    const sidebarLoginLink = document.getElementById("sidebar-login-link");
   
    if (loginLink && sidebarLoginLink) {
        const linkText = isLoggedIn ? ' Profile' : ' Login';
        const linkHref = isLoggedIn ? '/profile' : '/login';

        [loginLink, sidebarLoginLink].forEach(link => {
            link.href = linkHref;
            link.childNodes[1].textContent = linkText;
        });
    }
}
