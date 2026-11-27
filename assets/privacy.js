(function () {
  'use strict';
  var pt = document.documentElement.lang.toLowerCase().indexOf('pt') === 0;
  var key = 'da-store-analytics-consent-v1';
  var consent = null;
  try { consent = localStorage.getItem(key); } catch (e) {}
  var text = pt ? {
    title: 'Privacidade e cookies', description: 'Com sua autorização, usamos Google Tag Manager (que pode executar Google Analytics) e Microsoft Clarity para medir visitas e entender o uso do site. Essas ferramentas podem usar cookies e coletar dados de navegação, inclusive interações com a página. Dados podem ser tratados fora do Brasil. Sua escolha fica salva neste navegador e pode ser alterada em “Privacidade e cookies”.', accept: 'Aceitar análise', reject: 'Rejeitar análise', manage: 'Privacidade e cookies', contact: 'Para solicitar informações ou exercer seus direitos, entre em contato:', video: 'Carregar vídeo do YouTube', videoInfo: 'Ao carregar o vídeo, você se conecta ao YouTube, que pode coletar dados de navegação.'
  } : {
    title: 'Privacy and cookies', description: 'With your permission, we use Google Tag Manager (which may run Google Analytics) and Microsoft Clarity to measure visits and understand site use. These tools may use cookies and collect browsing data, including page interactions. Data may be processed outside your country. Your choice is stored in this browser and can be changed under “Privacy and cookies”.', accept: 'Accept analytics', reject: 'Reject analytics', manage: 'Privacy and cookies', contact: 'To request information or exercise your rights, contact:', video: 'Load YouTube video', videoInfo: 'Loading the video connects you to YouTube, which may collect browsing data.'
  };
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
  function startAnalytics() {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
    var gtm = document.createElement('script');
    gtm.async = true; gtm.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-KKDBBZ5G';
    document.head.appendChild(gtm);
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    var clarity = document.createElement('script');
    clarity.async = true; clarity.src = 'https://www.clarity.ms/tag/zkbjopify3';
    document.head.appendChild(clarity);
  }
  if (consent === 'accepted') startAnalytics();
  window.addEventListener('storage', function (event) {
    if (event.key === key && event.newValue !== consent) location.reload();
  });
  function clearAnalyticsCookies() {
    var host = location.hostname.split('.');
    document.cookie.split(';').forEach(function (item) {
      var name = item.split('=')[0].trim();
      if (!/^(_ga(?:_.*)?|_gid|_gat(?:_.*)?|_gcl_.*|_clck|_clsk|CLID|ANONCHK|MR|MUID|SM)$/.test(name)) return;
      var expired = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax';
      document.cookie = expired;
      for (var i = 0; i < host.length - 1; i++) document.cookie = expired + '; domain=.' + host.slice(i).join('.');
    });
  }
  function init() {
    var style = document.createElement('style');
    style.textContent = '.privacy-panel{position:fixed;z-index:9999;bottom:0;left:0;right:0;background:#151f2e;color:#fff;border-top:1px solid #49627c;padding:20px max(4%,calc((100% - 1120px)/2));box-shadow:0 -4px 20px #0008;font:16px/1.5 system-ui,sans-serif}.privacy-panel[hidden]{display:none}.privacy-panel p{color:#d8e3ef;margin:8px 0}.privacy-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:12px}.privacy-panel button,.privacy-video button,.privacy-link{font:inherit;cursor:pointer}.privacy-panel button,.privacy-video button{background:#48b4f5;color:#081522;border:2px solid #48b4f5;border-radius:6px;padding:9px 15px;font-weight:700}.privacy-panel a{color:#84d3ff}.privacy-link{display:inline-block;background:none;border:0;color:#84d3ff;text-decoration:underline;padding:8px}.privacy-video{background:#151f2e;border:1px solid #345a7a;border-radius:12px;padding:24px}.privacy-video p{color:#d8e3ef}';
    document.head.appendChild(style);
    var panel = document.createElement('section');
    panel.className = 'privacy-panel'; panel.setAttribute('aria-label', text.title);
    panel.innerHTML = '<strong></strong><p class="privacy-description"></p><p class="privacy-contact"></p><div class="privacy-actions"><button type="button" data-choice="accepted"></button><button type="button" data-choice="rejected"></button></div>';
    panel.querySelector('strong').textContent = text.title;
    panel.querySelector('.privacy-description').textContent = text.description;
    var contact = panel.querySelector('.privacy-contact'); contact.appendChild(document.createTextNode(text.contact + ' '));
    var mail = document.createElement('a'); mail.href = 'mailto:rdeprera@gmail.com'; mail.textContent = 'rdeprera@gmail.com'; contact.appendChild(mail);
    panel.querySelector('[data-choice="accepted"]').textContent = text.accept;
    panel.querySelector('[data-choice="rejected"]').textContent = text.reject;
    panel.hidden = consent === 'accepted' || consent === 'rejected';
    document.body.appendChild(panel);
    panel.addEventListener('click', function (event) {
      var choice = event.target.getAttribute('data-choice');
      if (!choice) return;
      try { localStorage.setItem(key, choice); } catch (e) {}
      if (choice === 'rejected') {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
        clearAnalyticsCookies();
        if (consent === 'accepted') { location.reload(); return; }
      } else if (consent !== 'accepted') startAnalytics();
      consent = choice; panel.hidden = true;
    });
    var link = document.createElement('button'); link.type = 'button'; link.className = 'privacy-link'; link.textContent = text.manage;
    link.addEventListener('click', function () { panel.hidden = false; panel.querySelector('button').focus(); });
    var footer = document.querySelector('footer .wrap') || document.querySelector('footer');
    if (footer) footer.appendChild(link);
    document.querySelectorAll('iframe[data-video-src]').forEach(function (frame) {
      var placeholder = document.createElement('div'); placeholder.className = 'privacy-video';
      var description = document.createElement('p'); description.textContent = text.videoInfo;
      var button = document.createElement('button'); button.type = 'button'; button.textContent = text.video;
      placeholder.appendChild(description); placeholder.appendChild(button); frame.parentNode.insertBefore(placeholder, frame); frame.hidden = true;
      button.addEventListener('click', function () { frame.src = frame.getAttribute('data-video-src'); frame.hidden = false; placeholder.remove(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
