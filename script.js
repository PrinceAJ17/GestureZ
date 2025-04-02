document.addEventListener('DOMContentLoaded', function() {
  const profileTitle = document.querySelector('.profile-title');
  if (profileTitle) {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      profileTitle.textContent = `Welcome, ${savedName}!`;
    }
  }

  const loginForm = document.querySelector('#loginForm, .login-form'); 
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const usernameInput = loginForm.querySelector('input[type="text"], input[name="username"]');
      const passwordInput = loginForm.querySelector('input[type="password"]');
      
      if (usernameInput && usernameInput.value.trim()) {
        localStorage.setItem('userName', usernameInput.value.trim());
        
        
        window.location.href = 'home.html'; // Adjust path as needed
      }
    });
  }

  if (document.querySelector('.form-label')) {
    const formRows = document.querySelectorAll('.form-row');
    let fullNameInput = null;
    let updateNameButton = null;

    formRows.forEach(row => {
      const label = row.querySelector('.form-label');
      if (label && label.textContent.trim() === 'Full name') {
        fullNameInput = row.querySelector('input');
        updateNameButton = row.querySelector('.update-button');
      }
    });

    if (fullNameInput && updateNameButton) {
      const savedName = localStorage.getItem('userName');
      if (savedName && fullNameInput.value === "John Doe") {
        fullNameInput.value = savedName;
      }
      
      updateNameButton.addEventListener('click', function() {
        if (fullNameInput.disabled) {
          fullNameInput.disabled = false;
          fullNameInput.focus();
          this.textContent = "Save";
        } else {
          const newName = fullNameInput.value.trim();
          if (newName) {
            localStorage.setItem('userName', newName);
            
            const profileTitle = document.querySelector('.profile-title');
            if (profileTitle) {
              profileTitle.textContent = `Welcome, ${newName}!`;
            }
            
            fullNameInput.disabled = true;
            this.textContent = "Update";
          }
        }
      });
    }
    
    const saveButton = document.querySelector('.btn-save');
    if (saveButton && fullNameInput) {
      saveButton.addEventListener('click', function() {
        if (!fullNameInput.disabled) {
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

  document.querySelectorAll(".card-button").forEach(button => {
    button.addEventListener("click", function() {
      const url = this.getAttribute("data-url");
      if (url) {
        window.location.href = url;
      }
    });
  });

  const updatePicButton = document.getElementById('updatePicButton');
  if (updatePicButton) {
    updatePicButton.addEventListener('click', function() {
      const fileInput = document.getElementById('profilePicInput');
      if (fileInput) {
        if (fileInput.disabled) {
          fileInput.disabled = false;
          this.textContent = "Save";
          fileInput.click(); 
        } else {
          const file = fileInput.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
              const avatarImg = document.getElementById('avatarImage');
              if (avatarImg) {
                avatarImg.src = e.target.result;
                localStorage.setItem('userAvatar', e.target.result);
              }
            };
            reader.readAsDataURL(file);
          }
          
          fileInput.disabled = true;
          this.textContent = "Update";
        }
      }
    });
  }

  const avatarImg = document.getElementById('avatarImage');
  if (avatarImg) {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      avatarImg.src = savedAvatar;
    }
  }
});

 document.addEventListener('DOMContentLoaded', function() {
  const openPopupBtn = document.getElementById('open-record-popup');
  const closePopupBtn = document.getElementById('close-popup');
  const popupOverlay = document.getElementById('record-popup');
  
  openPopupBtn.addEventListener('click', function() {
    popupOverlay.style.display = 'flex';
    document.body.classList.add('popup-open');
  });
  
  closePopupBtn.addEventListener('click', function() {
    popupOverlay.style.display = 'none';
    document.body.classList.remove('popup-open');
  });
  
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
  
  function createVideoElement() {
    if (!videoElement) {
      videoElement = document.createElement('video');
      videoElement.autoplay = true;
      videoElement.muted = true;
      videoElement.className = 'camera-feed';
      cameraPlaceholder.innerHTML = '';
      cameraPlaceholder.appendChild(videoElement);
    }
    return videoElement;
  }
  
  openRecordBtn.addEventListener('click', async function() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement = createVideoElement();
      videoElement.srcObject = stream;
      
      statusIndicator.textContent = 'Ready to record';
      statusDot.style.backgroundColor = 'green';
      
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
  
  recordButton.addEventListener('click', function() {
    if (!stream) return;
    
    if (!isRecording) {
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
        
        recordButton.dataset.recordedBlob = videoURL;
        
        videoElement.srcObject = null;
        videoElement.src = videoURL;
        videoElement.controls = true;
        videoElement.loop = true;
        videoElement.play();
        
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
      
      recordButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <rect x="6" y="6" width="12" height="12" fill="red" stroke="white"></rect>
        </svg>
      `;
    } else {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      
      isRecording = false;
      
      recordButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <circle cx="12" cy="12" r="6"></circle>
        </svg>
      `;
    }
  });
  
  previewButton.addEventListener('click', function() {
    if (recordButton.dataset.recordedBlob) {
      videoElement.srcObject = null;
      videoElement.src = recordButton.dataset.recordedBlob;
      videoElement.controls = true;
      videoElement.loop = true;
      videoElement.play();
      
      statusIndicator.textContent = 'Preview mode';
      statusDot.style.backgroundColor = 'blue';
      previewButton.parentElement.classList.add('active-control');
      retakeButton.parentElement.classList.add('active-control');
      recordButton.parentElement.classList.remove('active-control');
    }
  });
  
  retakeButton.addEventListener('click', function() {
    if (stream) {
      videoElement.srcObject = stream;
      videoElement.controls = false;
      
      statusIndicator.textContent = 'Ready to record';
      statusDot.style.backgroundColor = 'green';
      previewButton.parentElement.classList.remove('active-control');
      retakeButton.parentElement.classList.remove('active-control');
      recordButton.parentElement.classList.add('active-control');
      isRecording = false;
      
      recordButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <circle cx="12" cy="12" r="6"></circle>
        </svg>
      `;
    }
  });
  
saveBtn.addEventListener('click', function() {
  if (recordButton.dataset.recordedBlob) {

    const gestureSelect = document.getElementById('gestureSelect');
    const gestureName = gestureSelect.options[gestureSelect.selectedIndex].text;
    const gestureDesc = document.querySelector('.form-textarea').value;
    
    if (!gestureName || !gestureDesc.trim()) {
      alert('Please select a gesture name and add a description');
      return;
    }
      
      const emptyPreview = document.querySelector('.empty-preview');
      if (emptyPreview) {
        const savedVideo = document.createElement('video');
        savedVideo.src = recordButton.dataset.recordedBlob;
        savedVideo.className = 'recorded-gesture';
        savedVideo.controls = true;
        
        emptyPreview.innerHTML = '';
        emptyPreview.appendChild(savedVideo);
        emptyPreview.classList.remove('empty-preview');
        
        const customSelect = emptyPreview.closest('.gesture-item').querySelector('.select-selected');
        if (customSelect) {
          customSelect.textContent = gestureName;
        }
        
        const gestureConfig = emptyPreview.closest('.gesture-item').querySelector('.gesture-config');
        if (gestureConfig) {
          let descContainer = gestureConfig.querySelector('.gesture-description');
          if (!descContainer) {
            descContainer = document.createElement('div');
            descContainer.className = 'gesture-description';
            gestureConfig.appendChild(descContainer);
          }
          
          let gestureText = descContainer.querySelector('.gesture-text');
          if (!gestureText) {
            gestureText = document.createElement('p');
            gestureText.className = 'gesture-text';
            descContainer.appendChild(gestureText);
          }
          
          gestureText.textContent = gestureDesc;
        }
        
        alert('Gesture saved successfully!');
      } else {
        const gesturesContainer = document.querySelector('.gestures-container');
        const addGestureContainer = document.querySelector('.add-gesture-container');
        
        if (gesturesContainer && addGestureContainer) {
          const newGestureItem = document.createElement('div');
          newGestureItem.className = 'gesture-item';
          
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
          
          gesturesContainer.insertBefore(newGestureItem, addGestureContainer);
          
          alert('New gesture added successfully!');
        }
      }
      
      recordPopup.style.display = 'none';
      document.body.classList.remove('popup-open');
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      gestureSelect.value = 'Select Gesture';
      document.querySelector('.form-textarea').value = '';
    }
  });
  
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



document.addEventListener('DOMContentLoaded', function() {
  const addGestureBtn = document.querySelector('.add-gesture-btn');
  
  addGestureBtn.addEventListener('click', function() {
    const gesturesContainer = document.querySelector('.gestures-container');
    
    const newGestureItem = document.createElement('div');
    newGestureItem.className = 'gesture-item';
    
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
      </div>
      
      <div class="gesture-action">
        <button class="set-gesture-btn">Set gesture</button>
        <button class="remove-gesture-btn">Remove</button>
      </div>
    `;
    
    const addGestureContainer = document.querySelector('.add-gesture-container');
    gesturesContainer.insertBefore(newGestureItem, addGestureContainer);
    
    const newRemoveBtn = newGestureItem.querySelector('.remove-gesture-btn');
    newRemoveBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to remove this gesture?')) {
        newGestureItem.remove();
      }
    });
    
    const newRecordBtn = newGestureItem.querySelector('.record-btn');
    newRecordBtn.addEventListener('click', function() {
      const recordPopup = document.getElementById('record-popup');
      if (recordPopup) {
        recordPopup.style.display = 'flex';
      }
    });
  });
  
  const removeButtons = document.querySelectorAll('.remove-gesture-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const gestureItem = this.closest('.gesture-item');
      if (confirm('Are you sure you want to remove this gesture?')) {
        gestureItem.remove();
      }
    });
  });
  
  const recordButtons = document.querySelectorAll('.record-btn');
  recordButtons.forEach(button => {
    button.addEventListener('click', function() {
      const recordPopup = document.getElementById('record-popup');
      if (recordPopup) {
        recordPopup.style.display = 'flex';
      }
    });
  });
  
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