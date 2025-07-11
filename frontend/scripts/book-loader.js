// 加载书籍列表
async function loadBooks() {
  try {
    const response = await fetch('/api/books');
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态码: ${response.status}`);
    }
    
    // 修改后（正确处理数组）
    const booksData = await response.json();
    appState.books = booksData.map(book => ({
      id: book.id,
      title: book.title
    }));
    
    return appState.books;
  } catch (error) {
    console.error('加载书籍列表失败:', error);
    return [];
  }
}

// 加载书籍
async function loadBook(bookId) {
  try {
    appState.currentBookId = bookId;
    appState.chapters = await loadChapters(bookId);
    
    if (appState.chapters.length > 0) {
      await loadChapterContent(0);
      renderTableOfContents();
    }
    
    // 更新UI
    document.getElementById('book-sidebar').classList.add('-translate-x-full');
    document.body.style.overflow = '';
  } catch (error) {
    console.error('加载书籍失败:', error);
    const chapterTitle = document.getElementById('chapter-title');
    const actionHint = document.getElementById('action-hint');
    chapterTitle.textContent = '加载失败';
    actionHint.textContent = '请检查网络连接';
    appState.isLoading = false;
  }
}

// 加载章节配置
async function loadChapters(bookId) {
  try {
    const response = await fetch(`/api/books/${bookId}/chapters`);
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态码: ${response.status}`);
    }
    
    const chapterData = await response.json();
    return Object.entries(chapterData).map(([path, title], index) => ({
      index,
      path,
      title
    }));
  } catch (error) {
    console.error('加载章节配置失败:', error);
    return [];
  }
}

// 加载章节内容
async function loadChapterContent(chapterIndex) {
  try {
    if (!appState.chapters || appState.chapters.length === 0) {
      console.error('章节数据未加载');
      return;
    }

    const chapter = appState.chapters[chapterIndex];
    if (!chapter) return;
    
    // 更新状态
    appState.currentChapterIndex = chapterIndex;
    appState.currentParagraphIndex = 0;
    appState.isPlaying = false;
    
    // 更新标题
    const chapterTitle = document.getElementById('chapter-title');
    const chapterContent = document.getElementById('chapter-content');
    const actionHint = document.getElementById('action-hint');
    const endMessage = document.getElementById('end-message');
    
    chapterTitle.textContent = chapter.title;
    chapterTitle.classList.remove('active');
    void chapterTitle.offsetWidth;
    chapterTitle.classList.add('active');
    
    // 清空内容区
    chapterContent.innerHTML = '';
    endMessage.classList.add('hidden');
    actionHint.style.display = 'block';
    
    // 修复路径问题
    let fixedPath = chapter.path.replace(/\\/g, '/');

      // 确保不以斜杠开头
    if (fixedPath.startsWith('/')) {
      fixedPath = fixedPath.substring(1);
    }
    
    // 加载章节内容文件
    const response = await fetch(`/api/books/${appState.currentBookId}/content/${encodeURIComponent(fixedPath)}`);
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态码: ${response.status}`);
    }
    
    const content = await response.text();
    const paragraphs = content.split('\n')
      .map(p => p.trim())
      .filter(p => p);
    
    // 渲染段落
    paragraphs.forEach((paragraph, index) => {
      const paragraphElement = document.createElement('p');
      paragraphElement.className = 'paragraph-appear smooth-focus';
      paragraphElement.textContent = paragraph;
      
      if (appState.isSegmentMode && index > 0) {
        paragraphElement.style.display = 'none';
      } else {
        paragraphElement.classList.add('active');
      }
      
      chapterContent.appendChild(paragraphElement);
    });
    
    // 更新操作提示
    if (appState.isSegmentMode) {
      actionHint.textContent = '点击或滑动查看下一段';
    } else {
      actionHint.textContent = '本章内容已完整显示';
    }
    
  } catch (error) {
    console.error(`加载章节内容失败 (章节: ${chapterIndex}):`, error);
    const chapterContent = document.getElementById('chapter-content');
    chapterContent.innerHTML = '<p class="text-red-500">内容加载失败</p>';
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

// 显示下一段内容
function showNextParagraph() {
  if (!appState.isSegmentMode) return;
  
  const chapterContent = document.getElementById('chapter-content');
  const paragraphs = chapterContent.querySelectorAll('p');
  const actionHint = document.getElementById('action-hint');
  
  if (appState.currentParagraphIndex >= paragraphs.length - 1) {
    loadNextChapter();
    return;
  }
  
  appState.currentParagraphIndex++;
  const nextParagraph = paragraphs[appState.currentParagraphIndex];
  
  if (appState.currentParagraphIndex > 0) {
    actionHint.style.display = 'none';
  }
  
  nextParagraph.style.display = 'block';
  nextParagraph.classList.remove('paragraph-appear');
  void nextParagraph.offsetWidth;
  nextParagraph.classList.add('paragraph-appear', 'active');
  
  // 平滑滚动到新段落
  nextParagraph.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'center',
    inline: 'nearest'
  });
  
  // 添加高亮效果
  nextParagraph.classList.add('bg-blue-50', 'dark:bg-blue-900/30');
  setTimeout(() => {
    nextParagraph.classList.remove('bg-blue-50', 'dark:bg-blue-900/30');
  }, 1000);
}

// 其他函数保持不变...
4.
// 加载下一章
async function loadNextChapter() {
  if (appState.currentChapterIndex >= appState.chapters.length - 1) {
    showEndMessage();
    return;
  }
  
  appState.currentChapterIndex++;
  appState.currentParagraphIndex = 0;
  await loadChapterContent(appState.currentChapterIndex);
}

// 显示结束消息
function showEndMessage() {
  const chapterContent = document.getElementById('chapter-content');
  const actionHint = document.getElementById('action-hint');
  const endMessage = document.getElementById('end-message');
  
  chapterContent.innerHTML = '';
  actionHint.style.display = 'none';
  endMessage.classList.remove('hidden');
  endMessage.classList.remove('paragraph-appear');
  void endMessage.offsetWidth;
  endMessage.classList.add('paragraph-appear', 'active');
}

// 初始化应用
async function initApp() {
  try {
    // 加载书籍列表
    await loadBooks();
    
    if (appState.books.length > 0) {
      // 默认加载第一本书
      await loadBook(appState.books[0].id);
    } else {
      throw new Error('未找到书籍数据');
    }
    
    appState.isLoading = false;
    updateUI();
    
    // 检查用户偏好设置
    checkUserPreferences();
  } catch (error) {
    console.error('应用初始化失败:', error);
    const chapterTitle = document.getElementById('chapter-title');
    const actionHint = document.getElementById('action-hint');
    chapterTitle.textContent = '加载失败';
    actionHint.textContent = '请检查网络连接';
    appState.isLoading = false;
  }
}

// 暴露函数给全局作用域
window.showNextParagraph = showNextParagraph;
window.loadChapterContent = loadChapterContent;
window.loadNextChapter = loadNextChapter;
window.showEndMessage = showEndMessage;
window.loadBooks = loadBooks;
window.loadBook = loadBook;