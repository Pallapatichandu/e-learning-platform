document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const welcomeMsg = document.getElementById('welcome-msg');

  if (user?.name) {
    const firstName = user.name.split(' ')[0];
    welcomeMsg.textContent = `Welcome back, ${firstName} 👋`;
  } else {
    welcomeMsg.textContent = `Welcome to LearnRise 👋`;
  }
});
