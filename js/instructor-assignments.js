(() => {
  const API_URL = 'http://localhost:3000/assignments';
  const form = document.getElementById('assignment-form');
  const list = document.getElementById('assignments-list');

  let editingId = null;

  // Reset form fields and editing mode
  function resetForm() {
    editingId = null;
    form.reset();
    form.querySelector('button[type="submit"]').textContent = 'Create Assignment';
  }

  // Append a single assignment to the list
  function appendAssignment(assignment) {
    const li = document.createElement('li');
    li.dataset.id = assignment.id;
    li.innerHTML = `
      <strong>${assignment.title}</strong> (Course: ${assignment.course})<br />
      <span>Description: ${assignment.description}</span><br />
      <span>Due: ${assignment['due-date']}</span><br />
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;
    list.appendChild(li);
  }

  // Update assignment in the list UI
  function updateAssignmentInList(assignment) {
    const li = list.querySelector(`li[data-id="${assignment.id}"]`);
    if (!li) return;
    li.innerHTML = `
      <strong>${assignment.title}</strong> (Course: ${assignment.course})<br />
      <span>Description: ${assignment.description}</span><br />
      <span>Due: ${assignment['due-date']}</span><br />
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;
  }

  // Load all assignments from server
  async function loadAssignments() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      list.innerHTML = '';
      data.forEach(appendAssignment);
    } catch {
      alert('Failed to load assignments.');
    }
  }

  // Fill form with assignment data for editing
  async function editAssignment(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const assignment = await res.json();
      form.course.value = assignment.course;
      form.title.value = assignment.title;
      form.description.value = assignment.description;
      form['due-date'].value = assignment['due-date'];
      editingId = id;
      form.querySelector('button[type="submit"]').textContent = 'Update Assignment';
    } catch {
      alert('Failed to load assignment for editing.');
    }
  }

  // Delete assignment by ID
  async function deleteAssignment(id) {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const li = list.querySelector(`li[data-id="${id}"]`);
      if (li) li.remove();
      if (editingId === id) resetForm();
    } catch {
      alert('Failed to delete assignment.');
    }
  }

  // Handle click on edit/delete buttons
  list.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;
    if (e.target.classList.contains('edit-btn')) {
      editAssignment(id);
    } else if (e.target.classList.contains('delete-btn')) {
      deleteAssignment(id);
    }
  });

  // Form submit handler for create/update
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const assignment = {
      course: form.course.value.trim(),
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      'due-date': form['due-date'].value
    };

    if (!assignment.course || !assignment.title || !assignment.description || !assignment['due-date']) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      if (editingId) {
        // Update existing
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assignment)
        });
        const updated = await res.json();
        updateAssignmentInList(updated);
      } else {
        // Create new
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assignment)
        });
        const newAssignment = await res.json();
        appendAssignment(newAssignment);
      }
      resetForm();
    } catch {
      alert(editingId ? 'Failed to update assignment.' : 'Failed to create assignment.');
    }
  });

  // Initial load
  loadAssignments();
})();
