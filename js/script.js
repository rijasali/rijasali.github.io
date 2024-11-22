// Global Variables
var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");
const sidemenu = document.getElementById("sidemenu");
let xDown = null;
const form = document.forms['submit-to-google-sheet'];
const msg = document.getElementById("msg");
const scriptURL = '< add you own link here >'; // add your own app script link here

// Tab Functions
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

// Mobile Menu Functions
function openmenu() {
    sidemenu.style.right = "0";
}

function closemenu() {
    sidemenu.style.right = "-200px";
}

// Touch Functions
function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
}

function handleTouchMove(evt) {
    if (!xDown) return;

    let xUp = evt.touches[0].clientX;
    let xDiff = xDown - xUp;

    if (Math.abs(xDiff) > 50) {
        if (xDiff > 0) {
            closemenu();
        } else {
            openmenu();
        }
    }
    xDown = null;
}

// Clipboard Function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            const contactItems = document.querySelectorAll('.contact-item');
            contactItems.forEach(item => {
                if (item.querySelector('.contact-text').textContent.includes(text)) {
                    item.classList.add('copied');
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

// Services Section Functions
function setupServicesSection() {
    const servicesList = document.querySelector('.services-list');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const servicesWrapper = document.querySelector('.services-wrapper');
    let isManualScrolling = false;
    let autoScrollingEnabled = true;

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
        const gap = 20;
        const originalCardCount = servicesList.children.length / 2;
        const totalWidth = (cardWidth + gap) * originalCardCount;
        
        return {
            min: -totalWidth,
            max: 0,
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

        newPosition = Math.max(limits.min, Math.min(limits.max, newPosition));

        if (newPosition <= limits.min) {
            newPosition = 0;
        } else if (newPosition >= limits.max && direction === 'left') {
            newPosition = limits.min + limits.cardWidth;
        }

        servicesList.style.transition = 'transform 0.5s ease';
        servicesList.style.transform = `translateX(${newPosition}px)`;

        setTimeout(() => {
            isManualScrolling = false;
        }, 500);
    }

    // Event Listeners for Services Section
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

        servicesWrapper.addEventListener('mouseleave', (event) => {
            if (!servicesWrapper.contains(event.relatedTarget)) {
                autoScrollingEnabled = true;
                isManualScrolling = false;
                startAutoScroll();
            }
        });
    }

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

        servicesList.addEventListener('transitionend', () => {
            const currentTransform = servicesList.style.transform;
            const match = currentTransform.match(/-?\d+/);
            if (match) {
                const currentPosition = parseInt(match[0]);
                const limits = getScrollLimits();
                
                if (currentPosition <= limits.min) {
                    servicesList.style.transition = 'none';
                    servicesList.style.transform = 'translateX(0)';
                    servicesList.offsetHeight;
                    servicesList.style.transition = 'transform 0.5s ease';
                }
            }
        });
    }

    setupInfiniteScroll();
    startAutoScroll();

    window.addEventListener('resize', () => {
        if (!isManualScrolling && servicesList) {
            servicesList.style.transform = '';
            startAutoScroll();
        }
    });
}

// Portfolio Functions
function setupPortfolio() {
    const workList = document.querySelector('.work-list');
    const portfolioBtn = document.getElementById('portfolioExpandBtn');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const projects = document.querySelectorAll('.work');
    let isExpanded = false;

    workList.classList.add('collapsed');

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

    // Initialize Portfolio
    categoryButtons[0].classList.add('active');
    showLimitedProjects('robotics');

    // Portfolio Event Listeners
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
            
            document.querySelector('#portfolio').scrollIntoView({
                behavior: 'smooth'
            });
        }

        const activeCategory = document.querySelector('.category-btn.active');
        if (activeCategory) {
            showLimitedProjects(activeCategory.getAttribute('data-category'));
        }
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const selectedCategory = button.getAttribute('data-category');
            showLimitedProjects(selectedCategory);
        });
    });
}

// Modal Functions
function setupModals() {
    const projectModal = document.getElementById('projectModal');
    const servicesModal = document.getElementById('servicesModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const githubLink = document.getElementById('githubLink');
    const youtubeLink = document.getElementById('youtubeLink');
    const closeModals = document.querySelectorAll('.close-modal');
    const modalButtons = document.querySelector('.modal-buttons');

    // Project Modal Handler
    document.querySelectorAll('.view-project').forEach(button => {
        button.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const hasGithub = this.getAttribute('data-has-github') === 'true';
            const hasYoutube = this.getAttribute('data-has-youtube') === 'true';
            const github = this.getAttribute('data-github');
            const youtube = this.getAttribute('data-youtube');

            modalTitle.textContent = title;
            modalDescription.textContent = description;

            if (hasGithub && github) {
                githubLink.style.display = 'flex';
                githubLink.href = github;
            } else {
                githubLink.style.display = 'none';
            }

            if (hasYoutube && youtube) {
                youtubeLink.style.display = 'flex';
                youtubeLink.href = youtube;
            } else {
                youtubeLink.style.display = 'none';
            }

            if (!hasGithub && !hasYoutube) {
                modalButtons.style.display = 'none';
            } else {
                modalButtons.style.display = 'flex';
                modalButtons.classList.toggle('single-button', (hasGithub && !hasYoutube) || (!hasGithub && hasYoutube));
            }

            projectModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close Modal Functions
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            if (modal) closeModal(modal);
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target === projectModal) closeModal(projectModal);
        if (event.target === servicesModal) closeModal(servicesModal);
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (projectModal.style.display === 'block') closeModal(projectModal);
            if (servicesModal.style.display === 'block') closeModal(servicesModal);
        }
    });
}

// Main Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Tab Initialization
    Array.from(tablinks).forEach(function(tablink) {
        tablink.addEventListener('click', function() {
            opentab(this.textContent.toLowerCase());
        });
    });

    // Mobile Menu Initialization
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.querySelectorAll('#sidemenu a').forEach(link => {
        link.addEventListener('click', closemenu);
    });

    // Contact Form Initialization
    if(form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            fetch(scriptURL, { 
                method: 'POST', 
                body: new FormData(form)
            })
            .then(response => {
                msg.innerHTML = "Message sent successfully";
                setTimeout(function(){
                    msg.innerHTML = "";
                },5000);
                form.reset();
            })
            .catch(error => console.error('Error!', error.message));
        });
    }

    // Contact Items Initialization
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', function() {
            const textToCopy = this.querySelector('.contact-text').textContent;
            copyToClipboard(textToCopy);
        });
    });

    // Initialize all major components
    setupServicesSection();
    setupPortfolio();
    setupModals();
});
