// Clean, simplified version of the user profile management code
document.addEventListener('DOMContentLoaded', function() {
    // Load user name from localStorage on page load
    const profileTitle = document.querySelector('.profile-title');
    if (profileTitle) {
      const savedName = localStorage.getItem('userName');
      if (savedName) {
        profileTitle.textContent = `Welcome, ${savedName}!`;
      }
    }
  
    // Profile page specific functionality
    if (document.querySelector('.form-label')) {
      // Find the full name input by looking at all form rows
      const formRows = document.querySelectorAll('.form-row');
      let fullNameInput = null;
      let updateNameButton = null;
  
      // Find the full name input by checking the label text
      formRows.forEach(row => {
        const label = row.querySelector('.form-label');
        if (label && label.textContent.trim() === 'Full name') {
          fullNameInput = row.querySelector('input');
          updateNameButton = row.querySelector('.update-button');
        }
      });
  
      // If we found the name input and button, set up the event handler
      if (fullNameInput && updateNameButton) {
        updateNameButton.addEventListener('click', function() {
          if (fullNameInput.disabled) {
            // Enable the input for editing
            fullNameInput.disabled = false;
            fullNameInput.focus();
            this.textContent = "Save";
          } else {
            // Save the name
            const newName = fullNameInput.value.trim();
            if (newName) {
              // Update localStorage
              localStorage.setItem('userName', newName);
              
              // Update welcome message
              const profileTitle = document.querySelector('.profile-title');
              if (profileTitle) {
                profileTitle.textContent = `Welcome, ${newName}!`;
              }
              
              // Disable input again
              fullNameInput.disabled = true;
              this.textContent = "Update";
            }
          }
        });
      }
      
      // Make the Save Changes button also save the name
      const saveButton = document.querySelector('.btn-save');
      if (saveButton && fullNameInput) {
        saveButton.addEventListener('click', function() {
          if (!fullNameInput.disabled) {
            // Name is being edited, save it
            const newName = fullNameInput.value.trim();
            if (newName) {
              localStorage.setItem('userName', newName);
              
              const profileTitle = document.querySelector('.profile-title');
              if (profileTitle) {
                profileTitle.textContent = `Welcome, ${newName}!`;
              }
              
              fullNameInput.disabled = true;
              updateNameButton.textContent = "Update";
            }
          }
        });
      }
    }
  
    // Handle page navigation buttons
    document.querySelectorAll(".card-button").forEach(button => {
      button.addEventListener("click", function() {
        const url = this.getAttribute("data-url");
        if (url) {
          window.location.href = url;
        }
      });
    });
  
    // Handle profile picture update if on profile page
    const updatePicButton = document.getElementById('updatePicButton');
    if (updatePicButton) {
      updatePicButton.addEventListener('click', function() {
        const fileInput = document.getElementById('profilePicInput');
        if (fileInput) {
          if (fileInput.disabled) {
            // Enable the file input
            fileInput.disabled = false;
            this.textContent = "Save";
            fileInput.click(); // Open file dialog
          } else {
            // Save the profile picture
            const file = fileInput.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = function(e) {
                const avatarImg = document.getElementById('avatarImage');
                if (avatarImg) {
                  avatarImg.src = e.target.result;
                  // Save the image to localStorage (as base64)
                  localStorage.setItem('userAvatar', e.target.result);
                }
              };
              reader.readAsDataURL(file);
            }
            
            // Disable the file input again
            fileInput.disabled = true;
            this.textContent = "Update";
          }
        }
      });
    }
  
    // Load saved avatar
    const avatarImg = document.getElementById('avatarImage');
    if (avatarImg) {
      const savedAvatar = localStorage.getItem('userAvatar');
      if (savedAvatar) {
        avatarImg.src = savedAvatar;
      }
    }
  });