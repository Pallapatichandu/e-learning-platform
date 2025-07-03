// Mock data: Published courses
const courses = [
    {
      id: 1,
      title: "HTML & CSS Basics",
      description: "Learn the basics of web development with HTML and CSS.",
      instructor: "Jane Smith"
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      description: "Understand core JavaScript concepts for frontend development.",
      instructor: "John Doe"
    },
    {
      id: 3,
      title: "Introduction to Firebase",
      description: "Get started with Firebase authentication and database.",
      instructor: "Emily Johnson"
    }
  ];
  
  // Load courses on page load
  window.onload = () => {
    const container = document.getElementById("coursesContainer");
    courses.forEach(course => {
      const card = document.createElement("div");
      card.className = "course-card";
      card.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <p><strong>Instructor:</strong> ${course.instructor}</p>
        <button class="enroll-btn" onclick="enroll(${course.id})">Enroll</button>
      `;
      container.appendChild(card);
    });
  };
  
  // Enroll function
  function enroll(courseId) {
    const course = courses.find(c => c.id === courseId);
    alert(`You have enrolled in "${course.title}"`);
  }
  
  