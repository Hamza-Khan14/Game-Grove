const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');
const toggleHeart = document.getElementById('heart');

menuToggle.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-open');
    sidebar.style.left = document.body.classList.contains('sidebar-open') ? '0px' : '-300px';
    menuToggle.style.left = document.body.classList.contains('sidebar-open') ? '230px' : '20px';
});

// Load heart state on page load
window.addEventListener('load', () => {
    const isLiked = localStorage.getItem('isLiked') === 'true';
    updateHeartState(isLiked);
});

// Toggle heart icon and color
toggleHeart.addEventListener('click', () => {
    const isLiked = toggleHeart.classList.contains('fa-solid');
    updateHeartState(!isLiked);
    localStorage.setItem('isLiked', !isLiked);
});

function updateHeartState(isLiked) {
    toggleHeart.classList.toggle('fa-solid', isLiked);
    toggleHeart.classList.toggle('fa-regular', !isLiked);
    toggleHeart.style.color = isLiked ? 'red' : 'white';
    toggleHeart.classList.toggle('beat', isLiked);
}

// Fetch user profile data
async function fetchUserProfile() {
    try {
        const response = await fetch('/user/profile');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
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
    const userGamesElem = document.querySelector('.user-games');
    const skillBarsElem = document.querySelector('.skill-bars');

    if (userProfile) {
        profileImg.src = userProfile.profilePic || 'images/default-profile.png';
        userNameElem.textContent = userProfile.username || 'Username not found';
        userEmailElem.textContent = userProfile.email || 'Email not found';
        aboutUserElem.textContent = userProfile.about || 'No information available';
        
        // Update favorite games
        userGamesElem.innerHTML = userProfile.favoriteGames.map(game => `<li>${game}</li>`).join('') || '<li>No favorite games listed</li>';
        
        // Update gaming skills
        skillBarsElem.innerHTML = Object.entries(userProfile.gamingSkills).map(([skill, level]) => `
            <div class="skill">
                <span class="skill-name">${skill}</span>
                <div class="skill-bar" data-level="${level}"></div>
            </div>
        `).join('');
        
        // Animate skill bars
        setTimeout(() => {
            document.querySelectorAll('.skill-bar').forEach(bar => {
                const level = bar.getAttribute('data-level');
                bar.style.width = `${level}%`;
            });
        }, 500);
    } else {
        userNameElem.textContent = 'Username not found';
        userEmailElem.textContent = 'Email not found';
        aboutUserElem.textContent = 'No information available';
        userGamesElem.innerHTML = '<li>No favorite games listed</li>';
        skillBarsElem.innerHTML = '<p>No gaming skills listed</p>';
    }
}

// Navigate to edit profile page
function editProfile() {
    window.location.href = '/edit-profile';
}

// Update profile on page load
window.onload = updateProfile;

async function logout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            window.location.href = '/login';
        } else {
            console.error('Logout failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}
