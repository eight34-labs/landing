(function () {
  'use strict';

  // Retrieve configuration from current script tag
  var current = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.indexOf('eight34.js') !== -1) {
        return scripts[i];
      }
    }
    return null;
  })();

  if (!current) return;

  var site = current.getAttribute('data-site');
  if (!site) return;

  var rawEndpoint = current.getAttribute('data-endpoint') || 'https://app.e34labs.com/api/collect';
  var endpoint = (function (url) {
    try {
      return new URL(url, location.href).href;
    } catch (_) {
      return url;
    }
  })(rawEndpoint);

  // Safe localStorage storage with in-memory fallback for blocked/private browsing
  var memoryStorage = {};
  var storage = {
    get: function (k) {
      try {
        return window.localStorage ? window.localStorage.getItem(k) : memoryStorage[k];
      } catch (_) {
        return memoryStorage[k];
      }
    },
    set: function (k, v) {
      try {
        if (window.localStorage) {
          window.localStorage.setItem(k, v);
        } else {
          memoryStorage[k] = v;
        }
      } catch (_) {
        memoryStorage[k] = v;
      }
    }
  };

  var storageKey = '__e34_vid';
  var visitorId = storage.get(storageKey);
  if (!visitorId) {
    visitorId = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : 'e34_' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
    storage.set(storageKey, visitorId);
  }

  // Clean referrer sanitization (omit same-origin, strip query parameters for privacy)
  function getCleanReferrer() {
    var ref = document.referrer;
    if (!ref) return null;
    try {
      var refUrl = new URL(ref);
      if (refUrl.origin === location.origin) return null;
      return (refUrl.origin + refUrl.pathname).slice(0, 512);
    } catch (_) {
      return ref.slice(0, 512);
    }
  }

  // Sanitize custom properties payload
  function sanitizeProperties(props) {
    if (!props || typeof props !== 'object' || Array.isArray(props)) return {};
    var clean = {};
    var keys = Object.keys(props).slice(0, 25);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      var val = props[k];
      if (typeof val === 'string') {
        clean[k.slice(0, 64)] = val.slice(0, 256);
      } else if (typeof val === 'number' || typeof val === 'boolean') {
        clean[k.slice(0, 64)] = val;
      }
    }
    return clean;
  }

  // Shadow-DOM Attribution Tag Injection
  function injectAttributionTag() {
    if (current.getAttribute('data-attribution') === 'false') {
      return;
    }
    if (document.getElementById('e34-attribution-tag')) return;

    var container = document.createElement('div');
    container.id = 'e34-attribution-tag';

    var shadow = container.attachShadow ? container.attachShadow({ mode: 'closed' }) : container;

    var style = document.createElement('style');
    style.textContent = [
      ':host { all: initial; display: inline-block; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }',
      '.e34-tag { display: inline-flex; align-items: center; gap: 5.5px; font-size: 11.5px; letter-spacing: -0.01em; color: inherit; opacity: 0.8; transition: opacity 0.15s ease; text-decoration: none; }',
      '.e34-tag:hover { opacity: 1; }',
      '.e34-link { color: currentColor; font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }',
      '.e34-logo-svg { width: 12px; height: 12px; vertical-align: -1.5px; opacity: 0.9; }'
    ].join(' ');

    var link = document.createElement('a');
    link.className = 'e34-tag';
    link.href = 'https://portfolio.e34labs.com';
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.setAttribute('aria-label', 'Handcrafted by Eight34 Labs');

    var svgIcon = '<svg class="e34-logo-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="currentColor"></rect><path d="M8 9H24M8 16H20M8 23H24" stroke="#ffffff" stroke-width="3" stroke-linecap="round"></path><circle cx="24.5" cy="16" r="2.5" fill="#d7f268"></circle></svg>';

    link.innerHTML = svgIcon + ' Handcrafted by <span class="e34-link">Eight34 Labs</span> ↗';

    shadow.appendChild(style);
    shadow.appendChild(link);

    var target = document.querySelector('footer') || document.body;
    if (target) {
      target.appendChild(container);
    }
  }

  // Core Event Ingestion Dispatch
  function send(name, properties) {
    var reqAttr = current.getAttribute('data-attribution') !== 'false';

    // If attribution is required, ensure tag is injected or verify presence
    if (reqAttr) {
      if (!document.getElementById('e34-attribution-tag')) {
        injectAttributionTag();
      }
      // If the document is ready and the tag is still absent (explicitly removed), stop tracking
      if ((document.readyState === 'interactive' || document.readyState === 'complete') && !document.getElementById('e34-attribution-tag')) {
        return;
      }
    }

    var payload = {
      site: site.slice(0, 64),
      name: (name || 'pageview').slice(0, 64),
      path: (location.pathname + location.search).slice(0, 1024),
      referrer: getCleanReferrer(),
      visitorId: visitorId.slice(0, 64),
      properties: sanitizeProperties(properties)
    };

    var body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      try {
        var sent = navigator.sendBeacon(endpoint, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
        if (sent) return;
      } catch (_) {}
    }

    if (window.fetch) {
      try {
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
          keepalive: true,
          mode: 'cors',
          credentials: 'omit'
        }).catch(function () {});
      } catch (_) {}
    }
  }

  // Public SDK Surface
  window.eight34 = {
    track: function (name, properties) {
      send(name, properties);
    }
  };

  // Initial Load Trigger
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectAttributionTag();
      send('pageview');
    });
  } else {
    injectAttributionTag();
    send('pageview');
  }

  // SPA Route Change Tracking (pushState, replaceState, popstate, astro:page-load)
  var lastTrackedPath = location.pathname + location.search;

  function trackRouteChange() {
    var currentPath = location.pathname + location.search;
    if (currentPath !== lastTrackedPath) {
      lastTrackedPath = currentPath;
      send('pageview');
    }
  }

  var origPushState = history.pushState;
  if (origPushState) {
    history.pushState = function () {
      origPushState.apply(this, arguments);
      setTimeout(trackRouteChange, 0);
    };
  }

  var origReplaceState = history.replaceState;
  if (origReplaceState) {
    history.replaceState = function () {
      origReplaceState.apply(this, arguments);
      setTimeout(trackRouteChange, 0);
    };
  }

  window.addEventListener('popstate', trackRouteChange);
  document.addEventListener('astro:page-load', trackRouteChange);
}());
