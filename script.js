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
  let isRecording = false;
  
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
      
      statusIndicator.textContent = 'Ready to record';
      statusDot.style.backgroundColor = 'green';
      
      // Reset UI
      isRecording = false;
      recordButton.querySelector('svg circle').setAttribute('fill', 'none');
      recordButton.querySelector('svg').setAttribute('stroke', 'white');
      previewButton.parentElement.classList.remove('active-control');
      retakeButton.parentElement.classList.remove('active-control');
      recordButton.parentElement.classList.add('active-control');
    } catch (err) {
      console.error("Error accessing camera: ", err);
      statusIndicator.textContent = 'Camera error';
      statusDot.style.backgroundColor = 'red';
    }
  });
  
  // Handle recording - toggle between record and stop
  recordButton.addEventListener('click', function() {
    if (!stream) return;
    
    if (!isRecording) {
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
        
        // Store the blob for later use
        recordButton.dataset.recordedBlob = videoURL;
        
        // Switch to preview mode
        videoElement.srcObject = null;
        videoElement.src = videoURL;
        videoElement.controls = true;
        videoElement.loop = true;
        videoElement.play();
        
        // Update UI to preview mode
        statusIndicator.textContent = 'Preview mode';
        statusDot.style.backgroundColor = 'blue';
        previewButton.parentElement.classList.add('active-control');
        recordButton.parentElement.classList.remove('active-control');
      };
      
      mediaRecorder.start();
      isRecording = true;
      statusIndicator.textContent = 'Recording...';
      statusDot.style.backgroundColor = 'red';
      recordButton.querySelector('svg circle').setAttribute('fill', 'red');
      
      // Change button to "stop" appearance
      recordButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <rect x="6" y="6" width="12" height="12" fill="red" stroke="white"></rect>
        </svg>
      `;
    } else {
      // Stop recording
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      
      isRecording = false;
      
      // Change button back to "record" appearance
      recordButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <circle cx="12" cy="12" r="6"></circle>
        </svg>
      `;
    }
  });
  
  // Preview button functionality
  previewButton.addEventListener('click', function() {
    if (recordButton.dataset.recordedBlob) {
      videoElement.srcObject = null;
      videoElement.src = recordButton.dataset.recordedBlob;
      videoElement.controls = true;
      videoElement.loop = true;
      videoElement.play();
      
      // Update UI
      statusIndicator.textContent = 'Preview mode';
      statusDot.style.backgroundColor = 'blue';
      previewButton.parentElement.classList.add('active-control');
      retakeButton.parentElement.classList.add('active-control');
      recordButton.parentElement.classList.remove('active-control');
    }
  });
  
  // Retake button functionality
  retakeButton.addEventListener('click', function() {
    if (stream) {
      videoElement.srcObject = stream;
      videoElement.controls = false;
      
      // Reset UI for recording again
      statusIndicator.textContent = 'Ready to record';
      statusDot.style.backgroundColor = 'green';
      previewButton.parentElement.classList.remove('active-control');
      retakeButton.parentElement.classList.remove('active-control');
      recordButton.parentElement.classList.add('active-control');
      isRecording = false;
      
      // Reset record button appearance
      recordButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <circle cx="12" cy="12" r="6"></circle>
        </svg>
      `;
    }
  });
  
  // Save button functionality
  saveBtn.addEventListener('click', function() {
    if (recordButton.dataset.recordedBlob) {
      // Get the selected gesture name and description
      const gestureSelect = document.querySelector('.form-select');
      const gestureName = gestureSelect.value;
      const gestureDesc = document.querySelector('.form-textarea').value;
      
      // Validate inputs
      if (gestureName === 'Select Gesture' || !gestureDesc.trim()) {
        alert('Please select a gesture name and add a description');
        return;
      }
      
      // Find the empty gesture slot on the main page
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
        if (customSelect) {
          customSelect.textContent = gestureName;
        }
        
        // Update or create the description
        const gestureConfig = emptyPreview.closest('.gesture-item').querySelector('.gesture-config');
        if (gestureConfig) {
          // Check if description element exists
          let descContainer = gestureConfig.querySelector('.gesture-description');
          if (!descContainer) {
            // Create description container if it doesn't exist
            descContainer = document.createElement('div');
            descContainer.className = 'gesture-description';
            gestureConfig.appendChild(descContainer);
          }
          
          // Update or create the text element
          let gestureText = descContainer.querySelector('.gesture-text');
          if (!gestureText) {
            gestureText = document.createElement('p');
            gestureText.className = 'gesture-text';
            descContainer.appendChild(gestureText);
          }
          
          gestureText.textContent = gestureDesc;
        }
        
        // Show a success message
        alert('Gesture saved successfully!');
      } else {
        // If no empty slot is found, create a new gesture item
        const gesturesContainer = document.querySelector('.gestures-container');
        const addGestureContainer = document.querySelector('.add-gesture-container');
        
        if (gesturesContainer && addGestureContainer) {
          // Create new gesture item
          const newGestureItem = document.createElement('div');
          newGestureItem.className = 'gesture-item';
          
          // Create the HTML structure for the new gesture item
          newGestureItem.innerHTML = `
            <div class="gesture-preview">
              <video src="${recordButton.dataset.recordedBlob}" class="recorded-gesture" controls></video>
              <div class="video-controls">
                <button class="play-btn">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <polygon points="5,3 19,12 5,21" fill="currentColor"></polygon>
                  </svg>
                </button>
                <div class="progress-bar">
                  <div class="progress-fill"></div>
                </div>
                <div class="volume-control">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M3,9H7L12,4V20L7,15H3V9Z" fill="currentColor"></path>
                  </svg>
                </div>
                <div class="fullscreen-btn">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M7,14H5V19H10V17H7V14M5,10H7V7H10V5H5V10M17,17H14V19H19V14H17V17M14,5V7H17V10H19V5H14Z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="gesture-config">
              <div class="select-container">
                <label>Select gesture</label>
                <div class="custom-select">
                  <div class="select-selected">${gestureName}</div>
                  <div class="select-arrow">▼</div>
                </div>
              </div>
              <div class="gesture-description">
                <p class="gesture-text">${gestureDesc}</p>
              </div>
            </div>
            
            <div class="gesture-action">
              <button class="set-gesture-btn">Set gesture</button>
            </div>
          `;
          
          // Insert the new gesture item before the add-gesture-container
          gesturesContainer.insertBefore(newGestureItem, addGestureContainer);
          
          // Show a success message
          alert('New gesture added successfully!');
        }
      }
      
      // Close the popup
      recordPopup.style.display = 'none';
      document.body.classList.remove('popup-open');
      
      // Clean up
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Reset form for next time
      gestureSelect.value = 'Select Gesture';
      document.querySelector('.form-textarea').value = '';
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
    
    recordPopup.style.display = 'none';
    document.body.classList.remove('popup-open');
  });
});



// Add this to your script.js file
document.addEventListener('DOMContentLoaded', function() {
  // Find the add new gesture button
  const addGestureBtn = document.querySelector('.add-gesture-btn');
  
  // Add click event listener to the add gesture button
  addGestureBtn.addEventListener('click', function() {
    // Find the gestures container
    const gesturesContainer = document.querySelector('.gestures-container');
    
    // Create a new gesture item element
    const newGestureItem = document.createElement('div');
    newGestureItem.className = 'gesture-item';
    
    // Set the HTML content for the new gesture item
    newGestureItem.innerHTML = `
      <div class="gesture-preview empty-preview">
        <button class="record-btn" id="open-record-popup">Record New Gesture</button>
      </div>
      
      <div class="gesture-config">
        <div class="select-container">
          <label>Select gesture</label>
          <div class="custom-select">
            <div class="select-selected">Unselected</div>
          </div>
        </div>
        <div class="gesture-preview-box">
          <!-- Empty preview box -->
        </div>
      </div>
      
      <div class="gesture-action">
        <button class="set-gesture-btn">Set gesture</button>
        <button class="remove-gesture-btn">Remove</button>
      </div>
    `;
    
    // Insert the new gesture item before the add gesture container
    const addGestureContainer = document.querySelector('.add-gesture-container');
    gesturesContainer.insertBefore(newGestureItem, addGestureContainer);
    
    // Add event listener to the newly created remove button
    const newRemoveBtn = newGestureItem.querySelector('.remove-gesture-btn');
    newRemoveBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to remove this gesture?')) {
        newGestureItem.remove();
      }
    });
    
    // Add event listener to the newly created record button
    const newRecordBtn = newGestureItem.querySelector('.record-btn');
    newRecordBtn.addEventListener('click', function() {
      const recordPopup = document.getElementById('record-popup');
      if (recordPopup) {
        recordPopup.style.display = 'flex';
      }
    });
  });
  
  // Handle existing remove buttons (from the previous implementation)
  const removeButtons = document.querySelectorAll('.remove-gesture-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const gestureItem = this.closest('.gesture-item');
      if (confirm('Are you sure you want to remove this gesture?')) {
        gestureItem.remove();
      }
    });
  });
  
  // Handle existing record buttons
  const recordButtons = document.querySelectorAll('.record-btn');
  recordButtons.forEach(button => {
    button.addEventListener('click', function() {
      const recordPopup = document.getElementById('record-popup');
      if (recordPopup) {
        recordPopup.style.display = 'flex';
      }
    });
  });
  
  // Close popup functionality
  const closePopupBtn = document.getElementById('close-popup');
  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', function() {
      const recordPopup = document.getElementById('record-popup');
      if (recordPopup) {
        recordPopup.style.display = 'none';
      }
    });
  }
});