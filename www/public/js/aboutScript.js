document.addEventListener('DOMContentLoaded', function() {
    var loginLink = document.getElementById("login-link");

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
    var loginLink = document.getElementById("login-link");
    if (loginLink) {
        if (isLoggedIn) {

            loginLink.href = '/profile';
            loginLink.childNodes[1].textContent = ' Profile';
        } else {

            loginLink.href = '/login';
            loginLink.childNodes[1].textContent = ' Login';
        }
    }
}
