/* ============================================
   刘森 · 个人网站 — 主脚本
   页面过渡 · 导航 · 动画
   ============================================ */

(function () {
    'use strict';

    // ----- DOM 引用 -----
    const app = document.getElementById('app');
    const pages = document.querySelectorAll('.page');
    const navItems = document.querySelectorAll('.nav-item');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.transition-overlay');

    let currentPage = null;
    let isTransitioning = false;

    // ----- 初始化 -----
    function init() {
        // 读取当前 hash，默认首页
        const hash = window.location.hash.replace('#', '') || 'home';
        showPage(hash, false);

        // 监听 hash 变化
        window.addEventListener('hashchange', onHashChange);

        // 移动端菜单
        navToggle.addEventListener('click', toggleMobileMenu);

        // 点击导航外关闭菜单
        document.addEventListener('click', function (e) {
            if (navLinks.classList.contains('open') &&
                !navLinks.contains(e.target) &&
                !navToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // 内部链接（带 data-nav 属性的按钮/链接）
        document.addEventListener('click', function (e) {
            const link = e.target.closest('[data-nav]');
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    navigateTo(href.replace('#', ''));
                }
            }
        });

        // Intersection Observer — 卡片进入动画
        setupScrollAnimations();

        // 键盘导航
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMobileMenu();
        });
    }

    // ----- 页面切换 -----
    function showPage(name, animate) {
        if (isTransitioning) return;
        if (currentPage === name) return;

        const target = document.getElementById(name);
        if (!target) return;

        if (animate !== false && currentPage !== null) {
            // 执行过渡动画
            isTransitioning = true;

            // 遮罩闪烁
            overlay.classList.add('active');
            setTimeout(function () {
                overlay.classList.remove('active');
            }, 200);

            // 切换页面
            if (currentPage) {
                const oldPage = document.getElementById(currentPage);
                if (oldPage) oldPage.classList.remove('active');
            }
            target.classList.add('active');

            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'instant' });

            setTimeout(function () {
                isTransitioning = false;
                // 为新页面触发入场动画
                triggerPageAnimations(target);
            }, 500);
        } else {
            // 首次加载 / 无动画
            pages.forEach(function (p) { p.classList.remove('active'); });
            target.classList.add('active');
            // 首次加载也触发动画
            setTimeout(function () {
                triggerPageAnimations(target);
            }, 100);
        }

        currentPage = name;

        // 更新导航高亮
        navItems.forEach(function (item) {
            item.classList.toggle('active', item.getAttribute('data-page') === name);
        });

        // 关闭移动端菜单
        closeMobileMenu();
    }

    function onHashChange() {
        const hash = window.location.hash.replace('#', '') || 'home';
        showPage(hash, true);
    }

    function navigateTo(name) {
        if (name === currentPage) return;
        window.location.hash = name;
    }

    // ----- 移动端菜单 -----
    function toggleMobileMenu() {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    }

    function closeMobileMenu() {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
    }

    // ----- 滚动动画 -----
    function setupScrollAnimations() {
        var observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        };

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // 观察所有卡片
        var cards = document.querySelectorAll(
            '.about-card, .skill-card, .project-card, .contact-card, .social-card'
        );
        cards.forEach(function (card) {
            observer.observe(card);
        });

        // 返回 observer 以便后续使用
        return observer;
    }

    // 为新激活的页面重新触发动画
    function triggerPageAnimations(pageEl) {
        // 找到该页面内尚未显示过的卡片
        var cards = pageEl.querySelectorAll(
            '.about-card:not(.visible), .skill-card:not(.visible), .project-card:not(.visible), .contact-card:not(.visible), .social-card:not(.visible)'
        );
        cards.forEach(function (card, i) {
            setTimeout(function () {
                card.classList.add('visible');
            }, i * 80);
        });

        // 技能条动画
        var skillCards = pageEl.querySelectorAll('.skill-card:not(.visible)');
        skillCards.forEach(function (card, i) {
            setTimeout(function () {
                card.classList.add('visible');
            }, i * 100);
        });
    }

    // ----- 启动 -----
    init();

})();
