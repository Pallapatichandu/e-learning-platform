

(() => {
  const coursesAPI     = 'http://localhost:8000/courses';
  const enrollmentsAPI = 'http://localhost:8000/enrollments';

  const availableCourses    = document.getElementById('availableCourses');
  const enrolledCoursesList = document.getElementById('enrolledCourses');
  const messageDiv = document.getElementById('message');

  // ✅ Get current logged-in student from localStorage
  const currentStudent = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentStudent || currentStudent.role !== 'student') {
    alert('Please log in as a student.');
    window.location.href = 'login.html';
    return; // stop execution
  }
  const studentId = String(currentStudent.id); // force to string

  // 🔁 Load Courses NOT Enrolled
  function loadAvailableCourses() {
    Promise.all([
      fetch(coursesAPI).then(res => res.json()),
      fetch(`${enrollmentsAPI}?studentId=${studentId}`).then(res => res.json())
    ])
    .then(([courses, enrollments]) => {
      const enrolledIds = enrollments.map(e => String(e.courseId)); // force string comparison
      availableCourses.innerHTML = '';

      courses.forEach(course => {
        if (!enrolledIds.includes(String(course.id))) {
          const li = document.createElement('li');
          li.setAttribute('data-id', course.id);
          li.innerHTML = `
            <img src="${course.image}" alt="${course.title}" width="100" />
            <div>
              <strong>${course.title}</strong> by ${course.instructor}
              <p>${course.description}</p>
              <button class="enroll-btn">Enroll</button>
            </div>
          `;
          availableCourses.appendChild(li);
        }
      });
    })
    .catch(err => {
      console.error('Error loading available courses:', err);
      availableCourses.innerHTML = '<li>Failed to load courses.</li>';
    });
  }

  // 🔁 Load Enrolled Courses
  function loadEnrolledCourses() {
    fetch(`${enrollmentsAPI}?studentId=${studentId}`)
      .then(res => res.json())
      .then(enrollments => {
        const courseIds = enrollments.map(e => String(e.courseId));
        return fetch(coursesAPI).then(res => res.json())
          .then(courses => {
            enrolledCoursesList.innerHTML = '';
            courses
              .filter(course => courseIds.includes(String(course.id)))
              .forEach(course => {
                const li = document.createElement('li');
                li.innerHTML = `
                  <img src="${course.image}" width="100" alt="${course.title}" />
                  <strong>${course.title}</strong>
                `;
                enrolledCoursesList.appendChild(li);
              });
          });
      })
      .catch(err => {
        console.error('Error loading enrolled courses:', err);
        enrolledCoursesList.innerHTML = '<li>Failed to load your enrollments.</li>';
      });
  }

  // ✅ Enroll Handler
  availableCourses.addEventListener('click', e => {
    if (!e.target.classList.contains('enroll-btn')) return;

    const li = e.target.closest('li');
    const rawId = li?.getAttribute('data-id');

    if (!rawId) {
      alert('⚠️ Invalid course selected.');
      return;
    }

    const courseId = rawId; // keep as string if your DB uses string ids

    // Check if already enrolled
    fetch(`${enrollmentsAPI}?studentId=${studentId}&courseId=${courseId}`)
      .then(r => r.json())
      .then(existing => {
        if (existing.length > 0) {
          alert('⚠️ You are already enrolled.');
          return;
        }

        return fetch(enrollmentsAPI, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, courseId })
        });
      })
      .then(r => r?.ok && r.json())
      .then(newRec => {
        if (newRec) {
          alert('✅ Enrolled successfully!');
          loadAvailableCourses();
          loadEnrolledCourses();
        }
      })
      .catch(err => {
        console.error('Enrollment error:', err);
        alert('❌ Failed to enroll.');
      });
  });

  // 🚀 Initial Load
  loadAvailableCourses();
  loadEnrolledCourses();

})();
