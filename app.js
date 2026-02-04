// Database Learning Hub - App Logic

// Topic data for search and mapping
const topicData = [
    { id: 'normalization', title: 'Normalization (1NF, 2NF, 3NF)', module: '1', moduleName: 'Database Fundamentals' },
    { id: 'denormalization', title: 'Denormalization', module: '1', moduleName: 'Database Fundamentals' },
    { id: 'surrogate-key', title: 'Surrogate Key', module: '1', moduleName: 'Database Fundamentals' },
    { id: 'union', title: 'UNION vs UNION ALL', module: '2', moduleName: 'SQL Operations' },
    { id: 'subquery-vs-join', title: 'Subquery vs JOIN', module: '2', moduleName: 'SQL Operations' },
    { id: 'correlated-subquery', title: 'Correlated Subquery', module: '2', moduleName: 'SQL Operations' },
    { id: 'exists-vs-in', title: 'EXISTS vs IN', module: '2', moduleName: 'SQL Operations' },
    { id: 'cte', title: 'CTE (Common Table Expression)', module: '2', moduleName: 'SQL Operations' },
    { id: 'pivot', title: 'PIVOT Operation', module: '2', moduleName: 'SQL Operations' },
    { id: 'covering-index', title: 'Covering Index', module: '3', moduleName: 'Indexing & Performance' },
    { id: 'clustered-index', title: 'Clustered Index', module: '3', moduleName: 'Indexing & Performance' },
    { id: 'query-execution-plan', title: 'Query Execution Plan', module: '3', moduleName: 'Indexing & Performance' },
    { id: 'isolation-levels', title: 'Transaction Isolation Levels', module: '4', moduleName: 'Transactions & Concurrency' },
    { id: 'deadlock', title: 'Deadlock', module: '4', moduleName: 'Transactions & Concurrency' },
    { id: 'locking', title: 'Optimistic vs Pessimistic Locking', module: '4', moduleName: 'Transactions & Concurrency' },
    { id: 'two-phase-commit', title: 'Two-Phase Commit (2PC)', module: '4', moduleName: 'Transactions & Concurrency' },
    { id: 'snapshot-isolation', title: 'Snapshot Isolation', module: '4', moduleName: 'Transactions & Concurrency' },
    { id: 'etl-vs-elt', title: 'ETL vs ELT', module: '5', moduleName: 'Data Warehousing' },
    { id: 'star-schema', title: 'Star Schema', module: '5', moduleName: 'Data Warehousing' },
    { id: 'olap-vs-oltp', title: 'OLAP vs OLTP', module: '5', moduleName: 'Data Warehousing' },
    { id: 'rank-functions', title: 'RANK() vs DENSE_RANK()', module: '6', moduleName: 'Advanced Features' },
    { id: 'row-level-security', title: 'Row-Level Security (RLS)', module: '6', moduleName: 'Advanced Features' },
    { id: 'full-text-search', title: 'PostgreSQL Full-Text Search', module: '6', moduleName: 'Advanced Features' },
    { id: 'rds-vs-aurora', title: 'Amazon RDS vs Aurora', module: '6', moduleName: 'Advanced Features' },
    { id: 'ntile', title: 'NTILE(n)', module: '6', moduleName: 'Advanced Features' }
];

// Module data
const moduleData = {
    '1': { total: 3, topics: ['normalization', 'denormalization', 'surrogate-key'] },
    '2': { total: 6, topics: ['union', 'subquery-vs-join', 'correlated-subquery', 'exists-vs-in', 'cte', 'pivot'] },
    '3': { total: 3, topics: ['covering-index', 'clustered-index', 'query-execution-plan'] },
    '4': { total: 5, topics: ['isolation-levels', 'deadlock', 'locking', 'two-phase-commit', 'snapshot-isolation'] },
    '5': { total: 3, topics: ['etl-vs-elt', 'star-schema', 'olap-vs-oltp'] },
    '6': { total: 5, topics: ['rank-functions', 'row-level-security', 'full-text-search', 'rds-vs-aurora', 'ntile'] }
};

// Progress management
class ProgressTracker {
    constructor() {
        this.completedTopics = this.loadProgress();
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('dbLearningProgress');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.warn('Could not load progress from localStorage');
            return [];
        }
    }

    saveProgress() {
        try {
            localStorage.setItem('dbLearningProgress', JSON.stringify(this.completedTopics));
        } catch (e) {
            console.warn('Could not save progress to localStorage');
        }
    }

    toggleTopic(topicId) {
        const index = this.completedTopics.indexOf(topicId);
        if (index > -1) {
            this.completedTopics.splice(index, 1);
            return false;
        } else {
            this.completedTopics.push(topicId);
            return true;
        }
    }

    isCompleted(topicId) {
        return this.completedTopics.includes(topicId);
    }

    getProgress() {
        return {
            completed: this.completedTopics.length,
            total: topicData.length,
            percentage: Math.round((this.completedTopics.length / topicData.length) * 100)
        };
    }

    getModuleProgress(moduleId) {
        const module = moduleData[moduleId];
        if (!module) return { completed: 0, total: 0, percentage: 0 };
        
        const completed = module.topics.filter(t => this.isCompleted(t)).length;
        return {
            completed,
            total: module.total,
            percentage: Math.round((completed / module.total) * 100)
        };
    }

    reset() {
        this.completedTopics = [];
        this.saveProgress();
    }
}

// UI Controller
class UIController {
    constructor(progressTracker) {
        this.progress = progressTracker;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgressUI();
        this.initHighlightJS();
        this.restoreExpandedState();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleBackClick(e));
        });

        // Module cards
        document.querySelectorAll('.module-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleModuleClick(e));
        });

        // Expand/collapse topic cards
        document.querySelectorAll('.expand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleExpandClick(e));
        });

        // Mark complete buttons
        document.querySelectorAll('.mark-complete').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleMarkComplete(e));
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
            searchInput.addEventListener('focus', () => this.showSearchResults());
        }

        // Close search on click outside
        document.addEventListener('click', (e) => {
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer && !searchContainer.contains(e.target)) {
                this.hideSearchResults();
            }
        });

        // Mobile menu
        const menuToggle = document.getElementById('menuToggle');
        const closeSidebar = document.getElementById('closeSidebar');
        const overlay = document.getElementById('overlay');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleSidebar(true));
        }

        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => this.toggleSidebar(false));
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.toggleSidebar(false));
        }

        // Reset progress
        const resetBtn = document.getElementById('resetProgress');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.handleResetProgress());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    handleNavClick(e) {
        e.preventDefault();
        const sectionId = e.currentTarget.dataset.section;
        this.showSection(sectionId);
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Close sidebar on mobile
        this.toggleSidebar(false);
    }

    handleBackClick(e) {
        const sectionId = e.currentTarget.dataset.section;
        this.showSection(sectionId);
        
        // Update nav
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        if (navLink) navLink.classList.add('active');
    }

    handleModuleClick(e) {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        const moduleId = href.replace('#', '');
        this.showSection(moduleId);
        
        // Update nav
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const navLink = document.querySelector(`.nav-link[data-section="${moduleId}"]`);
        if (navLink) navLink.classList.add('active');
    }

    handleExpandClick(e) {
        const card = e.currentTarget.closest('.topic-card');
        const isExpanded = card.classList.contains('expanded');
        
        // Collapse all others in same section (optional accordion behavior)
        // card.closest('.topics-grid').querySelectorAll('.topic-card.expanded').forEach(c => {
        //     if (c !== card) this.toggleCard(c, false);
        // });
        
        this.toggleCard(card, !isExpanded);
        
        // Re-highlight code blocks
        if (!isExpanded) {
            card.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }
    }

    toggleCard(card, expand) {
        card.classList.toggle('expanded', expand);
        const btn = card.querySelector('.expand-btn');
        btn.textContent = expand ? 'Show Less ↑' : 'Read More ↓';
        
        // Save expanded state
        this.saveExpandedState();
    }

    handleMarkComplete(e) {
        e.stopPropagation();
        const btn = e.currentTarget;
        const topicId = btn.dataset.topic;
        const card = btn.closest('.topic-card');
        
        const isCompleted = this.progress.toggleTopic(topicId);
        this.progress.saveProgress();
        
        // Update UI
        card.classList.toggle('completed', isCompleted);
        btn.textContent = isCompleted ? '✓' : '○';
        btn.title = isCompleted ? 'Mark as incomplete' : 'Mark as complete';
        
        // Update progress displays
        this.updateProgressUI();
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        const resultsContainer = document.getElementById('searchResults');
        
        if (!query) {
            resultsContainer.innerHTML = '';
            resultsContainer.classList.remove('active');
            return;
        }
        
        const matches = topicData.filter(t => 
            t.title.toLowerCase().includes(query) ||
            t.moduleName.toLowerCase().includes(query)
        );
        
        this.renderSearchResults(matches);
    }

    renderSearchResults(matches) {
        const container = document.getElementById('searchResults');
        
        if (matches.length === 0) {
            container.innerHTML = '<div class="search-result-item">No results found</div>';
        } else {
            container.innerHTML = matches.map(m => `
                <div class="search-result-item" data-topic="${m.id}" data-module="${m.module}">
                    <div class="search-result-title">${m.title}</div>
                    <div class="search-result-module">${m.moduleName}</div>
                </div>
            `).join('');
            
            // Bind click events
            container.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const topicId = item.dataset.topic;
                    const moduleId = `module${item.dataset.module}`;
                    this.navigateToTopic(moduleId, topicId);
                    this.hideSearchResults();
                    document.getElementById('searchInput').value = '';
                });
            });
        }
        
        container.classList.add('active');
    }

    showSearchResults() {
        const input = document.getElementById('searchInput');
        if (input.value.trim()) {
            document.getElementById('searchResults').classList.add('active');
        }
    }

    hideSearchResults() {
        const results = document.getElementById('searchResults');
        if (results) results.classList.remove('active');
    }

    navigateToTopic(moduleId, topicId) {
        // Show the module section
        this.showSection(moduleId);
        
        // Update nav
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const navLink = document.querySelector(`.nav-link[data-section="${moduleId}"]`);
        if (navLink) navLink.classList.add('active');
        
        // Expand the topic card and scroll to it
        setTimeout(() => {
            const card = document.querySelector(`.topic-card[data-topic="${topicId}"]`);
            if (card) {
                this.toggleCard(card, true);
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Highlight code
                card.querySelectorAll('pre code').forEach(block => {
                    hljs.highlightElement(block);
                });
            }
        }, 100);
    }

    showSection(sectionId) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    toggleSidebar(show) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        if (sidebar) sidebar.classList.toggle('open', show);
        if (overlay) overlay.classList.toggle('active', show);
    }

    handleResetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            this.progress.reset();
            this.updateProgressUI();
            
            // Clear all completed states
            document.querySelectorAll('.topic-card').forEach(card => {
                card.classList.remove('completed');
            });
            document.querySelectorAll('.mark-complete').forEach(btn => {
                btn.textContent = '○';
                btn.title = 'Mark as complete';
            });
        }
    }

    updateProgressUI() {
        const progress = this.progress.getProgress();
        
        // Update main progress bar
        const progressFill = document.getElementById('progressFill');
        const progressPercent = document.getElementById('progressPercent');
        const completedCount = document.getElementById('completedCount');
        
        if (progressFill) progressFill.style.width = `${progress.percentage}%`;
        if (progressPercent) progressPercent.textContent = `${progress.percentage}%`;
        if (completedCount) completedCount.textContent = progress.completed;
        
        // Update module progress bars
        Object.keys(moduleData).forEach(moduleId => {
            const moduleProgress = this.progress.getModuleProgress(moduleId);
            const bar = document.querySelector(`.module-progress-bar[data-module="${moduleId}"]`);
            if (bar) {
                bar.style.width = `${moduleProgress.percentage}%`;
            }
        });
        
        // Update completed topic buttons
        document.querySelectorAll('.mark-complete').forEach(btn => {
            const topicId = btn.dataset.topic;
            if (this.progress.isCompleted(topicId)) {
                btn.textContent = '✓';
                btn.title = 'Mark as incomplete';
                btn.closest('.topic-card').classList.add('completed');
            }
        });
    }

    initHighlightJS() {
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    }

    saveExpandedState() {
        const expandedTopics = Array.from(document.querySelectorAll('.topic-card.expanded'))
            .map(card => card.dataset.topic);
        try {
            sessionStorage.setItem('dbLearningExpanded', JSON.stringify(expandedTopics));
        } catch (e) {
            console.warn('Could not save expanded state');
        }
    }

    restoreExpandedState() {
        try {
            const expanded = JSON.parse(sessionStorage.getItem('dbLearningExpanded') || '[]');
            expanded.forEach(topicId => {
                const card = document.querySelector(`.topic-card[data-topic="${topicId}"]`);
                if (card) this.toggleCard(card, true);
            });
        } catch (e) {
            console.warn('Could not restore expanded state');
        }
    }

    handleKeydown(e) {
        // ESC to close sidebar and search
        if (e.key === 'Escape') {
            this.toggleSidebar(false);
            this.hideSearchResults();
        }
        
        // / to focus search
        if (e.key === '/' && !e.target.matches('input')) {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.focus();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const progressTracker = new ProgressTracker();
    const uiController = new UIController(progressTracker);
    
    // Handle URL hash for direct linking
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const topic = topicData.find(t => t.id === hash);
        if (topic) {
            uiController.navigateToTopic(`module${topic.module}`, topic.id);
        } else if (hash.startsWith('module')) {
            uiController.showSection(hash);
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            const navLink = document.querySelector(`.nav-link[data-section="${hash}"]`);
            if (navLink) navLink.classList.add('active');
        }
    }
    
    console.log('🗄️ Database Learning Hub initialized!');
    console.log(`Progress: ${progressTracker.getProgress().completed}/${progressTracker.getProgress().total} topics`);
});
