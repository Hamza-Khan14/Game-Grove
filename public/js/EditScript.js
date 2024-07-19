document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.querySelector('.save');
    const profileImg = document.getElementById('profile-img');
    const profilePicInput = document.getElementById('profile-image');
    const usernameField = document.getElementById('username');
    const emailField = document.getElementById('email');
    const aboutField = document.getElementById('about');

    // Function to fetch user profile data
    async function fetchUserProfile() {
        try {
            const response = await fetch('/user/profile');
            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    // Function to update profile picture
    async function updateProfilePicture() {
        const userProfile = await fetchUserProfile();
        if (userProfile && userProfile.profilePic) {
            profileImg.src = userProfile.profilePic;
        } else {
            // Set default profile picture URL
            profileImg.src = 'images/default-profile.png';
        }
    }

    // Function to populate form fields with user data
    async function populateFormFields() {
        const userProfile = await fetchUserProfile();
        if (userProfile) {
            usernameField.value = userProfile.username;
            emailField.value = userProfile.email;
            aboutField.value = userProfile.about;
        }
    }

    // Event listener for save button click
    saveButton.addEventListener('click', async function () {
        const formData = new FormData();
        formData.append('username', usernameField.value);
        formData.append('email', emailField.value);
        formData.append('about', aboutField.value);
        if (profilePicInput.files[0]) {
            formData.append('profileImage', profilePicInput.files[0]);
        }

        try {
            const response = await fetch('/user/profile', {
                method: 'PUT',
                body: formData
            });
            if (response.ok) {
                alert('Profile updated successfully!');
                // Optionally, update the UI or redirect to another page
            } else {
                console.error('Error updating profile:', response.statusText);
                alert('Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred. Please try again.');
        }
    });

    // Event listener for profile image input change
    profilePicInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Initialize the form with user data
    updateProfilePicture();
    populateFormFields();
});
