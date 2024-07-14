const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');
const toggleHeart = document.getElementById('heart');

// Toggle sidebar visibility and body blur
menuToggle.addEventListener('click', () => {
    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-200px';
        document.body.classList.remove('sidebar-open');
    } else {
        sidebar.style.left = '0px';
        document.body.classList.add('sidebar-open');
    }
});

// Toggle heart icon and color
toggleHeart.addEventListener('click', () => {
    toggleHeart.classList.toggle('beat');
    toggleHeart.classList.toggle('fa-solid');
    toggleHeart.style.color = toggleHeart.classList.contains('fa-solid') ? 'red' : 'white';
});

// Fetch user profile data
async function fetchUserProfile() {
    try {
        const response = await fetch('/user/profile'); // Endpoint returns user profile data
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const userData = await response.json();
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
    const userEmailElem = document.querySelector('.user-email');
    const aboutUserElem = document.querySelector('.about-user');
    const userHobbiesElem = document.querySelector('.user-hobbies');
    const userSkillsElem = document.querySelector('.user-skills');

    if (userProfile) {
        profileImg.src = userProfile.profilePic || 'images/default-profile.png';
        userNameElem.textContent = userProfile.username || 'Username not found';
        userEmailElem.textContent = userProfile.email || 'Email not found';
        aboutUserElem.textContent = userProfile.about || 'No information available';
        userHobbiesElem.textContent = userProfile.hobbies || 'No hobbies listed';
        userSkillsElem.textContent = userProfile.skills || 'No skills listed';
    } else {
        userNameElem.textContent = 'Username not found';
        userEmailElem.textContent = 'Email not found';
        aboutUserElem.textContent = 'No information available';
        userHobbiesElem.textContent = 'No hobbies listed';
        userSkillsElem.textContent = 'No skills listed';
    }
}

// Navigate to edit profile page
function editProfile() {
    window.location.href = '/edit-profile';
}

// Update profile on page load
window.onload = updateProfile;
