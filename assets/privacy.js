(function () {
  'use strict';

  var pt = document.documentElement.lang.toLowerCase().indexOf('pt') === 0;
  var key = 'da-store-analytics-consent-v1';
  var consent = null;

  try {
    consent = localStorage.getItem(key);
  } catch (e) {}

  var text = pt ? {
    title: 'Privacidade e cookies',
    description: 'Com sua autorização, usamos Google Tag Manager (que pode executar Google Analytics) e Microsoft Clarity para medir visitas e entender o uso do site. Essas ferramentas podem usar cookies e coletar dados de navegação, inclusive interações com a página. Dados podem ser tratados fora do Brasil. Sua escolha fica salva neste navegador e pode ser alterada em “Privacidade e cookies”.',
    accept: 'Aceitar análise',
    reject: 'Rejeitar análise',
    manage: 'Privacidade e cookies',
    contact: 'Para solicitar informações ou exercer seus direitos, entre em contato:',
    video: 'Reproduzir vídeo',
    videoInfo: 'Ao reproduzir, você se conecta ao YouTube, que pode coletar dados de navegação.'
  } : {
    title: 'Privacy and cookies',
    description: 'With your permission, we use Google Tag Manager (which may run Google Analytics) and Microsoft Clarity to measure visits and understand site use. These tools may use cookies and collect browsing data, including page interactions. Data may be processed outside your country. Your choice is stored in this browser and can be changed under “Privacy and cookies”.',
    accept: 'Accept analytics',
    reject: 'Reject analytics',
    manage: 'Privacy and cookies',
    contact: 'To request information or exercise your rights, contact:',
    video: 'Play video',
    videoInfo: 'Playing this video connects you to YouTube, which may collect browsing data.'
  };

  window.dataLayer = window.dataLayer || [];

  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

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

    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    var gtm = document.createElement('script');
    gtm.async = true;
    gtm.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-PR9M3NN3';
    document.head.appendChild(gtm);

    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };

    var clarity = document.createElement('script');
    clarity.async = true;
    clarity.src = 'https://www.clarity.ms/tag/zkbjopify3';
    document.head.appendChild(clarity);
  }

  if (consent === 'accepted') startAnalytics();

  window.addEventListener('storage', function (event) {
    if (event.key === key && event.newValue !== consent) {
      location.reload();
    }
  });

  function clearAnalyticsCookies() {
    document.cookie.split(';').forEach(function (item) {
      var name = item.split('=')[0].trim();

      if (!/^(_ga(?:_.*)?|_gid|_gat(?:_.*)?|_gcl_.*|_clck|_clsk|CLID|ANONCHK|MR|MUID|SM)$/.test(name)) return;

      var expired = name +
        '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax';

      document.cookie = expired;
      document.cookie = expired + '; domain=' + location.hostname;
    });
  }

  function init() {

    var style = document.createElement('style');

    style.textContent = `
      .privacy-panel {
        position: fixed;
        z-index: 9999;
        bottom: 0;
        left: 0;
        right: 0;
        background: #151f2e;
        color: #fff;
        border-top: 1px solid #49627c;
        padding: 20px max(4%, calc((100% - 1120px) / 2));
        box-shadow: 0 -4px 20px #0008;
        font: 16px/1.5 system-ui, sans-serif;
      }

      .privacy-panel[hidden] {
        display: none;
      }

      .privacy-panel p {
        color: #d8e3ef;
        margin: 8px 0;
      }

      .privacy-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 12px;
      }

      .privacy-panel button,
      .privacy-link {
        font: inherit;
        cursor: pointer;
      }

      .privacy-panel button {
        background: #48b4f5;
        color: #081522;
        border: 2px solid #48b4f5;
        border-radius: 6px;
        padding: 9px 15px;
        font-weight: 700;
      }

      .privacy-panel a {
        color: #84d3ff;
      }

      .privacy-link {
        display: inline-block;
        background: none;
        border: 0;
        color: #84d3ff;
        text-decoration: underline;
        padding: 8px;
      }

      /* YouTube privacy facade */

      .privacy-video {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        box-sizing: border-box;
        padding: 3px;
        overflow: hidden;
        isolation: isolate;
        border-radius: 16px;

        background: linear-gradient(
          135deg,
          #00e5ff 0%,
          #48b4f5 22%,
          #0756a8 48%,
          #003363 65%,
          #48b4f5 85%,
          #00e5ff 100%
        );

        box-shadow:
          0 0 12px rgba(0, 195, 255, .35),
          0 0 28px rgba(0, 100, 255, .18),
          0 8px 28px rgba(0, 0, 0, .35);
      }

      .privacy-video-inner {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 13px;
        background: #10151e;
      }

      .privacy-video-thumbnail {
        display: block;
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border: 0;
        border-radius: 0;
        transition: transform .35s ease, filter .35s ease;
      }

      .privacy-video-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          rgba(0, 0, 0, .05) 0%,
          rgba(0, 0, 0, .12) 55%,
          rgba(0, 0, 0, .85) 100%
        );
        pointer-events: none;
      }

      .privacy-video-play {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        background: transparent;
        border: 0;
        cursor: pointer;
        z-index: 2;
      }

      .privacy-video-play svg {
        width: clamp(60px, 11%, 92px);
        height: auto;
        filter: drop-shadow(0 4px 12px rgba(0, 0, 0, .65));
        transition: transform .2s ease;
      }

      .privacy-video-play:hover svg {
        transform: scale(1.12);
      }

      .privacy-video:hover .privacy-video-thumbnail {
        transform: scale(1.025);
        filter: brightness(.9);
      }

      .privacy-video-play:focus-visible {
        outline: 3px solid #48b4f5;
        outline-offset: -6px;
      }

      .privacy-video-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 12px 18px;
        text-align: center;
        pointer-events: none;
        z-index: 3;
      }

      .privacy-video-caption strong {
        display: block;
        color: #fff;
        font: 600 clamp(13px, 2vw, 18px)/1.4 system-ui, sans-serif;
        text-shadow: 0 2px 5px #000;
      }

      .privacy-video-caption p {
        color: #d8e3ef;
        font: 400 clamp(10px, 1.4vw, 12px)/1.4 system-ui, sans-serif;
        margin: 4px 0 0;
      }

      iframe[data-video-src][hidden] {
        display: none !important;
      }

      @media (max-width: 480px) {
        .privacy-video-caption {
          padding: 6px 10px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .privacy-video-thumbnail,
        .privacy-video-play svg {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);

    /* Privacy consent panel */

    var panel = document.createElement('section');

    panel.className = 'privacy-panel';
    panel.setAttribute('aria-label', text.title);

    panel.innerHTML =
      '<strong></strong>' +
      '<p class="privacy-description"></p>' +
      '<p class="privacy-contact"></p>' +
      '<div class="privacy-actions">' +
      '<button type="button" data-choice="accepted"></button>' +
      '<button type="button" data-choice="rejected"></button>' +
      '</div>';

    panel.querySelector('strong').textContent = text.title;
    panel.querySelector('.privacy-description').textContent = text.description;

    var contact = panel.querySelector('.privacy-contact');
    contact.appendChild(document.createTextNode(text.contact + ' '));

    var mail = document.createElement('a');
    mail.href = 'mailto:rdeprera@gmail.com';
    mail.textContent = 'rdeprera@gmail.com';

    contact.appendChild(mail);

    panel.querySelector('[data-choice="accepted"]').textContent = text.accept;
    panel.querySelector('[data-choice="rejected"]').textContent = text.reject;

    panel.hidden = consent === 'accepted' || consent === 'rejected';

    document.body.appendChild(panel);

    panel.addEventListener('click', function (event) {

      var choice = event.target.getAttribute('data-choice');

      if (!choice) return;

      try {
        localStorage.setItem(key, choice);
      } catch (e) {}

      if (choice === 'rejected') {

        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });

        clearAnalyticsCookies();

        if (consent === 'accepted') {
          location.reload();
          return;
        }

      } else if (consent !== 'accepted') {
        startAnalytics();
      }

      consent = choice;
      panel.hidden = true;
    });

    /* Privacy settings link */

    var link = document.createElement('button');

    link.type = 'button';
    link.className = 'privacy-link';
    link.textContent = text.manage;

    link.addEventListener('click', function () {
      panel.hidden = false;
      panel.querySelector('button').focus();
    });

    var footer =
      document.querySelector('footer .wrap') ||
      document.querySelector('footer');

    if (footer) footer.appendChild(link);

    /* YouTube video facade */

    document.querySelectorAll('iframe[data-video-src]').forEach(function (frame) {

      var placeholder = document.createElement('div');
      placeholder.className = 'privacy-video';

      var inner = document.createElement('div');
      inner.className = 'privacy-video-inner';

      var thumbnail = document.createElement('img');
      thumbnail.className = 'privacy-video-thumbnail';

      thumbnail.src =
        frame.getAttribute('data-video-thumbnail') ||
        '/assets/spysat.webp';

      thumbnail.alt = frame.title || 'YouTube video';
      thumbnail.loading = 'lazy';

      var overlay = document.createElement('div');
      overlay.className = 'privacy-video-overlay';

      var button = document.createElement('button');

      button.type = 'button';
      button.className = 'privacy-video-play';
      button.setAttribute('aria-label', text.video);
      button.setAttribute('aria-describedby', 'privacy-video-info');

      button.innerHTML =
        '<svg viewBox="0 0 68 48" aria-hidden="true">' +
        '<rect width="68" height="48" rx="12" fill="#ff0033"/>' +
        '<path d="M27 14 L27 34 L45 24 Z" fill="#ffffff"/>' +
        '</svg>';

      var caption = document.createElement('div');
      caption.className = 'privacy-video-caption';

      var captionTitle = document.createElement('strong');
      captionTitle.textContent = text.video;

      var description = document.createElement('p');
      description.id = 'privacy-video-info';
      description.textContent = text.videoInfo;

      caption.appendChild(captionTitle);
      caption.appendChild(description);

      inner.appendChild(thumbnail);
      inner.appendChild(overlay);
      inner.appendChild(button);
      inner.appendChild(caption);

      placeholder.appendChild(inner);

      frame.parentNode.insertBefore(placeholder, frame);
      frame.hidden = true;

      button.addEventListener('click', function () {

        var videoURL = new URL(
          frame.getAttribute('data-video-src'),
          location.href
        );

        videoURL.searchParams.set('autoplay', '1');
        videoURL.searchParams.set('enablejsapi', '1');
        videoURL.searchParams.set('origin', location.origin);
        videoURL.searchParams.set('rel', '0');
        videoURL.searchParams.set('playsinline', '1');

        if (consent === 'accepted') {
          window.dataLayer.push({
            event: 'youtube_video_load',
            video_provider: 'youtube',
            video_title: frame.title,
            video_url: videoURL.href,
            video_id: videoURL.pathname.split('/').pop()
          });
        }

        frame.loading = 'eager';
        frame.src = videoURL.href;
        frame.hidden = false;

        placeholder.remove();
      });

    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
