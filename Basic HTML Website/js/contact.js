// Email button functionality
document.addEventListener('DOMContentLoaded', function() {
    const emailButton = document.querySelector('.email-button');
    if (emailButton) {
        emailButton.addEventListener('click', function() {
            window.location.href = 'mailto:hamitfindik2@gmail.com';
        });
    }
}); 