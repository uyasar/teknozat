(function () {
    'use strict';

    // Live date in header
    function updateHeaderDate() {
        var el = document.getElementById('header-date');
        if (!el) return;
        var now = new Date();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        el.textContent = now.toLocaleDateString('en-US', options);
    }

    // Mobile nav toggle
    function initMobileNav() {
        var hamburger = document.querySelector('.nav-hamburger');
        var mobileNav = document.getElementById('nav-mobile');
        var overlay = document.getElementById('nav-overlay');
        var closeBtn = document.querySelector('.nav-mobile-close');

        if (!hamburger || !mobileNav || !overlay) return;

        function openNav() {
            mobileNav.classList.add('is-open');
            overlay.classList.add('is-open');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeNav() {
            mobileNav.classList.remove('is-open');
            overlay.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', openNav);
        overlay.addEventListener('click', closeNav);
        if (closeBtn) closeBtn.addEventListener('click', closeNav);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeNav();
        });
    }

    // Sticky header shrink
    function initStickyHeader() {
        var header = document.querySelector('.site-header');
        if (!header) return;

        var lastScroll = 0;
        var ticking = false;

        window.addEventListener('scroll', function () {
            lastScroll = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    if (lastScroll > 80) {
                        header.classList.add('is-scrolled');
                    } else {
                        header.classList.remove('is-scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Reading progress bar
    function initReadingProgress() {
        var postContent = document.querySelector('.post-content');
        if (!postContent) return;

        var bar = document.createElement('div');
        bar.className = 'reading-progress-bar';
        bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:var(--color-red);width:0;z-index:999;transition:width 0.1s;';
        document.body.appendChild(bar);

        window.addEventListener('scroll', function () {
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
            bar.style.width = Math.min(100, progress) + '%';
        }, { passive: true });
    }

    // Lazy-load images with IntersectionObserver
    function initLazyImages() {
        if (!('IntersectionObserver' in window)) return;

        var lazyImages = document.querySelectorAll('img[loading="lazy"]');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '200px' });

        lazyImages.forEach(function (img) {
            observer.observe(img);
        });
    }

    // External link → open in new tab
    function initExternalLinks() {
        var siteHost = window.location.hostname;
        var links = document.querySelectorAll('.post-content a[href]');
        links.forEach(function (link) {
            try {
                var url = new URL(link.href);
                if (url.hostname !== siteHost) {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            } catch (e) { /* relative URLs */ }
        });
    }

    // Announcement bar dismiss
    function initAnnouncementBar() {
        var btn = document.querySelector('[data-announcement-close]');
        var bar = document.getElementById('gh-announcement-bar');
        if (!btn || !bar) return;
        btn.addEventListener('click', function () {
            bar.style.display = 'none';
        });
    }

    // Init
    document.addEventListener('DOMContentLoaded', function () {
        updateHeaderDate();
        initMobileNav();
        initStickyHeader();
        initReadingProgress();
        initLazyImages();
        initExternalLinks();
        initAnnouncementBar();
    });
}());
