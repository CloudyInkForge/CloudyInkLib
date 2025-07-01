// 应用状态
const appState = {
  currentBookId: '',
  books: [],
  chapters: [],
  currentChapterIndex: 0,
  currentParagraphIndex: 0,
  isLoading: true,
  isPlaying: false,
  touchStartY: 0,
  touchThreshold: 30,
  isDarkMode: false,
  isSegmentMode: true,
};

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  initApp().then(() => {
    console.log("应用初始化完成");
  });
});

// 暴露函数给全局作用域
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
window.loadBook = loadBook;