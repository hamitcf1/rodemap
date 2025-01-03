document.addEventListener('DOMContentLoaded', function() {
    const themeSelect = document.getElementById('themeSelect');
    
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply theme immediately to prevent flash of wrong theme
    applyTheme(savedTheme);
    
    // Set the select element to match current theme
    themeSelect.value = savedTheme;

    // Theme change handler
    themeSelect.addEventListener('change', function(e) {
        const newTheme = e.target.value;
        applyTheme(newTheme);
    });

    // Function to apply theme
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Optional: Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector("meta[name='theme-color']");
        if (metaThemeColor) {
            switch(theme) {
                case 'light':
                    metaThemeColor.setAttribute("content", "#ffffff");
                    break;
                case 'midnight':
                    metaThemeColor.setAttribute("content", "#1a1b1e");
                    break;
                case 'amoled':
                    metaThemeColor.setAttribute("content", "#000000");
                    break;
            }
        }
    }
});

// Prevent theme flash on page load
(function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})(); 