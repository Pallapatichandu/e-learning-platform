(() => {
  const coursesAPI = 'https://e-learning-platform-4.onrender.com/courses';
  const enrollmentsAPI = 'https://e-learning-platform-4.onrender.com/enrollments';

  const myCoursesList = document.getElementById('myCoursesList');
  const currentStudent = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentStudent || currentStudent.role !== 'student') {
    alert('Please log in as a student.');
    window.location.href = 'login.html';
    return;
  }

  const studentId = String(currentStudent.id);

  fetch(`${enrollmentsAPI}?studentId=${studentId}`)
    .then(res => res.json())
    .then(enrollments => {
      const courseIds = enrollments.map(e => String(e.courseId));
      return fetch(coursesAPI)
        .then(res => res.json())
        .then(courses => {
          const enrolledCourses = courses.filter(course =>
            courseIds.includes(String(course.id))
          );

          if (enrolledCourses.length === 0) {
            myCoursesList.innerHTML = '<li>No courses enrolled yet.</li>';
          } else {
            myCoursesList.innerHTML = '';
            enrolledCourses.forEach(course => {
              const li = document.createElement('li');
              li.innerHTML = `
                <img src="${course.image}" width="100" />
                <strong>${course.title}</strong> by ${course.instructor}
                <p>${course.description}</p>
              `;
              myCoursesList.appendChild(li);
            });
          }
        });
    })
    .catch(err => {
      console.error('Error loading my courses:', err);
      myCoursesList.innerHTML = '<li>Failed to load your courses.</li>';
    });
})();
