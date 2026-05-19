(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const sessionID = params.get('sessionID') || '';
  const lang = params.get('lang') || 'en';
  const device = params.get('device') || 'desktop';
  const rawRgsUrl = params.get('rgs_url') || '';
  const rgsUrl = normalizeRgsUrl(rawRgsUrl);
  const replay = params.get('replay') === 'true' || params.get('replay') === '1';
  const replayParams = {
    game: params.get('game') || '',
    version: params.get('version') || '',
    mode: params.get('mode') || '',
    event: params.get('event') || '',
    currency: params.get('currency') || '',
    amount: params.get('amount') || '',
    social: params.get('social') || ''
  };

  // Whitelist of approved RGS domains — prevents MITM / credential theft
  const ALLOWED_RGS_DOMAINS = [
    'rgs.stake.com',
    'rgs.stake.bet',
    'rgs.stake.games',
    'rgs.stake.us',
    'rgs.stake.co',
    'rgs.stake.ac',
    'rgs.stake.engine',
    'rgs.stakeengine.com',
    'rgs-api.stake.com',
    'api.stakeengine.io',
    'rgs.stakeengine.dev',
    'localhost',
    '127.0.0.1'
  ];

  function isAllowedRgsDomain(hostname) {
    const h = String(hostname || '').toLowerCase().trim();
    if (!h) return false;
    return ALLOWED_RGS_DOMAINS.some(allowed => {
      if (h === allowed) return true;
      // Allow subdomains of whitelisted domains (e.g. eu.rgs.stake.com)
      if (h.endsWith('.' + allowed)) return true;
      return false;
    });
  }

  function normalizeRgsUrl(value) {
    let raw = String(value || '').trim();
    try {
      raw = decodeURIComponent(raw);
    } catch (e) {
      // Malformed URI — reject
      return '';
    }
    if (!raw) return '';

    // Ensure protocol present for URL parsing
    let withProto = raw;
    if (!/^https?:\/\//i.test(raw) && !/^\/\//.test(raw)) {
      withProto = 'https://' + raw.replace(/^\/+/, '');
    } else if (/^\/\//.test(raw)) {
      withProto = 'https:' + raw;
    }

    let parsed;
    try {
      parsed = new URL(withProto);
    } catch (e) {
      return '';
    }

    // SECURITY: Reject non-HTTPS in production
    if (parsed.protocol !== 'https:' && parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') {
      return '';
    }

    // SECURITY: Domain whitelist check
    if (!isAllowedRgsDomain(parsed.hostname)) {
      console.error('[StakeEngineBridge] Rejected RGS URL — domain not whitelisted:', parsed.hostname);
      return '';
    }

    return parsed.origin; // Return sanitized origin only
  }

  function endpoint(path) {
    if (!rgsUrl) throw new Error('Missing rgs_url query parameter');
    return rgsUrl.replace(/\/$/, '') + path;
  }

  const FETCH_TIMEOUT_MS = 30000; // 30 second timeout for RGS requests

  async function fetchWithTimeout(url, options) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function post(path, body) {
    const res = await fetchWithTimeout(endpoint(path), {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body || { sessionID })
    });
    // Validate content-type before parsing
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const err = new Error('Invalid response format from RGS');
      err.status = res.status;
      err.payload = { expected: 'application/json', received: contentType };
      throw err;
    }
    let json;
    try {
      json = await res.json();
    } catch (parseErr) {
      const err = new Error('Failed to parse RGS response');
      err.status = res.status;
      err.cause = parseErr;
      throw err;
    }
    if (!res.ok) {
      const err = new Error(json.code || json.message || 'Stake Engine request failed');
      err.status = res.status;
      err.payload = json;
      throw err;
    }
    return json;
  }

  async function get(path) {
    const res = await fetchWithTimeout(endpoint(path), {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit'
    });
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const err = new Error('Invalid response format from RGS');
      err.status = res.status;
      err.payload = { expected: 'application/json', received: contentType };
      throw err;
    }
    let json;
    try {
      json = await res.json();
    } catch (parseErr) {
      const err = new Error('Failed to parse RGS response');
      err.status = res.status;
      err.cause = parseErr;
      throw err;
    }
    if (!res.ok) {
      const err = new Error(json.code || json.message || 'Stake Engine request failed');
      err.status = res.status;
      err.payload = json;
      throw err;
    }
    return json;
  }

  function replayPath() {
    const required = ['game', 'version', 'mode', 'event'];
    const missing = required.filter(key => !replayParams[key]);
    if (missing.length) throw new Error('Missing replay query parameter: ' + missing.join(', '));
    return '/bet/replay/' +
      encodeURIComponent(replayParams.game) + '/' +
      encodeURIComponent(replayParams.version) + '/' +
      encodeURIComponent(replayParams.mode) + '/' +
      encodeURIComponent(replayParams.event);
  }

  function formatAmount(amount, token) {
    const code = String(token || '').trim().toUpperCase();
    const meta = {
      USD: { symbol: '$', decimals: 2 },
      CAD: { symbol: 'CA$', decimals: 2 },
      JPY: { symbol: '¥', decimals: 0 },
      EUR: { symbol: '€', decimals: 2 },
      RUB: { symbol: '₽', decimals: 2 },
      CNY: { symbol: 'CN¥', decimals: 2 },
      PHP: { symbol: '₱', decimals: 2 },
      INR: { symbol: '₹', decimals: 2 },
      IDR: { symbol: 'Rp', decimals: 0 },
      KRW: { symbol: '₩', decimals: 0 },
      BRL: { symbol: 'R$', decimals: 2 },
      MXN: { symbol: 'MX$', decimals: 2 },
      DKK: { symbol: 'KR', decimals: 2, symbolAfter: true },
      PLN: { symbol: 'zł', decimals: 2, symbolAfter: true },
      VND: { symbol: '₫', decimals: 0, symbolAfter: true },
      TRY: { symbol: '₺', decimals: 2 },
      CLP: { symbol: 'CLP', decimals: 0, symbolAfter: true },
      ARS: { symbol: 'ARS', decimals: 2, symbolAfter: true },
      PEN: { symbol: 'S/', decimals: 2, symbolAfter: true },
      NGN: { symbol: '₦', decimals: 2 },
      SAR: { symbol: 'SAR', decimals: 2, symbolAfter: true },
      ILS: { symbol: 'ILS', decimals: 2, symbolAfter: true },
      AED: { symbol: 'AED', decimals: 2, symbolAfter: true },
      TWD: { symbol: 'NT$', decimals: 2 },
      NOK: { symbol: 'kr', decimals: 2 },
      KWD: { symbol: 'KD', decimals: 2 },
      JOD: { symbol: 'JD', decimals: 2 },
      CRC: { symbol: '₡', decimals: 2 },
      TND: { symbol: 'TND', decimals: 2, symbolAfter: true },
      SGD: { symbol: 'SG$', decimals: 2 },
      MYR: { symbol: 'RM', decimals: 2 },
      OMR: { symbol: 'OMR', decimals: 2, symbolAfter: true },
      QAR: { symbol: 'QAR', decimals: 2, symbolAfter: true },
      BHD: { symbol: 'BD', decimals: 2 },
      XGC: { symbol: 'GC', decimals: 2, symbolAfter: true },
      XSC: { symbol: 'SC', decimals: 2, symbolAfter: true }
    }[code] || { symbol: token || '', decimals: 2, symbolAfter: true };
    const n = Number(amount || 0) / 1000000;
    const formatted = n.toFixed(meta.decimals);
    return meta.symbolAfter ? `${formatted} ${meta.symbol}`.trim() : `${meta.symbol}${formatted}`;
  }

  // SECURITY: sessionID is stored in closure, not directly exposed.
  // Use getSessionID() read-only accessor if needed.
  const _sessionID = sessionID;

  const bridge = {
    // sessionID removed from direct exposure — use getSessionID() instead
    getSessionID: () => _sessionID,
    lang,
    device,
    rgsUrl,
    isReplay: replay,
    replayParams,
    isStakeLaunch: Boolean(rgsUrl && (_sessionID || replay)),
    authenticate: () => post('/wallet/authenticate', { sessionID: _sessionID }),
    balance: () => post('/wallet/balance', { sessionID: _sessionID }),
    play: (amount, mode) => post('/wallet/play', { sessionID: _sessionID, amount, mode }),
    endRound: () => post('/wallet/end-round', { sessionID: _sessionID }),
    event: (event) => post('/bet/event', { sessionID: _sessionID, event }),
    replay: () => get(replayPath()),
    formatAmount,
    refreshBalance: async function() {
      try {
        const resp = await this.balance();
        window.dispatchEvent(new CustomEvent('stake:balance', { detail: resp }));
        return resp;
      } catch (err) {
        window.dispatchEvent(new CustomEvent('stake:error', { detail: err }));
        throw err;
      }
    }
  };

  // Seal the bridge object to prevent tampering
  Object.freeze(bridge);
  window.StakeEngineBridge = bridge;

  const style = document.createElement('style');
  style.textContent = `
    #rtpBtn, #rtpPanel, #demoBonusBtn, [data-debug], .rtp-panel, .rtp-button { display: none !important; }
  `;
  document.head.appendChild(style);

  window.addEventListener('DOMContentLoaded', async () => {
    if (!bridge.isStakeLaunch) {
      window.dispatchEvent(new CustomEvent('stake:local-preview'));
      return;
    }
    try {
      if (bridge.isReplay) {
        // Add language parameter to replay request
        const replayRound = await bridge.replay();
        window.dispatchEvent(new CustomEvent('stake:replay', { detail: replayRound }));
        return;
      }
      const auth = await bridge.authenticate();
      window.dispatchEvent(new CustomEvent('stake:authenticated', { detail: auth }));
    } catch (err) {
      window.dispatchEvent(new CustomEvent('stake:error', { detail: err }));
    }
  });
})();
