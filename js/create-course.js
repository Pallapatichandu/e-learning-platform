var API_URL = 'http://localhost:8000/courses';
var form = document.getElementById('course-form');
var list = document.getElementById('courses-list');
var editingId = null;

function resetForm() {
  editingId = null;
  form.reset();
  form.querySelector('button[type="submit"]').textContent = 'Create Course';
}

function generateCourseHTML(course) {
  return `
    <strong>${course.title}</strong><br />
    <span>Instructor: ${course.instructor}</span><br />
    <span>${course.description}</span><br />
    <img src="${course.image}" alt="Course Image" width="100"><br />
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  `;
}

function appendCourse(course) {
  var li = document.createElement('li');
  li.dataset.id = course.id;
  li.innerHTML = generateCourseHTML(course);
  list.appendChild(li);
}

function updateCourseInList(course) {
  var li = list.querySelector('li[data-id="' + course.id + '"]');
  if (li) li.innerHTML = generateCourseHTML(course);
}

function loadCourses() {
  fetch(API_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to load');
      return res.json();
    })
    .then(function (data) {
      list.innerHTML = '';
      data.forEach(function (course) {
        appendCourse(course);
      });
    })
    .catch(function (error) {
      console.error('Error loading courses:', error);
      alert('⚠️ Failed to load courses.');
    });
}

function editCourse(id) {
  fetch(API_URL + '/' + id)
    .then(function (res) {
      if (!res.ok) throw new Error('Course not found');
      return res.json();
    })
    .then(function (course) {
      form.title.value = course.title;
      form.instructor.value = course.instructor;
      form.description.value = course.description;
      form.image.value = course.image;
      editingId = id;
      form.querySelector('button[type="submit"]').textContent = 'Update Course';
    })
    .catch(function (error) {
      console.error('Edit error:', error);
      alert('⚠️ Failed to load course for editing.');
    });
}

function deleteCourse(id) {
  if (!confirm('Are you sure you want to delete this course?')) return;

  fetch(API_URL + '/' + id, { method: 'DELETE' })
    .then(function (res) {
      if (!res.ok) throw new Error('Delete failed');
      var li = list.querySelector('li[data-id="' + id + '"]');
      if (li) li.remove();
      if (editingId === id) resetForm();
    })
    .catch(function (error) {
      console.error('Delete error:', error);
      alert('⚠️ Failed to delete course.');
    });
}

// Event Listeners
list.addEventListener('click', function (e) {
  var li = e.target.closest('li');
  if (!li) return;
  var id = li.dataset.id;

  if (e.target.classList.contains('edit-btn')) {
    editCourse(id);
  } else if (e.target.classList.contains('delete-btn')) {
    deleteCourse(id);
  }
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  var course = {
    title: form.title.value.trim(),
    instructor: form.instructor.value.trim(),
    description: form.description.value.trim(),
    image: form.image.value.trim()
  };

  if (!course.title || !course.instructor || !course.description || !course.image) {
    alert('⚠️ Please fill in all fields.');
    return;
  }

  if (editingId) {
    fetch(API_URL + '/' + editingId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (updated) {
        updateCourseInList(updated);
        resetForm();
      })
      .catch(function (error) {
        console.error('Update error:', error);
        alert('⚠️ Failed to update course.');
      });
  } else {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (newCourse) {
        appendCourse(newCourse);
        resetForm();
      })
      .catch(function (error) {
        console.error('Create error:', error);
        alert('⚠️ Failed to create course.');
      });
  }
});

// Initial call to load courses on page load
loadCourses();
