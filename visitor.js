(() => {
  const ua = navigator.userAgent || "";
  const botPattern = /bot|crawler|spider|crawl|facebookexternalhit|discordbot|whatsapp|telegrambot|slurp|bingpreview|uptimerobot/i;
  if (botPattern.test(ua)) return;

  const VISITOR_KEY = "andova_visitor_id";
  const SESSION_KEY = "andova_session_id";
  const SESSION_START = "andova_session_start";
  const PAGES_KEY = "andova_pages";
  const LAST_PAGE = "andova_last_page";
  const LANDING_KEY = "andova_landing_page";
  const RETURNING_KEY = "andova_returning";
  const SOURCE_KEY = "andova_source";
  const SEARCH_KEY = "andova_search_keyword";
  const INTERNAL_NAV_KEY = "andova_internal_nav";
  const HEARTBEAT_MS = 20000;
  const ACTIVE_AFTER_MS = 30000;

  const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const getOrSet = (storage, key, fallback) => {
    let value = storage.getItem(key);
    if (!value) {
      value = fallback();
      storage.setItem(key, value);
    }
    return value;
  };

  const getPageLabel = () => {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    const labels = {
      "/": "Home",
      "/index.html": "Home",
      "/payment.html": "Payment",
      "/blog/blog.html": "Blog",
      "/legal/privacy.html": "Privacy Policy",
      "/legal/terms.html": "Terms of Service",
      "/legal/disclaimer.html": "Disclaimer"
    };
    if (labels[path]) return labels[path];
    if (/\/end-[^/]+\.html$/i.test(path)) return "Control Panel";
    const last = path.split("/").filter(Boolean).pop() || "Home";
    return last.replace(/\.html?$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  };

  const getSource = () => {
    const ref = document.referrer || "";
    if (!ref) return "Direct";
    try {
      const refUrl = new URL(ref);
      const host = refUrl.hostname.replace(/^www\./, "");
      if (/google\./i.test(host)) return "Google";
      if (/bing\.com/i.test(host)) return "Bing";
      if (/yahoo\./i.test(host)) return "Yahoo";
      if (/duckduckgo\.com/i.test(host)) return "DuckDuckGo";
      if (/facebook\.com|fb\.com/i.test(host)) return "Facebook";
      if (/instagram\.com/i.test(host)) return "Instagram";
      if (/t\.co|twitter\.com|x\.com/i.test(host)) return "X/Twitter";
      return host;
    } catch (_) { return ref; }
  };

  const getSearchKeyword = () => {
    const ref = document.referrer || "";
    try {
      const params = new URL(ref).searchParams;
      return params.get("q") || params.get("query") || params.get("text") || "";
    } catch (_) { return ""; }
  };

  const getBrowser = () => {
    const patterns = [
      [/Edg(?:e|A|iOS)?\/([0-9.]+)/i, "Edge"],
      [/OPR\/([0-9.]+)/i, "Opera"],
      [/OPiOS\/([0-9.]+)/i, "Opera"],
      [/SamsungBrowser\/([0-9.]+)/i, "Samsung Internet"],
      [/CriOS\/([0-9.]+)/i, "Chrome"],
      [/Chrome\/([0-9.]+)/i, "Chrome"],
      [/FxiOS\/([0-9.]+)/i, "Firefox"],
      [/Firefox\/([0-9.]+)/i, "Firefox"],
      [/Version\/([0-9.]+).*Safari\//i, "Safari"]
    ];
    for (const [re, name] of patterns) {
      const match = ua.match(re);
      if (match) return `${name}/${match[1]}`;
    }
    return "Unknown";
  };

  const device = /iPad|Tablet|Android(?!.*Mobile)/i.test(ua) ? "Tablet" :
    /Android|iPhone|iPod|Mobile/i.test(ua) ? "Mobile" : "Desktop";
  const os = /Windows NT/i.test(ua) ? "Windows" :
    /Android/i.test(ua) ? "Android" :
    /iPhone|iPad|iPod/i.test(ua) ? "iOS" :
    /Mac OS X/i.test(ua) ? "macOS" :
    /CrOS/i.test(ua) ? "Chrome OS" :
    /Linux/i.test(ua) ? "Linux" : "Unknown";

  try {
    const now = Date.now();
    const existingVisitor = localStorage.getItem(VISITOR_KEY);
    const visitorId = existingVisitor || makeId();
    localStorage.setItem(VISITOR_KEY, visitorId);
    const hadVisitor = Boolean(existingVisitor);
    const sessionId = getOrSet(sessionStorage, SESSION_KEY, makeId);
    const sessionStart = Number(getOrSet(sessionStorage, SESSION_START, () => String(now)));
    const returning = localStorage.getItem(RETURNING_KEY) === "1" || hadVisitor;
    localStorage.setItem(RETURNING_KEY, "1");

    // A new page in the same browsing session is not a new visit.
    sessionStorage.removeItem(INTERNAL_NAV_KEY);

    const page = getPageLabel();
    const previousPage = sessionStorage.getItem(LAST_PAGE) || "";
    const pageSet = new Set(JSON.parse(sessionStorage.getItem(PAGES_KEY) || "[]"));
    pageSet.add(page);
    sessionStorage.setItem(PAGES_KEY, JSON.stringify([...pageSet]));
    sessionStorage.setItem(LAST_PAGE, page);

    if (!sessionStorage.getItem(LANDING_KEY)) sessionStorage.setItem(LANDING_KEY, page);
    if (!sessionStorage.getItem(SOURCE_KEY)) sessionStorage.setItem(SOURCE_KEY, getSource());
    if (!sessionStorage.getItem(SEARCH_KEY)) sessionStorage.setItem(SEARCH_KEY, getSearchKeyword());
    const landingPage = sessionStorage.getItem(LANDING_KEY) || page;
    const sessionSource = sessionStorage.getItem(SOURCE_KEY) || "Direct";
    const sessionSearchKeyword = sessionStorage.getItem(SEARCH_KEY) || "";

    const payload = {
      event: previousPage ? "pageview" : "new",
      visitorId,
      sessionId,
      page,
      landingPage,
      previousPage,
      returning,
      pagesViewed: pageSet.size,
      duration: Math.max(0, Math.floor((now - sessionStart) / 1000)),
      device,
      browser: getBrowser(),
      os,
      source: sessionSource,
      searchKeyword: sessionSearchKeyword,
      referrer: document.referrer || "Direct",
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
      language: navigator.language || "Unknown",
      time: new Date().toISOString()
    };

    const send = (body) => fetch("/api/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true
    }).catch(() => {});

    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 800));
    idle(() => send(payload));

    let activeSent = false;
    const sendActive = () => {
      if (activeSent) return;
      activeSent = true;
      send({ ...payload, event: "active", duration: Math.max(0, Math.floor((Date.now() - sessionStart) / 1000)) });
    };
    const activeTimer = setTimeout(sendActive, ACTIVE_AFTER_MS);

    // Heartbeat keeps the session alive while the page is open. Switching tabs does not end the visit.
    let heartbeatTimer = null;
    const sendHeartbeat = () => {
      send({
        ...payload,
        event: "heartbeat",
        page,
        pagesViewed: new Set(JSON.parse(sessionStorage.getItem(PAGES_KEY) || "[]")).size,
        duration: Math.max(0, Math.floor((Date.now() - sessionStart) / 1000)),
        time: new Date().toISOString()
      });
    };
    heartbeatTimer = setInterval(() => {
      if (!document.hidden) sendHeartbeat();
    }, HEARTBEAT_MS);

    // Mark normal same-site link navigation so it never creates a false "Visitor Left" event.
    document.addEventListener("click", (event) => {
      const anchor = event.target?.closest?.("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      try {
        const target = new URL(anchor.href, location.href);
        if (target.origin === location.origin && target.pathname !== location.pathname) {
          sessionStorage.setItem(INTERNAL_NAV_KEY, "1");
        }
      } catch (_) {}
    }, true);

    const sendExit = () => {
      if (sessionStorage.getItem(INTERNAL_NAV_KEY) === "1") return;
      const pages = JSON.parse(sessionStorage.getItem(PAGES_KEY) || "[]");
      const duration = Math.max(0, Math.floor((Date.now() - sessionStart) / 1000));
      const body = JSON.stringify({
        visitorId,
        sessionId,
        page: sessionStorage.getItem(LAST_PAGE) || page,
        landingPage,
        pages: pages.length,
        duration,
        time: new Date().toISOString()
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/visitor-exit", new Blob([body], { type: "application/json" }));
      }
    };

    // pagehide fires when the page is actually being unloaded/closed. Unlike visibilitychange,
    // it does NOT fire merely because the visitor switches to another browser tab.
    let exitSent = false;
    const sendExitOnce = () => {
      if (exitSent || sessionStorage.getItem(INTERNAL_NAV_KEY) === "1") return;
      exitSent = true;
      sendExit();
    };
    window.addEventListener("pagehide", sendExitOnce, { capture: true });

    window.addEventListener("pageshow", () => {
      if (heartbeatTimer === null) {
        heartbeatTimer = setInterval(() => {
          if (!document.hidden) sendHeartbeat();
        }, HEARTBEAT_MS);
      }
    });

    window.addEventListener("unload", () => {
      clearTimeout(activeTimer);
      clearInterval(heartbeatTimer);
    });
  } catch (_) {}
})();
