const navCreateBtn = document.getElementById("nav-create-btn");
const navLoginBtn = document.getElementById("nav-login-btn");
const heroLoginBtn = document.getElementById("hero-login-btn");
const heroCreateBtn = document.getElementById("hero-create-btn");

const previewIds = {
  coverage: document.getElementById("preview-coverage"),
  smcCount: document.getElementById("preview-smc-count"),
  tape: document.getElementById("preview-tape"),
  kpis: document.getElementById("preview-kpis"),
  board: document.getElementById("preview-board"),
  pulse: document.getElementById("preview-pulse"),
};

function goTo(path) {
  window.location.href = path;
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

function formatScope(flags = []) {
  return flags[0] || "Watching flow";
}

function renderFallbackPreview() {
  previewIds.tape.innerHTML = `
    <div class="hero-tape-row">
      <span>Preview</span>
      <span>Scanner online</span>
      <strong>Awaiting live momentum</strong>
    </div>
  `;
  previewIds.board.innerHTML = `
    <div class="shot-row"><span>Coverage</span><span>Live</span><span>Scanner online</span></div>
    <div class="shot-row"><span>SMC</span><span>Monitoring</span><span>Structure watch</span></div>
    <div class="shot-row"><span>Desk</span><span>Ready</span><span>Waiting for fresh flow</span></div>
  `;
  previewIds.pulse.innerHTML = `
    <div class="shot-pulse-card">
      <strong>Quiet tape</strong>
      <span>The scanner is online and waiting for the next clean move.</span>
      <em>Preview stays live</em>
    </div>
  `;
}

function renderPreview(snapshot) {
  const scanner = snapshot.scanner || {};
  const movers = snapshot.movers || [];
  const smcSignals = snapshot.smc_signals || [];
  const recentAlerts = snapshot.recent_alerts || [];

  previewIds.coverage.textContent = scanner.symbols ?? 0;
  previewIds.smcCount.textContent = smcSignals.length;
  previewIds.kpis.innerHTML = `
    <span>Coverage ${scanner.symbols ?? 0}</span>
    <span>Active ${scanner.active_breakouts ?? 0}</span>
    <span>SMC ${smcSignals.length}</span>
  `;

  if (movers.length) {
    previewIds.tape.innerHTML = movers.slice(0, 3).map((mover) => `
      <div class="hero-tape-row">
        <span>${mover.symbol}</span>
        <span>${formatScope(mover.flags)}</span>
        <strong>${formatPercent(mover.change_percent)}</strong>
      </div>
    `).join("");

    previewIds.board.innerHTML = movers.slice(0, 3).map((mover) => `
      <div class="shot-row">
        <span>${mover.symbol}</span>
        <span>${formatPercent(mover.change_percent)}</span>
        <span>${formatScope(mover.flags)}</span>
      </div>
    `).join("");
  } else {
    renderFallbackPreview();
  }

  if (recentAlerts.length || smcSignals.length) {
    const alertCards = recentAlerts.slice(0, 2).map((alert) => `
      <div class="shot-pulse-card">
        <strong>${alert.display_symbol}</strong>
        <span>Cleared ${alert.scope} @ ${formatNumber(alert.price)}</span>
        <em>${alert.direction === "HIGH" ? "Bullish surge" : "Bearish pressure"} ${formatPercent(alert.change_percent)}</em>
      </div>
    `);

    const smcCard = smcSignals[0] ? `
      <div class="shot-pulse-card">
        <strong>${smcSignals[0].display_symbol}</strong>
        <span>${smcSignals[0].signal}</span>
        <em>${smcSignals[0].bias}</em>
      </div>
    ` : "";

    previewIds.pulse.innerHTML = [...alertCards, smcCard].join("");
  } else if (movers.length) {
    previewIds.pulse.innerHTML = `
      <div class="shot-pulse-card">
        <strong>${movers[0].symbol}</strong>
        <span>${formatScope(movers[0].flags)} @ ${formatNumber(movers[0].price)}</span>
        <em>${formatPercent(movers[0].change_percent)}</em>
      </div>
    `;
  }
}

async function loadPreview() {
  try {
    const response = await fetch("/api/snapshot");
    const snapshot = await response.json();
    renderPreview(snapshot);
  } catch {
    renderFallbackPreview();
  }
}

navCreateBtn?.addEventListener("click", () => goTo("/create-account"));
navLoginBtn?.addEventListener("click", () => goTo("/login"));
heroLoginBtn?.addEventListener("click", () => goTo("/login"));
heroCreateBtn?.addEventListener("click", () => goTo("/create-account"));

loadPreview();
setInterval(loadPreview, 20000);
