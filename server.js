// 后台页 (带登录锁)
    app.get('/admin', (req, res) => {
        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>后台管理</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { background-color: #f0f2f5; height: 100vh; display: flex; align-items: center; justify-content: center; }
                .card { width: 100%; max-width: 400px; border: none; shadow: 0 4px 12px rgba(0,0,0,0.1); }
                #work-area { display: none; } /* 默认隐藏工作区 */
            </style>
        </head>
        <body>
            <!-- 1. 登录锁界面 -->
            <div id="login-area" class="card shadow p-4">
                <h4 class="text-center mb-4">🔒 管理员登录</h4>
                <input type="password" id="login-pass" class="form-control mb-3" placeholder="请输入管理员密码">
                <button onclick="checkLogin()" class="btn btn-dark w-100">进入系统</button>
            </div>

            <!-- 2. 真正的录入界面 (默认隐藏) -->
            <div id="work-area" class="card shadow p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="m-0">🛠 录入数据</h5>
                    <button onclick="logout()" class="btn btn-sm btn-outline-danger">退出</button>
                </div>
                
                <div class="mb-3">
                    <label class="small text-muted">运单号</label>
                    <input id="n" class="form-control" placeholder="例如: CN888">
                </div>
                <div class="mb-3">
                    <label class="small text-muted">状态</label>
                    <select id="s" class="form-select">
                        <option>已揽收</option>
                        <option>装船离港</option>
                        <option>航行中</option>
                        <option>到达目的港</option>
                        <option>已签收</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="small text-muted">当前位置</label>
                    <input id="l" class="form-control" placeholder="例如: 新加坡港">
                </div>
                <!-- 隐藏的密码字段，提交时自动填入 -->
                <input id="k" type="hidden"> 

                <button onclick="sub()" class="btn btn-primary w-100 mt-2">提交更新</button>
                <div id="msg" class="mt-3 text-center small"></div>
            </div>

            <script>
                // 检查登录密码
                function checkLogin() {
                    const p = document.getElementById('login-pass').value;
                    // 这里设置你的页面登录密码，目前设为 admin123
                    if(p === 'admin123') {
                        document.getElementById('login-area').style.display = 'none';
                        document.getElementById('work-area').style.display = 'block';
                        // 自动把密码填入隐藏的字段，方便后续提交
                        document.getElementById('k').value = p; 
                    } else {
                        alert('密码错误！');
                    }
                }

                function logout() {
                    location.reload();
                }

                async function sub() {
                    const btn = document.querySelector('button.btn-primary');
                    btn.disabled = true;
                    btn.innerText = '提交中...';
                    
                    try {
                        const res = await fetch('/api/update', {
                            method:'POST',
                            headers:{'Content-Type':'application/json'},
                            body:JSON.stringify({
                                no: document.getElementById('n').value,
                                status: document.getElementById('s').value,
                                loc: document.getElementById('l').value,
                                key: document.getElementById('k').value // 使用刚才自动填入的密码
                            })
                        });
                        const data = await res.json();
                        const msgDiv = document.getElementById('msg');
                        if(data.success) {
                            msgDiv.innerHTML = '<span class="text-success">✅ 更新成功！</span>';
                            // 清空位置，方便下一次
                            document.getElementById('l').value = '';
                        } else {
                            msgDiv.innerHTML = '<span class="text-danger">❌ ' + data.msg + '</span>';
                        }
                    } catch(e) {
                        alert('提交失败，请检查网络');
                    }
                    
                    btn.disabled = false;
                    btn.innerText = '提交更新';
                }
                
                // 支持按回车登录
                document.getElementById('login-pass').addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') checkLogin();
                });
            </script>
        </body>
        </html>
        `);
    });
