// Add article card hover effects
document.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}); 