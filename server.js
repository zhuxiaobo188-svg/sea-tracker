const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// 初始化数据库 (注意：Render免费版重启后数据会重置，仅供演示)
const db = new sqlite3.Database(':memory:'); 
// 为了防止报错，这里暂时用内存模式，或者文件模式 'shipping.db'

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tracking_number TEXT,
        status TEXT,
        location TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    // 预设一条数据方便你测试
    db.run(`INSERT INTO logs (tracking_number, status, location) VALUES ('CN888', '已发货', '上海港')`);
});

// API 接口
app.get('/api/track/:id', (req, res) => {
    db.all("SELECT * FROM logs WHERE tracking_number = ? ORDER BY timestamp DESC", [req.params.id], (err, rows) => {
        res.json({ logs: rows || [] });
    });
});

app.post('/api/update', (req, res) => {
    const { no, status, loc, key } = req.body;
    if (key !== 'admin123') return res.json({ success: false, msg: '密码错误' });
    db.run("INSERT INTO logs (tracking_number, status, location) VALUES (?,?,?)", [no, status, loc], (err) => {
        if (err) return res.json({ success: false, msg: err.message });
        res.json({ success: true });
    });
});

// 首页 (客户查询)
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>海运查询</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light p-4">
        <div class="container" style="max-width:600px">
            <div class="card shadow">
                <div class="card-body text-center">
                    <h3>🚢 海运追踪</h3>
                    <p class="text-muted">测试单号: CN888</p>
                    <input id="no" class="form-control mb-3" placeholder="输入单号...">
                    <button onclick="track()" class="btn btn-primary w-100">查询</button>
                    <div id="res" class="mt-4 text-start"></div>
                    <hr>
                    <a href="/admin" class="small">管理员入口</a>
                </div>
            </div>
        </div>
        <script>
            async function track() {
                const no = document.getElementById('no').value;
                const res = await fetch('/api/track/' + no);
                const data = await res.json();
                let h = '';
                if(data.logs && data.logs.length) {
                    data.logs.forEach(l => h += '<div class="alert alert-info"><b>'+l.status+'</b><br>'+l.location+'<br><small>'+l.timestamp+'</small></div>');
                } else { h = '无记录'; }
                document.getElementById('res').innerHTML = h;
            }
        </script>
    </body>
    </html>
    `);
});

app.get
