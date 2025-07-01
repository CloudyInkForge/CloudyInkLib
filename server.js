const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/shared', express.static(path.join(__dirname, 'shared')));

// 获取书籍列表
app.get('/api/books', (req, res) => {
  // 修正路径：指向 shared/books/books.json
  const booksPath = path.join(__dirname, 'shared', 'books', 'books.json');
  
  fs.readFile(booksPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`加载书籍列表失败: ${err}`);
      return res.status(404).json({ error: '未找到书籍列表' });
    }
    res.json(JSON.parse(data));
  });
});

// 获取书籍章节
app.get('/api/books/:book/chapters', (req, res) => {
  const bookId = req.params.book;
  // 修正路径：指向书籍目录下的 chapter.json
  const chapterPath = path.join(__dirname, 'shared', 'books', bookId, 'chapter.json');
  
  fs.readFile(chapterPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`加载章节配置失败: ${err}`);
      return res.status(404).json({ error: '未找到章节数据' });
    }
    
    try {
      // 直接返回原始章节对象（键值对格式）
      const chapterData = JSON.parse(data);
      res.json(chapterData);
    } catch (parseError) {
      console.error(`解析章节配置失败: ${parseError}`);
      res.status(500).json({ error: '解析章节配置失败' });
    }
  });
});

// 获取书籍内容（处理特殊字符）
app.get('/api/books/:book/content/*', (req, res) => {
  const bookId = req.params.book;
  const encodedFileName = req.params[0];
  const fileName = decodeURIComponent(encodedFileName);
  
  // 规范化路径
  const contentDir = path.join(__dirname, 'shared', 'books', bookId);
  const normalizedFileName = fileName.replace(/\\/g, '/').replace(/^\/+/, '');
  const filePath = path.join(contentDir, path.normalize(normalizedFileName));
  
  // 检查路径安全性
  if (!filePath.startsWith(contentDir)) {
    return res.status(403).send('非法路径访问');
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`加载章节内容失败: ${err}`);
      return res.status(404).send('内容加载失败');
    }
    res.send(data);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`服务器运行中：http://localhost:${PORT}`);
  console.log('按 Ctrl+C 停止服务器');
});