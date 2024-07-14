function toggleMenu() {
    var menuItems = document.getElementById("menuItems");
    menuItems.style.display = (menuItems.style.display === "block") ? "none" : "block";
}

// Check if the user is logged in (replace with your authentication logic)
var loggedInUser = sessionStorage.getItem('loggedInUser');

if (loggedInUser) {
    // Display the logged-in user's name
    document.getElementById('loggedInUser').style.display = 'block';
    document.getElementById('usernameDisplay').innerText = loggedInUser;
}

// Check if there is an error message and display it
var errorMessage = '<%= messages.error %>'; // Replace '<%= messages.error %>' with the actual value

if (errorMessage.trim() !== '') {
    document.getElementById('errorMessage').innerText += errorMessage;
    document.getElementById('errorMessage').style.display = 'block';
}
