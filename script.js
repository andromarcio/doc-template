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
const modalBody = document.getElementById('modalBody');

// Conteúdo dos arquivos
const fileContents = {
    'README.md': `# Doc Template 📚

Um template moderno, responsivo e profissional para documentação, com topo, menu lateral esquerdo e visual atual.

## ✨ Características

- ✅ **Design Moderno**: UI limpa e profissional com gradientes elegantes
- ✅ **Menu Lateral**: Navegação intuitiva na esquerda com ícones
- ✅ **Modo Escuro**: Toggle entre tema claro e escuro com persistência
- ✅ **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- ✅ **Sem Dependências**: Apenas HTML, CSS e JavaScript puro
- ✅ **Ícones**: Usa Font Awesome para ícones profissionais
- ✅ **Acessível**: Segue práticas de acessibilidade WCAG
- ✅ **Otimizado**: Performance excelente e SEO-friendly

## 🚀 Deploy no GitHub Pages

1. Vá para as configurações do repositório
2. Procure por "GitHub Pages"
3. Selecione "Deploy from a branch"
4. Escolha branch \`main\` e pasta \`/ (root)\`
5. Salve`,
    
    'MASTER.md': `# MASTER - Stack e Convenções Globais

## 🛠️ Stack Técnico

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Ícones**: Font Awesome 6.4
- **Versionamento**: Git + GitHub
- **Documentação**: Markdown

## 📋 Convenções

### Nomenclatura
- Classes CSS: kebab-case
- IDs: camelCase
- Variáveis JS: camelCase
- Arquivos: lowercase com hífen

### Estrutura CSS
- Variáveis customizadas via :root
- Mobile-first approach
- Breakpoints: 768px, 480px

### JavaScript
- Módulos bem separados por funcionalidade
- Comentários em blocos (============)
- Sem dependências externas

## 🎨 Paleta de Cores

- Primary: #6366f1 (Indigo)
- Secondary: #ec4899 (Pink)
- Text Dark: #1e293b
- Background: #f8fafc`,

    'DESIGN-SYSTEM.md': `# Design System

## Tipografia

- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, etc)
- **Base Font Size**: 16px
- **Line Height**: 1.6

## Componentes

### Botões
- Primary: Fundo branco, texto colorido
- Secondary: Fundo transparente, borda branca

### Cards
- Padding: 1.5rem
- Border Radius: 8px
- Shadow: var(--shadow-md)

### Modais
- Max Width: 600px
- Backdrop Filter: blur(4px)
- Z-index: 1000+

## Espaçamento

- xs: 0.5rem
- sm: 1rem
- md: 1.5rem
- lg: 2rem
- xl: 3rem`,

    'DATA-MODEL.md': `# Modelo de Dados Global

## Entidades Base

### User (Usuário)
- id: UUID
- name: String
- email: String
- role: Enum(admin, user, guest)
- createdAt: DateTime
- updatedAt: DateTime

### Document (Documento)
- id: UUID
- title: String
- content: Text
- author: UUID (FK User)
- status: Enum(draft, published, archived)
- createdAt: DateTime
- updatedAt: DateTime

### Version (Versão)
- id: UUID
- documentId: UUID (FK Document)
- content: Text
- version: Integer
- author: UUID (FK User)
- createdAt: DateTime

## Enums

### DocumentStatus
- draft: 0
- published: 1
- archived: 2

### UserRole
- admin: 0
- user: 1
- guest: 2`,

    'API-PATTERNS.md': `# Padrões de API

## REST Conventions

### Status Codes
- 200: OK
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

### Response Format

\`\`\`json
{
  "status": "success|error",
  "data": {},
  "error": "message",
  "timestamp": "2026-05-30T01:56:00Z"
}
\`\`\`

### Pagination

\`\`\`json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
\`\`\`

## Naming Conventions

- Endpoints em minúsculas
- Recursos em plural: /users, /documents
- Ações específicas: /users/:id/activate
- Query params: ?filter=value&sort=-date`,

    'ERROR-DICTIONARY.md': `# Dicionário de Erros

## Erros Globais

### E001 - Invalid Request
- Status: 400
- Message: "A requisição enviada não é válida"
- Ação: Verifique os parâmetros

### E002 - Unauthorized
- Status: 401
- Message: "Você não tem permissão para acessar este recurso"
- Ação: Faça login

### E003 - Not Found
- Status: 404
- Message: "Recurso não encontrado"
- Ação: Verifique o ID

### E004 - Internal Error
- Status: 500
- Message: "Erro interno do servidor"
- Ação: Tente novamente mais tarde

### E005 - Rate Limit
- Status: 429
- Message: "Você excedeu o limite de requisições"
- Ação: Aguarde antes de tentar novamente`,

    'SIZING.md': `# Critérios APF - Contagem de Pontos de Função

## Tabela de Referência

### EIF (External Interface File)
- Simples: 5 PF
- Médio: 7 PF
- Complexo: 10 PF

### ILF (Internal Logical File)
- Simples: 7 PF
- Médio: 10 PF
- Complexo: 15 PF

### Entrada
- Simples: 3 PF
- Médio: 4 PF
- Complexo: 6 PF

### Saída
- Simples: 4 PF
- Médio: 5 PF
- Complexo: 7 PF

### Consulta
- Simples: 3 PF
- Médio: 4 PF
- Complexo: 6 PF

## Exemplo de Cálculo

Feature: Criar Usuário
- 1 ILF (User): 7 PF
- 1 Entrada (Form): 3 PF
- 1 Saída (Confirmação): 4 PF
- **Total: 14 PF**`,

    'FIELD-DICTIONARY.md': `# Dicionário de Campos Canônicos

## CPF
- Label: "CPF"
- Type: String
- Format: "XXX.XXX.XXX-XX"
- Validation: regex + dígito verificador
- Storage: String(11)

## CNPJ
- Label: "CNPJ"
- Type: String
- Format: "XX.XXX.XXX/XXXX-XX"
- Validation: regex + dígito verificador
- Storage: String(14)

## Email
- Label: "E-mail"
- Type: String
- Format: RFC 5322
- Validation: regex simples
- Storage: String(255)

## CEP
- Label: "CEP"
- Type: String
- Format: "XXXXX-XXX"
- Validation: regex
- Storage: String(8)

## Telefone
- Label: "Telefone"
- Type: String
- Format: "(XX) XXXXX-XXXX"
- Validation: regex
- Storage: String(11)

## Data
- Label: "Data"
- Type: Date
- Format: "DD/MM/YYYY"
- Validation: data válida
- Storage: DATE

## Hora
- Label: "Hora"
- Type: Time
- Format: "HH:MM:SS"
- Validation: hora válida
- Storage: TIME`,

    'RULES-DICTIONARY.md': `# Dicionário de Regras de Negócio Canônicas

## Validação de Cadastro

### RN001 - Email Único
- Descrição: Todo email deve ser único no sistema
- Aplicação: Validação em DB (UNIQUE constraint)
- Mensagem: "Este email já está registrado"

### RN002 - CPF Válido
- Descrição: CPF deve passar pela validação de dígito verificador
- Aplicação: Validação em aplicação
- Mensagem: "CPF inválido"

### RN003 - Senha Forte
- Descrição: Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial
- Aplicação: Validação em aplicação
- Mensagem: "Senha não atende aos critérios de segurança"

## Regras de Negócio

### RN004 - Permissão de Edição
- Descrição: Apenas autor pode editar documento
- Aplicação: Check no backend
- Exceção: Admin pode editar tudo

### RN005 - Retenção de Dados
- Descrição: Documentos deletados são mantidos por 30 dias
- Aplicação: Soft delete + scheduled cleanup
- Ação: Restauração possível dentro do período`
};

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
    'script.js': { type: 'file', size: '12.9 KB', icon: 'fa-file-code', desc: 'Lógica JavaScript' },
    'MASTER.md': { type: 'file', size: '1.2 KB', icon: 'fa-file', desc: 'Stack e convenções' },
    'DESIGN-SYSTEM.md': { type: 'file', size: '0.8 KB', icon: 'fa-file', desc: 'Padrões de UI' },
    'DATA-MODEL.md': { type: 'file', size: '1.1 KB', icon: 'fa-file', desc: 'Modelo de dados' },
    'API-PATTERNS.md': { type: 'file', size: '0.9 KB', icon: 'fa-file', desc: 'Padrões de API' },
    'ERROR-DICTIONARY.md': { type: 'file', size: '0.7 KB', icon: 'fa-file', desc: 'Dicionário de erros' },
    'FIELD-DICTIONARY.md': { type: 'file', size: '1.2 KB', icon: 'fa-file', desc: 'Campos canônicos' },
    'RULES-DICTIONARY.md': { type: 'file', size: '1.0 KB', icon: 'fa-file', desc: 'Regras de negócio' },
    'SIZING.md': { type: 'file', size: '0.8 KB', icon: 'fa-file', desc: 'Critérios APF' },
    'INDEX.md': { type: 'file', size: '2.5 KB', icon: 'fa-file', desc: 'Índice de rastreabilidade' }
};

function openFileBrowser(path = '') {
    fileBrowserModal.classList.add('active');
    renderBrowser(path);
}

function closeBrowser() {
    fileBrowserModal.classList.remove('active');
}

function viewFile(filePath) {
    const fileName = filePath.split('/').pop();
    const content = fileContents[fileName];
    
    if (!content) {
        showFileNotFound(fileName);
        return;
    }
    
    // Hide file list, show content
    fileList.style.display = 'none';
    
    // Create file viewer
    const viewer = document.createElement('div');
    viewer.style.cssText = `
        display: flex;
        flex-direction: column;
        height: 100%;
    `;
    
    // File header
    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 1rem;
    `;
    
    const fileNameEl = document.createElement('div');
    fileNameEl.innerHTML = `<strong>📄 ${fileName}</strong>`;
    
    const backBtn = document.createElement('button');
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Voltar';
    backBtn.style.cssText = `
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
    `;
    backBtn.onclick = () => {
        viewer.remove();
        fileList.style.display = 'grid';
    };
    
    header.appendChild(fileNameEl);
    header.appendChild(backBtn);
    
    // File content
    const contentEl = document.createElement('div');
    contentEl.style.cssText = `
        overflow-y: auto;
        padding: 1rem;
        background: var(--bg-light);
        border-radius: 6px;
        font-family: 'Courier New', monospace;
        font-size: 0.85rem;
        white-space: pre-wrap;
        word-wrap: break-word;
        line-height: 1.5;
        color: var(--text-muted);
    `;
    contentEl.textContent = content;
    
    viewer.appendChild(header);
    viewer.appendChild(contentEl);
    
    modalBody.appendChild(viewer);
}

function showFileNotFound(fileName) {
    fileList.innerHTML = `
        <div style="
            padding: 2rem;
            text-align: center;
            color: var(--text-muted);
        ">
            <i class="fas fa-file-slash" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
            <p><strong>Arquivo não encontrado</strong></p>
            <p style="font-size: 0.9rem;">O arquivo <code>${fileName}</code> não está disponível para visualização neste momento.</p>
        </div>
    `;
}

function renderBrowser(path = '') {
    // Reset display
    fileList.style.display = 'grid';
    fileList.innerHTML = '';
    
    // Update title and breadcrumb
    modalTitle.textContent = path ? `📁 ${path}` : '📂 Estrutura do Repositório';
    renderBreadcrumb(path);
    
    // Get items in current directory
    const currentDir = repoStructure[path];
    if (!currentDir) {
        fileList.innerHTML = '<p style="color: var(--text-muted);">Diretório não encontrado</p>';
        return;
    }
    
    currentDir.children.forEach(item => {
        const itemPath = path ? `${path}/${item}` : item;
        const isDir = repoStructure[itemPath] !== undefined;
        const info = fileInfo[item] || { type: isDir ? 'dir' : 'file', icon: isDir ? 'fa-folder' : 'fa-file' };
        
        const itemEl = document.createElement('a');
        itemEl.href = '#';
        itemEl.className = 'file-item';
        itemEl.style.cursor = 'pointer';
        itemEl.onclick = (e) => {
            e.preventDefault();
            if (isDir) {
                renderBrowser(itemPath);
            } else {
                viewFile(itemPath);
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
