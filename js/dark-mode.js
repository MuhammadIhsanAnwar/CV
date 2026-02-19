// Dark Mode Toggle Script
(function() {
  // Check saved dark mode preference or default to light mode
  const savedMode = localStorage.getItem('darkMode');
  const isDarkMode = savedMode === 'true';
  
  // Apply dark mode on page load
  if (isDarkMode) {
    document.documentElement.classList.add('dark-mode');
  }
  
  // Wait for navbar to load
  const initDarkModeToggle = setInterval(() => {
    const toggleBtn = document.getElementById('darkModeToggle');
    
    if (toggleBtn) {
      clearInterval(initDarkModeToggle);
      
      // Update icon based on current mode
      updateIcon(toggleBtn, isDarkMode);
      
      // Add click event listener
      toggleBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const isCurrentlyDark = html.classList.contains('dark-mode');
        
        if (isCurrentlyDark) {
          html.classList.remove('dark-mode');
          localStorage.setItem('darkMode', 'false');
          updateIcon(toggleBtn, false);
        } else {
          html.classList.add('dark-mode');
          localStorage.setItem('darkMode', 'true');
          updateIcon(toggleBtn, true);
        }
        
        // Add animation
        toggleBtn.classList.add('toggle-animate');
        setTimeout(() => {
          toggleBtn.classList.remove('toggle-animate');
        }, 300);
      });
    }
  }, 100);
  
  // Update icon based on mode
  function updateIcon(button, isDark) {
    const icon = button.querySelector('i');
    if (isDark) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      button.title = 'Switch to Light Mode';
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      button.title = 'Switch to Dark Mode';
    }
  }
})();
