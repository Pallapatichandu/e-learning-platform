

function initStudentAssignments() {
  const studentId = JSON.parse(localStorage.getItem('currentUser'))?.id;
  const container = document.getElementById('assignments-container');

  if (!studentId) {
    container.innerHTML = '<p style="color:red;">Student ID not found.</p>';
    return;
  }

  Promise.all([
    fetch('http://localhost:8000/assignments').then(res => res.json()),
    fetch(`http://localhost:8000/submissions?studentId=${studentId}`).then(res => res.json())
  ])
    .then(([assignments, submissions]) => {
      if (assignments.length === 0) {
        container.innerHTML = '<p>No assignments available yet.</p>';
        return;
      }

      container.innerHTML = ''; // Clear previous content

      assignments.forEach(assignment => {
        const alreadySubmitted = submissions.find(sub => sub.assignmentId === assignment.id);

        const assignmentCard = document.createElement('div');
        assignmentCard.classList.add('assignment-card');

        assignmentCard.innerHTML = `
          <h3>${assignment.title} (${assignment.course})</h3>
          <p>${assignment.description}</p>
          <p><strong>Due:</strong> ${assignment["due-date"]}</p>
        `;

        if (alreadySubmitted) {
          assignmentCard.innerHTML += `
            <p><strong>✅ Already Submitted</strong></p>
            <p><strong>Deployed Link:</strong> <a href="${alreadySubmitted.deployedLink}" target="_blank">${alreadySubmitted.deployedLink}</a></p>
            <p><strong>GitHub Link:</strong> <a href="${alreadySubmitted.githubLink}" target="_blank">${alreadySubmitted.githubLink}</a></p>
            <div class="feedback"><strong>Feedback:</strong> ${alreadySubmitted.feedback || "Pending..."}</div>
          `;
        } else {
          assignmentCard.innerHTML += `
            <input type="url" id="deploy-${assignment.id}" placeholder="Enter deployed link" required />
            <input type="url" id="github-${assignment.id}" placeholder="Enter GitHub link" required />
            <button onclick="submitAssignment('${assignment.id}', '${assignment.course}', '${assignment.title}')">Submit</button>
            <div id="feedback-${assignment.id}" class="feedback"></div>
          `;
        }

        assignmentCard.innerHTML += `<hr>`;
        container.appendChild(assignmentCard);
      });
    })
    .catch(error => {
      console.error('Error loading assignments:', error);
      container.innerHTML = '<p>Something went wrong while loading assignments.</p>';
    });
}

function submitAssignment(id, course, title) {
  const student = JSON.parse(localStorage.getItem('currentUser'));
  if (!student) {
    alert("Student not found. Please login again.");
    return;
  }

  const deployLink = document.getElementById(`deploy-${id}`).value.trim();
  const githubLink = document.getElementById(`github-${id}`).value.trim();

  if (!deployLink || !githubLink) {
    alert("Please provide both the deployed and GitHub links.");
    return;
  }

  const submission = {
    assignmentId: id,
    course,
    title,
    studentId: student.id,
    deployedLink: deployLink,
    githubLink: githubLink,
    submittedAt: new Date().toISOString(),
    feedback: ""
  };

  fetch('http://localhost:8000/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission)
  })
    .then(res => {
      if (res.ok) {
        alert("Assignment submitted successfully!");
        initStudentAssignments();
      } else {
        alert("Submission failed. Please try again.");
      }
    })
    .catch(error => {
      console.error("Error submitting assignment:", error);
      alert("Network error. Try again later.");
    });
}

// Make function global for loader to call
window.initStudentAssignments = initStudentAssignments;
