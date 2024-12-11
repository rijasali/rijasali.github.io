var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");



function opentab(tabname) {
    for(let tablink of tablinks) {
        tablink.classList.remove("active-link");
    }
    for(let tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}

// Add this to ensure the DOM is loaded before adding event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add click events to all tab links
    Array.from(tablinks).forEach(function(tablink) {
        tablink.addEventListener('click', function() {
            opentab(this.textContent.toLowerCase());
        });
    });
});
// Mobile menu functionality
const sidemenu = document.getElementById("sidemenu");

function openmenu() {
    sidemenu.style.right = "0";
}

function closemenu() {
    sidemenu.style.right = "-200px";
}

// Touch swipe functionality for mobile menu
let xDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
}

function handleTouchMove(evt) {
    if (!xDown) {
        return;
    }

    let xUp = evt.touches[0].clientX;
    let xDiff = xDown - xUp;

    // Detect swipe
    if (Math.abs(xDiff) > 50) {
        if (xDiff > 0) {
            // Swiped left - close menu
            closemenu();
        } else {
            // Swiped right - open menu
            openmenu();
        }
    }

    xDown = null;
}

// Contact form functionality
const scriptURL = '< add you own link here >' // add your own app script link here
const form = document.forms['submit-to-google-sheet']
const msg = document.getElementById("msg")

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    // Add click handlers to menu links
    document.querySelectorAll('#sidemenu a').forEach(link => {
        link.addEventListener('click', () => {
            closemenu();
        });
    });

    // Contact form submission
    if(form) {
        form.addEventListener('submit', e => {
            e.preventDefault()
            fetch(scriptURL, { 
                method: 'POST', 
                body: new FormData(form)
            })
            .then(response => {
                msg.innerHTML = "Message sent successfully"
                setTimeout(function(){
                    msg.innerHTML = ""
                },5000)
                form.reset()
            })
            .catch(error => console.error('Error!', error.message))
        });
    }
});

// Add this at the end of your script.js file
// Replace your existing services carousel code in script.js with this version
// Replace your existing services carousel code in script.js with this version
document.addEventListener('DOMContentLoaded', function() {
    const servicesList = document.querySelector('.services-list');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const servicesWrapper = document.querySelector('.services-wrapper');
    let isManualScrolling = false;
    let autoScrollingEnabled = true;
    let lastScrollPosition = 0;
    let autoScrollAnimation = null;

    function setupInfiniteScroll() {
        if (!servicesList) return;
        const originalCards = Array.from(servicesList.children);
        if (originalCards.length === servicesList.querySelectorAll('.service-card').length) {
            originalCards.forEach(card => {
                const clone = card.cloneNode(true);
                servicesList.appendChild(clone);
            });
        }
    }

    function calculateAutoScrollPosition() {
        const totalWidth = servicesList.scrollWidth / 2; // Half because we cloned the items
        const scrollDuration = 40000; // 40 seconds for one complete scroll
        const currentTime = Date.now();
        const scrollPosition = (currentTime % scrollDuration) / scrollDuration * -totalWidth;
        return scrollPosition;
    }

    function startAutoScroll() {
        if (!servicesList || isManualScrolling) return;
        
        // Cancel any existing animation
        if (autoScrollAnimation) {
            cancelAnimationFrame(autoScrollAnimation);
        }

        let startTime = Date.now();
        const startPosition = lastScrollPosition;
        const totalWidth = servicesList.scrollWidth / 2;
        
        function animate() {
            if (!autoScrollingEnabled) return;

            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const scrollDuration = 40000; // 40 seconds for one complete scroll
            
            // Calculate new position based on elapsed time
            const progress = (elapsed % scrollDuration) / scrollDuration;
            const newPosition = startPosition + (progress * -totalWidth);

            // Apply transform
            servicesList.style.transform = `translateX(${newPosition}px)`;
            lastScrollPosition = newPosition;

            // Reset position if we've scrolled past the end
            if (newPosition <= -totalWidth) {
                startTime = currentTime;
                lastScrollPosition = 0;
                servicesList.style.transform = 'translateX(0)';
            }

            autoScrollAnimation = requestAnimationFrame(animate);
        }

        autoScrollAnimation = requestAnimationFrame(animate);
    }

    function stopAutoScroll() {
        if (autoScrollAnimation) {
            cancelAnimationFrame(autoScrollAnimation);
            autoScrollAnimation = null;
        }
        // Keep track of where we stopped
        const computedStyle = window.getComputedStyle(servicesList);
        const matrix = new DOMMatrix(computedStyle.transform);
        lastScrollPosition = matrix.m41;
    }

    function handleManualScroll(direction) {
        if (!servicesList || isManualScrolling) return;
        
        isManualScrolling = true;
        autoScrollingEnabled = false;
        stopAutoScroll();

        const cardWidth = document.querySelector('.service-card')?.offsetWidth || 400;
        const gap = 20;
        const scrollAmount = cardWidth + gap;
        
        // Calculate new position
        const newPosition = lastScrollPosition + (direction === 'left' ? scrollAmount : -scrollAmount);
        
        // Apply the scroll
        servicesList.style.transition = 'transform 0.5s ease';
        servicesList.style.transform = `translateX(${newPosition}px)`;
        lastScrollPosition = newPosition;

        // Handle wrapping
        const totalWidth = servicesList.scrollWidth / 2;
        if (Math.abs(lastScrollPosition) >= totalWidth) {
            lastScrollPosition = 0;
            setTimeout(() => {
                servicesList.style.transition = 'none';
                servicesList.style.transform = 'translateX(0)';
            }, 500);
        }

        setTimeout(() => {
            isManualScrolling = false;
            if (!servicesWrapper.matches(':hover')) {
                autoScrollingEnabled = true;
                startAutoScroll();
            }
        }, 500);
    }

    // Event Listeners
    if (leftArrow) {
        leftArrow.addEventListener('click', () => handleManualScroll('left'));
    }

    if (rightArrow) {
        rightArrow.addEventListener('click', () => handleManualScroll('right'));
    }

    if (servicesWrapper) {
        servicesWrapper.addEventListener('mouseenter', () => {
            autoScrollingEnabled = false;
            stopAutoScroll();
        });

        servicesWrapper.addEventListener('mouseleave', () => {
            if (!isManualScrolling) {
                autoScrollingEnabled = true;
                startAutoScroll();
            }
        });
    }

    // Initialize
    setupInfiniteScroll();
    startAutoScroll();

    // Reset on window resize
    window.addEventListener('resize', () => {
        lastScrollPosition = 0;
        if (autoScrollAnimation) {
            cancelAnimationFrame(autoScrollAnimation);
        }
        if (!isManualScrolling) {
            startAutoScroll();
        }
    });
});
// Add this to your script.js file
// Add this to your script.js file
document.addEventListener('DOMContentLoaded', function() {
    // Get all category buttons and projects
    const categoryButtons = document.querySelectorAll('.category-btn');
    const projects = document.querySelectorAll('.work');

    // Show initial category (Robotics)
    projects.forEach(project => {
        if (project.getAttribute('data-category') === 'robotics') {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });

    // Add click event to category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const selectedCategory = button.getAttribute('data-category');

            // Filter projects
            projects.forEach(project => {
                if (project.getAttribute('data-category') === selectedCategory) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
});

// Add this to your script.js file

document.addEventListener('DOMContentLoaded', function() {
    // Portfolio functionality
    const workList = document.querySelector('.work-list');
    const portfolioBtn = document.querySelector('.portfolio-btn');
    let isExpanded = false;

    // Initialize in collapsed state
    workList.classList.add('collapsed');

    // Update button text and icon
    portfolioBtn.innerHTML = 'Explore Full Portfolio <i class="fas fa-chevron-down"></i>';

    portfolioBtn.addEventListener('click', function(e) {
        e.preventDefault();
        isExpanded = !isExpanded;
        
        if (isExpanded) {
            workList.classList.remove('collapsed');
            workList.classList.add('expanded');
            portfolioBtn.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
            portfolioBtn.classList.add('expanded');
        } else {
            workList.classList.remove('expanded');
            workList.classList.add('collapsed');
            portfolioBtn.innerHTML = 'Explore Full Portfolio <i class="fas fa-chevron-down"></i>';
            portfolioBtn.classList.remove('expanded');
            
            // Smooth scroll to portfolio section when collapsing
            document.querySelector('#portfolio').scrollIntoView({
                behavior: 'smooth'
            });
        }
    });

    // Initialize category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const projects = document.querySelectorAll('.work');

    // Show initial category (Robotics)
    projects.forEach(project => {
        if (project.getAttribute('data-category') === 'robotics') {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });

    // Category filtering with collapsed/expanded state preservation
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedCategory = button.getAttribute('data-category');
            
            projects.forEach(project => {
                if (project.getAttribute('data-category') === selectedCategory) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
});

// Add this to your script.js file

document.addEventListener('DOMContentLoaded', function() {
    const workList = document.querySelector('.work-list');
    const portfolioBtn = document.querySelector('.portfolio-btn');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const projects = document.querySelectorAll('.work');
    let isExpanded = false;

    // Initialize in collapsed state
    workList.classList.add('collapsed');
    portfolioBtn.innerHTML = 'Explore Full Portfolio <i class="fas fa-chevron-down"></i>';

    // Function to show limited projects for a category
    function showLimitedProjects(category, limit = 4) {
        let count = 0;
        projects.forEach(project => {
            if (project.getAttribute('data-category') === category) {
                if (count < limit || isExpanded) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
                count++;
            } else {
                project.style.display = 'none';
            }
        });
    }

    // Handle expand/collapse
    portfolioBtn.addEventListener('click', function(e) {
        e.preventDefault();
        isExpanded = !isExpanded;
        
        if (isExpanded) {
            workList.classList.remove('collapsed');
            workList.classList.add('expanded');
            portfolioBtn.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
            portfolioBtn.classList.add('expanded');
        } else {
            workList.classList.remove('expanded');
            workList.classList.add('collapsed');
            portfolioBtn.innerHTML = 'Explore Full Portfolio <i class="fas fa-chevron-down"></i>';
            portfolioBtn.classList.remove('expanded');
            
            // Smooth scroll to portfolio section when collapsing
            document.querySelector('#portfolio').scrollIntoView({
                behavior: 'smooth'
            });
        }

        // Re-apply current category filter with new expanded/collapsed state
        const activeCategory = document.querySelector('.category-btn.active');
        if (activeCategory) {
            showLimitedProjects(activeCategory.getAttribute('data-category'));
        }
    });

    // Initialize with first category (Robotics)
    categoryButtons[0].classList.add('active');
    showLimitedProjects('robotics');

    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedCategory = button.getAttribute('data-category');
            showLimitedProjects(selectedCategory);
        });
    });
});

// Add this to your existing script.js file
// Add this to your script.js file
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const githubLink = document.getElementById('githubLink');
    const youtubeFrame = document.getElementById('youtubeFrame');
    const modalButtons = document.querySelector('.modal-buttons');
    const closeBtn = modal.querySelector('.close-modal');

    // View project button click handler
    document.querySelectorAll('.view-project').forEach(button => {
        button.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const github = this.getAttribute('data-github');
            const youtube = this.getAttribute('data-youtube');
            const hasGithub = this.getAttribute('data-has-github') === 'true';
            const hasYoutube = this.getAttribute('data-has-youtube') === 'true';

            modalTitle.textContent = title;
            modalDescription.textContent = description;

            // Handle GitHub button
            if (hasGithub && github) {
                githubLink.style.display = 'flex';
                githubLink.href = github;
            } else {
                githubLink.style.display = 'none';
            }

            // Handle YouTube video
            if (hasYoutube && youtube) {
                // Extract video ID from URL
                const videoId = youtube.split('v=')[1]?.split('&')[0] || 
                               youtube.split('youtu.be/')[1]?.split('?')[0];
                if (videoId) {
                    youtubeFrame.src = `https://www.youtube.com/embed/${videoId}`;
                    youtubeFrame.parentElement.style.display = 'block';
                }
            } else {
                youtubeFrame.src = '';
                youtubeFrame.parentElement.style.display = 'none';
            }

            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal and stop video
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        youtubeFrame.src = ''; // Stops the video
    }

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
    });
});
// Add this to your script.js file

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('servicesModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const videoContainer = document.querySelector('.video-container');
    const galleryContainer = document.querySelector('.gallery-container');
    const videoFrame = document.getElementById('videoFrame');
    const galleryImage = document.getElementById('galleryImage');
    const closeModal = document.querySelector('.close-modal');
    const prevButton = document.querySelector('.prev-img');
    const nextButton = document.querySelector('.next-img');

    let currentImageIndex = 0;
    let imagesList = [];

    // Add click event to all service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');

            modalTitle.textContent = title;
            modalDescription.textContent = description;

            // Reset displays
            videoContainer.style.display = 'none';
            galleryContainer.style.display = 'none';

            if (type === 'video') {
                // Handle video content
                const videoId = this.getAttribute('data-video-id');
                videoContainer.style.display = 'block';
                videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
            } else if (type === 'gallery') {
                // Handle gallery content
                galleryContainer.style.display = 'block';
                imagesList = this.getAttribute('data-images').split(',');
                currentImageIndex = 0;
                updateGalleryImage();
            }

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Gallery navigation
    function updateGalleryImage() {
        galleryImage.src = imagesList[currentImageIndex];
    }

    prevButton.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + imagesList.length) % imagesList.length;
        updateGalleryImage();
    });

    nextButton.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % imagesList.length;
        updateGalleryImage();
    });

    // Close modal functionality
    function closeModalFunction() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        videoFrame.src = ''; // Stop video playback
        imagesList = []; // Clear images list
        currentImageIndex = 0;
    }

    closeModal.addEventListener('click', closeModalFunction);
    
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModalFunction();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModalFunction();
        }
        // Gallery keyboard navigation
        if (galleryContainer.style.display === 'block') {
            if (event.key === 'ArrowLeft') {
                prevButton.click();
            } else if (event.key === 'ArrowRight') {
                nextButton.click();
            }
        }
    });
});

// Add this to your script.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const msg = document.getElementById('msg');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending...';
            
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                msg.innerHTML = "Message sent successfully!";
                msg.style.color = "#61b752";
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit';
                
                setTimeout(() => {
                    msg.innerHTML = "";
                }, 5000);
            })
            .catch(error => {
                msg.innerHTML = "Error sending message. Please try again.";
                msg.style.color = "#ff0000";
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit';
                console.error('Error:', error);
            });
        });
    }
});
