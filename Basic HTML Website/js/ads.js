document.addEventListener('DOMContentLoaded', function() {
    // Function to check if AdSense is loaded and ads are available
    function checkAdsLoaded() {
        if (window.adsbygoogle && document.querySelector('.adsbygoogle')) {
            const footerAds = document.getElementById('footer-ads');
            
            // Insert AdSense code
            const adElement = document.createElement('ins');
            adElement.className = 'adsbygoogle';
            adElement.style.display = 'block';
            adElement.setAttribute('data-ad-client', 'YOUR-AD-CLIENT-ID'); // Replace with your AdSense ID
            adElement.setAttribute('data-ad-slot', 'YOUR-AD-SLOT-ID'); // Replace with your Ad slot ID
            adElement.setAttribute('data-ad-format', 'auto');
            adElement.setAttribute('data-full-width-responsive', 'true');
            
            footerAds.appendChild(adElement);
            footerAds.classList.add('active');
            
            // Initialize ad
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }

    // Check if ads are blocked or not available
    if (window.addEventListener) {
        window.addEventListener('load', checkAdsLoaded, false);
    } else if (window.attachEvent) {
        window.attachEvent('onload', checkAdsLoaded);
    }
}); 