document.addEventListener('DOMContentLoaded', function() {
    const editPostButton = document.querySelectorAll('.edit-post-button');

    editPostButton.forEach(btn => {
        btn.onclick = () => {
            btn.style.display = 'none';
            const postId = btn.getAttribute('data-post-id');
            const contentDiv = document.getElementById(`post-content-${postId}`);
            const content = contentDiv.textContent;

            // Create a new div to hold the form content
            const newDiv = document.createElement('div');
            newDiv.className = 'edit-post-form-container';

            // Set the innerHTML of the new div with the form markup
            newDiv.innerHTML = `
                <form enctype="multipart/form-data" class="edit-post-form" data-post-id="${postId}" style="display: flex; flex-direction: column;">
                    <textarea name="content" class="content-input" rows="10" required style="margin-bottom: 16px; padding: 10px 8px 10px 16px; ">${content.trim()}</textarea>
                    <label for="media-edit-input-${postId}" class="custom-file-input" style="justify-content: start;">
                        <img src="/static/network/img/image-medium.svg" alt="Media Icon">
                        <span>Media</span>
                    </label>
                    <input type="file" id="media-edit-input-${postId}" class="media-edit-input" name="media" style="display: none;">
                    <button type="submit" class="special-button" style="max-width: 100%; padding: 0.6rem 1.6rem;">Save Changes</button>
                </form>
            `;

            // Replace the contentDiv's content with the new div
            contentDiv.innerHTML = '';
            contentDiv.appendChild(newDiv);

            const editForm = document.querySelector(`.edit-post-form[data-post-id="${postId}"]`);

            editForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const contentInput = this.querySelector('.content-input');
                const mediaInput = this.querySelector('.media-edit-input');

                const formData = new FormData(this);
                formData.append('content', contentInput.value);

                // Append the file if it's selected
                if (mediaInput.files.length > 0) {
                    formData.append('media', mediaInput.files[0]);
                }

                fetch(`/edit-post/${postId}`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Update the content on the page
                        contentDiv.textContent = data.content;

                        // Update the image if submitted
                        const postImage = document.getElementById(`post-image-${postId}`);
                        const postImageContainer = document.getElementById(`post-img-${postId}`);
                        if (postImage) {
                            if (data.image) {
                                postImage.src = data.image;  // Update the image source
                            }
                        } else {
                            postImageContainer.innerHTML = `<img id="post-image-${postId}" src="${data.image}">`
                        }

                        // Optionally, update other elements if needed

                        // Close the modal or hide the edit form
                        btn.style.display = 'block';
                        alert('Post successfully updated');
                    } else {
                        // Handle errors, display an error message, etc.
                    }
                });
            });
        }
    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
});
