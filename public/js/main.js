document.addEventListener('DOMContentLoaded', () => {
  // Add window control functionality
  const closeBtn = document.querySelector('.control.close');
  const minimizeBtn = document.querySelector('.control.minimize');
  const maximizeBtn = document.querySelector('.control.maximize');
  
  // Just for visual effect - we're running in a browser
  closeBtn.addEventListener('click', () => {
    alert('This would close the window in a desktop app');
  });
  
  minimizeBtn.addEventListener('click', () => {
    alert('This would minimize the window in a desktop app');
  });
  
  maximizeBtn.addEventListener('click', () => {
    document.querySelector('.container').classList.toggle('maximized');
  });
  
  // Image preview modal
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalImageTitle');
  const closeModal = document.querySelector('.close-modal');
  
  // Get all photo items
  const photoItems = document.querySelectorAll('.photo-item');
  
  // Add click event to show modal
  photoItems.forEach(item => {
    item.addEventListener('click', function() {
      const imgSrc = this.getAttribute('data-src');
      const fileName = this.getAttribute('data-filename');
      
      modal.style.display = 'flex';
      modalImg.src = imgSrc;
      modalTitle.textContent = fileName;
    });
  });
  
  // Close modal when clicking on X
  closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  // Close modal when clicking outside the image
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Close modal when pressing Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
    }
  });
});