

function dailyVideosInit() {
  const form = document.getElementById('video-form');
  const courseEl = document.getElementById('course');
  const videoUrlEl = document.getElementById('video-url');
  const thumbnailEl = document.getElementById('thumbnail');
  const dateEl = document.getElementById('upload-date');
  const videosList = document.getElementById('videos-list');
  const API = 'http://localhost:3000/videos';

  if (!form) {
    console.error('Video form not found!');
    return;
  }

  function loadVideos() {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        videosList.innerHTML = '';
        data.forEach(video => {
          const card = document.createElement('div');
          card.style.border = '1px solid #ccc';
          card.style.margin = '10px';
          card.style.padding = '10px';

          card.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.course}" width="100" />
            <h4>${video.course}</h4>
            <p><strong>Date:</strong> ${video.date || 'Not provided'}</p>
            <a href="${video.videoUrl}" target="_blank" rel="noopener noreferrer">Watch Video</a>
            <br/>
            <button class="edit-btn" data-id="${video.id}">Edit</button>
            <button class="delete-btn" data-id="${video.id}">Delete</button>
          `;

          videosList.appendChild(card);
        });

        // Delete
        document.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this video?')) {
              fetch(`${API}/${id}`, { method: 'DELETE' })
                .then(res => {
                  if (!res.ok) throw new Error('Failed to delete');
                  loadVideos();
                })
                .catch(err => alert('Delete failed: ' + err));
            }
          });
        });

        // Edit
        document.querySelectorAll('.edit-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const videoToEdit = data.find(v => v.id == id);
            if (videoToEdit) {
              courseEl.value = videoToEdit.course;
              videoUrlEl.value = videoToEdit.videoUrl;
              thumbnailEl.value = videoToEdit.thumbnail;
              dateEl.value = videoToEdit.date || '';

              form.dataset.editingId = id;
              form.querySelector('button[type="submit"]').textContent = 'Update Video';
            }
          });
        });
      })
      .catch(err => {
        console.error('Failed to load videos:', err);
        videosList.innerHTML = '<p>Error loading videos.</p>';
      });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const newVideo = {
      course: courseEl.value.trim(),
      videoUrl: videoUrlEl.value.trim(),
      thumbnail: thumbnailEl.value.trim(),
      date: dateEl.value.trim()
    };

    const editingId = form.dataset.editingId;

    if (editingId) {
      // Update existing video
      fetch(`${API}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo)
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to update');
          return res.json();
        })
        .then(() => {
          alert('Video updated successfully!');
          form.reset();
          form.querySelector('button[type="submit"]').textContent = 'Upload Video';
          delete form.dataset.editingId;
          loadVideos();
        })
        .catch(err => {
          console.error(err);
          alert('Update failed, see console.');
        });

    } else {
      // Add new video
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo)
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to upload video');
          return res.json();
        })
        .then(() => {
          alert('Video uploaded successfully!');
          form.reset();
          loadVideos();
        })
        .catch(err => {
          console.error(err);
          alert('Upload failed, see console.');
        });
    }
  });

  loadVideos();
}

dailyVideosInit();
