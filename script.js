//To allow for buttons to redirect to other pages
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".card-button").forEach(button => {
        button.addEventListener("click", function () {
            window.location.href = this.getAttribute("data-url");
        });
    });
});

document.getElementById('updatePicButton').addEventListener('click', function() {
    const fileInput = document.getElementById('profilePicInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatarImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});


document.addEventListener("DOMContentLoaded", function () {
    // Select the Full Name input field and the Welcome message element
    const fullNameInput = document.querySelector(".form-input input[type='text']");
    const welcomeTitle = document.querySelector(".profile-title");

    // Select all update buttons
    const updateButtons = document.querySelectorAll(".update-button");

    updateButtons.forEach((button) => {
        button.addEventListener("click", function () {
            // Find the corresponding input field
            const inputField = this.previousElementSibling;

            if (inputField.disabled) {
                // Enable input field for editing
                inputField.disabled = false;
                inputField.focus();
                this.textContent = "Save";
            } else {
                // Disable input field and update welcome message if it's the full name field
                inputField.disabled = true;
                this.textContent = "Update";

                if (inputField === fullNameInput) {
                    welcomeTitle.textContent = `Welcome, ${inputField.value}!`;
                }
            }
        });
    });
});
