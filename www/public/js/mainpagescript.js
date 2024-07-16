document.addEventListener('DOMContentLoaded', function () {
    var menuIcon = document.getElementById("menuIcon");
    var sidebar = document.getElementById("sidebar");
    var mainContent = document.getElementById("main");
    var contactSection = document.getElementById("contact");

    if (!menuIcon || !sidebar || !mainContent || !contactSection) {
        console.error("Elements not found");
    }

    menuIcon.addEventListener('click', function () {
        sidebar.classList.toggle("show");
    });

    // Call the function to update user data
    updateUserData();
});

// Fetch user profile data
async function fetchUserProfile() {
    try {
        const response = await fetch('/user/profile'); // Endpoint returns user profile data
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        console.log('User data fetched:', userData); // Debug statement
        return userData;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

// Update profile information
async function updateUserData() {
    const userProfile = await fetchUserProfile();

    const profileImg = document.getElementById("avatar");
    const userNameElem = document.getElementById("username");

    if (userProfile) {
        profileImg.src = userProfile.profilePic || 'images/default-profile.png';
        userNameElem.textContent = userProfile.username || 'Login First!';
    } else {
        userNameElem.textContent = 'Login First!';
    }

    console.log('Profile image source:', profileImg.src); // Debug statement
    console.log('User name:', userNameElem.textContent); // Debug statement
}
