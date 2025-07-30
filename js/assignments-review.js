

const submissionsEndpoint = 'https://e-learning-platform-4.onrender.com/submissions';

// Load all assignment submissions
function loadSubmissions() {
  fetch(submissionsEndpoint)
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch submissions");
      return response.json();
    })
    .then(data => {
      console.log("Submissions data:", data);
      const list = document.getElementById('submission-list');
      list.innerHTML = '';

      if (data.length === 0) {
        list.innerHTML = "<p>No submissions found.</p>";
        return;
      }

      data.forEach(sub => {
        const card = document.createElement('div');
        card.className = 'submission-card';
        card.innerHTML = `
          <h3>${sub.title} (${sub.course})</h3>
          <p><strong>Student ID:</strong> ${sub.studentId}</p>
          <p><strong>GitHub:</strong> <a href="${sub.githubLink}" target="_blank">${sub.githubLink}</a></p>
          <p><strong>Live Site:</strong> <a href="${sub.deployedLink}" target="_blank">${sub.deployedLink}</a></p>
          <label for="feedback-${sub.id}">Feedback:</label><br>
          <textarea id="feedback-${sub.id}" rows="3" placeholder="Write feedback...">${sub.feedback || ''}</textarea><br>
          <button onclick="submitFeedback('${sub.id}')">Submit Feedback</button>
        `;
        list.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById('submission-list').innerHTML = `<p style="color:red;">⚠️ ${error.message}</p>`;
    });
}

// Submit feedback
function submitFeedback(submissionId) {
  const textarea = document.getElementById(`feedback-${submissionId}`);
  const feedback = textarea.value.trim();

  if (!feedback) {
    alert("Feedback cannot be empty.");
    return;
  }

  fetch(`${submissionsEndpoint}/${submissionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ feedback })
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to submit feedback");
      alert("✅ Feedback submitted successfully!");
    })
    .catch(err => {
      console.error("Error submitting feedback:", err);
      alert("❌ Error submitting feedback");
    });
}

// Call loadSubmissions after content is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSubmissions);
} else {
  loadSubmissions();
}

