// 设置事件监听器
function setupEventListeners() {
  const tocSidebar = document.getElementById('toc-sidebar');
  const tocBtn = document.getElementById('toc-btn');
  const closeToc = document.getElementById('close-toc');
  const readingModeToggle = document.getElementById('reading-mode-toggle');
  const contentContainer = document.getElementById('content-container');

  // 点击事件 - 查看下一段或开始播放
  document.addEventListener('click', handleDocumentClick);
  
  // 触摸事件 - 滑动查看下一段
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchend', handleTouchEnd);
  
  // 目录按钮点击
  tocBtn.addEventListener('click', toggleTocSidebar);
  
  // 关闭目录按钮点击
  closeToc.addEventListener('click', closeTocSidebar);
  
  // 点击目录以外区域关闭目录
  tocSidebar.addEventListener('click', handleTocSidebarClick);
  
  // 深色模式切换
  document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
  
  // 阅读模式切换
  readingModeToggle.addEventListener('click', toggleReadingMode);
}

// 处理文档点击事件
function handleDocumentClick(e) {
  // 忽略目录相关点击
  if (e.target.closest('#toc-btn') || 
      e.target.closest('#toc-sidebar') || 
      e.target.closest('#dark-mode-toggle') || 
      e.target.closest('#reading-mode-toggle')) {
    return;
  }
  
  if (appState.isLoading) return;
  
  if (!appState.isPlaying) {
    appState.isPlaying = true;
    if (appState.isSegmentMode) {
      const actionHint = document.getElementById('action-hint');
      actionHint.textContent = '点击或滑动查看下一段';
    }
  } else if (appState.isSegmentMode) {
    showNextParagraph();
  }
}

// 处理触摸开始事件
function handleTouchStart(e) {
  appState.touchStartY = e.touches[0].clientY;
}

// 处理触摸结束事件
function handleTouchEnd(e) {
  if (appState.isLoading || !appState.isSegmentMode) return;
  
  const touchEndY = e.changedTouches[0].clientY;
  const touchDiff = appState.touchStartY - touchEndY;
  
  if (touchDiff > appState.touchThreshold) {
    if (!appState.isPlaying) {
      appState.isPlaying = true;
      const actionHint = document.getElementById('action-hint');
      actionHint.textContent = '点击或滑动查看下一段';
    } else {
      showNextParagraph();
    }
  }
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

// 处理目录侧边栏点击
function handleTocSidebarClick(e) {
  const tocSidebar = document.getElementById('toc-sidebar');
  if (e.target === tocSidebar) {
    closeTocSidebar();
  }
}