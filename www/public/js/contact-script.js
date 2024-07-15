document.addEventListener('DOMContentLoaded', function() {
    var menuIcon = document.getElementById("menuIcon");
    var sidebar = document.getElementById("sidebar");
    var mainContent = document.querySelector(".wrapper");

    if (menuIcon) {
        menuIcon.addEventListener('click', function() {
            sidebar.classList.toggle("open");
            mainContent.classList.toggle("shifted");
        });
    } else {
        console.error("Menu icon not found");
    }

    updateProfile(); // Call updateProfile after DOM has loaded
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
async function updateProfile() {
    const userProfile = await fetchUserProfile();
    const profileImg = document.getElementById('profile-img');
    const userNameElem = document.querySelector('.user-name');

    if (userProfile) {
        profileImg.src = userProfile.profilePic || 'images/default-profile.png';
        userNameElem.textContent = userProfile.username || 'Username not found';
    } else {
        userNameElem.textContent = 'Username not found';
    }

    console.log('Profile image source:', profileImg.src); // Debug statement
    console.log('User name:', userNameElem.textContent); // Debug statement
}
