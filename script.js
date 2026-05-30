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
    item.addEventListener('click', (e) => {
        // Don't close sidebar for toggle buttons
        if (!item.classList.contains('nav-toggle')) {
            sidebar.classList.remove('active');
        }
        
        // Update active state only for links, not toggles
        if (!item.classList.contains('nav-toggle')) {
            navItems.forEach(link => link.classList.remove('active'));
            item.classList.add('active');
        }
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

// ============ FRAMEWORK SUBMENU TOGGLE ============
const frameworkToggle = document.getElementById('frameworkToggle');
const frameworkMenu = document.getElementById('frameworkMenu');

frameworkToggle.addEventListener('click', () => {
    const isOpen = frameworkMenu.style.display === 'block';
    frameworkMenu.style.display = isOpen ? 'none' : 'block';
    
    // Rotate chevron icon
    const chevron = frameworkToggle.querySelector('.fa-chevron-down');
    if (chevron) {
        chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        chevron.style.transition = 'transform 0.3s ease';
    }
});

// Framework links to open modal
const frameworkLinks = document.querySelectorAll('.framework-link');
frameworkLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.getAttribute('data-path');
        openFileBrowser(path);
    });
});

// ============ FILE BROWSER MODAL ============
const fileBrowserModal = document.getElementById('fileBrowserModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const fileList = document.getElementById('fileList');
const breadcrumb = document.getElementById('breadcrumb');
const modalTitle = document.getElementById('modalTitle');

// Repository structure
const repoStructure = {
    '': {
        type: 'dir',
        children: ['README.md', 'index.html', 'styles.css', 'script.js', 'global', 'modules', 'prototypes', 'prompts', 'decisions', 'changelogs']
    },
    'global': {
        type: 'dir',
        children: ['MASTER.md', 'DESIGN-SYSTEM.md', 'DATA-MODEL.md', 'SIZING.md', 'API-PATTERNS.md', 'ERROR-DICTIONARY.md', 'FIELD-DICTIONARY.md', 'RULES-DICTIONARY.md', 'data-models']
    },
    'global/data-models': {
        type: 'dir',
        children: ['_template-dominio.md', 'identity.md', 'contacts.md', 'communication.md', 'work.md', 'capture.md']
    },
    'modules': {
        type: 'dir',
        children: ['INDEX.md', '_template-dominio']
    },
    'prototypes': {
        type: 'dir',
        children: ['README.md', '_template']
    },
    'prompts': {
        type: 'dir',
        children: ['SYSTEM_PROMPT_analista_requisitos.md', 'PROMPT_MENU.md', 'PROMPT_0_EXTRACTION.md', 'PROMPT_1A_N1_negocio.md', 'PROMPT_1B_N1_tecnico.md', 'PROMPT_2A_N2_negocio.md', 'PROMPT_3A_N3_negocio.md', 'PROMPT_3B_N3_tecnico.md', 'PROMPT_4A_N3_UPDATE_negocio.md', 'PROMPT_4B_N3_UPDATE_tecnico.md', 'PROMPT_QA.md', 'PROMPT_SDD.md']
    },
    'decisions': {
        type: 'dir',
        children: ['ADR-000-template.md']
    },
    'changelogs': {
        type: 'dir',
        children: ['CHANGELOG-template.md']
    }
};

// File info (type, size, description)
const fileInfo = {
    'README.md': { type: 'file', size: '4.9 KB', icon: 'fa-file', desc: 'Documentação do projeto' },
    'index.html': { type: 'file', size: '12.4 KB', icon: 'fa-file-code', desc: 'Página principal' },
    'styles.css': { type: 'file', size: '14.8 KB', icon: 'fa-file-code', desc: 'Estilos do projeto' },
    'script.js': { type: 'file', size: '5.7 KB', icon: 'fa-file-code', desc: 'Lógica JavaScript' },
    'MASTER.md': { type: 'file', size: '3.2 KB', icon: 'fa-file', desc: 'Stack e convenções' },
    'DESIGN-SYSTEM.md': { type: 'file', size: '5.1 KB', icon: 'fa-file', desc: 'Padrões de UI' },
    'DATA-MODEL.md': { type: 'file', size: '8.7 KB', icon: 'fa-file', desc: 'Modelo de dados' },
    'INDEX.md': { type: 'file', size: '2.5 KB', icon: 'fa-file', desc: 'Índice de rastreabilidade' },
    'README.md': { type: 'file', size: '1.8 KB', icon: 'fa-file', desc: 'Índice de estrutura' }
};

function openFileBrowser(path = '') {
    fileBrowserModal.classList.add('active');
    renderBrowser(path);
}

function closeBrowser() {
    fileBrowserModal.classList.remove('active');
}

function renderBrowser(path = '') {
    // Update title and breadcrumb
    modalTitle.textContent = path ? `📁 ${path}` : '📂 Estrutura do Repositório';
    renderBreadcrumb(path);
    
    // Get items in current directory
    const currentDir = repoStructure[path];
    if (!currentDir) {
        fileList.innerHTML = '<p style="color: var(--text-muted);">Diretório não encontrado</p>';
        return;
    }
    
    fileList.innerHTML = '';
    
    currentDir.children.forEach(item => {
        const itemPath = path ? `${path}/${item}` : item;
        const isDir = repoStructure[itemPath] !== undefined;
        const info = fileInfo[item] || { type: isDir ? 'dir' : 'file', icon: isDir ? 'fa-folder' : 'fa-file' };
        
        const itemEl = document.createElement('a');
        itemEl.href = '#';
        itemEl.className = 'file-item';
        itemEl.onclick = (e) => {
            e.preventDefault();
            if (isDir) {
                renderBrowser(itemPath);
            }
        };
        
        itemEl.innerHTML = `
            <i class="fas ${info.icon}"></i>
            <span class="file-item-name">${item}${isDir ? '/' : ''}</span>
            ${info.size ? `<span class="file-item-size">${info.size}</span>` : ''}
        `;
        
        fileList.appendChild(itemEl);
    });
}

function renderBreadcrumb(path = '') {
    breadcrumb.innerHTML = '';
    
    // Home
    const homeBtn = document.createElement('button');
    homeBtn.className = 'breadcrumb-item';
    homeBtn.textContent = '🏠 Raiz';
    homeBtn.style.background = 'none';
    homeBtn.style.border = 'none';
    homeBtn.style.cursor = 'pointer';
    homeBtn.onclick = () => renderBrowser('');
    breadcrumb.appendChild(homeBtn);
    
    if (path) {
        const parts = path.split('/');
        let currentPath = '';
        
        parts.forEach((part, index) => {
            const sep = document.createElement('span');
            sep.className = 'breadcrumb-separator';
            sep.textContent = '/';
            breadcrumb.appendChild(sep);
            
            currentPath = currentPath ? `${currentPath}/${part}` : part;
            const isLast = index === parts.length - 1;
            
            const btn = document.createElement('button');
            btn.className = 'breadcrumb-item';
            btn.textContent = part;
            btn.style.background = 'none';
            btn.style.border = 'none';
            btn.style.cursor = 'pointer';
            btn.style.fontWeight = isLast ? '600' : '400';
            btn.onclick = () => renderBrowser(currentPath);
            breadcrumb.appendChild(btn);
        });
    }
}

// Modal controls
modalClose.addEventListener('click', closeBrowser);
modalOverlay.addEventListener('click', closeBrowser);

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fileBrowserModal.classList.contains('active')) {
        closeBrowser();
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
    
    // Update active nav item (only for non-toggle items)
    navItems.forEach(item => {
        if (!item.classList.contains('nav-toggle')) {
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
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
    
    // Alt + D for dark mode toggle
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
