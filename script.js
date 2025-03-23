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

// Add this to your existing JavaScript or replace the current recording functionality
document.addEventListener('DOMContentLoaded', function() {
  const recordPopup = document.getElementById('record-popup');
  const openRecordBtn = document.getElementById('open-record-popup');
  const closePopupBtn = document.getElementById('close-popup');
  const saveBtn = document.getElementById('popup-save-button');
  const cameraPlaceholder = document.querySelector('.camera-placeholder');
  const statusIndicator = document.querySelector('.status-indicator span');
  const statusDot = document.querySelector('.status-dot');
  const recordButton = document.querySelector('.record-button');
  const previewButton = document.querySelector('.preview-button');
  const retakeButton = document.querySelector('.retake-button');
  
  let mediaRecorder;
  let recordedChunks = [];
  let stream;
  let videoElement;
  
  // Function to create video element for preview
  function createVideoElement() {
    if (!videoElement) {
      videoElement = document.createElement('video');
      videoElement.autoplay = true;
      videoElement.muted = true;
      videoElement.className = 'camera-feed';
      // Replace placeholder with video
      cameraPlaceholder.innerHTML = '';
      cameraPlaceholder.appendChild(videoElement);
    }
    return videoElement;
  }
  
  // Open camera when record popup is opened
  openRecordBtn.addEventListener('click', async function() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement = createVideoElement();
      videoElement.srcObject = stream;
      
      statusIndicator.textContent = 'Camera active';
      statusDot.style.backgroundColor = 'green';
    } catch (err) {
      console.error("Error accessing camera: ", err);
      statusIndicator.textContent = 'Camera error';
      statusDot.style.backgroundColor = 'red';
    }
  });
  
  // Handle recording
  recordButton.addEventListener('click', function() {
    if (!stream) return;
    
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      // Start recording
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        
        // Display recorded video
        videoElement.srcObject = null;
        videoElement.src = videoURL;
        videoElement.controls = true;
        
        // Store the blob for later use
        recordButton.dataset.recordedBlob = videoURL;
      };
      
      mediaRecorder.start();
      statusIndicator.textContent = 'Recording...';
      statusDot.style.backgroundColor = 'red';
      recordButton.querySelector('svg').setAttribute('stroke', 'red');
      recordButton.querySelector('circle').setAttribute('fill', 'red');
    } else if (mediaRecorder.state === 'recording') {
      // Stop recording
      mediaRecorder.stop();
      statusIndicator.textContent = 'Recording complete';
      statusDot.style.backgroundColor = 'green';
      recordButton.querySelector('svg').setAttribute('stroke', 'white');
      recordButton.querySelector('circle').setAttribute('fill', 'none');
    }
  });
  
  // Preview button functionality
  previewButton.addEventListener('click', function() {
    if (recordButton.dataset.recordedBlob) {
      videoElement.srcObject = null;
      videoElement.src = recordButton.dataset.recordedBlob;
      videoElement.controls = true;
    }
  });
  
  // Retake button functionality
  retakeButton.addEventListener('click', function() {
    if (stream) {
      videoElement.srcObject = stream;
      videoElement.controls = false;
      statusIndicator.textContent = 'Camera active';
      statusDot.style.backgroundColor = 'green';
    }
  });
  
  // Save button functionality
  saveBtn.addEventListener('click', function() {
    if (recordButton.dataset.recordedBlob) {
      // Get the selected gesture name and description
      const gestureName = document.querySelector('.form-select').value;
      const gestureDesc = document.querySelector('.form-textarea').value;
      
      // You would normally save this to a database
      // For now, we'll just display the recorded gesture in the page
      const emptyPreview = document.querySelector('.empty-preview');
      if (emptyPreview) {
        // Create a video element to display the recorded gesture
        const savedVideo = document.createElement('video');
        savedVideo.src = recordButton.dataset.recordedBlob;
        savedVideo.className = 'recorded-gesture';
        savedVideo.controls = true;
        
        // Replace the record button with the video
        emptyPreview.innerHTML = '';
        emptyPreview.appendChild(savedVideo);
        emptyPreview.classList.remove('empty-preview');
        
        // Update the gesture selection dropdown
        const customSelect = emptyPreview.closest('.gesture-item').querySelector('.select-selected');
        if (customSelect && gestureName !== 'Select Gesture') {
          customSelect.textContent = gestureName;
        }
        
        // Update the description
        const gestureText = emptyPreview.closest('.gesture-item').querySelector('.gesture-text');
        if (gestureText && gestureDesc) {
          gestureText.textContent = gestureDesc;
        }
      }
      
      // Close the popup
      recordPopup.style.display = 'none';
      document.body.classList.remove('popup-open');
      
      // Clean up
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  });
  
  // Close popup and clean up
  closePopupBtn.addEventListener('click', function() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  });
});