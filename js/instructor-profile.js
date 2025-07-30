const API_URL = 'http://localhost:3000/instructors';

const profilePreview = document.getElementById('profilePreview');
const profileImage = document.getElementById('profileImage');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const specializationInput = document.getElementById('specialization');
const profileForm = document.getElementById('profileForm');

let instructorId = null;

// Dummy user from localStorage for testing
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
  name: "Test Instructor",
  email: "test@instructor.com",
  role: "instructor"
};
localStorage.setItem('currentUser', JSON.stringify(currentUser));

// Set name/email in UI
nameInput.value = currentUser.name;
emailInput.value = currentUser.email;

// Load existing profile (if available)
fetch(`${API_URL}?email=${currentUser.email}`)
  .then(res => res.json())
  .then(data => {
    if (data.length > 0) {
      instructorId = data[0].id;
      specializationInput.value = data[0].specialization || '';
      if (data[0].image) profilePreview.src = data[0].image;
    }
  });

// Image preview
profileImage.addEventListener('change', () => {
  const file = profileImage.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      profilePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Save profile
profileForm.addEventListener('submit', e => {
  e.preventDefault();

  const updatedProfile = {
    name: currentUser.name,
    email: currentUser.email,
    specialization: specializationInput.value,
    image: profilePreview.src
  };

  const method = instructorId ? 'PUT' : 'POST';
  const url = instructorId ? `${API_URL}/${instructorId}` : API_URL;

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedProfile)
  })
    .then(res => res.json())
    .then(() => {
      alert('Profile saved!');
    });
});
