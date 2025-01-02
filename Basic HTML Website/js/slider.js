document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('reviewSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let currentIndex = 0;

    // Touch events
    slider.addEventListener('touchstart', touchStart);
    slider.addEventListener('touchend', touchEnd);
    slider.addEventListener('touchmove', touchMove);

    // Mouse events
    slider.addEventListener('mousedown', touchStart);
    slider.addEventListener('mouseup', touchEnd);
    slider.addEventListener('mouseleave', touchEnd);
    slider.addEventListener('mousemove', touchMove);

    // Disable context menu
    window.oncontextmenu = function(event) {
        if (event.target === slider) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }

    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        animationID = requestAnimationFrame(animation);
        slider.style.cursor = 'grabbing';
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        const movedBy = currentTranslate - prevTranslate;

        // Snap to closest slide
        if (Math.abs(movedBy) > 100) {
            if (movedBy < 0) {
                currentIndex += 1;
            } else {
                currentIndex -= 1;
            }
        }

        // Boundary checks
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > slider.children.length - 1) {
            currentIndex = slider.children.length - 1;
        }

        setPositionByIndex();
        slider.style.cursor = 'grab';
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse') 
            ? event.pageX 
            : event.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
        const slideWidth = slider.children[0].offsetWidth + 20; // 20 is the gap
        currentTranslate = currentIndex * -slideWidth;
        prevTranslate = currentTranslate;
        setSliderPosition();
    }

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex -= 1;
            setPositionByIndex();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < slider.children.length - 1) {
            currentIndex += 1;
            setPositionByIndex();
        }
    });
}); 