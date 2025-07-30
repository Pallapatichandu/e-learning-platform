
document.addEventListener('DOMContentLoaded', loadClassVideos);

function loadClassVideos() {
  const container = document.getElementById('videos-container');
  if (!container) return;

  const studentId = localStorage.getItem('studentId'); // Replace with actual logic if needed
  if (!studentId) {
    container.innerHTML = '<p style="color:red;">⚠️ Student not logged in.</p>';
    return;
  }

  // Step 1: Get enrollments for this student
  fetch('https://e-learning-platform-4.onrender.com/enrollments')
    .then(res => res.json())
    .then(enrollments => {
      const studentEnrollments = enrollments.filter(e => e.studentId === studentId);
      const courseIds = studentEnrollments.map(e => e.courseId);

      // Step 2: Get course titles for those course IDs
      fetch('https://e-learning-platform-4.onrender.com/courses')
        .then(res => res.json())
        .then(courses => {
          const enrolledCourseTitles = courses
            .filter(course => courseIds.includes(course.id))
            .map(course => course.title.toLowerCase());

          // Step 3: Get all videos and filter by enrolled course title
          fetch('https://e-learning-platform-4.onrender.com/videos')
            .then(res => res.json())
            .then(videos => {
              const filteredVideos = videos.filter(video =>
                enrolledCourseTitles.includes(video.course?.toLowerCase())
              );

              if (filteredVideos.length === 0) {
                container.innerHTML = '<p>No class videos available for your courses.</p>';
                return;
              }

              container.innerHTML = ''; // Clear container

              filteredVideos.forEach(video => {
                const card = document.createElement('div');
                card.className = 'video-card';

                card.innerHTML = `
                  <img src="${video.thumbnail || 'https://via.placeholder.com/150'}" 
                       alt="${video.title || 'Class Video'}" 
                       class="video-thumbnail">
                  <h3>${video.title || 'Untitled Video'}</h3>
                  <p>Course: ${video.course || 'Unknown'}</p>
                  <p class="video-date">Date: ${video.date ? new Date(video.date).toLocaleDateString() : 'N/A'}</p>
                `;

                const iframe = document.createElement('iframe');
                iframe.className = 'video-iframe';
                iframe.src = video.videoUrl;
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowfullscreen', '');
                iframe.style.display = 'none';

                const thumbnail = card.querySelector('.video-thumbnail');
                thumbnail.style.cursor = 'pointer';

                thumbnail.addEventListener('click', () => {
                  thumbnail.style.display = 'none';
                  iframe.style.display = 'block';
                });

                card.appendChild(iframe);
                container.appendChild(card);
              });
            });
        });
    })
    .catch(error => {
      container.innerHTML = `<p style="color:red;">⚠️ ${error.message}</p>`;
    });
}
