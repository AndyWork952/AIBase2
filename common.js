/**
 * 平台管理系统 - 公共脚本
 * 负责：顶部导航渲染/高亮、左侧导航渲染/高亮、页面标题注入、布局初始化
 */

(function () {
  'use strict';

  const TOP_NAV = [
    { name: '工作台', href: 'workbench.html' }
  ];

  const SIDE_NAV = [
    { name: '运维管理', href: 'ops-mgmt.html' },
    { name: '组织管理', href: 'org-mgmt.html' },
    { name: '用户管理', href: 'user-mgmt.html' },
    { name: '用户组管理', href: 'user-group-mgmt.html' },
    { name: '角色管理', href: 'role-mgmt.html' },
    { name: '资源池管理', href: 'resource-pool-mgmt.html' },
    { name: '存储卷管理', href: 'storage-volume-mgmt.html' }
  ];

  const BASE_CONTROL_PAGES = ['ops-mgmt.html', 'org-mgmt.html', 'user-mgmt.html', 'user-create.html', 'user-edit.html', 'user-group-mgmt.html', 'role-mgmt.html', 'role-create.html', 'role-edit.html', 'resource-pool-mgmt.html', 'storage-volume-mgmt.html'];

  function toSameDirUrl(fileName) {
    const href = (window.location.href || '').split('#')[0];
    const baseIndex = href.lastIndexOf('/');
    const base = baseIndex === -1 ? href : href.slice(0, baseIndex + 1);
    return base + fileName;
  }

  /**
   * 获取当前页面文件名
   * 支持 file:// 与 http(s):// 协议
   * @returns {string}
   */
  function getCurrentPage() {
    const href = window.location.href;
    const pathname = window.location.pathname;
    const path = pathname || href;
    const segments = path.split('/');
    let filename = (segments[segments.length - 1] || '').replace(/^\//, '');
    if (filename.indexOf('?') > -1) filename = filename.split('?')[0];
    if (!filename) {
      const fromHref = href.split('/').pop() || '';
      filename = fromHref.indexOf('?') > -1 ? fromHref.split('?')[0] : fromHref;
    }
    return filename || 'index.html';
  }

  /**
   * 渲染顶部导航并高亮
   */
  function renderTopNav() {
    const container = document.querySelector('.app-header .top-nav-container');
    if (!container) return;

    const current = getCurrentPage();
    const html = TOP_NAV.map(function (item) {
      const active = item.href === current ? ' is-active' : '';
      return '<a class="top-nav-item' + active + '" href="' + item.href + '">' + item.name + '</a>';
    }).join('');
    container.innerHTML = html;
  }

  /**
   * 渲染用户头像及下拉菜单
   */
  function renderUserAvatar() {
    const header = document.querySelector('.app-header');
    if (!header) return;

    let wrap = document.getElementById('header-user-wrap');
    if (!wrap) {
      const style = document.createElement('style');
      style.textContent = '.header-user-wrap { margin-left: auto; position: relative; }' +
        '.header-user-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; user-select: none; }' +
        '.header-user-avatar:hover { opacity: .9; }' +
        '.header-user-dropdown { position: absolute; top: 100%; right: 0; margin-top: 8px; background: var(--card); border-radius: 8px; box-shadow: 0 6px 16px rgba(0,0,0,.12); min-width: 140px; padding: 4px 0; border: 1px solid var(--border); display: none; z-index: 100; }' +
        '.header-user-dropdown.is-open { display: block; }' +
        '.header-user-dropdown a, .header-user-dropdown span { display: block; padding: 10px 16px; font-size: 14px; color: var(--text); text-decoration: none; cursor: pointer; transition: background .2s; }' +
        '.header-user-dropdown a:hover, .header-user-dropdown span:hover { background: rgba(22, 119, 255, .08); color: var(--primary); }';
      document.head.appendChild(style);

      wrap = document.createElement('div');
      wrap.id = 'header-user-wrap';
      wrap.className = 'header-user-wrap';
      wrap.innerHTML = '<div class="header-user-avatar" title="用户">👤</div>' +
        '<div class="header-user-dropdown">' +
        '<a href="' + toSameDirUrl('personal-center.html') + '">个人中心</a>' +
        '<a href="' + toSameDirUrl('ops-mgmt.html') + '">基础管控管理</a>' +
        '</div>';
      header.appendChild(wrap);

      var avatar = wrap.querySelector('.header-user-avatar');
      var dropdown = wrap.querySelector('.header-user-dropdown');
      avatar.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.toggle('is-open');
      });
      document.addEventListener('click', function () {
        dropdown.classList.remove('is-open');
      });
      dropdown.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }
  }

  /**
   * 渲染侧边导航并按规则显示/隐藏与高亮
   */
  function renderSideNav() {
    const sider = document.querySelector('.app-sider');
    const container = document.querySelector('.app-sider .side-nav-container');
    if (!sider || !container) return;

    const current = getCurrentPage();
    const showSider = BASE_CONTROL_PAGES.indexOf(current) !== -1;

    if (showSider) {
      sider.classList.remove('is-hidden');
      const subPageMap = { 'user-create.html': 'user-mgmt.html', 'user-edit.html': 'user-mgmt.html', 'role-create.html': 'role-mgmt.html', 'role-edit.html': 'role-mgmt.html' };
      const activeHref = subPageMap[current] || current;
      const html = SIDE_NAV.map(function (item) {
        const active = item.href === activeHref ? ' is-active' : '';
        return '<a class="side-nav-item' + active + '" href="' + item.href + '">' + item.name + '</a>';
      }).join('');
      container.innerHTML = html;
    } else {
      sider.classList.add('is-hidden');
      container.innerHTML = '';
    }
  }

  /**
   * 页面加载时初始化布局
   */
  function initLayout() {
    renderTopNav();
    renderSideNav();
    renderUserAvatar();
  }

  window.getCurrentPage = getCurrentPage;
  window.renderTopNav = renderTopNav;
  window.renderSideNav = renderSideNav;
  window.initLayout = initLayout;
})();
