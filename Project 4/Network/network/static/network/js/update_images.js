document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch updated image URLs from the server
    function fetchUpdatedImageURLs() {
        fetch('/get-updated-image-urls')
            .then(response => response.json())
            .then(data => {
                // Update profile image src attribute based on the received data
                for (const userId in data) {
                    const imageUrl = data[userId];
                    const profileImages = document.querySelectorAll(`.profile-image[data-user-id="${userId}"]`);

                    // Iterate over all matching elements and update their src
                    profileImages.forEach(profileImage => {
                        if (profileImage) {
                            profileImage.src = imageUrl;
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching updated image URLs:', error);
            });
    }

    // Periodically fetch updated image URLs (adjust the interval based on your needs)
    setInterval(fetchUpdatedImageURLs, 50000);  // Fetch every 5 minutes, for example
});
