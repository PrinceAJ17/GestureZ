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
  
    // Check if we're on the login page
    const loginForm = document.querySelector('#loginForm, .login-form');
    if (loginForm) {
      // Handle login submission
      loginForm.addEventListener('submit', function(event) {
        // Prevent form submission
        event.preventDefault();
        
        // Get all the input fields
        const fullNameInput = document.getElementById('fullname');
        const emailInput = document.getElementById('email');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.querySelector('input[type="password"]');
        
        // Store all values in localStorage
        if (fullNameInput && fullNameInput.value.trim()) {
          localStorage.setItem('userName', fullNameInput.value.trim());
        }
        
        if (emailInput && emailInput.value.trim()) {
          localStorage.setItem('userEmail', emailInput.value.trim());
        }
        
        if (usernameInput && usernameInput.value.trim()) {
          localStorage.setItem('userUsername', usernameInput.value.trim());
        }
        
        // Redirect to the home page after login
        window.location.href = 'home.html'; // Adjust path as needed
      });
    }
  
    // Profile page specific functionality
    if (document.querySelector('.form-label')) {
      // Find all the form inputs
      const formRows = document.querySelectorAll('.form-row');
      let fullNameInput = null;
      let usernameInput = null;
      let emailInput = null;
      let dobInput = null;
      let languageInput = null;
      
      // Find the relevant inputs by checking the label text
      formRows.forEach(row => {
        const label = row.querySelector('.form-label');
        if (label) {
          const labelText = label.textContent.trim();
          if (labelText === 'Full name') {
            fullNameInput = row.querySelector('input');
          } else if (labelText === 'Username') {
            usernameInput = row.querySelector('input');
          } else if (labelText === 'Email Address') {
            emailInput = row.querySelector('input');
          } else if (labelText === 'Date of Birth') {
            dobInput = row.querySelector('input');
          } else if (labelText === 'Language') {
            languageInput = row.querySelector('input');
          }
        }
      });
      
      // Populate the fields with saved values
      if (fullNameInput) {
        const savedName = localStorage.getItem('userName');
        if (savedName) {
          fullNameInput.value = savedName;
        }
      }
      
      if (usernameInput) {
        const savedUsername = localStorage.getItem('userUsername');
        if (savedUsername) {
          usernameInput.value = savedUsername;
        }
      }
      
      if (emailInput) {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
          emailInput.value = savedEmail;
        }
      }
      
      // Set up update buttons for all fields
      document.querySelectorAll('.update-button').forEach(button => {
        if (button.id !== 'updatePicButton') { // Exclude the profile picture button
          const inputField = button.closest('.form-input').querySelector('input');
          const labelElement = button.closest('.form-row').querySelector('.form-label');
          
          if (inputField && labelElement) {
            const fieldType = labelElement.textContent.trim();
            
            button.addEventListener('click', function() {
              if (inputField.disabled) {
                // Enable the input for editing
                inputField.disabled = false;
                inputField.focus();
                this.textContent = "Save";
              } else {
                // Save the value
                const newValue = inputField.value.trim();
                if (newValue) {
                  // Determine which localStorage key to use based on field type
                  let storageKey = '';
                  if (fieldType === 'Full name') {
                    storageKey = 'userName';
                    // Also update the welcome message
                    const profileTitle = document.querySelector('.profile-title');
                    if (profileTitle) {
                      profileTitle.textContent = `Welcome, ${newValue}!`;
                    }
                  } else if (fieldType === 'Username') {
                    storageKey = 'userUsername';
                  } else if (fieldType === 'Email Address') {
                    storageKey = 'userEmail';
                  } else if (fieldType === 'Date of Birth') {
                    storageKey = 'userDob';
                  } else if (fieldType === 'Language') {
                    storageKey = 'userLanguage';
                  }
                  
                  // Save to localStorage if we have a valid key
                  if (storageKey) {
                    localStorage.setItem(storageKey, newValue);
                  }
                  
                  // Disable input again
                  inputField.disabled = true;
                  this.textContent = "Update";
                }
              }
            });
          }
        }
      });
      
      // Make the Save Changes button also save all fields
      const saveButton = document.querySelector('.btn-save');
      if (saveButton) {
        saveButton.addEventListener('click', function() {
          // Find all inputs that are currently being edited
          const activeInputs = document.querySelectorAll('.form-input input:not([disabled])');
          activeInputs.forEach(input => {
            const row = input.closest('.form-row');
            const label = row.querySelector('.form-label');
            const updateButton = row.querySelector('.update-button');
            
            if (label && input.value.trim()) {
              const fieldType = label.textContent.trim();
              let storageKey = '';
              
              if (fieldType === 'Full name') {
                storageKey = 'userName';
                // Update welcome message
                const profileTitle = document.querySelector('.profile-title');
                if (profileTitle) {
                  profileTitle.textContent = `Welcome, ${input.value.trim()}!`;
                }
              } else if (fieldType === 'Username') {
                storageKey = 'userUsername';
              } else if (fieldType === 'Email Address') {
                storageKey = 'userEmail';
              } else if (fieldType === 'Date of Birth') {
                storageKey = 'userDob';
              } else if (fieldType === 'Language') {
                storageKey = 'userLanguage';
              }
              
              if (storageKey) {
                localStorage.setItem(storageKey, input.value.trim());
              }
              
              // Disable input
              input.disabled = true;
              if (updateButton) {
                updateButton.textContent = "Update";
              }
            }
          });
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