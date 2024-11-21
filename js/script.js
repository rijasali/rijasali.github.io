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
document.addEventListener('DOMContentLoaded', function() {
    const servicesList = document.querySelector('.services-list');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const servicesWrapper = document.querySelector('.services-wrapper');
    let isManualScrolling = false;
    let autoScrollingEnabled = true;

    // Clone items for smooth infinite scroll
    function setupInfiniteScroll() {
        if (!servicesList) return;
        const originalCards = Array.from(servicesList.children);
        // Only clone if we haven't already cloned
        if (originalCards.length === servicesList.querySelectorAll('.service-card').length) {
            originalCards.forEach(card => {
                const clone = card.cloneNode(true);
                servicesList.appendChild(clone);
            });
        }
    }

    function startAutoScroll() {
        if (!servicesList) return;
        if (autoScrollingEnabled) {
            servicesList.classList.add('auto-scrolling');
        }
    }

    function stopAutoScroll() {
        if (!servicesList) return;
        servicesList.classList.remove('auto-scrolling');
        const computedStyle = window.getComputedStyle(servicesList);
        const currentTransform = computedStyle.transform;
        if (currentTransform !== 'none') {
            const matrix = new DOMMatrix(currentTransform);
            servicesList.style.transform = `translateX(${matrix.m41}px)`;
        }
    }

    function getScrollLimits() {
        const cardWidth = document.querySelector('.service-card')?.offsetWidth || 400;
        const gap = 20; // Gap between cards
        const originalCardCount = servicesList.children.length / 2; // Half because we cloned them
        const totalWidth = (cardWidth + gap) * originalCardCount;
        
        return {
            min: -totalWidth, // Maximum scroll to the left
            max: 0, // Maximum scroll to the right
            cardWidth: cardWidth + gap
        };
    }

    function handleManualScroll(direction) {
        if (!servicesList || isManualScrolling) return;
        
        isManualScrolling = true;
        autoScrollingEnabled = false;
        stopAutoScroll();

        const limits = getScrollLimits();
        const currentTransform = servicesList.style.transform;
        let currentPosition = 0;

        if (currentTransform) {
            const match = currentTransform.match(/-?\d+/);
            if (match) {
                currentPosition = parseInt(match[0]);
            }
        }

        let newPosition = direction === 'left' 
            ? currentPosition + limits.cardWidth
            : currentPosition - limits.cardWidth;

        // Apply boundaries
        newPosition = Math.max(limits.min, Math.min(limits.max, newPosition));

        // If we're at the end, wrap to the beginning
        if (newPosition <= limits.min) {
            newPosition = 0;
        }
        // If we're at the beginning and trying to go back, wrap to the end
        else if (newPosition >= limits.max && direction === 'left') {
            newPosition = limits.min + limits.cardWidth;
        }

        servicesList.style.transition = 'transform 0.5s ease';
        servicesList.style.transform = `translateX(${newPosition}px)`;

        // Reset transition after animation
        setTimeout(() => {
            isManualScrolling = false;
        }, 500);
    }

    // Event Listeners
    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            handleManualScroll('left');
        });
    }

    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            handleManualScroll('right');
        });
    }

    if (servicesWrapper) {
        servicesWrapper.addEventListener('mouseenter', () => {
            autoScrollingEnabled = false;
            stopAutoScroll();
        });

        servicesWrapper.addEventListener('mouseleave', (event) => {
            if (!servicesWrapper.contains(event.relatedTarget)) {
                autoScrollingEnabled = true;
                isManualScrolling = false;
                startAutoScroll();
            }
        });
    }

    // Touch support with boundaries
    if (servicesList) {
        let touchStartX = 0;
        
        servicesList.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            autoScrollingEnabled = false;
            stopAutoScroll();
        });

        servicesList.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const swipeDistance = touchStartX - touchEndX;

            if (Math.abs(swipeDistance) > 50) {
                handleManualScroll(swipeDistance > 0 ? 'right' : 'left');
            }
        });

        // Add transition end listener to handle infinite scroll wrapping
        servicesList.addEventListener('transitionend', () => {
            const currentTransform = servicesList.style.transform;
            const match = currentTransform.match(/-?\d+/);
            if (match) {
                const currentPosition = parseInt(match[0]);
                const limits = getScrollLimits();
                
                // If we've scrolled past the end, reset to start
                if (currentPosition <= limits.min) {
                    servicesList.style.transition = 'none';
                    servicesList.style.transform = 'translateX(0)';
                    // Force reflow
                    servicesList.offsetHeight;
                    servicesList.style.transition = 'transform 0.5s ease';
                }
            }
        });
    }

    // Initialize
    setupInfiniteScroll();
    startAutoScroll();

    // Reset on window resize
    window.addEventListener('resize', () => {
        if (!isManualScrolling && servicesList) {
            servicesList.style.transform = '';
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
    const youtubeLink = document.getElementById('youtubeLink');
    const closeModal = document.querySelector('.close-modal');

    // Add click event to all view project buttons
    document.querySelectorAll('.view-project').forEach(button => {
        button.addEventListener('click', function() {
            // Get project data from button attributes
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const hasGithub = this.getAttribute('data-has-github') === 'true';
            const hasYoutube = this.getAttribute('data-has-youtube') === 'true';
            const github = this.getAttribute('data-github');
            const youtube = this.getAttribute('data-youtube');

            // Update modal content
            modalTitle.textContent = title;
            modalDescription.textContent = description;

            // Show/hide GitHub button based on availability
            if (hasGithub) {
                githubLink.style.display = 'flex';
                githubLink.href = github;
            } else {
                githubLink.style.display = 'none';
            }

            // Show/hide YouTube button based on availability
            if (hasYoutube) {
                youtubeLink.style.display = 'flex';
                youtubeLink.href = youtube;
            } else {
                youtubeLink.style.display = 'none';
            }

            // Handle case when no buttons are visible
            const modalButtons = document.querySelector('.modal-buttons');
            if (!hasGithub && !hasYoutube) {
                modalButtons.style.display = 'none';
            } else {
                modalButtons.style.display = 'flex';
                if (hasGithub && !hasYoutube || !hasGithub && hasYoutube) {
                    modalButtons.classList.add('single-button');
                } else {
                    modalButtons.classList.remove('single-button');
                }
            }

            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal when clicking the close button
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Add this to your script.js file
document.addEventListener('DOMContentLoaded', function() {
    const workList = document.querySelector('.work-list');
    const portfolioBtn = document.getElementById('portfolioExpandBtn');
    const btnText = portfolioBtn.querySelector('.btn-text');
    const btnIcon = portfolioBtn.querySelector('i');
    let isExpanded = false;

    // Initialize in collapsed state
    workList.classList.add('collapsed');

    portfolioBtn.addEventListener('click', function() {
        isExpanded = !isExpanded;
        
        if (isExpanded) {
            workList.classList.remove('collapsed');
            workList.classList.add('expanded');
            btnText.textContent = 'Show Less';
            btnIcon.classList.remove('fa-chevron-down');
            btnIcon.classList.add('fa-chevron-up');
        } else {
            workList.classList.remove('expanded');
            workList.classList.add('collapsed');
            btnText.textContent = 'Explore Full Portfolio';
            btnIcon.classList.remove('fa-chevron-up');
            btnIcon.classList.add('fa-chevron-down');
            
            // Smooth scroll to portfolio section when collapsing
            document.querySelector('#portfolio').scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

function copyToClipboard(text) {
    // Modern clipboard API method
    navigator.clipboard.writeText(text)
        .then(() => {
            // Find and update the clicked element
            const contactItems = document.querySelectorAll('.contact-item');
            contactItems.forEach(item => {
                if (item.querySelector('.contact-text').textContent.includes(text)) {
                    // Add copied class
                    item.classList.add('copied');
                    
                    // Remove copied class after animation
                    setTimeout(() => {
                        item.classList.remove('copied');
                    }, 2000);
                }
            });
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to contact items
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const textToCopy = this.querySelector('.contact-text').textContent;
            copyToClipboard(textToCopy);
        });
    });
});
// Add this to your script.js file
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
