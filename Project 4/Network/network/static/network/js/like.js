document.addEventListener('DOMContentLoaded', function() {
    const likeLinks = document.querySelectorAll('.like-link');

    likeLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const postId = this.getAttribute('data-post-id');

            fetch(this.href, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })
            .then(response => response.json())
            .then(data => {
                const likeCount = document.getElementById(`like-count-${postId}`);
                const likeImg = this.querySelector('img');

                likeCount.textContent = `${data.likes} Likes`;

                if (data.action === 'like') {
                    likeImg.src = '/static/network/img/thumbs-up-fill-medium.svg';
                } else {
                    likeImg.src = '/static/network/img/thumbs-up-outline-medium.svg';
                }
            });
        });
    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
});