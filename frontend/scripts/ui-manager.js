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

// 渲染目录
function renderTableOfContents() {
  const tocList = document.getElementById('toc-list');
  tocList.innerHTML = '';
  
  appState.chapters.forEach(chapter => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = chapter.title;
    a.classList.add('block', 'p-2', 'rounded', 'hover:bg-gray-100', 'transition-colors', 'dark:hover:bg-gray-700');
    
    // 高亮当前章节
    if (chapter.index === appState.currentChapterIndex) {
      a.classList.add('bg-blue-100', 'dark:bg-blue-900/50');
    }
    
    a.addEventListener('click', (e) => {
      e.preventDefault();
      loadChapterContent(chapter.index);
      closeTocSidebar();
    });
    
    li.appendChild(a);
    tocList.appendChild(li);
  });
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

// 切换深色模式
function toggleDarkMode() {
  appState.isDarkMode = !appState.isDarkMode;
  updateDarkMode();
  localStorage.setItem('darkMode', appState.isDarkMode);
}

// 更新深色模式UI
function updateDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  if (appState.isDarkMode) {
    document.documentElement.classList.add('dark');
    darkModeToggle.innerHTML = '<i class="fa fa-sun text-xl"></i><span class="ml-2 hidden md:inline">浅色模式</span>';
  } else {
    document.documentElement.classList.remove('dark');
    darkModeToggle.innerHTML = '<i class="fa fa-moon text-xl"></i><span class="ml-2 hidden md:inline">深色模式</span>';
  }
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