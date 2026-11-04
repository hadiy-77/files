const BASE_URL = 'https://raw.githubusercontent.com/Hadiy-77/public-files/main/files';

  function getFileUrl(filename) {
      return `${BASE_URL}/${encodeURIComponent(filename)}`;
  }

  function getMimeType(filename) {
      const ext = filename.split('.').pop().toLowerCase();
      const types = { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', txt: 'text/plain', html: 'text/html', json: 'application/json' };
      return types[ext] || 'application/octet-stream';
  }

  async function viewFile() {
      const filename = document.getElementById('fileInput').value.trim();
      if (!filename) { alert('Please enter a filename'); return; }

      const url = getFileUrl(filename);
      document.getElementById('fileTitle').textContent = filename;
      document.getElementById('fileViewer').style.display = 'block';
      const container = document.getElementById('fileContent');

      const fileExt = filename.split('.').pop().toLowerCase();

      try {
          const response = await fetch(url, { method: 'HEAD' });
          if (!response.ok) {
              container.innerHTML = `<p style="color:red">File not found: ${filename}</p><p>URL: <code>${url}</code></p>`;
              return;
          }

          if (fileExt === 'pdf') {
              container.innerHTML = `<embed src="${url}" type="application/pdf" class="embed-container">`;
          } else if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExt)) {
              container.innerHTML = `<img src="${url}" alt="${filename}" style="max-width:100%; height:auto;">`;
          } else if (fileExt === 'txt' || fileExt === 'json') {
              const text = await fetch(url).then(r => r.text());
              container.innerHTML = `<pre style="background:#f5f5f5; padding:15px; overflow:auto;">${escapeHtml(text)}</pre>`;
          } else if (fileExt === 'html') {
              container.innerHTML = `<iframe src="${url}" class="embed-container"></iframe>`;
          } else {
              container.innerHTML = `<p>File: <a href="${url}" target="_blank">${filename}</a></p><p>Type: ${getMimeType(filename)}</p>`;
          }
      } catch (e) {
          container.innerHTML = `<p style="color:red">Error loading file</p>`;
      }
  }

  function escapeHtml(str) {
      return str.replace(/[&<>"']/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[tag]));
  }

  function backToUpload() {
      document.getElementById('fileViewer').style.display = 'none';
  }
