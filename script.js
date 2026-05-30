// ============ DARK MODE TOGGLE ============
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    themeToggle.innerHTML = isDarkMode 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
});

// ============ SIDEBAR TOGGLE ============
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');

menuToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
});

sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// Close sidebar when a link is clicked
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebar.classList.remove('active');
        
        // Update active state
        navItems.forEach(link => link.classList.remove('active'));
        item.classList.add('active');
    });
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    const isSidebarClick = sidebar.contains(e.target);
    const isMenuToggleClick = menuToggle.contains(e.target);
    
    if (!isSidebarClick && !isMenuToggleClick && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// ============ SMOOTH SCROLLING ============
// Update active nav item based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    // Update active nav item
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// ============ SMOOTH SCROLL BEHAVIOR ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only prevent default for internal links
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            
            const target = document.querySelector(href);
            const headerHeight = document.querySelector('.header').clientHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============ COPY CODE BLOCK ============
const codeBlocks = document.querySelectorAll('.code-block');

codeBlocks.forEach(block => {
    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copiar';
    copyButton.className = 'copy-btn';
    copyButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 10;
    `;
    
    // Make code block relative for absolute positioning
    block.style.position = 'relative';
    block.appendChild(copyButton);
    
    // Show/hide button on hover
    block.addEventListener('mouseenter', () => {
        copyButton.style.opacity = '1';
    });
    
    block.addEventListener('mouseleave', () => {
        copyButton.style.opacity = '0';
    });
    
    // Copy functionality
    copyButton.addEventListener('click', () => {
        const code = block.querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
        });
    });
});

// ============ MOBILE MENU RESPONSIVENESS ============
function handleResponsive() {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
}

window.addEventListener('resize', handleResponsive);

// ============ ACCESSIBILITY ============
// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key to close sidebar
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
    
    // Alt + D for dark mode toggle (optional)
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        themeToggle.click();
    }
});

// ============ INITIAL SETUP ============
// Set first nav item as active on page load
if (navItems.length > 0) {
    navItems[0].classList.add('active');
}

console.log('Documentation template loaded successfully! 🚀');
