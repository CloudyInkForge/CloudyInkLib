const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 启用CORS解决跨域问题
app.use(cors());

// 设置静态文件服务
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/shared', express.static(path.join(__dirname, 'shared')));

// 更新章节API路由
app.get('/api/books/:book/chapters', (req, res) => {
  const bookName = req.params.book;
  const chapterPath = path.join(__dirname, 'shared', 'books', bookName, 'chapters.json'); // 文件名修正
  
  fs.readFile(chapterPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`加载章节配置失败: ${err}`);
      return res.status(404).json({ error: '未找到章节数据' });
    }
    
    try {
      const chapterData = JSON.parse(data);
      // 转换为前端需要的格式
      const chapters = Object.entries(chapterData).map(([path, title], index) => ({
        index,
        path,
        title
      }));
      
      res.json(chapters);
    } catch (parseError) {
      console.error(`解析章节配置失败: ${parseError}`);
      res.status(500).json({ error: '解析章节配置失败' });
    }
  });
});

app.get('/api/books/:book/content/:file', (req, res) => {
  const bookName = req.params.book;
  const fileName = req.params.file;
  const contentPath = path.join(__dirname, 'shared', 'books', bookName, fileName);
  
  fs.readFile(contentPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`加载章节内容失败: ${err}`);
      return res.status(404).send('内容加载失败');
    }
    res.send(data);
  });
});

// 处理所有其他路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行中：http://localhost:${PORT}`);
  console.log('按 Ctrl+C 停止服务器');
});