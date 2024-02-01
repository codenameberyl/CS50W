document.addEventListener('DOMContentLoaded', function() {
    const editProfileButton = document.getElementById('editProfileButton');
    const userName = document.getElementById('userName');
    const userAbout = document.getElementById('userAbout');

    if (editProfileButton) {
        editProfileButton.addEventListener('click', function () {
            const isEditMode = editProfileButton.textContent.trim() === 'Save profile';

            if (isEditMode) {
                // Handle form submission via fetch
                // You can use FormData to gather form data and send it to the server
                const editedUserImagePreview = document.getElementById('imagePreview');
                const userInputFile = document.getElementById('editUserImage');
                editedUserImagePreview.style.display = 'none';

                // Get the values from the input fields
                const editedUserFirstName = document.getElementById('editUserFirstName').value;
                const editedUserLastName = document.getElementById('editUserLastName').value;
                const editedUserAbout = document.getElementById('editUserAbout').value;


                // Create a FormData object to send as the request body
                const formData = new FormData();
                formData.append('first_name', editedUserFirstName);
                formData.append('last_name', editedUserLastName);
                formData.append('about', editedUserAbout);
                formData.append('profile_image', userInputFile.files[0]);

                // Send a POST request to the server
                fetch('/edit-profile', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'), // Include CSRF token if applicable
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            // Update the UI or perform any necessary actions
                            userName.textContent = `${data.first_name} ${data.last_name}`;
                            userAbout.textContent = `${data.about}`;

                            // Update profile image if submitted
                            const profileImage = document.getElementById('userImage');
                            if (data.profile_image) {
                                profileImage.src = data.profile_image;  // Update the image source
                            }
                            alert('Profile updated successfully');
                        } else {
                            // Handle errors, display an error message, etc.
                            console.error('Failed to update profile');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

                // Function to get CSRF token from cookies
                function getCookie(name) {
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; ${name}=`);
                    if (parts.length === 2) return parts.pop().split(';').shift();
                }

                // After submission, update the UI and toggle back to "Edit profile"
                editProfileButton.textContent = 'Edit profile';
            } else {
                // Toggle to "Save profile" state
                editProfileButton.textContent = 'Save profile';

                const userNameContent = userName.textContent.trim()
                const userAboutContent = userAbout.textContent.trim()

                if (editProfileButton.textContent.trim() === 'Save profile') {

                    // Replace user name and about sections with input fields for editing
                    userName.innerHTML = `<input type="text" id="editUserFirstName" placeholder="Enter First Name" value="${userNameContent.split(" ").length > 1 ? userNameContent.split(" ")[0] : userNameContent}" required style="padding: 6px; border-radius: 6px;">
                        <input type="text" id="editUserLastName" placeholder="Enter Last Name" value="${userNameContent.split(" ").length > 1 ? userNameContent.split(" ")[1] : userNameContent}" required style="padding: 6px; border-radius: 6px;">`;
                    userAbout.innerHTML = `<textarea id="editUserAbout" rows="4" style="width: 42%; margin-top: 16px; padding: 10px; border: 2px solid black; border-radius: 6px;">${userAboutContent}</textarea>`;

                    // Optionally, handle the location and contact info sections

                    // You can also handle changing the user image here
                    // Find the parent container of userImage
                    const userImageContainer = document.querySelector('.pv-top-card--photo-resize');

                    // Create the input file element
                    const inputFile = document.createElement('input');
                    inputFile.type = 'file';
                    inputFile.id = 'editUserImage';
                    inputFile.style.display = 'none'; // Initially hide the input file

                    // Create an image element for preview
                    const imagePreview = document.createElement('img');
                    imagePreview.id = 'imagePreview';
                    imagePreview.style.display = 'none'; // Initially hide the image preview
                    imagePreview.width = 40; // Set width as needed
                    imagePreview.height = 40; // Set height as needed
                    imagePreview.style.borderRadius = '50%'; // Initially hide the image preview
                    imagePreview.style.margin = '0 auto'; // Initially hide the image preview

                    // Append the input file and image preview to the container
                    userImageContainer.appendChild(inputFile);
                    userImageContainer.appendChild(imagePreview);

                    // Add a click event listener to userImage button
                    document.querySelector('.pv-top-card-profile-picture__container').addEventListener('click', () => {
                        // Show the input file when the user clicks the image
                        inputFile.click();
                    });

                    // Update the image preview when a new file is selected
                    inputFile.addEventListener('change', (event) => {
                        const selectedFile = event.target.files[0];
                        if (selectedFile) {
                            // Display the selected image preview
                            const reader = new FileReader();
                            reader.onload = function (e) {
                                imagePreview.src = e.target.result;
                                imagePreview.style.display = 'block';
                            };
                            reader.readAsDataURL(selectedFile);
                        }
                    });
                }
            }
        });
    }
});