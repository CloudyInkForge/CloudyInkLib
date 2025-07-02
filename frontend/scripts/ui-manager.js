// 检查用户偏好设置
function checkUserPreferences() {
  // 检查深色模式偏好
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedDarkMode = localStorage.getItem('darkMode');
  
  if (savedDarkMode !== null) {
    appState.isDarkMode = savedDarkMode === 'true';
  } else {
    appState.isDarkMode = prefersDark;
  }
  
  // 应用深色模式
  updateDarkMode();
  
  // 检查阅读模式偏好
  const savedReadingMode = localStorage.getItem('readingMode');
  if (savedReadingMode !== null) {
    appState.isSegmentMode = savedReadingMode === 'true';
    updateReadingModeText();
  }
}

// 渲染书籍列表
function renderBookList() {
  const bookList = document.getElementById('book-list');
  bookList.innerHTML = '';
  
  appState.books.forEach(book => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = book.title;
    a.classList.add('block', 'p-2', 'rounded', 'hover:bg-gray-100', 'transition-colors', 'dark:hover:bg-gray-700');
    
    if (book.id === appState.currentBookId) {
      a.classList.add('bg-blue-100', 'dark:bg-blue-900/50');
    }
    
    a.addEventListener('click', (e) => {
      e.preventDefault();
      loadBook(book.id);
    });
    
    li.appendChild(a);
    bookList.appendChild(li);
  });
}

// 打开书籍侧边栏
function openBookSidebar() {
  const bookSidebar = document.getElementById('book-sidebar');
  bookSidebar.classList.remove('-translate-x-full');
  document.body.style.overflow = 'hidden';
  renderBookList();
}

// 关闭书籍侧边栏
function closeBookSidebar() {
  const bookSidebar = document.getElementById('book-sidebar');
  bookSidebar.classList.add('-translate-x-full');
  document.body.style.overflow = '';
}

// 在 ui-manager.js 中添加
function toggleBookSidebar() {
  const bookSidebar = document.getElementById('book-sidebar');
  if (bookSidebar.classList.contains('-translate-x-full')) {
    openBookSidebar();
  } else {
    closeBookSidebar();
  }
}

// 打开目录侧边栏
function openTocSidebar() {
  const tocSidebar = document.getElementById('toc-sidebar');
  tocSidebar.classList.remove('-translate-x-full');
  document.body.style.overflow = 'hidden';
}

// 关闭目录侧边栏
function closeTocSidebar() {
  const tocSidebar = document.getElementById('toc-sidebar');
  tocSidebar.classList.add('-translate-x-full');
  document.body.style.overflow = '';
}

// 切换目录侧边栏
function toggleTocSidebar() {
  const tocSidebar = document.getElementById('toc-sidebar');
  if (tocSidebar.classList.contains('-translate-x-full')) {
    openTocSidebar();
  } else {
    closeTocSidebar();
  }
}

function toggleDarkMode() {
  appState.isDarkMode = !appState.isDarkMode;
  updateDarkMode();
  localStorage.setItem('darkMode', appState.isDarkMode);
}

function updateDarkMode() {
  if (appState.isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// 删除整个 toggleDarkMode 函数中的图标切换逻辑
function toggleDarkMode() {
  appState.isDarkMode = !appState.isDarkMode;
  updateDarkMode();
  localStorage.setItem('darkMode', appState.isDarkMode);
}
// 切换阅读模式
function toggleReadingMode() {
  appState.isSegmentMode = !appState.isSegmentMode;
  updateReadingModeText();
  loadChapterContent(appState.currentChapterIndex);
  localStorage.setItem('readingMode', appState.isSegmentMode);
}

// 更新阅读模式文本
function updateReadingModeText() {
  const readingModeText = document.getElementById('reading-mode-text');
  readingModeText.textContent = appState.isSegmentMode 
    ? '逐段阅读' 
    : '完整阅读';
}

// 更新UI状态
function updateUI() {
  const chapterTitle = document.getElementById('chapter-title');
  const chapterContent = document.getElementById('chapter-content');
  const actionHint = document.getElementById('action-hint');
  
  if (appState.isLoading) {
    chapterTitle.textContent = '加载中...';
    chapterContent.innerHTML = '';
    actionHint.textContent = '';
  }
}
window.toggleDarkMode = toggleDarkMode;
window.toggleReadingMode = toggleReadingMode;
window.toggleTocSidebar = toggleTocSidebar;
window.closeTocSidebar = closeTocSidebar;
window.renderTableOfContents = renderTableOfContents;
window.updateDarkMode = updateDarkMode;
window.updateReadingModeText = updateReadingModeText;
window.checkUserPreferences = checkUserPreferences;
window.openBookSidebar = openBookSidebar;
window.closeBookSidebar = closeBookSidebar;
window.toggleBookSidebar = toggleBookSidebar;