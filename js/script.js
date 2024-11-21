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
    let currentPosition = 0;
    let isManualScrolling = false;

    // Function to stop automatic scrolling
    const pauseAutoScroll = () => {
        servicesList.style.animationPlayState = 'paused';
    };

    // Function to resume automatic scrolling
    const resumeAutoScroll = () => {
        if (!isManualScrolling) {
            servicesList.style.animationPlayState = 'running';
        }
    };

    // Function to handle manual scrolling
    const handleManualScroll = (direction) => {
        isManualScrolling = true;
        // Stop automatic scrolling temporarily
        servicesList.style.animation = 'none';
        servicesList.classList.add('scrolling');

        // Calculate scroll amount (width of one card + gap)
        const scrollAmount = 420; // 400px card width + 20px gap

        // Update position based on direction
        if (direction === 'left') {
            currentPosition = Math.max(currentPosition - scrollAmount, 0);
        } else {
            const maxScroll = servicesList.scrollWidth - servicesList.parentElement.offsetWidth;
            currentPosition = Math.min(currentPosition + scrollAmount, maxScroll);
        }

        // Apply the scroll
        servicesList.style.transform = `translateX(-${currentPosition}px)`;

        // Resume automatic scrolling after 2 seconds
        setTimeout(() => {
            servicesList.style.animation = '';
            servicesList.classList.remove('scrolling');
            servicesList.style.transform = ''; // Remove manual transform
            currentPosition = 0; // Reset position
            isManualScrolling = false;
        }, 2000);
    };

    // Add hover events to arrows
    leftArrow.addEventListener('mouseenter', pauseAutoScroll);
    leftArrow.addEventListener('mouseleave', resumeAutoScroll);
    rightArrow.addEventListener('mouseenter', pauseAutoScroll);
    rightArrow.addEventListener('mouseleave', resumeAutoScroll);

    // Add click event listeners to arrows
    leftArrow.addEventListener('click', () => handleManualScroll('left'));
    rightArrow.addEventListener('click', () => handleManualScroll('right'));

    // Pause animation on hover over the services list
    servicesList.addEventListener('mouseenter', pauseAutoScroll);
    servicesList.addEventListener('mouseleave', resumeAutoScroll);

    // Add hover event to the entire services wrapper
    servicesWrapper.addEventListener('mouseenter', pauseAutoScroll);
    servicesWrapper.addEventListener('mouseleave', resumeAutoScroll);

    // Add touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    servicesList.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        pauseAutoScroll();
    });

    servicesList.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const swipeDistance = touchStartX - touchEndX;

        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                handleManualScroll('right');
            } else {
                handleManualScroll('left');
            }
        } else {
            resumeAutoScroll();
        }
    });

    // Prevent scroll issues during touch
    servicesList.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    // Duplicate cards for infinite scroll if needed
    const duplicateCards = () => {
        const cards = servicesList.querySelectorAll('.service-card');
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            servicesList.appendChild(clone);
        });
    };

    // Call duplicate function
    duplicateCards();
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