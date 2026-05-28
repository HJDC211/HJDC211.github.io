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
    // 3. 阅读进度条
    // ===========================================
    function initProgressBar() {
        var bar = document.getElementById('progressBar');
        if (!bar) return;

        window.addEventListener('scroll', function () {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = Math.min(progress, 100) + '%';
        });
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
    // 启动一切
    // ===========================================
    initParticles();
    initTypewriter();
    initProgressBar();
    initBackToTop();
    initTilt();
    initNav();
    setupScrollAnimations();

})();
