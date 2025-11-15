

/***********************
* MODE TOGGLE BEHAVIOR *
***********************/

// Get elements that change with the mode.
const toggleModeBtn = document.getElementById("toggle-mode-btn");
const portfolioLink = document.getElementById("portfolio-link");
const body = document.body;

// Function to apply mode.
function applyMode(mode) {
	body.classList.remove("light-mode", "dark-mode");
	body.classList.add(mode);

	if (mode === "dark-mode") {
		// Set dark mode styles.
		toggleModeBtn.style.color = "rgb(245, 245, 245)";
		toggleModeBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';

		portfolioLink.style.color = "rgb(245, 245, 245)";

		responsiveWarning.style.backgroundColor = "rgb(2, 4, 8)";
	} else {
		// Set light mode styles.
		toggleModeBtn.style.color = "rgb(2, 4, 8)";
		toggleModeBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';

		portfolioLink.style.color = "rgb(2, 4, 8)";

		responsiveWarning.style.backgroundColor = "rgb(245, 245, 245)";
	}
}

// Check and apply saved mode on page load
let savedMode = localStorage.getItem("mode");

if (savedMode === null) {
	savedMode = "light-mode"; // Default mode.
}
applyMode(savedMode);

// Toggle mode and save preference.
toggleModeBtn.addEventListener("click", function () {
	let newMode;

	if (body.classList.contains("light-mode")) {
		newMode = "dark-mode";
	} else {
		newMode = "light-mode";
	}

	applyMode(newMode);

	// Save choice.
	localStorage.setItem("mode", newMode);
});

/***********************
* MOBILE NAVIGATION *
***********************/

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

// Define the book states with increased translations for mobile
const bookStates = [
    { cover: false, page1: false, page2: false, page3: false, page4: false, transform: 0 }, // Start - cover closed
    { cover: true, page1: false, page2: false, page3: false, page4: false, transform: 35 }, // Cover open (right)
    { cover: true, page1: true, page2: false, page3: false, page4: false, transform: -35 }, // Page 1 flipped (left)
    { cover: true, page1: true, page2: true, page3: false, page4: false, transform: 35 }, // Page 2 flipped (right)
    { cover: true, page1: true, page2: true, page3: true, page4: false, transform: -35 }, // Page 3 flipped (left)
    { cover: true, page1: true, page2: true, page3: true, page4: true, transform: 35 }  // Page 4 flipped (right)
];

// Function to update transform values based on screen size

// Initialize transform values
updateTransformValues();

let currentState = 0;

// Function to update book state
function updateBookState(stateIndex) {
    const state = bookStates[stateIndex];
    
    // Update checkboxes
    document.getElementById("cover_checkbox").checked = state.cover;
    document.getElementById("page1_checkbox").checked = state.page1;
    document.getElementById("page2_checkbox").checked = state.page2;
    document.getElementById("page3_checkbox").checked = state.page3;
    document.getElementById("page4_checkbox").checked = state.page4;
    
    // Update transform with appropriate units
    const flipBook = document.getElementById("flip_book");
    if (window.innerWidth <= 768) {
        // Mobile: use vw units
        flipBook.style.transform = `translateX(${state.transform}vw)`;
    } else {
        // Desktop: use px units
        flipBook.style.transform = `translateX(${state.transform}px)`;
    }
    
    currentState = stateIndex;
    
    // Update button states
    prevBtn.disabled = stateIndex === 0;
    nextBtn.disabled = stateIndex === bookStates.length - 1;
    
    // Visual feedback for disabled buttons
    prevBtn.style.opacity = prevBtn.disabled ? "0.5" : "1";
    nextBtn.style.opacity = nextBtn.disabled ? "0.5" : "1";
    
    // Log current state for debugging
    console.log(`Current state: ${currentState}, Transform: ${state.transform}${window.innerWidth <= 768 ? 'vw' : 'px'}`);
}

// Event listeners for navigation
prevBtn.addEventListener("click", function() {
    if (currentState > 0) {
        updateBookState(currentState - 1);
    }
});

nextBtn.addEventListener("click", function() {
    if (currentState < bookStates.length - 1) {
        updateBookState(currentState + 1);
    }
});

// Initialize book state
updateBookState(0);

// Handle window resize to adjust transform values
window.addEventListener("resize", function() {
    updateTransformValues();
    
    // Re-apply current state with new transform values
    updateBookState(currentState);
});

// Add touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentState < bookStates.length - 1) {
            // Swipe left - go to next page
            updateBookState(currentState + 1);
        } else if (diff < 0 && currentState > 0) {
            // Swipe right - go to previous page
            updateBookState(currentState);
        }
    }
}