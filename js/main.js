/* ============================================
   刘森 · 个人网站 — 主脚本
   粒子 · 打字机 · 进度条 · 3D倾斜 · 页面过渡
   ============================================ */

(function () {
    'use strict';

    // ===========================================
    // 1. 粒子星空背景
    // ===========================================
    function initParticles() {
        var canvas = document.getElementById('particles');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var w, h, particles = [];

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // 创建粒子
        var count = Math.min(80, Math.floor((w * h) / 12000));
        for (var i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.6 + 0.2,
                pulse: Math.random() * Math.PI * 2
            });
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];

                // 连接附近的粒子
                for (var j = i + 1; j < particles.length; j++) {
                    var q = particles[j];
                    var dx = p.x - q.x, dy = p.y - q.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = 'rgba(201, 160, 80, ' + (0.06 * (1 - dist / 120)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }

                // 呼吸闪烁
                p.pulse += 0.01;
                var pulseAlpha = p.alpha + Math.sin(p.pulse) * 0.15;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(201, 160, 80, ' + pulseAlpha + ')';
                ctx.fill();

                // 光晕
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(201, 160, 80, ' + (pulseAlpha * 0.3) + ')';
                ctx.fill();

                // 移动
                p.x += p.vx;
                p.y += p.vy;

                // 边界回弹
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
            }
            requestAnimationFrame(draw);
        }
        draw();
    }

    // ===========================================
    // 2. 打字机效果
    // ===========================================
    function initTypewriter() {
        var el = document.querySelector('.hero-tagline');
        if (!el) return;
        var fullText = el.textContent.trim();
        var index = 0;
        el.textContent = '';

        function type() {
            if (index < fullText.length) {
                el.textContent += fullText.charAt(index);
                index++;
                setTimeout(type, 80 + Math.random() * 60);
            } else {
                // 打完加闪烁光标，2秒后隐藏
                el.classList.add('typed');
            }
        }

        // 延迟 1 秒开始
        setTimeout(type, 1000);
    }

    // ===========================================
    // 3. 背景音乐播放器
    // ===========================================
    function initMusicPlayer() {
        var player = document.getElementById('musicPlayer');
        var toggle = document.getElementById('musicToggle');
        if (!player || !toggle) return;

        // 创建 audio 元素
        var audio = new Audio('assets/bgm.mp3');
        audio.loop = true;
        audio.volume = 0.4;

        var playing = false;

        function playMusic() {
            audio.play().then(function () {
                playing = true;
                player.classList.add('playing');
                player.classList.remove('paused');
            }).catch(function () {
                // 浏览器拦截自动播放，静默处理
                player.classList.add('paused');
                playing = false;
            });
        }

        function pauseMusic() {
            audio.pause();
            playing = false;
            player.classList.add('paused');
            player.classList.remove('playing');
        }

        toggle.addEventListener('click', function () {
            if (playing) {
                pauseMusic();
            } else {
                playMusic();
            }
        });

        // 页面加载后尝试自动播放（用户首次交互后）
        var autoPlayTried = false;
        function tryAutoPlay() {
            if (autoPlayTried) return;
            autoPlayTried = true;
            playMusic();
            // 移除一次性监听器
            document.removeEventListener('click', tryAutoPlay);
            document.removeEventListener('keydown', tryAutoPlay);
            document.removeEventListener('touchstart', tryAutoPlay);
            document.removeEventListener('scroll', tryAutoPlay);
        }
        document.addEventListener('click', tryAutoPlay, { once: true });
        document.addEventListener('keydown', tryAutoPlay, { once: true });
        document.addEventListener('touchstart', tryAutoPlay, { once: true });
        document.addEventListener('scroll', tryAutoPlay, { once: true });

        // 也直接尝试（部分浏览器允许）
        playMusic();
    }

    // ===========================================
    // 4. 回到顶部按钮
    // ===========================================
    function initBackToTop() {
        var btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', function () {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (scrollTop > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===========================================
    // 5. 卡片 3D 倾斜效果
    // ===========================================
    function initTilt() {
        var cards = document.querySelectorAll('.about-card, .skill-card, .project-card, .contact-card, .social-card');

        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateX = (y - centerY) / centerY * -6;
                var rotateY = (x - centerX) / centerX * 6;

                card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-3px)';
                card.style.transition = 'transform 0.1s ease, border-color 0.35s ease, box-shadow 0.35s ease';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
                card.style.transition = 'transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1), border-color 0.35s ease, box-shadow 0.35s ease';
            });
        });
    }

    // ===========================================
    // 6. 页面导航系统（保留原有逻辑）
    // ===========================================
    var pages = document.querySelectorAll('.page');
    var navItems = document.querySelectorAll('.nav-item');
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');
    var overlay = document.querySelector('.transition-overlay');
    var currentPage = null;
    var isTransitioning = false;

    function initNav() {
        var hash = window.location.hash.replace('#', '') || 'home';
        showPage(hash, false);

        window.addEventListener('hashchange', onHashChange);

        navToggle.addEventListener('click', toggleMobileMenu);

        document.addEventListener('click', function (e) {
            if (navLinks.classList.contains('open') &&
                !navLinks.contains(e.target) &&
                !navToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        document.addEventListener('click', function (e) {
            var link = e.target.closest('[data-nav]');
            if (link) {
                e.preventDefault();
                var href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    navigateTo(href.replace('#', ''));
                }
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMobileMenu();
        });
    }

    function showPage(name, animate) {
        if (isTransitioning) return;
        if (currentPage === name) return;

        var target = document.getElementById(name);
        if (!target) return;

        if (animate !== false && currentPage !== null) {
            isTransitioning = true;
            overlay.classList.add('active');
            setTimeout(function () { overlay.classList.remove('active'); }, 200);

            if (currentPage) {
                var oldPage = document.getElementById(currentPage);
                if (oldPage) oldPage.classList.remove('active');
            }
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'instant' });

            setTimeout(function () {
                isTransitioning = false;
                triggerPageAnimations(target);
            }, 500);
        } else {
            pages.forEach(function (p) { p.classList.remove('active'); });
            target.classList.add('active');
            setTimeout(function () { triggerPageAnimations(target); }, 100);
        }

        currentPage = name;
        navItems.forEach(function (item) {
            item.classList.toggle('active', item.getAttribute('data-page') === name);
        });
        closeMobileMenu();
    }

    function onHashChange() {
        var hash = window.location.hash.replace('#', '') || 'home';
        showPage(hash, true);
    }

    function navigateTo(name) {
        if (name === currentPage) return;
        window.location.hash = name;
    }

    function toggleMobileMenu() {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    }

    function closeMobileMenu() {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
    }

    function triggerPageAnimations(pageEl) {
        var cards = pageEl.querySelectorAll(
            '.about-card:not(.visible), .skill-card:not(.visible), .project-card:not(.visible), .contact-card:not(.visible), .social-card:not(.visible)'
        );
        cards.forEach(function (card, i) {
            setTimeout(function () { card.classList.add('visible'); }, i * 80);
        });

        var skillCards = pageEl.querySelectorAll('.skill-card:not(.visible)');
        skillCards.forEach(function (card, i) {
            setTimeout(function () { card.classList.add('visible'); }, i * 100);
        });

        // 重新绑定 tilt 效果
        initTilt();
    }

    function setupScrollAnimations() {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

        document.querySelectorAll(
            '.about-card, .skill-card, .project-card, .contact-card, .social-card'
        ).forEach(function (card) { observer.observe(card); });
    }

    // ===========================================
    // 7. 技能雷达图
    // ===========================================
    // 技能数据 — 从 .skill-fill 中读取，也可在此直接定义后备值
    var radarSkills = [
        { name: '视频剪辑', value: 80 },
        { name: '文档处理', value: 85 },
        { name: '文档规范', value: 80 },
        { name: '数码知识', value: 75 },
        { name: '游戏理解', value: 70 },
        { name: '协助沟通', value: 82 }
    ];

    function initRadarChart() {
        var canvas = document.getElementById('radarChart');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var size = canvas.width;  // 340
        var cx = size / 2, cy = size / 2;
        var radius = 120;
        var levels = 5;  // 5 层同心多边形
        var n = radarSkills.length;  // 6 边形
        var angleStep = (Math.PI * 2) / n;
        var startAngle = -Math.PI / 2;  // 从顶部开始

        // 取出数值
        var values = radarSkills.map(function (s) { return s.value; });

        // 动画变量
        var animProgress = 0;
        var animating = false;

        // 读 skill-card 里的进度条数值
        var bars = document.querySelectorAll('.skill-fill');
        if (bars.length === n) {
            bars.forEach(function (bar, i) {
                var w = bar.style.getPropertyValue('--w');
                if (w) values[i] = parseInt(w);
            });
        }

        function getPoint(i, r, centerX, centerY) {
            var angle = startAngle + i * angleStep;
            return {
                x: (centerX || cx) + r * Math.cos(angle),
                y: (centerY || cy) + r * Math.sin(angle)
            };
        }

        function drawFrame() {
            ctx.clearRect(0, 0, size, size);

            // 背景网格
            for (var level = 1; level <= levels; level++) {
                var r = (radius / levels) * level;
                ctx.beginPath();
                for (var i = 0; i < n; i++) {
                    var pt = getPoint(i, r);
                    if (i === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                }
                ctx.closePath();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // 填充最低层
                if (level === 1) {
                    ctx.fillStyle = 'rgba(201, 160, 80, 0.03)';
                    ctx.fill();
                }
            }

            // 轴线
            for (var i = 0; i < n; i++) {
                var pt = getPoint(i, radius);
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(pt.x, pt.y);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // 刻度点
            for (var level = 1; level <= levels; level++) {
                var r = (radius / levels) * level;
                for (var i = 0; i < n; i++) {
                    var pt = getPoint(i, r);
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                    ctx.fill();
                }
            }
        }

        function drawData(pct) {
            // 清除之前的数据区域（重绘框架 + 数据）
            drawFrame();

            // 数据填充区域
            var dataR = (radius / levels) * levels;  // 满半径
            ctx.beginPath();
            for (var i = 0; i < n; i++) {
                var val = values[i] * pct / 100;
                var r = (val / 100) * dataR;
                var pt = getPoint(i, r);
                if (i === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
            }
            ctx.closePath();

            // 填充渐变
            var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, dataR);
            grad.addColorStop(0, 'rgba(201, 160, 80, 0.35)');
            grad.addColorStop(1, 'rgba(201, 160, 80, 0.05)');
            ctx.fillStyle = grad;
            ctx.fill();

            // 描边
            ctx.strokeStyle = 'rgba(201, 160, 80, 0.7)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 顶点圆点
            for (var i = 0; i < n; i++) {
                var val = values[i] * pct / 100;
                var r = (val / 100) * dataR;
                var pt = getPoint(i, r);
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = 'var(--accent)';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#d4b060';
                ctx.fill();
                // 光晕
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(201, 160, 80, 0.3)';
                ctx.fill();
            }
        }

        function drawLabels() {
            var labelR = radius + 30;
            for (var i = 0; i < n; i++) {
                var pt = getPoint(i, labelR);
                ctx.fillStyle = '#999';
                ctx.font = '12px "PingFang SC", "Microsoft YaHei", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(radarSkills[i].name, pt.x, pt.y);

                // 数值
                var valPt = getPoint(i, labelR + 16);
                ctx.fillStyle = '#c9a050';
                ctx.font = 'bold 11px "PingFang SC", "Microsoft YaHei", sans-serif';
                ctx.fillText(values[i] + '%', valPt.x, valPt.y);
            }
        }

        function animateRadar() {
            if (animating) return;
            animating = true;
            animProgress = 0;
            var start = null;
            var duration = 1200;

            function step(ts) {
                if (!start) start = ts;
                var elapsed = ts - start;
                var p = Math.min(elapsed / duration, 1);
                // easeOutCubic
                var eased = 1 - Math.pow(1 - p, 3);
                animProgress = eased * 100;
                drawData(animProgress);
                drawLabels();
                if (p < 1) {
                    requestAnimationFrame(step);
                } else {
                    animating = false;
                }
            }
            requestAnimationFrame(step);
        }

        // 初始绘制
        drawFrame();
        drawLabels();

        // 滚动到技能区时触发动画
        var skillsSection = document.getElementById('skills');
        if (skillsSection) {
            var radarObs = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    animateRadar();
                    radarObs.unobserve(skillsSection);
                }
            }, { threshold: 0.3 });
            radarObs.observe(skillsSection);
        }

        // 点击技能页导航时也触发
        window.addEventListener('hashchange', function () {
            if (window.location.hash === '#skills') {
                setTimeout(animateRadar, 500);
            }
        });
    }

    // ===========================================
    // 8. 访客计数器 (JSONP 绕过跨域限制)
    // ===========================================
    function initVisitorCounter() {
        var el = document.getElementById('visitorCount');
        if (!el) return;

        // 优先用 localStorage 记录本设备是否已计数
        var visitedKey = 'liusen-site-visited';
        var hasVisited = localStorage.getItem(visitedKey);
        var count = parseInt(localStorage.getItem('liusen-local-count') || '0', 10);
        if (!hasVisited) {
            count++;
            localStorage.setItem(visitedKey, '1');
            localStorage.setItem('liusen-local-count', count.toString());
        }
        el.innerHTML = '👁️ 本站已被访问 <strong>' + count + '</strong> 次（本设备）';

        // 用 JSONP 方式从 countapi 获取云端计数
        var script = document.createElement('script');
        var callbackName = 'cb_' + Math.random().toString(36).slice(2);
        window[callbackName] = function (data) {
            if (data && data.value) {
                el.innerHTML = '👁️ 你是第 <strong>' + data.value + '</strong> 位访客';
            }
            delete window[callbackName];
            document.body.removeChild(script);
        };
        script.src = 'https://api.countapi.xyz/hit/liusen-website/hjdc211.github.io?callback=' + callbackName;
        script.onerror = function () {
            // 云端不可用，保留本地计数
            delete window[callbackName];
            document.body.removeChild(script);
        };
        document.body.appendChild(script);
    }

    // ===========================================
    // 启动一切
    // ===========================================
    initParticles();
    initTypewriter();
    initMusicPlayer();
    initBackToTop();
    initTilt();
    initRadarChart();
    initVisitorCounter();
    initNav();
    setupScrollAnimations();

})();
