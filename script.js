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
const navItems = document.querySelectorAll('a.nav-item');
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

// ============ FRAMEWORK MENU TOGGLE ============
const frameworkToggle = document.getElementById('frameworkToggle');
const frameworkMenu = document.getElementById('frameworkMenu');

if (frameworkToggle) {
    frameworkToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isVisible = frameworkMenu.style.display === 'block';
        frameworkMenu.style.display = isVisible ? 'none' : 'block';
    });
}

// ============ FILE BROWSER MODAL ============
const modal = document.getElementById('fileBrowserModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const fileList = document.getElementById('fileList');
const breadcrumb = document.getElementById('breadcrumb');
const modalTitle = document.getElementById('modalTitle');

// Repository structure
const repoStructure = {
    '': {
        name: 'doc-template',
        type: 'directory',
        children: ['README.md', 'index.html', 'styles.css', 'script.js', 'global', 'modules', 'prototypes', 'prompts', 'decisions', 'changelogs', 'repos']
    },
    'global': {
        name: 'global',
        type: 'directory',
        children: ['MASTER.md', 'DESIGN-SYSTEM.md', 'DATA-MODEL.md', 'SIZING.md', 'API-PATTERNS.md', 'ERROR-DICTIONARY.md', 'FIELD-DICTIONARY.md', 'RULES-DICTIONARY.md', 'data-models']
    },
    'global/data-models': {
        name: 'data-models',
        type: 'directory',
        children: ['_template-dominio.md', 'identity.md', 'contacts.md', 'communication.md', 'work.md', 'capture.md']
    },
    'modules': {
        name: 'modules',
        type: 'directory',
        children: ['INDEX.md', '_template-dominio', 'example-domain']
    },
    'modules/_template-dominio': {
        name: '_template-dominio',
        type: 'directory',
        children: ['README.md', '_template-feature-set']
    },
    'modules/_template-dominio/_template-feature-set': {
        name: '_template-feature-set',
        type: 'directory',
        children: ['README.md', '_template-feature.md']
    },
    'prototypes': {
        name: 'prototypes',
        type: 'directory',
        children: ['README.md', '_template', 'example-feature-set']
    },
    'prototypes/_template': {
        name: '_template',
        type: 'directory',
        children: ['_template-feature-set']
    },
    'prototypes/_template/_template-feature-set': {
        name: '_template-feature-set',
        type: 'directory',
        children: ['README.md', '_template-feature']
    },
    'prototypes/_template/_template-feature-set/_template-feature': {
        name: '_template-feature',
        type: 'directory',
        children: ['README.md', 'form.html', 'loading.html', 'empty.html', 'error.html', 'assets']
    },
    'prompts': {
        name: 'prompts',
        type: 'directory',
        children: ['SYSTEM_PROMPT_analista_requisitos.md', 'PROMPT_MENU.md', 'PROMPT_0_EXTRACTION.md', 'PROMPT_1A_N1_negocio.md', 'PROMPT_1B_N1_tecnico.md', 'PROMPT_2A_N2_negocio.md', 'PROMPT_3A_N3_negocio.md', 'PROMPT_QA.md', 'PROMPT_SDD.md']
    },
    'decisions': {
        name: 'decisions',
        type: 'directory',
        children: ['ADR-000-template.md', 'ADR-001-architecture.md']
    },
    'changelogs': {
        name: 'changelogs',
        type: 'directory',
        children: ['CHANGELOG-template.md', 'CHANGELOG.md']
    },
    'repos': {
        name: 'repos',
        type: 'directory',
        children: ['INDEX.md', '_template-repo.md']
    }
};

function getItemsInPath(path) {
    if (!repoStructure[path]) return [];
    
    const items = repoStructure[path].children || [];
    return items.map(name => {
        const fullPath = path ? `${path}/${name}` : name;
        const item = repoStructure[fullPath];
        
        return {
            name: name,
            path: fullPath,
            type: item?.type || (name.includes('.') ? 'file' : 'directory')
        };
    });
}

function renderFileList(path = '') {
    const items = getItemsInPath(path);
    fileList.innerHTML = '';
    
    items.forEach(item => {
        const div = document.createElement('button');
        div.className = 'file-item';
        
        const icon = item.type === 'directory' ? 'fa-folder' : 'fa-file';
        const color = item.type === 'directory' ? 'primary' : 'muted';
        
        div.innerHTML = `
            <i class="fas ${icon}"></i>
            <span class="file-item-name">${item.name}</span>
        `;
        
        div.addEventListener('click', () => {
            if (item.type === 'directory') {
                renderFileList(item.path);
                updateBreadcrumb(item.path);
            } else {
                // Copy to clipboard or show file content
                const fileContent = `${item.path}/${item.name}`;
                navigator.clipboard.writeText(item.path).then(() => {
                    const originalText = div.innerHTML;
                    div.innerHTML = '<i class="fas fa-check" style="color: #10b981;"></i> Caminho copiado!';
                    setTimeout(() => {
                        div.innerHTML = originalText;
                    }, 2000);
                });
            }
        });
        
        fileList.appendChild(div);
    });
}

function updateBreadcrumb(path) {
    breadcrumb.innerHTML = '';
    
    // Root item
    const rootBtn = document.createElement('button');
    rootBtn.className = 'breadcrumb-item';
    rootBtn.textContent = '📂 doc-template';
    rootBtn.addEventListener('click', () => {
        renderFileList('');
        updateBreadcrumb('');
    });
    breadcrumb.appendChild(rootBtn);
    
    if (path) {
        const parts = path.split('/');
        let currentPath = '';
        
        parts.forEach((part, index) => {
            const separator = document.createElement('span');
            separator.className = 'breadcrumb-separator';
            separator.textContent = '/';
            breadcrumb.appendChild(separator);
            
            currentPath = currentPath ? `${currentPath}/${part}` : part;
            
            const btn = document.createElement('button');
            btn.className = 'breadcrumb-item';
            btn.textContent = part;
            btn.addEventListener('click', () => {
                renderFileList(currentPath);
                updateBreadcrumb(currentPath);
            });
            breadcrumb.appendChild(btn);
        });
    }
}

// Framework menu links
const frameworkLinks = document.querySelectorAll('.framework-link');
frameworkLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.dataset.path;
        renderFileList(path);
        updateBreadcrumb(path);
        modal.classList.add('active');
    });
});

// Modal controls
modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
});

modalOverlay.addEventListener('click', () => {
    modal.classList.remove('active');
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
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
        const code = block.querySelector('code') ? block.querySelector('code').textContent : block.textContent;
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
