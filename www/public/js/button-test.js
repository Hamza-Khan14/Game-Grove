async function toggleButton() {
    // Get the current state of the button
    const buttonElement = document.getElementById('toggleButton');
    const currentState = buttonElement.classList.contains('on') ? 'on' : 'off';
  
    // Toggle the button state
    const newState = currentState === 'on' ? 'off' : 'on';
    buttonElement.classList.toggle('on', newState === 'on');
    buttonElement.classList.toggle('off', newState === 'off');
  
    // Get the logged-in user's credentials
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  
    // Send the updated button state to the server
    if (loggedInUser) {
      await fetch('/api/button-state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loggedInUser.username,
          buttonState: newState,
        }),
      });
    } else {
      console.error('User not logged in.');
    }
  }
  
  // Load initial button state from the server
  document.addEventListener('DOMContentLoaded', async () => {
    // Get the logged-in user's credentials
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  
    if (loggedInUser) {
      const response = await fetch(`/api/button-state?username=${loggedInUser.username}`);
      const { buttonState } = await response.json();
  
      const buttonElement = document.getElementById('toggleButton');
      buttonElement.classList.toggle('on', buttonState === 'on');
      buttonElement.classList.toggle('off', buttonState === 'off');
    } else {
      console.error('User not logged in.');
    }
  });
  