

// Show instructor name
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (currentUser && currentUser.role === 'instructor') {
  document.getElementById('instructor-name').textContent = currentUser.name;
} else {
  window.location.href = 'login.html';
}

// Load dynamic page content
function loadPage(page) {
  fetch(page)
    .then(response => {
      if (!response.ok) throw new Error("Page not found or server error");
      return response.text();
    })
    .then(html => {
      document.getElementById("content-area").innerHTML = html;
      loadScriptForPage(page);
      localStorage.setItem('instructorDefaultPage', page); // Save current page
    })
    .catch(err => {
      document.getElementById("content-area").innerHTML = `<p style="color: red;">⚠️ ${err.message}</p>`;
      console.error("Error loading page:", err);
    });
}

// Load page-specific script if needed
function loadScriptForPage(page) {
  const scriptMap = {
    'instructor-home.html': 'js/instructor-home.js',
    'create-course.html': 'js/create-course.js',
    'instructor-assignments.html': 'js/instructor-assignments.js',
    'daily-videos.html': 'js/daily-videos.js',
    'assignments-review.html': 'js/assignments-review.js'
  };

  const existingScript = document.getElementById('dynamic-script');
  if (existingScript) existingScript.remove();

  const scriptSrc = scriptMap[page];
  if (scriptSrc) {
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.id = 'dynamic-script';

    script.onload = () => {
      if (page === 'assignments-review.html' && typeof loadSubmissions === 'function') {
        loadSubmissions();
      }
      if (page === 'daily-videos.html' && typeof loadDailyVideos === 'function') {
        loadDailyVideos();
      }
      if (page === 'instructor-assignments.html' && typeof initInstructorAssignments === 'function') {
        initInstructorAssignments();
      }
    };

    document.body.appendChild(script);
  }
}

// Load last visited page or default to instructor-home.html
window.addEventListener('DOMContentLoaded', () => {
  const defaultPage = localStorage.getItem('instructorDefaultPage') || 'instructor-home.html';
  loadPage(defaultPage);
});

// Logout function
function logout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('instructorDefaultPage');
  window.location.href = 'login.html';
}

// Expose globally
window.loadPage = loadPage;
window.logout = logout;
