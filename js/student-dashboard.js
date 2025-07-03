

// Show student name
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser && currentUser.role === 'student') {
  document.getElementById('student-name').textContent = currentUser.name;
} else {
  window.location.href = 'login.html';
}

// Load dynamic page content
function loadPage(page) {
  fetch(page)
    .then(res => {
      if (!res.ok) throw new Error("Page not found");
      return res.text();
    })
    .then(html => {
      document.getElementById("content-area").innerHTML = html;
      loadScriptForPage(page);
      localStorage.setItem('defaultPage', page); // Save current page
    })
    .catch(err => {
      document.getElementById("content-area").innerHTML = `<p style="color:red;">⚠️ ${err.message}</p>`;
    });
}

// Load page-specific script if needed
function loadScriptForPage(page) {
  const scriptMap = {
    'student-home.html': 'js/student-home.js',
    'available-courses.html': 'js/available-courses.js',
    'mycourse.html': 'js/mycourse.js',
    'student-class-videos.html': 'js/student-class-videos.js',
    'student-assignments.html': 'js/student-assignments.js'
    
  };

  const existingScript = document.getElementById('dynamic-script');
  if (existingScript) existingScript.remove();

  const scriptSrc = scriptMap[page];
  if (scriptSrc) {
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.id = 'dynamic-script';

    // Optional: run page-specific function after script loads
    script.onload = () => {
      if (page === 'student-class-videos.html' && typeof loadClassVideos === 'function') {
        loadClassVideos();
      }
      if (page === 'student-assignments.html' && typeof initStudentAssignments === 'function') {
  initStudentAssignments();
}
    };

    document.body.appendChild(script);
  }
}

// Load last visited page or home on load
window.addEventListener('DOMContentLoaded', () => {
  const defaultPage = localStorage.getItem('defaultPage');
  loadPage(defaultPage || 'student-home.html');
});

// Logout function
function logout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('defaultPage');
  window.location.href = 'login.html';
}
