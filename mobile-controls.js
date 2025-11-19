/* -----------------------------------------------------------
   ✅ MOBILE TOUCH SUPPORT (Swipe rotate, pinch zoom, tap star)
   ----------------------------------------------------------- */

function initMobileControls() {
    if (!container) return;

    let touchStartX = 0, touchStartY = 0;
    let prevDistance = null;

    // ✅ Distance helper (for pinch)
    function getDistance(a, b) {
        return Math.sqrt(
            Math.pow(a.clientX - b.clientX, 2) +
            Math.pow(a.clientY - b.clientY, 2)
        );
    }

    /* ----- TOUCH START ----- */
    container.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            // One finger → rotate
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            // Two fingers → zoom
            prevDistance = getDistance(e.touches[0], e.touches[1]);
        }
    }, { passive: false });


    /* ----- TOUCH MOVE ----- */
    container.addEventListener("touchmove", (e) => {
        e.preventDefault();

        // ✅ One finger → rotate
        if (e.touches.length === 1) {
            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;

            let deltaX = x - touchStartX;
            let deltaY = y - touchStartY;

            scene.rotation.y += deltaX * 0.005;
            scene.rotation.x += deltaY * 0.005;

            touchStartX = x;
            touchStartY = y;
        }

        // ✅ Two fingers → pinch zoom
        if (e.touches.length === 2) {
            let dist = getDistance(e.touches[0], e.touches[1]);

            if (prevDistance !== null) {
                let zoomStrength = (prevDistance - dist) * 0.01;
                camera.position.z += zoomStrength;
                camera.position.z = Math.max(10, Math.min(50, camera.position.z));
            }
            prevDistance = dist;
        }
    }, { passive: false });


    /* ----- TOUCH END ----- */
    container.addEventListener("touchend", () => {
        prevDistance = null;
    });


    /* ----- TAP STAR TO SHOW TOOLTIP ----- */
    container.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];

        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(specialStars);

        if (intersects.length > 0) {
            const data = intersects[0].object.userData;
            showTooltip(data);
            setTimeout(hideTooltip, 3500);
        }
    }, { passive: true });
}
