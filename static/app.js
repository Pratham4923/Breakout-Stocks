lucide.createIcons();

const state = {
  socket: null,
  soundEnabled: true,
  snapshot: null,
  filter: "",
  token: localStorage.getItem("astraveda_token") || null,
  mode: "login",
};

document.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;
  document.documentElement.style.setProperty("--mouse-x", `${x}%`);
  document.documentElement.style.setProperty("--mouse-y", `${y}%`);
});

const ids = {
  navCreateBtn: document.getElementById("nav-create-btn"),
  navLaunchBtn: document.getElementById("nav-launch-btn"),
  heroLaunchBtn: document.getElementById("hero-launch-btn"),
  wsDot: document.getElementById("ws-dot"),
  wsLabel: document.getElementById("ws-label"),
  marketStatus: document.getElementById("market-status"),
  lastQuote: document.getElementById("last-quote"),
  trackedSymbols: document.getElementById("tracked-symbols"),
  activeCount: document.getElementById("active-count"),
  recentCount: document.getElementById("recent-count"),
  smcCount: document.getElementById("smc-count"),
  breakoutsTableBody: document.getElementById("breakouts-table-body"),
  breakdownsTableBody: document.getElementById("breakdowns-table-body"),
  smcLiveTableBody: document.getElementById("smc-live-table-body"),
  healStatus: document.getElementById("heal-status"),
  healEvents: document.getElementById("heal-events"),
  streamRestarts: document.getElementById("stream-restarts"),
  referenceFailures: document.getElementById("reference-failures"),
  alerts: document.getElementById("alerts"),
  tableBody: document.getElementById("table-body"),
  smcFeed: document.getElementById("smc-feed"),
  notifyBtn: document.getElementById("notify-btn"),
  soundBtn: document.getElementById("sound-btn"),
  refreshBtn: document.getElementById("refresh-btn"),
  filterInput: document.getElementById("filter-input"),
  authOverlay: document.getElementById("auth-overlay"),
  authPanel: document.getElementById("auth-panel"),
  authKicker: document.getElementById("auth-kicker"),
  authTitle: document.getElementById("auth-title"),
  authCopy: document.getElementById("auth-copy"),
  authSubmitLabel: document.getElementById("auth-submit-label"),
  authSwitchLabel: document.getElementById("auth-switch-label"),
  authSwitchLink: document.getElementById("auth-switch-link"),
  authError: document.getElementById("auth-error"),
  authForm: document.getElementById("auth-form"),
  authIdentifierGroup: document.getElementById("auth-identifier-group"),
  signupFields: document.getElementById("signup-fields"),
  authIdentifier: document.getElementById("auth-identifier"),
  authPassword: document.getElementById("auth-password"),
  signupUsername: document.getElementById("signup-username"),
  signupEmail: document.getElementById("signup-email"),
  signupPhone: document.getElementById("signup-phone"),
  authSubmit: document.getElementById("auth-submit"),
  dashboardShell: document.getElementById("dashboard-shell"),
  superuserNode: document.getElementById("superuser-node"),
  terminalModeLabel: document.getElementById("terminal-mode-label"),
  priceActionTone: document.getElementById("price-action-tone"),
  priceActionBias: document.getElementById("price-action-bias"),
  priceActionTime: document.getElementById("price-action-time"),
  priceActionReading: document.getElementById("price-action-reading"),
};

function websocketUrl() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws?token=${encodeURIComponent(state.token || "")}`;
}

function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  const num = Number(value);
  return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`;
}

function formatTime(iso) {
  if (!iso) return "--:--:--";
  try {
    return new Date(iso).toLocaleTimeString("en-IN", { hour12: false });
  } catch {
    return iso;
  }
}

function setMetricTone(node, tone) {
  if (!node) return;
  node.style.color = tone;
}

function deriveHealingState(scanner = {}) {
  if (scanner.self_healing_status) {
    return scanner.self_healing_status;
  }
  if (scanner.last_error) {
    return "Recovering";
  }
  if ((scanner.stream_restarts || 0) > 0 || (scanner.reference_failures || 0) > 0) {
    return "Monitoring";
  }
  return "Healthy";
}

function healingTone(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("healthy") || normalized.includes("streaming") || normalized.includes("nominal")) {
    return "var(--success)";
  }
  if (normalized.includes("recover") || normalized.includes("self-healing") || normalized.includes("monitor")) {
    return "var(--accent)";
  }
  if (normalized.includes("offline") || normalized.includes("error") || normalized.includes("stale")) {
    return "var(--danger)";
  }
  return "var(--text)";
}

function marketTone(status) {
  return String(status || "").toLowerCase().includes("open") ? "var(--success)" : "var(--danger)";
}

function playAlertTone() {
  if (!state.soundEnabled) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

function setMode(mode) {
  state.mode = mode;
  const isSignup = mode === "signup";
  ids.authPanel.dataset.mode = mode;
  ids.authForm.classList.remove("mode-shift");
  void ids.authForm.offsetWidth;
  ids.authForm.classList.add("mode-shift");
  ids.authKicker.textContent = isSignup ? "Create your desk access" : "Private terminal access";
  ids.authTitle.textContent = isSignup ? "Open your AstraVeda account" : "Enter the intelligence terminal";
  ids.authCopy.textContent = isSignup
    ? "Create your secure trading identity to unlock the live institutional signal stream."
    : "Sign in to resume your market desk with live breakouts, structure shifts, and signal flow.";
  ids.authSubmitLabel.textContent = isSignup ? "Create account" : "Sign in";
  ids.authSwitchLabel.textContent = isSignup ? "Already inside?" : "New to AstraVeda?";
  ids.authSwitchLink.textContent = isSignup ? "Sign in" : "Create account";
  ids.authIdentifierGroup.hidden = isSignup;
  ids.signupFields.hidden = !isSignup;
  ids.authError.textContent = "";
}

function showAuth() {
  document.body.dataset.view = "auth";
}

function hideAuth() {
  if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    window.location.href = "/dashboard";
  }
}

function openAuth(mode) {
  setMode(mode);
  history.replaceState(null, "", `${window.location.pathname}${mode === "signup" ? "#create-account" : "#login"}`);
  showAuth();
}

window.logout = function() {
  localStorage.removeItem("astraveda_token");
  state.token = null;
  window.location.href = "/";
};

function renderSnapshot(data) {
  state.snapshot = data;
  const { scanner, smc_signals, movers, recent_alerts } = data;
  const healingStatus = deriveHealingState(scanner);
  const breakouts = movers.filter(isBreakoutMover);
  const breakdowns = movers.filter(isBreakdownMover);

  // Global Telemetry
  ids.trackedSymbols.textContent = scanner.symbols ?? movers.length ?? 0;
  ids.activeCount.textContent = breakouts.length;
  ids.recentCount.textContent = scanner.recent_alerts ?? recent_alerts.length ?? 0;
  ids.smcCount.textContent = smc_signals.length;

  ids.lastQuote.textContent = formatTime(scanner.last_quote_at || movers[0]?.updated_at);
  ids.marketStatus.textContent = scanner.market_status || "UNKNOWN";
  setMetricTone(ids.marketStatus, marketTone(scanner.market_status));

  ids.healStatus.textContent = healingStatus;
  setMetricTone(ids.healStatus, healingTone(healingStatus));
  ids.healEvents.textContent = scanner.self_heal_events ?? 0;
  ids.streamRestarts.textContent = scanner.stream_restarts ?? 0;
  ids.referenceFailures.textContent = scanner.reference_failures ?? 0;
  renderPriceAction(scanner, breakouts, breakdowns);

  renderAlerts(recent_alerts);
  renderTable(movers);
  renderDirectionalTable(ids.breakoutsTableBody, breakouts, "No active breakouts right now.");
  renderDirectionalTable(ids.breakdownsTableBody, breakdowns, "No active breakdowns right now.");
  renderSmc(smc_signals, scanner);
  renderSmcLiveTable(smc_signals);
  lucide.createIcons();
}

function renderPriceAction(scanner, breakouts, breakdowns) {
  const breakoutCount = breakouts.length;
  const breakdownCount = breakdowns.length;
  const bullishAdvantage = breakoutCount - breakdownCount;
  let tone = "Balanced";
  let bias = "Two-way rotation";
  let reading = "Watching for a cleaner directional push.";

  if (bullishAdvantage >= 3) {
    tone = "Expansion";
    bias = "Bullish control";
    reading = "Upside continuation is leading the tape across the session.";
  } else if (bullishAdvantage <= -3) {
    tone = "Pressure";
    bias = "Bearish control";
    reading = "Downside pressure is dominating and breakdowns are leading.";
  } else if (breakoutCount > breakdownCount) {
    tone = "Constructive";
    bias = "Breakouts leading";
    reading = "Buy-side participation is stronger, but structure is still developing.";
  } else if (breakdownCount > breakoutCount) {
    tone = "Defensive";
    bias = "Breakdowns leading";
    reading = "Sell-side activity is stronger, but the move is not fully one-way yet.";
  }

  ids.priceActionTone.textContent = tone;
  ids.priceActionBias.textContent = bias;
  ids.priceActionTime.textContent = formatTime(scanner.last_quote_at);
  ids.priceActionReading.textContent = reading;
}

function isBreakoutMover(mover) {
  return (mover.flags || []).some((flag) => flag.includes("HIGH")) || Number(mover.change_percent) >= 0;
}

function isBreakdownMover(mover) {
  return (mover.flags || []).some((flag) => flag.includes("LOW")) || Number(mover.change_percent) < 0;
}

function renderAlerts(alerts) {
  if (!alerts.length) {
    ids.alerts.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-dim); font-size:0.8rem;">Monitoring for breakthroughs...</div>';
    return;
  }

  ids.alerts.innerHTML = alerts
    .map(
      (alert, index) => `
        <div class="alert-card ${alert.direction.toLowerCase()} ${index === 0 ? "new-alert" : ""}">
          <div class="alert-header">
            <span class="alert-symbol">${alert.display_symbol}</span>
            <span class="alert-time">${formatTime(alert.timestamp)}</span>
          </div>
          <div class="alert-body">
            Cleared <span class="alert-val">${alert.scope}</span> @ <span class="alert-val">${formatNumber(alert.price)}</span>
            <div style="margin-top:4px; font-size:0.7rem; color: ${alert.direction === "HIGH" ? "var(--success)" : "var(--danger)"}">
              ${alert.direction === "HIGH" ? "BULLISH SURGE" : "BEARISH CRACK"} ${formatPercent(alert.change_percent)}
            </div>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderTable(movers) {
  const filtered = movers.filter((mover) => mover.symbol.toLowerCase().includes(state.filter));
  if (!filtered.length) {
    ids.tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:100px; color:var(--text-dim);">No active breakouts found.</td></tr>';
    return;
  }

  const now = Date.now();
  ids.tableBody.innerHTML = filtered
    .map(
      (mover) => {
        const isNew = (now - new Date(mover.updated_at).getTime()) < 30000;
        return `
        <tr class="${isNew ? 'new-row-glow' : ''}">
          <td class="symbol-cell">${mover.symbol}</td>
          <td class="price-cell">${formatNumber(mover.price)}</td>
          <nav class="terminal-nav">
          <button class="nav-tab active" data-tab="breakouts">Breakouts</button>
          <button class="nav-tab" data-tab="smc">SMC Intel</button>
          <button class="nav-tab" data-tab="price-action">Price Action</button>
          <button class="nav-tab" data-tab="journal">Journal</button>
        </nav>

        <div class="terminal-actions">
          <div class="status-pill authenticated">
            <span class="pulse"></span>
            <span id="user-display">Authenticated</span>
          </div>
          <td class="price-cell" style="color: ${mover.change_percent >= 0 ? "var(--success)" : "var(--danger)"}">
            ${formatPercent(mover.change_percent)}
          </td>
          <td>
            <div class="tag-container">
              ${mover.flags
                .map(
                  (flag) => `
                    <span class="badge ${flag.includes("HIGH") ? "badge-success" : "badge-danger"}">${flag}</span>
                  `,
                )
                .join("")}
            </div>
          </td>
          <td style="color: var(--text-dim); font-size: 0.8rem;">${formatTime(mover.updated_at)}</td>
        </tr>
      `
      }
    )
    .join("");
}

function renderDirectionalTable(target, movers, emptyMessage) {
  if (!target) return;
  if (!movers.length) {
    target.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:72px 24px; color:var(--text-dim);">${emptyMessage}</td></tr>`;
    return;
  }

  target.innerHTML = movers
    .map(
      (mover) => `
        <tr>
          <td class="symbol-cell">${mover.symbol}</td>
          <td class="price-cell">${formatNumber(mover.price)}</td>
          <td class="price-cell" style="color: ${mover.change_percent >= 0 ? "var(--success)" : "var(--danger)"}">
            ${formatPercent(mover.change_percent)}
          </td>
          <td>
            <div class="tag-container">
              ${(mover.flags || [])
                .map((flag) => `<span class="badge ${flag.includes("HIGH") ? "badge-success" : "badge-danger"}">${flag}</span>`)
                .join("")}
            </div>
          </td>
          <td style="color: var(--text-dim); font-size: 0.8rem;">${formatTime(mover.updated_at)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderSmcLiveTable(signals) {
  if (!ids.smcLiveTableBody) return;
  if (!signals.length) {
    ids.smcLiveTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:72px 24px; color:var(--text-dim);">The SMC board is online and waiting for fresh structure signals.</td></tr>';
    return;
  }

  ids.smcLiveTableBody.innerHTML = signals
    .map(
      (signal) => `
        <tr>
          <td class="symbol-cell">${signal.display_symbol}</td>
          <td>${signal.signal}</td>
          <td><span class="badge ${signal.bias.toLowerCase().includes("bull") ? "badge-success" : signal.bias.toLowerCase().includes("bear") ? "badge-danger" : "badge-blue"}">${signal.bias}</span></td>
          <td class="price-cell">${formatNumber(signal.reference_price)}</td>
          <td class="price-cell">${formatNumber(signal.live_price)}</td>
          <td style="color: var(--text-muted);">${signal.detail}</td>
        </tr>
      `,
    )
    .join("");
}

function renderSmc(signals, scanner = {}) {
  if (!signals.length) {
    const frameworkStatus = scanner.last_reference_refresh
      ? "Reference map loaded. Waiting for fresh structure displacement."
      : "Preparing structure map and opening reference levels.";
    const frameworkDetail = scanner.tracked_quotes
      ? `${scanner.tracked_quotes} live quotes are flowing through the framework.`
      : "Live quotes will populate the framework as soon as the stream settles.";
    ids.smcFeed.innerHTML = `
      <div class="empty-feed empty-feed-rich">
        <div class="empty-feed-title">SMC Framework is online</div>
        <div class="empty-feed-copy">${frameworkStatus}</div>
        <div class="empty-feed-meta">${frameworkDetail}</div>
      </div>
    `;
    return;
  }

  ids.smcFeed.innerHTML = signals
    .map(
      (signal) => `
        <div class="smc-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div class="smc-title">${signal.display_symbol}</div>
            <span class="badge ${signal.bias.toLowerCase().includes("bull") ? "badge-success" : signal.bias.toLowerCase().includes("bear") ? "badge-danger" : "badge-blue"}">${signal.bias}</span>
          </div>
          <div style="font-size:0.9rem; font-weight:700; margin:4px 0;">${signal.signal}</div>
          <div class="smc-desc">${signal.detail}</div>
          <div style="display:flex; gap:10px; margin-top:8px; font-family:'JetBrains Mono'; font-size:0.75rem;">
            <span style="color:var(--text-dim)">REF: ${formatNumber(signal.reference_price)}</span>
            <span style="color:var(--accent)">LTP: ${formatNumber(signal.live_price)}</span>
          </div>
        </div>
      `,
    )
    .join("");
}

function connect() {
  ids.wsLabel.textContent = "Initializing...";
  const socket = new WebSocket(websocketUrl());
  state.socket = socket;

  socket.onopen = () => {
    ids.wsDot.classList.add("active");
    ids.wsLabel.textContent = "Authenticated";
    ids.terminalModeLabel.textContent = "Live";
    ids.healStatus.textContent = "Linking";
    setMetricTone(ids.healStatus, "var(--accent)");
    socket.send("snapshot");
  };

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === "error") {
      localStorage.removeItem("astraveda_token");
      state.token = null;
      showAuth();
      setMode("login");
      if (state.socket) {
        state.socket.close();
      }
      return;
    }
    if (msg.type === "snapshot") renderSnapshot(msg.data);
    if (msg.type === "alert") {
      playAlertTone();
      if (state.snapshot) {
        state.snapshot.recent_alerts.unshift(msg.data);
        renderAlerts(state.snapshot.recent_alerts);
      }
    }
  };

  socket.onclose = () => {
    ids.wsDot.classList.remove("active");
    ids.wsLabel.textContent = state.token ? "Reconnecting..." : "Locked";
    ids.terminalModeLabel.textContent = state.token ? "Recovering" : "Guest";
    ids.healStatus.textContent = "OFFLINE";
    ids.healStatus.style.color = "var(--danger)";
    if (state.token) {
      setTimeout(connect, 2000);
    }
  };
}

async function initAuth() {
  const isLanding = window.location.pathname === "/" || window.location.pathname === "/index.html";
  
  if (isLanding) {
    if (window.location.hash === "#create-account") {
      openAuth("signup");
    } else if (window.location.hash === "#login") {
      openAuth("login");
    }
  }

  if (!state.token) {
    if (!isLanding) {
      window.location.href = "/";
    }
    return;
  }

  try {
    const response = await fetch(`/api/auth/status?token=${encodeURIComponent(state.token)}`);
    const data = await response.json();
    if (data.authenticated) {
      if (document.getElementById("terminal-mode-label")) {
         document.getElementById("terminal-mode-label").textContent = data.email || "System User";
      }
      if (isLanding) {
        window.location.href = "/dashboard";
        return;
      }
      connect();
      return;
    }
  } catch {
    // fall through to auth screen or redirect
  }

  localStorage.removeItem("astraveda_token");
  state.token = null;
  if (!isLanding) {
    window.location.href = "/";
  } else {
    showAuth();
  }
}

async function submitAuth(event) {
  event.preventDefault();
  ids.authError.textContent = "";

  const password = ids.authPassword.value.trim();
  if (password.length < 6) {
    ids.authError.textContent = "Password must be at least 6 characters.";
    return;
  }

  let endpoint = "/api/auth/login";
  let payload = {};

  if (state.mode === "signup") {
    const username = ids.signupUsername.value.trim();
    const email = ids.signupEmail.value.trim();
    const phone = ids.signupPhone.value.trim();
    if (!username || !email || !phone) {
      ids.authError.textContent = "Fill in username, email, and phone to create an account.";
      return;
    }
    endpoint = "/api/auth/register";
    payload = { username, email, phone, password };
  } else {
    const identifier = ids.authIdentifier.value.trim();
    if (!identifier) {
      ids.authError.textContent = "Enter your username, email, or phone number.";
      return;
    }
    payload = { identifier, password };
  }

  ids.authSubmit.disabled = true;
  ids.authSubmitLabel.textContent = state.mode === "signup" ? "Creating..." : "Signing in...";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!data.ok) {
      ids.authError.textContent = data.message || "Authentication failed.";
      return;
    }

    state.token = data.token;
    localStorage.setItem("astraveda_token", data.token);
    hideAuth();
  } catch {
    ids.authError.textContent = "The terminal could not reach the auth service. Try again.";
  } finally {
    ids.authSubmit.disabled = false;
    ids.authSubmitLabel.textContent = state.mode === "signup" ? "Create account" : "Sign in";
  }
}

ids.authSwitchLink.onclick = () => openAuth(state.mode === "login" ? "signup" : "login");
ids.authForm.onsubmit = submitAuth;
ids.navCreateBtn.onclick = () => {
  openAuth("signup");
};
ids.navLaunchBtn.onclick = () => {
  openAuth("login");
};
ids.heroLaunchBtn.onclick = () => {
  openAuth("login");
};

ids.superuserNode.onclick = () => {
    if (state.token) {
        console.log("Summoning Superuser Overdrive...");
        alert("Superuser Clearance required. Bio-scan in progress...");
    }
};

ids.refreshBtn.onclick = () => {
  if (state.socket) {
    state.socket.send("snapshot");
  }
};

ids.soundBtn.onclick = () => {
  state.soundEnabled = !state.soundEnabled;
  ids.soundBtn.classList.toggle("active", state.soundEnabled);
  ids.soundBtn.querySelector("i").setAttribute("data-lucide", state.soundEnabled ? "volume-2" : "volume-x");
  lucide.createIcons();
};

ids.notifyBtn.onclick = async () => {
  const result = await Notification.requestPermission();
  if (result === "granted") {
    ids.notifyBtn.classList.add("active");
    ids.notifyBtn.querySelector("i").setAttribute("data-lucide", "bell");
    lucide.createIcons();
  }
};

ids.filterInput.oninput = (event) => {
  state.filter = event.target.value.toLowerCase();
  if (state.snapshot) renderTable(state.snapshot.movers);
};

setMode("login");
initAuth();
