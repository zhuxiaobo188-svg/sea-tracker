<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>海运物流跟踪</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background-color: #f8f9fa; font-family: 'Segoe UI', sans-serif; }
        .navbar-brand { font-weight: bold; color: #0d6efd; display: flex; align-items: center; gap: 10px; }
        .search-box { max-width: 800px; margin: 0 auto; margin-top: 80px; }
        .custom-input { border-right: none; padding: 12px; }
        .input-group-text { background: white; border-left: none; }
        .pill-example { cursor: pointer; font-size: 0.85rem; background: white; border: 1px solid #dee2e6; color: #6c757d; padding: 5px 15px; border-radius: 50px; margin: 0 5px; transition: 0.2s; }
        .pill-example:hover { background: #e9ecef; }
        .empty-state { background: #f1f3f5; border-radius: 12px; padding: 60px 20px; text-align: center; margin-top: 40px; }
        .empty-icon { font-size: 50px; color: #0d6efd; background: #d0e1fd; width: 80px; height: 80px; line-height: 80px; border-radius: 50%; margin: 0 auto 20px; }
        /* 轨迹样式 */
        .timeline { border-left: 2px solid #dee2e6; margin-left: 20px; padding-left: 30px; margin-top: 30px; text-align: left;}
        .timeline-item { position: relative; margin-bottom: 30px; }
        .timeline-item::before { content: ''; position: absolute; left: -36px; top: 5px; width: 14px; height: 14px; background: #0d6efd; border-radius: 50%; }
    </style>
</head>
<body>

    <!-- 顶部导航 -->
    <nav class="navbar bg-white border-bottom px-4">
        <div class="navbar-brand">
            <i class="fa-solid fa-ship fa-lg"></i>
            <div>
                <div style="line-height:1; font-size:1.2rem;">海运物流跟踪</div>
                <div style="font-size:0.7rem; color:#6c757d; font-weight:normal;">海洋货运物流</div>
            </div>
        </div>
        <div class="text-muted"><i class="fa-solid fa-language"></i> EN</div>
    </nav>

    <!-- 主内容区 -->
    <div class="container text-center search-box">
        <h2 class="fw-bold mb-2">跟踪您的货物</h2>
        <p class="text-muted mb-4">输入跟踪单号查看实时货物状态</p>

        <!-- 搜索框 -->
        <div class="input-group shadow-sm mb-3">
            <span class="input-group-text bg-white border-end-0 ps-3"><i class="fa-solid fa-magnifying-glass text-muted"></i></span>
            <input type="text" id="searchInput" class="form-control custom-input border-start-0" placeholder="输入跟踪单号 ( 例如 : MAEU123456789 )">
            <button class="btn btn-primary px-4 fw-bold" onclick="track()">查询</button>
        </div>

        <!-- 示例单号 -->
        <div class="mb-4">
            <span class="text-muted small me-2">试试这些示例跟踪单号 :</span>
            <span class="pill-example" onclick="setDemo('MAEU123456789')">MAEU123456789</span>
            <span class="pill-example" onclick="setDemo('COSC0987654321')">COSC0987654321</span>
        </div>

        <!-- 空状态展示 (默认显示这个) -->
        <div id="emptyState" class="empty-state">
            <div class="empty-icon"><i class="fa-solid fa-ship"></i></div>
            <h5 class="fw-bold">输入跟踪单号开始查询</h5>
            <p class="text-muted small mb-0">跟踪您的海运货物，查看船舶位置、预计到达时间和货物运输里程碑等详细信息。</p>
        </div>

        <!-- 结果展示区 (默认隐藏) -->
        <div id="resultState" class="card shadow-sm mt-4 p-4" style="display: none;">
            <h5 class="text-start border-bottom pb-2">📦 运单号: <span id="resNum" class="text-primary"></span></h5>
            <div class="timeline" id="timelineBox"></div>
        </div>
    </div>

    <script>
        function setDemo(val) { document.getElementById('searchInput').value = val; }

        async function track() {
            const num = document.getElementById('searchInput').value;
            if(!num) return alert("请输入单号");

            const res = await fetch('/api/track/' + num);
            const data = await res.json();
            
            const emptyDiv = document.getElementById('emptyState');
            const resultDiv = document.getElementById('resultState');
            const timeline = document.getElementById('timelineBox');

            if(data.logs && data.logs.length > 0) {
                // 有数据，隐藏空状态，显示结果
                emptyDiv.style.display = 'none';
                resultDiv.style.display = 'block';
                document.getElementById('resNum').innerText = num;
                
                let html = '';
                data.logs.forEach(log => {
                    html += `
                    <div class="timeline-item">
                        <div class="fw-bold text-dark">${log.status}</div>
                        <div class="text-muted small"><i class="fa-solid fa-location-dot me-1"></i> ${log.location}</div>
                        <div class="text-secondary small mt-1">${new Date(log.timestamp).toLocaleString()}</div>
                    </div>`;
                });
                timeline.innerHTML = html;
            } else {
                alert("未找到该运单信息，请先去后台录入！");
                emptyDiv.style.display = 'block';
                resultDiv.style.display = 'none';
            }
        }
    </script>
</body>
</html>
