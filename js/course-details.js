// Simulated course database
const courses = [
    { id: 1, title: "HTML Basics", description: "Learn the foundation of web structure." },
    { id: 2, title: "JavaScript Essentials", description: "Understand JS and its power." },
    { id: 3, title: "CSS for Beginners", description: "Style your pages beautifully." },
    { id: 4, title: "React Introduction", description: "Build dynamic UIs with React." }
  ];
  
  // Get course ID from URL
  const params = new URLSearchParams(window.location.search);
  const courseId = parseInt(params.get("id"));
  
  // Find the course
  const course = courses.find(c => c.id === courseId);
  
  if (course) {
    document.getElementById("course-title").textContent = course.title;
    document.getElementById("course-description").textContent = course.description;
  } else {
    document.getElementById("course-title").textContent = "Course not found";
  }
  
  // Enroll function
  function enroll() {
    let enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
    if (!enrolled.find(c => c.id === course.id)) {
      enrolled.push(course);
      localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
      alert(`You have enrolled in ${course.title}`);
    } else {
      alert("You are already enrolled in this course.");
    }
  }
  