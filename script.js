// Enhanced user profile management with login integration
document.addEventListener('DOMContentLoaded', function() {
    // Load user name from localStorage on every page
    const profileTitle = document.querySelector('.profile-title');
    if (profileTitle) {
      const savedName = localStorage.getItem('userName');
      if (savedName) {
        profileTitle.textContent = `Welcome, ${savedName}!`;
      }
    }
  
    // Check if we're on the login page (you'll need to add an identifier to your login form)
    const loginForm = document.querySelector('#loginForm, .login-form'); // Adjust selector to match your login form
    if (loginForm) {
      // Handle login submission
      loginForm.addEventListener('submit', function(event) {
        // Prevent form submission if you're handling login via JavaScript
        event.preventDefault();
        
        // Get the username/name input from the login form
        // Adjust these selectors to match your actual input fields
        const usernameInput = loginForm.querySelector('input[type="text"], input[name="username"]');
        const passwordInput = loginForm.querySelector('input[type="password"]');
        
        if (usernameInput && usernameInput.value.trim()) {
          // Store the name in localStorage
          localStorage.setItem('userName', usernameInput.value.trim());
          
          // You might want to do additional validation here
          
          // Redirect to the home page after login
          window.location.href = 'home.html'; // Adjust path as needed
        }
      });
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
        // Update the profile form with the saved name
        const savedName = localStorage.getItem('userName');
        if (savedName && fullNameInput.value === "John Doe") {
          // Only update if it's still the default value
          fullNameInput.value = savedName;
        }
        
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

   // Script to handle the popup functionality
   document.addEventListener('DOMContentLoaded', function() {
    const openPopupBtn = document.getElementById('open-record-popup');
    const closePopupBtn = document.getElementById('close-popup');
    const popupOverlay = document.getElementById('record-popup');
    
    // Open popup
    openPopupBtn.addEventListener('click', function() {
      popupOverlay.style.display = 'flex';
      document.body.classList.add('popup-open');
    });
    
    // Close popup
    closePopupBtn.addEventListener('click', function() {
      popupOverlay.style.display = 'none';
      document.body.classList.remove('popup-open');
    });
    
    // Close popup when clicking outside
    popupOverlay.addEventListener('click', function(e) {
      if (e.target === popupOverlay) {
        popupOverlay.style.display = 'none';
        document.body.classList.remove('popup-open');
      }
    });
  });