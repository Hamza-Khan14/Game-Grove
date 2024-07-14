function submitForm() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Add your authentication logic here
    // For simplicity, let's assume any non-empty username and password are valid
    if (username.trim() !== '' && password.trim() !== '') {
        // Redirect to a page with information about 10 AI technologies
        window.location.href = 'ai_technologies.html';
    } else {
        alert('Invalid username or password. Please try again.');
    }
}
