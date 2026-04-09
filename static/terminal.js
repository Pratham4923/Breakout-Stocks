lucide.createIcons();

const state = {
  token: localStorage.getItem("astraveda_token") || null,
  socket: null,
  snapshot: null,
  user: null,
  disciplineSummary: null,
  dailyLossState: null,
  journalAnalytics: null,
  aplusSetups: [],
  playbooks: [],
};

const WORKSPACE_LINKS = [
  { href: "/morning-brief", label: "Morning Brief" },
  { href: "/closing-review", label: "Closing Review" },
  { href: "/confluence-engine", label: "Confluence Engine" },
  { href: "/execution-gate", label: "Execution Gate" },
  { href: "/capital-allocation", label: "Capital Allocation" },
  { href: "/desk-restrictions", label: "Desk Restrictions" },
  { href: "/trader-progression", label: "Trader Progression" },
  { href: "/session-checklist", label: "Session Checklist" },
  { href: "/confidence-ladder", label: "Confidence Ladder" },
  { href: "/focus-board", label: "Focus Board" },
  { href: "/missed-opportunities", label: "Missed Opportunities" },
  { href: "/playbook-coverage", label: "Playbook Coverage" },
  { href: "/edge-stability", label: "Edge Stability" },
  { href: "/review-queue", label: "Review Queue" },
  { href: "/theme-tracker", label: "Theme Tracker" },
  { href: "/decision-audit", label: "Decision Audit" },
  { href: "/weekly-review", label: "Weekly Review" },
  { href: "/preparation-score", label: "Preparation Score" },
  { href: "/habit-radar", label: "Habit Radar" },
  { href: "/market-narrative", label: "Market Narrative" },
  { href: "/system-rotation", label: "System Rotation" },
  { href: "/trader-scorecard", label: "Trader Scorecard" },
  { href: "/playbook-compliance", label: "Playbook Compliance" },
  { href: "/setup-quality", label: "Setup Quality" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/trades", label: "Breakout/Breakdown" },
  { href: "/smc", label: "SMC" },
  { href: "/journal", label: "Journal" },
  { href: "/discipline", label: "Discipline" },
  { href: "/daily-loss-lock", label: "Daily Loss Lock" },
  { href: "/aplus-archive", label: "A+ Archive" },
  { href: "/price-action", label: "Price Action" },
  { href: "/toolkit", label: "Toolkit" },
  { href: "/watchlists", label: "Watchlists" },
  { href: "/alerts", label: "Alerts" },
  { href: "/risk-manager", label: "Risk Manager" },
  { href: "/market-breadth", label: "Market Breadth" },
  { href: "/multi-timeframe", label: "Multi-Timeframe" },
  { href: "/strategies", label: "Strategy Lab" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/journal-analytics", label: "Journal Analytics" },
  { href: "/replay", label: "Replay" },
  { href: "/backtest", label: "Backtest" },
  { href: "/video-strategy", label: "Video Strategy" },
];

const ids = {
  welcomeName: document.getElementById("welcome-name"),
  greetingText: document.getElementById("greeting-text"),
  terminalModeLabel: document.getElementById("terminal-mode-label"),
  wsDot: document.getElementById("ws-dot"),
  wsLabel: document.getElementById("ws-label"),
  marketStatus: document.getElementById("market-status"),
  lastQuote: document.getElementById("last-quote"),
  coverageMetric: document.getElementById("coverage-metric"),
  activeMetric: document.getElementById("active-metric"),
  recentMetric: document.getElementById("recent-metric"),
  smcMetric: document.getElementById("smc-metric"),
  dashboardAlerts: document.getElementById("dashboard-alerts"),
  dashboardSmc: document.getElementById("dashboard-smc"),
  briefBias: document.getElementById("brief-bias"),
  briefBiasCopy: document.getElementById("brief-bias-copy"),
  briefRiskPosture: document.getElementById("brief-risk-posture"),
  briefRiskCopy: document.getElementById("brief-risk-copy"),
  briefMandate: document.getElementById("brief-mandate"),
  briefMandateCopy: document.getElementById("brief-mandate-copy"),
  briefGuidance: document.getElementById("brief-guidance"),
  briefLeaders: document.getElementById("brief-leaders"),
  briefFocus: document.getElementById("brief-focus"),
  briefAvoid: document.getElementById("brief-avoid"),
  qualityACount: document.getElementById("quality-a-count"),
  qualityACopy: document.getElementById("quality-a-copy"),
  qualityBestSymbol: document.getElementById("quality-best-symbol"),
  qualityBestCopy: document.getElementById("quality-best-copy"),
  qualityDeskFocus: document.getElementById("quality-desk-focus"),
  qualityFocusCopy: document.getElementById("quality-focus-copy"),
  qualityBoard: document.getElementById("quality-board"),
  qualityNotes: document.getElementById("quality-notes"),
  disciplineScore: document.getElementById("discipline-score"),
  disciplineScoreCopy: document.getElementById("discipline-score-copy"),
  disciplineBreachCount: document.getElementById("discipline-breach-count"),
  disciplineBreachCopy: document.getElementById("discipline-breach-copy"),
  disciplineHighCount: document.getElementById("discipline-high-count"),
  disciplineHighCopy: document.getElementById("discipline-high-copy"),
  disciplineForm: document.getElementById("discipline-form"),
  disciplineRuleType: document.getElementById("discipline-rule-type"),
  disciplineSeverity: document.getElementById("discipline-severity"),
  disciplineSymbol: document.getElementById("discipline-symbol"),
  disciplineNote: document.getElementById("discipline-note"),
  disciplineError: document.getElementById("discipline-error"),
  disciplineSubmit: document.getElementById("discipline-submit"),
  disciplineTopBoard: document.getElementById("discipline-top-board"),
  disciplineBoard: document.getElementById("discipline-board"),
  lossLockStatus: document.getElementById("loss-lock-status"),
  lossLockStatusCopy: document.getElementById("loss-lock-status-copy"),
  lossLockLimit: document.getElementById("loss-lock-limit"),
  lossLockLimitCopy: document.getElementById("loss-lock-limit-copy"),
  lossLockBuffer: document.getElementById("loss-lock-buffer"),
  lossLockBufferCopy: document.getElementById("loss-lock-buffer-copy"),
  lossLockForm: document.getElementById("loss-lock-form"),
  lossLockPnl: document.getElementById("loss-lock-pnl"),
  lossLockNote: document.getElementById("loss-lock-note"),
  lossLockError: document.getElementById("loss-lock-error"),
  lossLockSubmit: document.getElementById("loss-lock-submit"),
  lossLockGuidance: document.getElementById("loss-lock-guidance"),
  aplusForm: document.getElementById("aplus-form"),
  aplusTitle: document.getElementById("aplus-title"),
  aplusSymbol: document.getElementById("aplus-symbol"),
  aplusSetupType: document.getElementById("aplus-setup-type"),
  aplusBias: document.getElementById("aplus-bias"),
  aplusRationale: document.getElementById("aplus-rationale"),
  aplusContextNote: document.getElementById("aplus-context-note"),
  aplusError: document.getElementById("aplus-error"),
  aplusSubmit: document.getElementById("aplus-submit"),
  aplusBoard: document.getElementById("aplus-board"),
  closingTone: document.getElementById("closing-tone"),
  closingToneCopy: document.getElementById("closing-tone-copy"),
  closingDisciplineScore: document.getElementById("closing-discipline-score"),
  closingDisciplineCopy: document.getElementById("closing-discipline-copy"),
  closingAplusCount: document.getElementById("closing-aplus-count"),
  closingAplusCopy: document.getElementById("closing-aplus-copy"),
  closingSummary: document.getElementById("closing-summary"),
  closingCarry: document.getElementById("closing-carry"),
  confluenceBestSymbol: document.getElementById("confluence-best-symbol"),
  confluenceBestCopy: document.getElementById("confluence-best-copy"),
  confluenceHighCount: document.getElementById("confluence-high-count"),
  confluenceHighCopy: document.getElementById("confluence-high-copy"),
  confluenceBiasLink: document.getElementById("confluence-bias-link"),
  confluenceBiasCopy: document.getElementById("confluence-bias-copy"),
  confluenceBoard: document.getElementById("confluence-board"),
  confluenceNotes: document.getElementById("confluence-notes"),
  gateStatus: document.getElementById("gate-status"),
  gateStatusCopy: document.getElementById("gate-status-copy"),
  gateRisk: document.getElementById("gate-risk"),
  gateRiskCopy: document.getElementById("gate-risk-copy"),
  gateBest: document.getElementById("gate-best"),
  gateBestCopy: document.getElementById("gate-best-copy"),
  gateBoard: document.getElementById("gate-board"),
  gateNotes: document.getElementById("gate-notes"),
  allocationMode: document.getElementById("allocation-mode"),
  allocationModeCopy: document.getElementById("allocation-mode-copy"),
  allocationTopWeight: document.getElementById("allocation-top-weight"),
  allocationTopWeightCopy: document.getElementById("allocation-top-weight-copy"),
  allocationConcentration: document.getElementById("allocation-concentration"),
  allocationConcentrationCopy: document.getElementById("allocation-concentration-copy"),
  allocationBoard: document.getElementById("allocation-board"),
  allocationNotes: document.getElementById("allocation-notes"),
  restrictionsLevel: document.getElementById("restrictions-level"),
  restrictionsLevelCopy: document.getElementById("restrictions-level-copy"),
  restrictionsMode: document.getElementById("restrictions-mode"),
  restrictionsModeCopy: document.getElementById("restrictions-mode-copy"),
  restrictionsTrigger: document.getElementById("restrictions-trigger"),
  restrictionsTriggerCopy: document.getElementById("restrictions-trigger-copy"),
  restrictionsBoard: document.getElementById("restrictions-board"),
  restrictionsNotes: document.getElementById("restrictions-notes"),
  progressionLevel: document.getElementById("progression-level"),
  progressionLevelCopy: document.getElementById("progression-level-copy"),
  progressionNext: document.getElementById("progression-next"),
  progressionNextCopy: document.getElementById("progression-next-copy"),
  progressionBlocker: document.getElementById("progression-blocker"),
  progressionBlockerCopy: document.getElementById("progression-blocker-copy"),
  progressionBoard: document.getElementById("progression-board"),
  progressionNotes: document.getElementById("progression-notes"),
  checklistState: document.getElementById("checklist-state"),
  checklistStateCopy: document.getElementById("checklist-state-copy"),
  checklistPriority: document.getElementById("checklist-priority"),
  checklistPriorityCopy: document.getElementById("checklist-priority-copy"),
  checklistHardRule: document.getElementById("checklist-hard-rule"),
  checklistHardRuleCopy: document.getElementById("checklist-hard-rule-copy"),
  checklistBoard: document.getElementById("checklist-board"),
  checklistNotes: document.getElementById("checklist-notes"),
  confidenceState: document.getElementById("confidence-state"),
  confidenceStateCopy: document.getElementById("confidence-state-copy"),
  confidenceSize: document.getElementById("confidence-size"),
  confidenceSizeCopy: document.getElementById("confidence-size-copy"),
  confidenceReason: document.getElementById("confidence-reason"),
  confidenceReasonCopy: document.getElementById("confidence-reason-copy"),
  confidenceBoard: document.getElementById("confidence-board"),
  confidenceNotes: document.getElementById("confidence-notes"),
  focusTheme: document.getElementById("focus-theme"),
  focusThemeCopy: document.getElementById("focus-theme-copy"),
  focusWidth: document.getElementById("focus-width"),
  focusWidthCopy: document.getElementById("focus-width-copy"),
  focusIgnoreCount: document.getElementById("focus-ignore-count"),
  focusIgnoreCopy: document.getElementById("focus-ignore-copy"),
  focusBoard: document.getElementById("focus-board"),
  focusNotes: document.getElementById("focus-notes"),
  missedCount: document.getElementById("missed-count"),
  missedCountCopy: document.getElementById("missed-count-copy"),
  missedLead: document.getElementById("missed-lead"),
  missedLeadCopy: document.getElementById("missed-lead-copy"),
  missedLesson: document.getElementById("missed-lesson"),
  missedLessonCopy: document.getElementById("missed-lesson-copy"),
  missedBoard: document.getElementById("missed-board"),
  missedNotes: document.getElementById("missed-notes"),
  coverageCovered: document.getElementById("coverage-covered"),
  coverageCoveredCopy: document.getElementById("coverage-covered-copy"),
  coverageThin: document.getElementById("coverage-thin"),
  coverageThinCopy: document.getElementById("coverage-thin-copy"),
  coverageBest: document.getElementById("coverage-best"),
  coverageBestCopy: document.getElementById("coverage-best-copy"),
  coverageBoard: document.getElementById("coverage-board"),
  coverageNotes: document.getElementById("coverage-notes"),
  edgeState: document.getElementById("edge-state"),
  edgeStateCopy: document.getElementById("edge-state-copy"),
  edgeScore: document.getElementById("edge-score"),
  edgeScoreCopy: document.getElementById("edge-score-copy"),
  edgeLeak: document.getElementById("edge-leak"),
  edgeLeakCopy: document.getElementById("edge-leak-copy"),
  edgeBoard: document.getElementById("edge-board"),
  edgeNotes: document.getElementById("edge-notes"),
  reviewQueueSize: document.getElementById("review-queue-size"),
  reviewQueueSizeCopy: document.getElementById("review-queue-size-copy"),
  reviewTopItem: document.getElementById("review-top-item"),
  reviewTopItemCopy: document.getElementById("review-top-item-copy"),
  reviewTheme: document.getElementById("review-theme"),
  reviewThemeCopy: document.getElementById("review-theme-copy"),
  reviewQueueBoard: document.getElementById("review-queue-board"),
  reviewQueueNotes: document.getElementById("review-queue-notes"),
  themeLead: document.getElementById("theme-lead"),
  themeLeadCopy: document.getElementById("theme-lead-copy"),
  themeAlignment: document.getElementById("theme-alignment"),
  themeAlignmentCopy: document.getElementById("theme-alignment-copy"),
  themeReviewBias: document.getElementById("theme-review-bias"),
  themeReviewBiasCopy: document.getElementById("theme-review-bias-copy"),
  themeBoard: document.getElementById("theme-board"),
  themeNotes: document.getElementById("theme-notes"),
  auditState: document.getElementById("audit-state"),
  auditStateCopy: document.getElementById("audit-state-copy"),
  auditScore: document.getElementById("audit-score"),
  auditScoreCopy: document.getElementById("audit-score-copy"),
  auditFault: document.getElementById("audit-fault"),
  auditFaultCopy: document.getElementById("audit-fault-copy"),
  auditBoard: document.getElementById("audit-board"),
  auditNotes: document.getElementById("audit-notes"),
  weeklyTone: document.getElementById("weekly-tone"),
  weeklyToneCopy: document.getElementById("weekly-tone-copy"),
  weeklyBestHabit: document.getElementById("weekly-best-habit"),
  weeklyBestHabitCopy: document.getElementById("weekly-best-habit-copy"),
  weeklyMainLeak: document.getElementById("weekly-main-leak"),
  weeklyMainLeakCopy: document.getElementById("weekly-main-leak-copy"),
  weeklyBoard: document.getElementById("weekly-board"),
  weeklyNotes: document.getElementById("weekly-notes"),
  prepScore: document.getElementById("prep-score"),
  prepScoreCopy: document.getElementById("prep-score-copy"),
  prepState: document.getElementById("prep-state"),
  prepStateCopy: document.getElementById("prep-state-copy"),
  prepBlocker: document.getElementById("prep-blocker"),
  prepBlockerCopy: document.getElementById("prep-blocker-copy"),
  prepBoard: document.getElementById("prep-board"),
  prepNotes: document.getElementById("prep-notes"),
  habitState: document.getElementById("habit-state"),
  habitStateCopy: document.getElementById("habit-state-copy"),
  habitStrongest: document.getElementById("habit-strongest"),
  habitStrongestCopy: document.getElementById("habit-strongest-copy"),
  habitLeak: document.getElementById("habit-leak"),
  habitLeakCopy: document.getElementById("habit-leak-copy"),
  habitBoard: document.getElementById("habit-board"),
  habitNotes: document.getElementById("habit-notes"),
  narrativeTheme: document.getElementById("narrative-theme"),
  narrativeThemeCopy: document.getElementById("narrative-theme-copy"),
  narrativeLeadership: document.getElementById("narrative-leadership"),
  narrativeLeadershipCopy: document.getElementById("narrative-leadership-copy"),
  narrativeTone: document.getElementById("narrative-tone"),
  narrativeToneCopy: document.getElementById("narrative-tone-copy"),
  narrativeBoard: document.getElementById("narrative-board"),
  narrativeNotes: document.getElementById("narrative-notes"),
  rotationActiveCount: document.getElementById("rotation-active-count"),
  rotationActiveCopy: document.getElementById("rotation-active-copy"),
  rotationWatchCount: document.getElementById("rotation-watch-count"),
  rotationWatchCopy: document.getElementById("rotation-watch-copy"),
  rotationBenchCount: document.getElementById("rotation-bench-count"),
  rotationBenchCopy: document.getElementById("rotation-bench-copy"),
  rotationBoard: document.getElementById("rotation-board"),
  rotationNotes: document.getElementById("rotation-notes"),
  scorecardGrade: document.getElementById("scorecard-grade"),
  scorecardGradeCopy: document.getElementById("scorecard-grade-copy"),
  scorecardScore: document.getElementById("scorecard-score"),
  scorecardScoreCopy: document.getElementById("scorecard-score-copy"),
  scorecardConstraint: document.getElementById("scorecard-constraint"),
  scorecardConstraintCopy: document.getElementById("scorecard-constraint-copy"),
  scorecardBoard: document.getElementById("scorecard-board"),
  scorecardNotes: document.getElementById("scorecard-notes"),
  complianceScore: document.getElementById("compliance-score"),
  complianceScoreCopy: document.getElementById("compliance-score-copy"),
  complianceMatchCount: document.getElementById("compliance-match-count"),
  complianceMatchCopy: document.getElementById("compliance-match-copy"),
  complianceDrift: document.getElementById("compliance-drift"),
  complianceDriftCopy: document.getElementById("compliance-drift-copy"),
  complianceBoard: document.getElementById("compliance-board"),
  complianceNotes: document.getElementById("compliance-notes"),
  breakoutsTableBody: document.getElementById("breakouts-table-body"),
  breakdownsTableBody: document.getElementById("breakdowns-table-body"),
  smcTableBody: document.getElementById("smc-table-body"),
  journalBoard: document.getElementById("journal-board"),
  journalForm: document.getElementById("journal-form"),
  journalTitle: document.getElementById("journal-title"),
  journalThesis: document.getElementById("journal-thesis"),
  journalExecution: document.getElementById("journal-execution"),
  journalLesson: document.getElementById("journal-lesson"),
  journalTags: document.getElementById("journal-tags"),
  journalFormError: document.getElementById("journal-form-error"),
  journalSubmit: document.getElementById("journal-submit"),
  watchlistBoard: document.getElementById("watchlist-board"),
  watchlistForm: document.getElementById("watchlist-form"),
  watchlistName: document.getElementById("watchlist-name"),
  watchlistSymbols: document.getElementById("watchlist-symbols"),
  watchlistNotes: document.getElementById("watchlist-notes"),
  watchlistError: document.getElementById("watchlist-error"),
  watchlistSubmit: document.getElementById("watchlist-submit"),
  alertBoard: document.getElementById("alert-board"),
  alertForm: document.getElementById("alert-form"),
  alertName: document.getElementById("alert-name"),
  alertRuleType: document.getElementById("alert-rule-type"),
  alertScope: document.getElementById("alert-scope"),
  alertThreshold: document.getElementById("alert-threshold"),
  alertNotes: document.getElementById("alert-notes"),
  alertError: document.getElementById("alert-error"),
  alertSubmit: document.getElementById("alert-submit"),
  riskForm: document.getElementById("risk-form"),
  riskAccountSize: document.getElementById("risk-account-size"),
  riskPerTrade: document.getElementById("risk-per-trade"),
  riskMaxDailyLoss: document.getElementById("risk-max-daily-loss"),
  riskPreferredRr: document.getElementById("risk-preferred-rr"),
  riskError: document.getElementById("risk-error"),
  riskSubmit: document.getElementById("risk-submit"),
  riskSummary: document.getElementById("risk-summary"),
  breadthBreakouts: document.getElementById("breadth-breakouts"),
  breadthBreakdowns: document.getElementById("breadth-breakdowns"),
  breadthBias: document.getElementById("breadth-bias"),
  sectorBoard: document.getElementById("sector-board"),
  mtfDailyBias: document.getElementById("mtf-daily-bias"),
  mtfDailyCopy: document.getElementById("mtf-daily-copy"),
  mtfHourlyBias: document.getElementById("mtf-hourly-bias"),
  mtfHourlyCopy: document.getElementById("mtf-hourly-copy"),
  mtfFifteenBias: document.getElementById("mtf-fifteen-bias"),
  mtfFifteenCopy: document.getElementById("mtf-fifteen-copy"),
  mtfFiveBias: document.getElementById("mtf-five-bias"),
  mtfFiveCopy: document.getElementById("mtf-five-copy"),
  playbookBoard: document.getElementById("playbook-board"),
  playbookForm: document.getElementById("playbook-form"),
  playbookTitle: document.getElementById("playbook-title"),
  playbookSetupType: document.getElementById("playbook-setup-type"),
  playbookBias: document.getElementById("playbook-bias"),
  playbookEntryRule: document.getElementById("playbook-entry-rule"),
  playbookRiskRule: document.getElementById("playbook-risk-rule"),
  playbookExitRule: document.getElementById("playbook-exit-rule"),
  playbookError: document.getElementById("playbook-error"),
  playbookSubmit: document.getElementById("playbook-submit"),
  analyticsTotalEntries: document.getElementById("analytics-total-entries"),
  analyticsConsistency: document.getElementById("analytics-consistency"),
  analyticsTopTag: document.getElementById("analytics-top-tag"),
  analyticsTagsBoard: document.getElementById("analytics-tags-board"),
  analyticsLessonsBoard: document.getElementById("analytics-lessons-board"),
  replayReadiness: document.getElementById("replay-readiness"),
  replayReadinessCopy: document.getElementById("replay-readiness-copy"),
  replayFocus: document.getElementById("replay-focus"),
  replayFocusCopy: document.getElementById("replay-focus-copy"),
  replayAnchor: document.getElementById("replay-anchor"),
  replayAnchorCopy: document.getElementById("replay-anchor-copy"),
  replayBoard: document.getElementById("replay-board"),
  replayNotes: document.getElementById("replay-notes"),
  backtestWinRate: document.getElementById("backtest-win-rate"),
  backtestWinRateCopy: document.getElementById("backtest-win-rate-copy"),
  backtestExpectancy: document.getElementById("backtest-expectancy"),
  backtestExpectancyCopy: document.getElementById("backtest-expectancy-copy"),
  backtestBestCondition: document.getElementById("backtest-best-condition"),
  backtestBestConditionCopy: document.getElementById("backtest-best-condition-copy"),
  backtestBoard: document.getElementById("backtest-board"),
  backtestNotes: document.getElementById("backtest-notes"),
  strategyBreadthLabel: document.getElementById("strategy-breadth-label"),
  strategyBreadthCopy: document.getElementById("strategy-breadth-copy"),
  priceActionTone: document.getElementById("price-action-tone"),
  priceActionBias: document.getElementById("price-action-bias"),
  priceActionReading: document.getElementById("price-action-reading"),
  priceBreakoutCount: document.getElementById("price-breakout-count"),
  priceBreakdownCount: document.getElementById("price-breakdown-count"),
  priceLeader: document.getElementById("price-leader"),
  priceBreadth: document.getElementById("price-breadth"),
  priceStructureRead: document.getElementById("price-structure-read"),
  priceExecutionCue: document.getElementById("price-execution-cue"),
  priceRiskPosture: document.getElementById("price-risk-posture"),
  priceActionTableBody: document.getElementById("price-action-table-body"),
  videoStrategyForm: document.getElementById("video-strategy-form"),
  videoStrategyUrl: document.getElementById("video-strategy-url"),
  videoStrategyError: document.getElementById("video-strategy-error"),
  videoStrategySubmit: document.getElementById("video-strategy-submit"),
  videoStrategySummary: document.getElementById("video-strategy-summary"),
  videoStrategyMatches: document.getElementById("video-strategy-matches"),
  videoStrategyTranscript: document.getElementById("video-strategy-transcript"),
  videoStrategyHistory: document.getElementById("video-strategy-history"),
  logoutBtn: document.getElementById("logout-btn"),
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

function formatDateTime(iso) {
  if (!iso) return "--";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizePathname(pathname) {
  const path = pathname || "/";
  return path.endsWith(".html") ? path.slice(0, -5) : path;
}

function injectWorkspaceDirectory() {
  const content = document.querySelector(".product-content");
  if (!content || document.querySelector(".workspace-directory")) return;
  const currentPath = normalizePathname(window.location.pathname);
  
  // Only show operational toolkit links in the sub-nav for better focus
  const toolkitLinks = WORKSPACE_LINKS.filter(link => 
    !["/dashboard", "/trades", "/smc", "/journal", "/price-action", "/toolkit"].includes(normalizePathname(link.href))
  );

  const nav = document.createElement("nav");
  nav.className = "workspace-directory";
  nav.innerHTML = toolkitLinks.map((link) => {
    const active = currentPath === normalizePathname(link.href);
    return `<a href="${link.href}" class="workspace-directory-link${active ? " active" : ""}">${escapeHtml(link.label)}</a>`;
  }).join("");
  content.insertAdjacentElement("afterbegin", nav);
}

function ensureHealingStatusPill() {
  const actions = document.querySelector(".product-actions");
  if (!actions || document.getElementById("healing-status")) return;
  const pill = document.createElement("div");
  pill.className = "status-pill status-pill-healing";
  pill.innerHTML = `
    <span id="healing-status">Healing</span>
    <small id="healing-meta">Waiting for scanner state</small>
  `;
  actions.insertBefore(pill, actions.firstChild);
}

function greetingLine(name) {
  const hour = new Date().getHours();
  const firstName = (name || "Trader").split(/[\s._-]+/)[0];
  if (hour < 12) return `Happy Trading, ${firstName}. May your day be profitable.`;
  if (hour < 17) return `Stay disciplined, ${firstName}. Let the session come to you.`;
  return `Well held, ${firstName}. Review the flow and finish strong.`;
}

function displayName(value) {
  return String(value || "Trader")
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function updateGreeting(user) {
  const rawName = user?.username || user?.email?.split("@", 1)[0] || "Trader";
  const name = displayName(rawName);
  if (ids.welcomeName) ids.welcomeName.textContent = name;
  if (ids.greetingText) ids.greetingText.textContent = greetingLine(name);
}

function isBreakoutMover(mover) {
  return (mover.flags || []).some((flag) => flag.includes("HIGH")) || Number(mover.change_percent) >= 0;
}

function isBreakdownMover(mover) {
  return (mover.flags || []).some((flag) => flag.includes("LOW")) || Number(mover.change_percent) < 0;
}

function qualityTier(score) {
  if (score >= 85) return "A+";
  if (score >= 75) return "A";
  if (score >= 65) return "B";
  if (score >= 55) return "C";
  return "Watch";
}

function qualityToneClass(score) {
  if (score >= 75) return "quality-pill strong";
  if (score >= 60) return "quality-pill decent";
  return "quality-pill cautious";
}

function scoreMover(snapshot, mover) {
  const alerts = snapshot.recent_alerts || [];
  const smcSignals = snapshot.smc_signals || [];
  const allMovers = snapshot.movers || [];
  const breakouts = allMovers.filter(isBreakoutMover).length;
  const breakdowns = allMovers.filter(isBreakdownMover).length;
  const flags = mover.flags || [];
  const change = Math.abs(Number(mover.change_percent) || 0);
  const breakoutSide = isBreakoutMover(mover);
  let score = 42;

  score += Math.min(18, change * 2.2);
  score += Math.min(16, flags.length * 4);
  if (flags.some((flag) => flag.includes("52 WEEKS"))) score += 10;
  if (flags.some((flag) => flag.includes("3 MONTHS"))) score += 6;
  if (flags.some((flag) => flag.includes("2 WEEKS"))) score += 4;
  if (flags.some((flag) => flag.includes("DAY"))) score += 3;

  const matchingAlerts = alerts.filter((alert) => alert.display_symbol === mover.symbol);
  score += Math.min(10, matchingAlerts.length * 4);

  const matchingSmc = smcSignals.filter((signal) => signal.display_symbol === mover.symbol);
  score += Math.min(8, matchingSmc.length * 4);

  if (breakoutSide && breakouts > breakdowns) score += 6;
  if (!breakoutSide && breakdowns > breakouts) score += 6;
  if (breakoutSide && breakouts < breakdowns) score -= 5;
  if (!breakoutSide && breakdowns < breakouts) score -= 5;

  score = Math.max(25, Math.min(98, Math.round(score)));

  let note = "Monitor for better confirmation.";
  if (score >= 85) note = "Desk-quality leadership with strong alignment and freshness.";
  else if (score >= 75) note = "High-quality setup with solid alignment and usable structure.";
  else if (score >= 65) note = "Tradable, but requires cleaner timing and disciplined execution.";
  else if (score >= 55) note = "Developing setup. Needs more proof before desk-sized conviction.";

  return {
    score,
    tier: qualityTier(score),
    toneClass: qualityToneClass(score),
    note,
  };
}

function confluenceToneClass(score) {
  if (score >= 82) return "quality-pill strong";
  if (score >= 68) return "quality-pill decent";
  return "quality-pill cautious";
}

function scoreConfluence(snapshot, mover) {
  const quality = scoreMover(snapshot, mover);
  const alerts = snapshot.recent_alerts || [];
  const smcSignals = snapshot.smc_signals || [];
  const movers = snapshot.movers || [];
  const breakouts = movers.filter(isBreakoutMover).length;
  const breakdowns = movers.filter(isBreakdownMover).length;
  const directionalBias = breakouts > breakdowns + 2 ? "Bullish" : breakdowns > breakouts + 2 ? "Bearish" : "Balanced";
  const breakoutSide = isBreakoutMover(mover);
  let score = quality.score * 0.58;

  const matchingAlerts = alerts.filter((alert) => alert.display_symbol === mover.symbol);
  const matchingSmc = smcSignals.filter((signal) => signal.display_symbol === mover.symbol);

  score += Math.min(16, matchingAlerts.length * 5);
  score += Math.min(14, matchingSmc.length * 6);
  if (directionalBias === "Bullish" && breakoutSide) score += 9;
  if (directionalBias === "Bearish" && !breakoutSide) score += 9;
  if (directionalBias === "Bullish" && !breakoutSide) score -= 6;
  if (directionalBias === "Bearish" && breakoutSide) score -= 6;
  if (directionalBias === "Balanced") score += 2;

  const finalScore = Math.max(25, Math.min(99, Math.round(score)));
  let note = "Some factors align, but conviction is still limited.";
  if (finalScore >= 82) note = "Multiple desk factors are aligning. This belongs near the top of the board.";
  else if (finalScore >= 68) note = "There is usable alignment here, but execution quality still matters.";
  else if (finalScore >= 58) note = "This is tradable only if timing and structure tighten further.";

  return {
    score: finalScore,
    toneClass: confluenceToneClass(finalScore),
    note,
    directionalBias,
    quality,
    alertCount: matchingAlerts.length,
    smcCount: matchingSmc.length,
  };
}

function renderMetricCards(snapshot) {
  const { scanner, smc_signals, movers, recent_alerts } = snapshot;
  if (ids.coverageMetric) ids.coverageMetric.textContent = scanner.symbols ?? movers.length ?? 0;
  if (ids.activeMetric) ids.activeMetric.textContent = scanner.active_breakouts ?? movers.length ?? 0;
  if (ids.recentMetric) ids.recentMetric.textContent = scanner.recent_alerts ?? recent_alerts.length ?? 0;
  if (ids.smcMetric) ids.smcMetric.textContent = smc_signals.length;
  if (ids.marketStatus) ids.marketStatus.textContent = scanner.market_status || "UNKNOWN";
  if (ids.lastQuote) ids.lastQuote.textContent = formatTime(scanner.last_quote_at);
}

function renderHealingFactor(snapshot) {
  const scanner = snapshot.scanner || {};
  const statusEl = document.getElementById("healing-status");
  const metaEl = document.getElementById("healing-meta");
  if (!statusEl || !metaEl) return;

  const status = scanner.self_healing_status || (
    scanner.last_error ? "Recovering" :
    ((scanner.stream_restarts || 0) > 0 || (scanner.reference_failures || 0) > 0) ? "Monitoring" :
    "Healthy"
  );

  statusEl.textContent = status;
  metaEl.textContent = `${scanner.self_heal_events ?? 0} heals / ${scanner.stream_restarts ?? 0} restarts / ${scanner.reference_failures ?? 0} ref fails`;

  statusEl.classList.remove("healing-healthy", "healing-monitoring", "healing-recovering");
  const lowered = String(status).toLowerCase();
  if (lowered.includes("healthy")) statusEl.classList.add("healing-healthy");
  else if (lowered.includes("recover")) statusEl.classList.add("healing-recovering");
  else statusEl.classList.add("healing-monitoring");

  const pill = statusEl.closest(".status-pill-healing");
  if (pill) {
    pill.title = scanner.last_error || "Self-healing telemetry from the scanner.";
  }
}

function renderRows(target, rows, cols, emptyText) {
  if (!target) return;
  if (!rows.length) {
    target.innerHTML = `<tr><td colspan="${cols}" class="terminal-empty-cell">${emptyText}</td></tr>`;
    return;
  }
  target.innerHTML = rows.join("");
}

function renderDashboard(snapshot) {
  const { recent_alerts, smc_signals } = snapshot;
  if (ids.dashboardAlerts) {
    ids.dashboardAlerts.innerHTML = recent_alerts.length
      ? recent_alerts.slice(0, 4).map((alert) => `
          <div class="pulse-card">
            <strong>${alert.display_symbol}</strong>
            <span>${alert.scope} ${alert.direction} @ ${formatNumber(alert.price)}</span>
            <em>${formatPercent(alert.change_percent)}</em>
          </div>
        `).join("")
      : '<div class="terminal-empty-copy">Waiting for fresh live alerts.</div>';
  }

  if (ids.dashboardSmc) {
    ids.dashboardSmc.innerHTML = smc_signals.length
      ? smc_signals.slice(0, 4).map((signal) => `
          <div class="context-card">
            <strong>${signal.display_symbol}</strong>
            <span>${signal.signal}</span>
            <em>${signal.detail}</em>
          </div>
        `).join("")
      : '<div class="terminal-empty-copy">SMC board is online and waiting for structure signals.</div>';
  }
}

function renderMorningBrief(snapshot) {
  const movers = snapshot.movers || [];
  const recentAlerts = snapshot.recent_alerts || [];
  const smcSignals = snapshot.smc_signals || [];
  const breakouts = movers.filter(isBreakoutMover);
  const breakdowns = movers.filter(isBreakdownMover);
  const leader = movers[0];
  const biasScore = breakouts.length - breakdowns.length;

  let bias = "Balanced";
  let biasCopy = "Breadth is mixed, so the desk should stay selective.";
  let riskPosture = "Measured";
  let riskCopy = "Use normal or slightly reduced size until the tape proves directional control.";
  let mandate = "Wait for clarity";
  let mandateCopy = "Only trade clean leadership. Avoid forcing middling names.";
  let guidanceTitle = "Neutral tape";
  let guidanceBody = "The desk is not seeing dominant one-way control yet. Prioritize names with the cleanest structure and respect invalidation quickly.";
  let focusPoints = [
    "Wait for clear continuation or clear failure, not halfway structure.",
    "Trade names with the strongest flags and freshest alert flow.",
    "Stay aligned with session leadership rather than hunting random laggards.",
  ];
  let avoidPoints = [
    "Avoid oversized risk in mixed tape.",
    "Avoid chasing names after the move is already extended.",
    "Avoid trades that have no structure or no clear invalidation.",
  ];

  if (biasScore >= 3) {
    bias = "Bullish";
    biasCopy = "Upside participation is broader and leadership is leaning constructive.";
    riskPosture = "Constructive";
    riskCopy = "The desk can lean into longs, but should still avoid late entries on extended names.";
    mandate = "Press clean continuation";
    mandateCopy = "Prioritize strong names, orderly pullbacks, and continuation through highs.";
    guidanceTitle = "Buy-side control";
    guidanceBody = "The tape is acting like a momentum session. The desk should favor clean breakouts, bullish continuation, and names already proving relative strength.";
    focusPoints = [
      "Prioritize breakouts with multiple high-side flags.",
      "Use leadership names as the session map for continuation.",
      "Favor pullback entries over chasing the first spike.",
    ];
    avoidPoints = [
      "Avoid fading the strongest names without structure failure.",
      "Avoid late breakouts after exhaustion bars.",
      "Avoid weak names just because they look cheaper.",
    ];
  } else if (biasScore <= -3) {
    bias = "Bearish";
    biasCopy = "Sell-side pressure is broader and the tape is behaving more defensively.";
    riskPosture = "Defensive";
    riskCopy = "Reduce aggression on longs and only take the cleanest reversal evidence.";
    mandate = "Respect downside pressure";
    mandateCopy = "Focus on failed bounces, breakdown continuation, and capital preservation.";
    guidanceTitle = "Sell-side control";
    guidanceBody = "The tape is favoring weakness. The desk should stay disciplined, avoid forcing hero reversals, and let weak names do the work.";
    focusPoints = [
      "Prioritize breakdown continuation and failed reclaims.",
      "Use live weakness to guide the session rather than counter-trend guessing.",
      "Keep entries near clear invalidation levels.",
    ];
    avoidPoints = [
      "Avoid random dip buys while the tape is still defensive.",
      "Avoid calling bottoms without structure change.",
      "Avoid adding risk to weak longs just because price is lower.",
    ];
  }

  if (ids.briefBias) ids.briefBias.textContent = bias;
  if (ids.briefBiasCopy) ids.briefBiasCopy.textContent = biasCopy;
  if (ids.briefRiskPosture) ids.briefRiskPosture.textContent = riskPosture;
  if (ids.briefRiskCopy) ids.briefRiskCopy.textContent = riskCopy;
  if (ids.briefMandate) ids.briefMandate.textContent = mandate;
  if (ids.briefMandateCopy) ids.briefMandateCopy.textContent = mandateCopy;

  if (ids.briefGuidance) {
    ids.briefGuidance.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-head">
          <div>
            <strong>${escapeHtml(guidanceTitle)}</strong>
            <div class="journal-entry-meta">
              <span>${escapeHtml(`${breakouts.length} breakouts`)}</span>
              <span>${escapeHtml(`${breakdowns.length} breakdowns`)}</span>
              <span>${escapeHtml(`${smcSignals.length} SMC setups`)}</span>
            </div>
          </div>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk read</span>
          <p>${escapeHtml(guidanceBody)}</p>
        </div>
      </article>
    `;
  }

  if (ids.briefLeaders) {
    ids.briefLeaders.innerHTML = movers.length
      ? movers.slice(0, 5).map((mover) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(mover.symbol)}</strong>
                <div class="journal-entry-meta">
                  <span>${escapeHtml(formatNumber(mover.price))}</span>
                  <span>${escapeHtml(formatPercent(mover.change_percent))}</span>
                </div>
              </div>
            </div>
            <div class="journal-entry-row">
              <span class="journal-note-label">Leadership note</span>
              <p>${escapeHtml((mover.flags || []).join(", ") || "Live leadership candidate.")}</p>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">Leadership names will appear here.</div>';
  }

  if (ids.briefFocus) {
    const alertLead = recentAlerts[0];
    ids.briefFocus.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Primary focus</span>
          <p>${escapeHtml(focusPoints[0])}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Secondary focus</span>
          <p>${escapeHtml(focusPoints[1])}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Live cue</span>
          <p>${escapeHtml(alertLead ? `${alertLead.display_symbol} is currently part of the freshest alert flow.` : focusPoints[2])}</p>
        </div>
      </article>
    `;
  }

  if (ids.briefAvoid) {
    const structureCaution = smcSignals[0]?.detail;
    ids.briefAvoid.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Avoid</span>
          <p>${escapeHtml(avoidPoints[0])}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Also avoid</span>
          <p>${escapeHtml(avoidPoints[1])}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Structure caution</span>
          <p>${escapeHtml(structureCaution || avoidPoints[2])}</p>
        </div>
      </article>
    `;
  }
}

function renderSetupQuality(snapshot) {
  const movers = snapshot.movers || [];
  const ranked = movers
    .map((mover) => ({ ...mover, quality: scoreMover(snapshot, mover) }))
    .sort((a, b) => b.quality.score - a.quality.score);

  const aCount = ranked.filter((item) => item.quality.score >= 75).length;
  const best = ranked[0];
  const deskFocus =
    aCount >= 4 ? "Press leadership" :
    aCount >= 2 ? "Selective aggression" :
    ranked.length ? "Tight selection" : "Wait";

  if (ids.qualityACount) ids.qualityACount.textContent = String(aCount);
  if (ids.qualityACopy) ids.qualityACopy.textContent = aCount ? `${aCount} names currently qualify as desk-grade ideas.` : "No A-grade setups yet. Stay selective.";
  if (ids.qualityBestSymbol) ids.qualityBestSymbol.textContent = best ? `${best.symbol} / ${best.quality.tier}` : "Waiting";
  if (ids.qualityBestCopy) ids.qualityBestCopy.textContent = best ? best.quality.note : "The strongest live setup will appear here.";
  if (ids.qualityDeskFocus) ids.qualityDeskFocus.textContent = deskFocus;
  if (ids.qualityFocusCopy) ids.qualityFocusCopy.textContent =
    deskFocus === "Press leadership" ? "The board has enough quality to focus on continuation leaders." :
    deskFocus === "Selective aggression" ? "There are a few quality names. Stay disciplined and avoid second-tier setups." :
    deskFocus === "Tight selection" ? "Only the very best names deserve attention right now." :
    "No meaningful quality edge yet. Preserve capital and wait.";

  if (ids.qualityBoard) {
    ids.qualityBoard.innerHTML = ranked.length
      ? ranked.slice(0, 8).map((item) => {
          const archiveLink = `/aplus-archive?title=${encodeURIComponent(`A+ ${item.symbol} ${item.quality.tier}`)}&symbol=${encodeURIComponent(item.symbol)}&setup=${encodeURIComponent(isBreakoutMover(item) ? "Live Breakout Quality Setup" : "Live Breakdown Quality Setup")}&bias=${encodeURIComponent(isBreakoutMover(item) ? "Bullish" : "Bearish")}&rationale=${encodeURIComponent(item.quality.note)}&context=${encodeURIComponent((item.flags || []).join(", ") || "Live leadership context")}`;
          return `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(item.symbol)}</strong>
                <div class="journal-entry-meta">
                  <span>${escapeHtml(item.quality.tier)} grade</span>
                  <span>${escapeHtml(String(item.quality.score))}/100</span>
                  <span>${escapeHtml(formatPercent(item.change_percent))}</span>
                </div>
              </div>
              <span class="${item.quality.toneClass}">${escapeHtml(item.quality.tier)}</span>
            </div>
            <div class="journal-entry-grid">
              <div class="journal-entry-row">
                <span class="journal-note-label">Desk note</span>
                <p>${escapeHtml(item.quality.note)}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Flags</span>
                <p>${escapeHtml((item.flags || []).join(", ") || "No special flags")}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Model book</span>
                <p><a class="toolkit-action-link" href="${archiveLink}">Archive this as an A+ setup</a></p>
              </div>
            </div>
          </article>
        `;
        }).join("")
      : '<div class="terminal-empty-copy">Ranked setups will appear here.</div>';
  }

  if (ids.qualityNotes) {
    const topThree = ranked.slice(0, 3);
    ids.qualityNotes.innerHTML = topThree.length
      ? `
        <article class="journal-note journal-entry">
          <div class="journal-entry-row">
            <span class="journal-note-label">What the desk should do</span>
            <p>${escapeHtml(deskFocus === "Press leadership" ? "Work from the top of the board. Leadership is good enough to focus on continuation and cleaner re-entries." : deskFocus === "Selective aggression" ? "Take only the best names. Ignore second-tier setups and stay close to invalidation." : "Keep risk tight and let the board improve before pressing.")}</p>
          </div>
          <div class="journal-entry-row">
            <span class="journal-note-label">Best names now</span>
            <p>${escapeHtml(topThree.map((item) => `${item.symbol} (${item.quality.tier} ${item.quality.score})`).join(", "))}</p>
          </div>
          <div class="journal-entry-row">
            <span class="journal-note-label">Desk caution</span>
            <p>${escapeHtml(aCount <= 1 ? "Quality concentration is thin. Avoid turning movement into conviction too early." : "Even strong boards punish chasing. Let the tape come to your level.")}</p>
          </div>
        </article>
      `
      : '<div class="terminal-empty-copy">Desk-quality guidance will appear here.</div>';
  }
}

function renderConfluenceEngine(snapshot) {
  const movers = snapshot.movers || [];
  const ranked = movers
    .map((mover) => ({ ...mover, confluence: scoreConfluence(snapshot, mover) }))
    .sort((a, b) => b.confluence.score - a.confluence.score);

  const strongCount = ranked.filter((item) => item.confluence.score >= 68).length;
  const best = ranked[0];
  const biasLink = best?.confluence?.directionalBias || "Balanced";

  if (ids.confluenceBestSymbol) ids.confluenceBestSymbol.textContent = best ? `${best.symbol} / ${best.confluence.score}` : "Waiting";
  if (ids.confluenceBestCopy) ids.confluenceBestCopy.textContent = best ? best.confluence.note : "The strongest multi-factor setup will appear here.";
  if (ids.confluenceHighCount) ids.confluenceHighCount.textContent = String(strongCount);
  if (ids.confluenceHighCopy) ids.confluenceHighCopy.textContent = strongCount ? `${strongCount} names currently have stronger confluence.` : "No high-confluence names yet.";
  if (ids.confluenceBiasLink) ids.confluenceBiasLink.textContent = biasLink;
  if (ids.confluenceBiasCopy) ids.confluenceBiasCopy.textContent =
    biasLink === "Bullish" ? "Breadth is helping long-side conviction." :
    biasLink === "Bearish" ? "Breadth is helping short-side conviction." :
    "Conviction is relying more on single-name behavior than broad tape alignment.";

  if (ids.confluenceBoard) {
    ids.confluenceBoard.innerHTML = ranked.length
      ? ranked.slice(0, 8).map((item) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(item.symbol)}</strong>
                <div class="journal-entry-meta">
                  <span>${escapeHtml(formatPercent(item.change_percent))}</span>
                  <span>${escapeHtml(item.confluence.directionalBias)}</span>
                  <span>${escapeHtml(`${item.confluence.alertCount} alerts / ${item.confluence.smcCount} smc`)}</span>
                </div>
              </div>
              <span class="${item.confluence.toneClass}">${escapeHtml(String(item.confluence.score))}</span>
            </div>
            <div class="journal-entry-grid">
              <div class="journal-entry-row">
                <span class="journal-note-label">Confluence read</span>
                <p>${escapeHtml(item.confluence.note)}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Flags</span>
                <p>${escapeHtml((item.flags || []).join(", ") || "No special flags")}</p>
              </div>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">Live confluence rankings will appear here.</div>';
  }

  if (ids.confluenceNotes) {
    ids.confluenceNotes.innerHTML = best
      ? `
        <article class="journal-note journal-entry">
          <div class="journal-entry-row">
            <span class="journal-note-label">Desk read</span>
            <p>${escapeHtml(best.confluence.score >= 82 ? "Top confluence is strong enough to deserve primary desk attention." : best.confluence.score >= 68 ? "There is meaningful alignment, but execution still decides the outcome." : "Confluence is still developing. Avoid confusing movement with true conviction.")}</p>
          </div>
          <div class="journal-entry-row">
            <span class="journal-note-label">Current leader</span>
            <p>${escapeHtml(`${best.symbol} is leading with a confluence score of ${best.confluence.score}.`)}</p>
          </div>
          <div class="journal-entry-row">
            <span class="journal-note-label">Desk caution</span>
            <p>${escapeHtml(strongCount <= 1 ? "The board is thin. One strong-looking name does not mean the whole tape is supportive." : "Even with several aligned names, focus on the highest-quality execution points rather than quantity.")}</p>
          </div>
        </article>
      `
      : '<div class="terminal-empty-copy">The desk interpretation will appear here.</div>';
  }
}

function renderExecutionGate(snapshot) {
  if (!ids.gateBoard && !ids.gateNotes && !ids.gateStatus) return;

  const movers = snapshot.movers || [];
  const disciplineScore = Number(state.disciplineSummary?.discipline_score ?? 100);
  const lossLocked = Boolean(state.dailyLossState?.locked);
  const ranked = movers
    .map((mover) => {
      const quality = scoreMover(snapshot, mover);
      const confluence = scoreConfluence(snapshot, mover);
      const total = Math.round((quality.score * 0.56) + (confluence.score * 0.44));
      return { ...mover, quality, confluence, gateScore: total };
    })
    .sort((a, b) => b.gateScore - a.gateScore);

  const best = ranked[0];
  let status = "Hold";
  let statusCopy = "The desk is waiting for stronger alignment.";
  let risk = "Neutral";
  let riskCopy = "Keep normal selectivity and wait for better permission.";

  if (lossLocked) {
    status = "Blocked";
    statusCopy = "The daily loss lock is active. No new risk should be pressed.";
    risk = "Review Only";
    riskCopy = "Use the session for observation and review, not fresh execution.";
  } else if ((best?.gateScore || 0) >= 82 && disciplineScore >= 80) {
    status = "Go";
    statusCopy = "A strong candidate is live and the trader is behaving well enough to press selectively.";
    risk = "Selective Aggression";
    riskCopy = "Focus on the top setup only and do not dilute quality by trading too many names.";
  } else if ((best?.gateScore || 0) >= 68 && disciplineScore >= 70) {
    status = "Selective";
    statusCopy = "There is enough alignment for controlled risk, but not enough for desk-wide aggression.";
    risk = "Tight Risk";
    riskCopy = "Trade smaller, demand cleaner entries, and stay close to invalidation.";
  } else if (disciplineScore < 70) {
    status = "Blocked";
    statusCopy = "Trader behavior is the main issue right now, not opportunity quality.";
    risk = "Behavior Repair";
    riskCopy = "No pressing risk until discipline improves and execution stabilizes.";
  }

  if (ids.gateStatus) ids.gateStatus.textContent = status;
  if (ids.gateStatusCopy) ids.gateStatusCopy.textContent = statusCopy;
  if (ids.gateRisk) ids.gateRisk.textContent = risk;
  if (ids.gateRiskCopy) ids.gateRiskCopy.textContent = riskCopy;
  if (ids.gateBest) ids.gateBest.textContent = best ? `${best.symbol} / ${best.gateScore}` : "Waiting";
  if (ids.gateBestCopy) ids.gateBestCopy.textContent = best
    ? `${best.quality.tier} quality with ${best.confluence.score} confluence.`
    : "The best live candidate will appear once the board has enough movement.";

  if (ids.gateBoard) {
    ids.gateBoard.innerHTML = ranked.length
      ? ranked.slice(0, 6).map((item) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(item.symbol)}</strong>
                <div class="journal-entry-meta">
                  <span>${escapeHtml(item.quality.tier)} quality</span>
                  <span>${escapeHtml(String(item.confluence.score))} confluence</span>
                  <span>${escapeHtml(formatPercent(item.change_percent))}</span>
                </div>
              </div>
              <span class="${item.gateScore >= 82 ? "quality-tier-a" : item.gateScore >= 68 ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(String(item.gateScore))}</span>
            </div>
            <div class="journal-entry-grid">
              <div class="journal-entry-row">
                <span class="journal-note-label">Permission read</span>
                <p>${escapeHtml(
                  lossLocked
                    ? "No trade is allowed while the desk is in protection mode."
                    : item.gateScore >= 82
                      ? "Tradable if entry quality stays clean and the trader respects the plan."
                      : item.gateScore >= 68
                        ? "Watch closely and only execute if timing improves."
                        : "Movement exists, but desk permission is not strong enough yet."
                )}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Setup note</span>
                <p>${escapeHtml(item.quality.note)}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Confluence note</span>
                <p>${escapeHtml(item.confluence.note)}</p>
              </div>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">Execution gate candidates will appear here.</div>';
  }

  if (ids.gateNotes) {
    ids.gateNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk instruction</span>
          <p>${escapeHtml(
            status === "Go"
              ? "Press only the top-ranked candidate. The edge is strong enough, but discipline still matters more than quantity."
              : status === "Selective"
                ? "Take only names that improve into your level. Do not turn acceptable into urgent."
                : "Stand down from fresh risk and let review, patience, or behavior correction do the work."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Why</span>
          <p>${escapeHtml(
            lossLocked
              ? "Risk protection overrides opportunity."
              : disciplineScore < 70
                ? "Trader behavior is weaker than the opportunity set."
                : best
                  ? `${best.symbol} is the strongest current candidate, but desk permission is based on both market quality and operator quality.`
                  : "There is not enough live edge on the board yet."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Non-negotiable</span>
          <p>${escapeHtml("If the trader cannot describe the setup, invalidation, and reason for size in one clean sentence, the trade is not ready.")}</p>
        </div>
      </article>
    `;
  }
}

function renderCapitalAllocation(snapshot) {
  if (!ids.allocationBoard && !ids.allocationNotes && !ids.allocationMode) return;

  const movers = snapshot.movers || [];
  const disciplineScore = Number(state.disciplineSummary?.discipline_score ?? 100);
  const lossLocked = Boolean(state.dailyLossState?.locked);
  const traderScore = (() => {
    const analyticsScore = Number(state.journalAnalytics?.consistency_score ?? 0);
    const archiveScore = Math.min(100, (state.aplusSetups || []).length * 18);
    return Math.round((disciplineScore * 0.45) + (analyticsScore * 0.3) + (archiveScore * 0.25));
  })();

  const ranked = movers
    .map((mover) => {
      const quality = scoreMover(snapshot, mover);
      const confluence = scoreConfluence(snapshot, mover);
      const allocationScore = Math.max(1, Math.round((quality.score * 0.58) + (confluence.score * 0.42)));
      return { ...mover, quality, confluence, allocationScore };
    })
    .sort((a, b) => b.allocationScore - a.allocationScore)
    .slice(0, 5);

  const scoreTotal = ranked.reduce((sum, item) => sum + item.allocationScore, 0) || 1;
  const weighted = ranked.map((item, index) => {
    let weight = Math.round((item.allocationScore / scoreTotal) * 100);
    if (lossLocked) weight = 0;
    else if (traderScore < 60) weight = Math.round(weight * 0.45);
    else if (index > 1) weight = Math.round(weight * 0.7);
    return { ...item, weight };
  });

  const topWeight = weighted[0]?.weight || 0;
  const concentration =
    topWeight >= 45 ? "High Focus" :
    topWeight >= 30 ? "Selective" :
    weighted.length >= 3 ? "Distributed" :
    "Light";

  const mode =
    lossLocked ? "Protected" :
    traderScore >= 80 && topWeight >= 35 ? "Concentrated" :
    traderScore >= 65 ? "Selective" :
    "Reduced";

  if (ids.allocationMode) ids.allocationMode.textContent = mode;
  if (ids.allocationModeCopy) ids.allocationModeCopy.textContent =
    mode === "Protected" ? "Capital protection overrides deployment. No fresh size should be allocated." :
    mode === "Concentrated" ? "The desk can lean into the best name rather than spreading attention too widely." :
    mode === "Selective" ? "Deploy carefully across only the strongest names." :
    "Trader quality or board quality is too soft for normal capital distribution.";
  if (ids.allocationTopWeight) ids.allocationTopWeight.textContent = `${topWeight}%`;
  if (ids.allocationTopWeightCopy) ids.allocationTopWeightCopy.textContent = weighted[0]
    ? `${weighted[0].symbol} is currently the lead candidate for desk attention.`
    : "No clear lead candidate yet.";
  if (ids.allocationConcentration) ids.allocationConcentration.textContent = concentration;
  if (ids.allocationConcentrationCopy) ids.allocationConcentrationCopy.textContent =
    concentration === "High Focus" ? "The board favors one or two names over broad distribution." :
    concentration === "Selective" ? "The desk should stay concentrated, but not single-name dependent." :
    concentration === "Distributed" ? "The board is broad enough for measured distribution." :
    "Keep exposure light until the board firms up.";

  if (ids.allocationBoard) {
    ids.allocationBoard.innerHTML = weighted.length
      ? weighted.map((item) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(item.symbol)}</strong>
                <div class="journal-entry-meta">
                  <span>${escapeHtml(item.quality.tier)} quality</span>
                  <span>${escapeHtml(String(item.confluence.score))} confluence</span>
                  <span>${escapeHtml(formatPercent(item.change_percent))}</span>
                </div>
              </div>
              <span class="${item.weight >= 35 ? "quality-tier-a" : item.weight >= 20 ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(`${item.weight}%`)}</span>
            </div>
            <div class="journal-entry-grid">
              <div class="journal-entry-row">
                <span class="journal-note-label">Allocation read</span>
                <p>${escapeHtml(
                  lossLocked
                    ? "No size should be allocated while the desk is locked."
                    : item.weight >= 35
                      ? "Primary focus name. This deserves the cleanest attention and best execution."
                      : item.weight >= 20
                        ? "Secondary focus. Tradable only after the lead idea is handled properly."
                        : "Tertiary idea. Watch it, but do not let it steal attention from better names."
                )}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Desk weight</span>
                <p>${escapeHtml(`${item.weight}% of current desk attention / notional allocation.`)}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Why it ranks here</span>
                <p>${escapeHtml(`${item.quality.note} ${item.confluence.note}`)}</p>
              </div>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">Allocation priorities will appear here.</div>';
  }

  if (ids.allocationNotes) {
    ids.allocationNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk plan</span>
          <p>${escapeHtml(
            mode === "Protected"
              ? "Do not deploy fresh capital. Protect the day and use the board for observation only."
              : mode === "Concentrated"
                ? "Concentrate on the top setup. Spreading risk wider would dilute the desk's edge."
                : mode === "Selective"
                  ? "Use a two-name focus at most and keep lower-ranked ideas on watch only."
                  : "Keep overall deployment light until both the trader and the board improve."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Operator filter</span>
          <p>${escapeHtml(
            traderScore >= 80
              ? "Trader quality is supportive of normal execution."
              : traderScore >= 65
                ? "Trader quality is acceptable, but not strong enough for loose decision-making."
                : "Trader quality is reducing the amount of capital the desk should trust right now."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Capital rule</span>
          <p>${escapeHtml("If the board improves, add only to the lead name first. If the board weakens, cut lower-priority ideas before touching the lead setup.")}</p>
        </div>
      </article>
    `;
  }
}

function renderDeskRestrictions() {
  if (!ids.restrictionsBoard && !ids.restrictionsNotes && !ids.restrictionsLevel) return;

  const disciplineScore = Number(state.disciplineSummary?.discipline_score ?? 100);
  const lossState = state.dailyLossState || {};
  const lossLocked = Boolean(lossState.locked);
  const analyticsScore = Number(state.journalAnalytics?.consistency_score ?? 0);
  const archiveCount = (state.aplusSetups || []).length;
  const playbooks = state.playbooks || [];
  const entries = state.snapshot?.journalEntries || [];
  const compliance = entries.length && playbooks.length
    ? Math.round(
        entries.reduce((sum, entry) => {
          const best = playbooks
            .map((playbook) => scorePlaybookMatch(entry, playbook).score)
            .sort((a, b) => b - a)[0] || 0;
          return sum + best;
        }, 0) / entries.length
      )
    : 0;

  let level = "Normal";
  let mode = "Full System Trading";
  let trigger = "Healthy Desk State";
  const rules = [];

  if (lossLocked) {
    level = "Hard Lock";
    mode = "Review Only";
    trigger = "Daily Loss Lock";
    rules.push("No fresh trades for the session.");
    rules.push("Use the terminal only for review, journaling, and model-book work.");
    rules.push("Do not attempt recovery trading.");
  } else {
    if (disciplineScore < 70) {
      level = "High Restriction";
      mode = "Reduced Freedom";
      trigger = "Discipline Drift";
      rules.push("No discretionary trades outside saved playbooks.");
      rules.push("Cut normal size and require cleaner confirmation.");
    }
    if (compliance < 55) {
      if (level === "Normal") level = "Medium Restriction";
      mode = "Playbook Only";
      trigger = trigger === "Healthy Desk State" ? "System Drift" : `${trigger} + System Drift`;
      rules.push("Every trade must map to a saved playbook before execution.");
    }
    if (analyticsScore < 45) {
      if (level === "Normal") level = "Light Restriction";
      trigger = trigger === "Healthy Desk State" ? "Thin Review Sample" : `${trigger} + Thin Review Sample`;
      rules.push("Write a full journal note after each trade so the desk can evaluate behavior correctly.");
    }
    if (archiveCount < 2) {
      rules.push("Archive clean A+ examples before expanding the strategy set.");
    }
    if (!rules.length) {
      rules.push("Normal desk standards apply: clean setup, clear invalidation, disciplined size.");
      rules.push("Focus on the top-ranked names and avoid boredom trades.");
    }
  }

  if (ids.restrictionsLevel) ids.restrictionsLevel.textContent = level;
  if (ids.restrictionsLevelCopy) ids.restrictionsLevelCopy.textContent =
    level === "Hard Lock" ? "Protection mode is active and overrides opportunity." :
    level === "High Restriction" ? "The desk is actively reducing freedom because trader quality has weakened." :
    level === "Medium Restriction" ? "The desk is allowing only structured, system-based execution." :
    level === "Light Restriction" ? "The desk is still tradable, but one weak layer needs tightening." :
    "The desk is operating inside normal standards.";
  if (ids.restrictionsMode) ids.restrictionsMode.textContent = mode;
  if (ids.restrictionsModeCopy) ids.restrictionsModeCopy.textContent =
    mode === "Review Only" ? "Observation and review only." :
    mode === "Reduced Freedom" ? "Trade less, trade tighter, and remove improvisation." :
    mode === "Playbook Only" ? "Only saved systems qualify for execution." :
    "Normal execution is allowed as long as setup quality stays clean.";
  if (ids.restrictionsTrigger) ids.restrictionsTrigger.textContent = trigger;
  if (ids.restrictionsTriggerCopy) ids.restrictionsTriggerCopy.textContent =
    "This is the main operational reason shaping today's desk behavior.";

  if (ids.restrictionsBoard) {
    const parts = [
      { label: "Discipline Score", value: disciplineScore, note: `${state.disciplineSummary?.breach_count ?? 0} breaches currently logged.` },
      { label: "Playbook Compliance", value: compliance, note: `${entries.length} journaled trades in the review sample.` },
      { label: "Journal Consistency", value: analyticsScore, note: `${state.journalAnalytics?.top_tags?.[0]?.tag || "No top tag yet"} is the strongest repeated review pattern.` },
      { label: "A+ Archive", value: Math.min(100, archiveCount * 20), note: `${archiveCount} clean model-book examples saved.` },
    ];

    ids.restrictionsBoard.innerHTML = parts.map((part) => `
      <article class="journal-note journal-entry">
        <div class="journal-entry-head">
          <div>
            <strong>${escapeHtml(part.label)}</strong>
            <div class="journal-entry-meta">
              <span>${escapeHtml(String(part.value))}/100</span>
            </div>
          </div>
          <span class="${part.value >= 80 ? "quality-tier-a" : part.value >= 60 ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(String(part.value))}</span>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk note</span>
          <p>${escapeHtml(part.note)}</p>
        </div>
      </article>
    `).join("");
  }

  if (ids.restrictionsNotes) {
    ids.restrictionsNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Active restrictions</span>
          <p>${escapeHtml(rules.join(" "))}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk intent</span>
          <p>${escapeHtml(
            level === "Hard Lock"
              ? "Protect capital and confidence first."
              : level === "High Restriction"
                ? "Reduce opportunity set until trader behavior improves."
                : level === "Medium Restriction"
                  ? "Keep the desk inside repeatable systems only."
                  : level === "Light Restriction"
                    ? "Trade, but tighten process and documentation."
                    : "Operate normally, but stay disciplined."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">What removes restrictions</span>
          <p>${escapeHtml("Better discipline, clearer playbook adherence, stronger review quality, and more A+ examples will reduce restrictions over time.")}</p>
        </div>
      </article>
    `;
  }
}

function renderTraderProgression() {
  if (!ids.progressionBoard && !ids.progressionNotes && !ids.progressionLevel) return;

  const disciplineScore = Number(state.disciplineSummary?.discipline_score ?? 100);
  const analyticsScore = Number(state.journalAnalytics?.consistency_score ?? 0);
  const archiveScore = Math.min(100, (state.aplusSetups || []).length * 20);
  const lossLocked = Boolean(state.dailyLossState?.locked);
  const playbooks = state.playbooks || [];
  const entries = state.snapshot?.journalEntries || [];
  const complianceScore = entries.length && playbooks.length
    ? Math.round(
        entries.reduce((sum, entry) => {
          const best = playbooks
            .map((playbook) => scorePlaybookMatch(entry, playbook).score)
            .sort((a, b) => b - a)[0] || 0;
          return sum + best;
        }, 0) / entries.length
      )
    : 0;

  const progressScore = Math.round(
    (disciplineScore * 0.3)
    + (complianceScore * 0.28)
    + (analyticsScore * 0.22)
    + (archiveScore * 0.2)
  );

  let level = "Observer";
  let next = "Structured Trader";
  if (progressScore >= 85 && !lossLocked) {
    level = "Desk Trusted";
    next = "Capital Leadership";
  } else if (progressScore >= 72 && !lossLocked) {
    level = "Structured Trader";
    next = "Desk Trusted";
  } else if (progressScore >= 58) {
    level = "Developing";
    next = "Structured Trader";
  }

  let blocker = "Thin Sample";
  if (lossLocked) blocker = "Risk Protection";
  else if (disciplineScore < 70) blocker = "Discipline Drift";
  else if (complianceScore < 55) blocker = "System Drift";
  else if (analyticsScore < 45) blocker = "Weak Review Habit";
  else if (archiveScore < 40) blocker = "Weak Model Book";

  if (ids.progressionLevel) ids.progressionLevel.textContent = level;
  if (ids.progressionLevelCopy) ids.progressionLevelCopy.textContent =
    level === "Desk Trusted" ? "The trader is earning real desk trust through repeatable behavior." :
    level === "Structured Trader" ? "The trader is operating inside a visible system, but still has room to mature." :
    level === "Developing" ? "The trader is building structure, but not enough to earn wider trust yet." :
    "The trader is still in the earliest proof-building stage.";
  if (ids.progressionNext) ids.progressionNext.textContent = next;
  if (ids.progressionNextCopy) ids.progressionNextCopy.textContent =
    next === "Capital Leadership" ? "The next step is proving the ability to handle greater responsibility and concentration." :
    next === "Desk Trusted" ? "The next step is making behavior stable enough that the desk can trust it day after day." :
    "The next step is building a more structured operating process.";
  if (ids.progressionBlocker) ids.progressionBlocker.textContent = blocker;
  if (ids.progressionBlockerCopy) ids.progressionBlockerCopy.textContent =
    blocker === "Risk Protection" ? "The daily loss lock is the main barrier to progression right now." :
    blocker === "Discipline Drift" ? "Behavioral mistakes are limiting trust more than setup quality." :
    blocker === "System Drift" ? "The trader is not staying close enough to the saved playbooks." :
    blocker === "Weak Review Habit" ? "Review quality is too thin to prove repeatability." :
    blocker === "Weak Model Book" ? "There are not enough A+ examples to anchor better standards." :
    "The trader needs more consistent evidence before leveling up.";

  if (ids.progressionBoard) {
    const ladder = [
      {
        label: "Observer",
        status: progressScore < 58 ? "Current" : "Passed",
        note: "Build the first layer of journaling, playbooks, and discipline awareness.",
      },
      {
        label: "Developing",
        status: progressScore >= 58 && progressScore < 72 ? "Current" : progressScore >= 72 ? "Passed" : "Locked",
        note: "Show repeated behavior and stop relying on random discretionary trades.",
      },
      {
        label: "Structured Trader",
        status: progressScore >= 72 && progressScore < 85 && !lossLocked ? "Current" : progressScore >= 85 && !lossLocked ? "Passed" : "Locked",
        note: "Earn trust through stronger compliance, cleaner discipline, and better review quality.",
      },
      {
        label: "Desk Trusted",
        status: progressScore >= 85 && !lossLocked ? "Current" : "Locked",
        note: "Prove the trader can handle more focus, responsibility, and better capital deployment.",
      },
    ];

    ids.progressionBoard.innerHTML = ladder.map((step) => `
      <article class="journal-note journal-entry">
        <div class="journal-entry-head">
          <div>
            <strong>${escapeHtml(step.label)}</strong>
            <div class="journal-entry-meta">
              <span>${escapeHtml(step.status)}</span>
            </div>
          </div>
          <span class="${step.status === "Passed" ? "quality-tier-a" : step.status === "Current" ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(step.status)}</span>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Requirement</span>
          <p>${escapeHtml(step.note)}</p>
        </div>
      </article>
    `).join("");
  }

  if (ids.progressionNotes) {
    ids.progressionNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Development plan</span>
          <p>${escapeHtml(
            blocker === "Risk Protection"
              ? "Stabilize risk behavior first. No progression matters until the trader can stay out of protection mode."
              : blocker === "Discipline Drift"
                ? "Fix repeated process mistakes before optimizing entries or adding more strategies."
                : blocker === "System Drift"
                  ? "Trade only saved playbooks until the desk sees real adherence."
                  : blocker === "Weak Review Habit"
                    ? "Write better journal reviews so the desk can coach from evidence, not guesses."
                    : blocker === "Weak Model Book"
                      ? "Archive more A+ examples to sharpen visual and structural standards."
                      : "Keep reinforcing the same clean behaviors that are already working."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">What unlocks the next level</span>
          <p>${escapeHtml(
            next === "Capital Leadership"
              ? "Consistent discipline, strong system adherence, better review quality, and the ability to avoid protection mode."
              : next === "Desk Trusted"
                ? "Cleaner compliance, stronger archive standards, and steadier trader behavior."
                : "Basic consistency in journaling, discipline, and system naming."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk truth</span>
          <p>${escapeHtml("Promotion comes from repeatability, not from one good day or one good trade.")}</p>
        </div>
      </article>
    `;
  }
}

function renderSessionChecklist(snapshot) {
  if (!ids.checklistBoard && !ids.checklistNotes && !ids.checklistState) return;

  const movers = snapshot.movers || [];
  const breakouts = movers.filter(isBreakoutMover).length;
  const breakdowns = movers.filter(isBreakdownMover).length;
  const disciplineScore = Number(state.disciplineSummary?.discipline_score ?? 100);
  const lossLocked = Boolean(state.dailyLossState?.locked);
  const topMover = movers[0];
  const topTag = state.journalAnalytics?.top_tags?.[0]?.tag || "No dominant tag";
  const playbookCount = (state.playbooks || []).length;

  const items = [
    {
      title: "Desk state is known",
      status: movers.length ? "Ready" : "Wait",
      note: movers.length ? `The live board is populated and ${topMover?.symbol || "the tape"} is currently leading.` : "Do not trade before the board has enough live context.",
    },
    {
      title: "Risk mode is respected",
      status: lossLocked ? "Blocked" : "Ready",
      note: lossLocked ? "The daily loss lock is active. The checklist is automatically failed." : "The session is not in protection mode.",
    },
    {
      title: "Trader behavior qualifies",
      status: disciplineScore >= 80 ? "Ready" : disciplineScore >= 70 ? "Caution" : "Blocked",
      note: disciplineScore >= 80 ? "Behavior is currently strong enough for normal desk standards." : disciplineScore >= 70 ? "Behavior is acceptable, but freedom should still be reduced." : "Behavior is too weak to trust with normal freedom.",
    },
    {
      title: "Playbook map exists",
      status: playbookCount >= 2 ? "Ready" : playbookCount >= 1 ? "Caution" : "Wait",
      note: playbookCount >= 2 ? `${playbookCount} saved playbooks are available for system-based execution.` : playbookCount === 1 ? "Only one playbook is available. Stay tight and avoid setup drift." : "Create at least one playbook before trusting discretionary trades.",
    },
    {
      title: "Market side is clear enough",
      status: Math.abs(breakouts - breakdowns) >= 2 ? "Ready" : "Caution",
      note: breakouts > breakdowns ? "The tape leans constructive." : breakdowns > breakouts ? "The tape leans defensive." : "The tape is still mixed, so selectivity matters more than direction.",
    },
    {
      title: "Review habit is active",
      status: state.journalAnalytics?.consistency_score >= 50 ? "Ready" : "Caution",
      note: `The strongest repeated journal pattern right now is ${topTag}.`,
    },
  ];

  const blockedCount = items.filter((item) => item.status === "Blocked").length;
  const cautionCount = items.filter((item) => item.status === "Caution").length;

  const checklistState =
    blockedCount ? "Blocked" :
    cautionCount >= 2 ? "Selective" :
    "Ready";
  const priority =
    lossLocked ? "Protect Capital" :
    disciplineScore < 70 ? "Repair Behavior" :
    Math.abs(breakouts - breakdowns) < 2 ? "Wait For Clarity" :
    topMover?.symbol || "Build Context";
  const hardRule =
    lossLocked ? "No fresh trades" :
    disciplineScore < 70 ? "No discretionary trades" :
    "No trade without clear invalidation";

  if (ids.checklistState) ids.checklistState.textContent = checklistState;
  if (ids.checklistStateCopy) ids.checklistStateCopy.textContent =
    checklistState === "Blocked" ? "The checklist has a hard failure and the desk should stand down." :
    checklistState === "Selective" ? "The checklist is partially satisfied, so only top-quality opportunities qualify." :
    "The desk state is good enough to operate normally with discipline.";
  if (ids.checklistPriority) ids.checklistPriority.textContent = priority;
  if (ids.checklistPriorityCopy) ids.checklistPriorityCopy.textContent = "This is the single most important session focus right now.";
  if (ids.checklistHardRule) ids.checklistHardRule.textContent = hardRule;
  if (ids.checklistHardRuleCopy) ids.checklistHardRuleCopy.textContent = "If this rule is violated, the desk should treat the session as compromised.";

  if (ids.checklistBoard) {
    ids.checklistBoard.innerHTML = items.map((item) => `
      <article class="journal-note journal-entry">
        <div class="journal-entry-head">
          <div>
            <strong>${escapeHtml(item.title)}</strong>
          </div>
          <span class="${item.status === "Ready" ? "quality-tier-a" : item.status === "Caution" ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(item.status)}</span>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk check</span>
          <p>${escapeHtml(item.note)}</p>
        </div>
      </article>
    `).join("");
  }

  if (ids.checklistNotes) {
    ids.checklistNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Session reminder</span>
          <p>${escapeHtml(
            checklistState === "Blocked"
              ? "Do not negotiate with the checklist. If the desk says no, the answer is no."
              : checklistState === "Selective"
                ? "Trade fewer names, require cleaner triggers, and let the best setup do the work."
                : "The checklist is supportive, but permission still depends on execution quality at the moment of entry."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Current focus</span>
          <p>${escapeHtml(`Priority is ${priority}. Keep the session simple and avoid adding complexity that does not improve edge.`)}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Hard stop</span>
          <p>${escapeHtml(hardRule)}</p>
        </div>
      </article>
    `;
  }
}

function renderConfidenceLadder() {
  if (!ids.confidenceBoard && !ids.confidenceNotes && !ids.confidenceState) return;

  const disciplineScore = Number(state.disciplineSummary?.discipline_score ?? 100);
  const analyticsScore = Number(state.journalAnalytics?.consistency_score ?? 0);
  const archiveScore = Math.min(100, (state.aplusSetups || []).length * 20);
  const lossLocked = Boolean(state.dailyLossState?.locked);
  const playbooks = state.playbooks || [];
  const entries = state.snapshot?.journalEntries || [];
  const complianceScore = entries.length && playbooks.length
    ? Math.round(
        entries.reduce((sum, entry) => {
          const best = playbooks
            .map((playbook) => scorePlaybookMatch(entry, playbook).score)
            .sort((a, b) => b - a)[0] || 0;
          return sum + best;
        }, 0) / entries.length
      )
    : 0;

  const confidenceScore = Math.round(
    (disciplineScore * 0.34)
    + (complianceScore * 0.28)
    + (analyticsScore * 0.18)
    + (archiveScore * 0.2)
  );

  let stateLabel = "Low";
  let sizePosture = "Half Size";
  let reason = "Sample Building";
  if (lossLocked) {
    stateLabel = "Frozen";
    sizePosture = "No New Risk";
    reason = "Protection Active";
  } else if (confidenceScore >= 85) {
    stateLabel = "High";
    sizePosture = "Normal Size";
    reason = "Earned Trust";
  } else if (confidenceScore >= 70) {
    stateLabel = "Building";
    sizePosture = "Selective Normal";
    reason = "Mostly Stable";
  } else if (disciplineScore < 70) {
    stateLabel = "Low";
    sizePosture = "Reduced Size";
    reason = "Discipline Drift";
  } else if (complianceScore < 55) {
    stateLabel = "Low";
    sizePosture = "Playbook Only";
    reason = "System Drift";
  }

  if (ids.confidenceState) ids.confidenceState.textContent = stateLabel;
  if (ids.confidenceStateCopy) ids.confidenceStateCopy.textContent =
    stateLabel === "Frozen" ? "Confidence is locked because capital protection is active." :
    stateLabel === "High" ? "The desk has enough evidence to trust normal operation." :
    stateLabel === "Building" ? "Confidence is improving, but it still has to be defended." :
    "Confidence is still too fragile for full freedom.";
  if (ids.confidenceSize) ids.confidenceSize.textContent = sizePosture;
  if (ids.confidenceSizeCopy) ids.confidenceSizeCopy.textContent = "This is the current size posture the desk should respect.";
  if (ids.confidenceReason) ids.confidenceReason.textContent = reason;
  if (ids.confidenceReasonCopy) ids.confidenceReasonCopy.textContent = "This is the main driver behind today's confidence level.";

  const ladder = [
    { label: "Frozen", active: stateLabel === "Frozen", passed: false, note: "Protection mode. No new risk is allowed." },
    { label: "Low", active: stateLabel === "Low", passed: confidenceScore >= 70 && !lossLocked, note: "Trade reduced, stay strict, and prove stability first." },
    { label: "Building", active: stateLabel === "Building", passed: confidenceScore >= 85 && !lossLocked, note: "Confidence is improving. Keep quality high and avoid giving it back." },
    { label: "High", active: stateLabel === "High", passed: false, note: "Normal size is justified only because the desk stack is supportive." },
  ];

  if (ids.confidenceBoard) {
    ids.confidenceBoard.innerHTML = ladder.map((item) => `
      <article class="journal-note journal-entry">
        <div class="journal-entry-head">
          <div>
            <strong>${escapeHtml(item.label)}</strong>
          </div>
          <span class="${item.active ? "quality-tier-b" : item.passed ? "quality-tier-a" : "quality-tier-watch"}">${escapeHtml(item.active ? "Current" : item.passed ? "Passed" : "Locked")}</span>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk meaning</span>
          <p>${escapeHtml(item.note)}</p>
        </div>
      </article>
    `).join("");
  }

  if (ids.confidenceNotes) {
    ids.confidenceNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Confidence rule</span>
          <p>${escapeHtml(
            stateLabel === "Frozen"
              ? "Do not use confidence as an excuse to override protection. Confidence is zero while protection is active."
              : stateLabel === "High"
                ? "Normal size is allowed, but only because the process is supportive. One sloppy session should reduce it again."
                : stateLabel === "Building"
                  ? "Defend the progress. Good behavior matters more than pressing more names."
                  : "Cut risk, simplify decisions, and rebuild trust through clean repetition."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">How to move up</span>
          <p>${escapeHtml(
            reason === "Discipline Drift"
              ? "Reduce mistakes first. Confidence cannot rise while behavior is leaking."
              : reason === "System Drift"
                ? "Trade saved playbooks only until the desk sees reliable adherence."
                : reason === "Protection Active"
                  ? "Finish the day in review mode and come back with clean process."
                  : "Keep logging strong reviews and build more A+ examples so the desk has evidence."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk truth</span>
          <p>${escapeHtml("Confidence should be earned slowly and lost quickly. The desk should never assume it is permanent.")}</p>
        </div>
      </article>
    `;
  }
}

function renderFocusBoard(snapshot) {
  if (!ids.focusBoard && !ids.focusNotes && !ids.focusTheme) return;

  const movers = snapshot.movers || [];
  const ranked = movers
    .map((mover) => {
      const quality = scoreMover(snapshot, mover);
      const confluence = scoreConfluence(snapshot, mover);
      const focusScore = Math.round((quality.score * 0.55) + (confluence.score * 0.45));
      return { ...mover, quality, confluence, focusScore };
    })
    .sort((a, b) => b.focusScore - a.focusScore);

  const focusNames = ranked.slice(0, 3);
  const ignoreNames = ranked.slice(3, 8);
  const breakouts = movers.filter(isBreakoutMover).length;
  const breakdowns = movers.filter(isBreakdownMover).length;

  const leadTheme =
    breakouts > breakdowns + 2 ? "Bullish Leadership" :
    breakdowns > breakouts + 2 ? "Defensive Weakness" :
    "Mixed Tape";
  const focusWidth =
    focusNames.length <= 2 ? "Ultra Narrow" :
    focusNames.length === 3 ? "Narrow" :
    "Broad";

  if (ids.focusTheme) ids.focusTheme.textContent = leadTheme;
  if (ids.focusThemeCopy) ids.focusThemeCopy.textContent =
    leadTheme === "Bullish Leadership" ? "The desk should stay with the strongest upside continuation names." :
    leadTheme === "Defensive Weakness" ? "The desk should stay with weak bounces and lower-side pressure." :
    "The desk should stay selective and avoid pretending the tape is cleaner than it is.";
  if (ids.focusWidth) ids.focusWidth.textContent = focusWidth;
  if (ids.focusWidthCopy) ids.focusWidthCopy.textContent = "This is how tight the desk should keep its attention today.";
  if (ids.focusIgnoreCount) ids.focusIgnoreCount.textContent = String(ignoreNames.length);
  if (ids.focusIgnoreCopy) ids.focusIgnoreCopy.textContent = ignoreNames.length
    ? `${ignoreNames.length} lower-priority names should stay on watch only.`
    : "No lower-priority names are being tracked right now.";

  if (ids.focusBoard) {
    ids.focusBoard.innerHTML = focusNames.length
      ? focusNames.map((item, index) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(item.symbol)}</strong>
                <div class="journal-entry-meta">
                  <span>Rank ${index + 1}</span>
                  <span>${escapeHtml(item.quality.tier)} quality</span>
                  <span>${escapeHtml(String(item.confluence.score))} confluence</span>
                </div>
              </div>
              <span class="${index === 0 ? "quality-tier-a" : "quality-tier-b"}">${escapeHtml(String(item.focusScore))}</span>
            </div>
            <div class="journal-entry-grid">
              <div class="journal-entry-row">
                <span class="journal-note-label">Why it belongs</span>
                <p>${escapeHtml(`${item.quality.note} ${item.confluence.note}`)}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Desk role</span>
                <p>${escapeHtml(index === 0 ? "Lead name. This should carry the best attention." : index === 1 ? "Secondary name. Tradable only if the lead remains clean." : "Tertiary name. Watch carefully, but do not let it distract from better quality.")}</p>
              </div>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">Focus names will appear here.</div>';
  }

  if (ids.focusNotes) {
    ids.focusNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Ignore list</span>
          <p>${escapeHtml(ignoreNames.length ? ignoreNames.map((item) => item.symbol).join(", ") : "No lower-priority names yet.")}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk rule</span>
          <p>${escapeHtml("If a name is not on the focus board, it does not deserve the same mental energy as the lead names.")}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Why this matters</span>
          <p>${escapeHtml("The desk usually loses quality when attention becomes too broad. Focus is part of risk management.")}</p>
        </div>
      </article>
    `;
  }
}

function renderMissedOpportunities(snapshot) {
  if (!ids.missedBoard && !ids.missedNotes && !ids.missedCount) return;

  const movers = snapshot.movers || [];
  const journalEntries = state.snapshot?.journalEntries || [];
  const journalText = journalEntries
    .map((entry) => `${entry.title || ""} ${entry.thesis || ""} ${entry.execution || ""} ${entry.lesson || ""} ${entry.tags || ""}`)
    .join(" ")
    .toLowerCase();

  const ranked = movers
    .map((mover) => {
      const quality = scoreMover(snapshot, mover);
      const confluence = scoreConfluence(snapshot, mover);
      const reviewMentioned = journalText.includes((mover.symbol || "").toLowerCase());
      const missScore = Math.round((quality.score * 0.58) + (confluence.score * 0.42) + (reviewMentioned ? -28 : 0));
      return { ...mover, quality, confluence, reviewMentioned, missScore };
    })
    .filter((item) => !item.reviewMentioned && item.missScore >= 70)
    .sort((a, b) => b.missScore - a.missScore)
    .slice(0, 6);

  const lead = ranked[0];
  const lesson =
    ranked.length >= 3 ? "Attention was too broad" :
    ranked.length >= 1 ? "A clear candidate was left under-reviewed" :
    "Review coverage is holding up";

  if (ids.missedCount) ids.missedCount.textContent = String(ranked.length);
  if (ids.missedCountCopy) ids.missedCountCopy.textContent =
    ranked.length ? `${ranked.length} strong names were not clearly reflected in the journal sample.` : "No obvious missed names are standing out right now.";
  if (ids.missedLead) ids.missedLead.textContent = lead ? `${lead.symbol} / ${lead.missScore}` : "None";
  if (ids.missedLeadCopy) ids.missedLeadCopy.textContent = lead
    ? `${lead.quality.tier} quality with ${lead.confluence.score} confluence never clearly entered the review flow.`
    : "The desk does not currently see a major missed candidate.";
  if (ids.missedLesson) ids.missedLesson.textContent = lesson;
  if (ids.missedLessonCopy) ids.missedLessonCopy.textContent = "This is the highest-value learning takeaway from the names that were not properly reviewed.";

  if (ids.missedBoard) {
    ids.missedBoard.innerHTML = ranked.length
      ? ranked.map((item) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(item.symbol)}</strong>
                <div class="journal-entry-meta">
                  <span>${escapeHtml(item.quality.tier)} quality</span>
                  <span>${escapeHtml(String(item.confluence.score))} confluence</span>
                  <span>${escapeHtml(formatPercent(item.change_percent))}</span>
                </div>
              </div>
              <span class="${item.missScore >= 82 ? "quality-tier-a" : "quality-tier-b"}">${escapeHtml(String(item.missScore))}</span>
            </div>
            <div class="journal-entry-grid">
              <div class="journal-entry-row">
                <span class="journal-note-label">Why it matters</span>
                <p>${escapeHtml(`${item.quality.note} ${item.confluence.note}`)}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Miss prompt</span>
                <p>${escapeHtml("Ask why this name never became part of the focus board, trade plan, or post-trade review.")}</p>
              </div>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">Missed opportunities will appear here.</div>';
  }

  if (ids.missedNotes) {
    ids.missedNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk lesson</span>
          <p>${escapeHtml(
            ranked.length >= 3
              ? "The desk likely watched too much at once. Narrow focus faster and let the lead names dominate attention."
              : ranked.length >= 1
                ? "There was at least one strong candidate that should have entered the focus and review process."
                : "Coverage looks reasonably complete. Keep the same selective review habit."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Review question</span>
          <p>${escapeHtml("Was the miss caused by poor focus, weak preparation, or hesitation even though the setup quality was there?")}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Action</span>
          <p>${escapeHtml("Take the lead missed name into Replay or Journal review and decide whether it belonged in a playbook, focus board, or execution gate.")}</p>
        </div>
      </article>
    `;
  }
}

function renderPlaybookCoverage() {
  if (!ids.coverageBoard && !ids.coverageNotes && !ids.coverageCovered) return;

  const playbooks = state.playbooks || [];
  const entries = state.snapshot?.journalEntries || [];

  const scored = playbooks.map((playbook) => {
    const matches = entries
      .map((entry) => scorePlaybookMatch(entry, playbook).score)
      .filter((score) => score >= 46);
    const avgMatch = matches.length
      ? Math.round(matches.reduce((sum, score) => sum + score, 0) / matches.length)
      : 0;
    const evidenceScore = Math.min(100, Math.round((matches.length * 18) + (avgMatch * 0.46)));
    return {
      ...playbook,
      matchCount: matches.length,
      avgMatch,
      evidenceScore,
      status: evidenceScore >= 75 ? "Covered" : evidenceScore >= 45 ? "Building" : "Thin",
    };
  }).sort((a, b) => b.evidenceScore - a.evidenceScore);

  const coveredCount = scored.filter((item) => item.status === "Covered").length;
  const thinCount = scored.filter((item) => item.status === "Thin").length;
  const best = scored[0];

  if (ids.coverageCovered) ids.coverageCovered.textContent = String(coveredCount);
  if (ids.coverageCoveredCopy) ids.coverageCoveredCopy.textContent =
    coveredCount ? `${coveredCount} playbooks have stronger evidence behind them.` : "No playbook has enough evidence yet.";
  if (ids.coverageThin) ids.coverageThin.textContent = String(thinCount);
  if (ids.coverageThinCopy) ids.coverageThinCopy.textContent =
    thinCount ? `${thinCount} playbooks still need more reviewed repetitions.` : "No obviously thin playbooks right now.";
  if (ids.coverageBest) ids.coverageBest.textContent = best ? `${best.title} / ${best.evidenceScore}` : "None";
  if (ids.coverageBestCopy) ids.coverageBestCopy.textContent = best
    ? `${best.matchCount} reviewed matches with ${best.avgMatch} average fit.`
    : "Save playbooks and journal reviews to build coverage.";

  if (ids.coverageBoard) {
    ids.coverageBoard.innerHTML = scored.length
      ? scored.map((item) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(item.title)}</strong>
                <div class="journal-entry-meta">
                  <span>${escapeHtml(item.setup_type)}</span>
                  <span>${escapeHtml(item.bias)}</span>
                  <span>${escapeHtml(`${item.matchCount} reviewed matches`)}</span>
                </div>
              </div>
              <span class="${item.status === "Covered" ? "quality-tier-a" : item.status === "Building" ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(item.status)}</span>
            </div>
            <div class="journal-entry-grid">
              <div class="journal-entry-row">
                <span class="journal-note-label">Coverage read</span>
                <p>${escapeHtml(
                  item.status === "Covered"
                    ? "This system has enough review evidence to deserve more trust."
                    : item.status === "Building"
                      ? "The system is promising, but still needs more repetitions."
                      : "This system is too thin to trust confidently yet."
                )}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Evidence</span>
                <p>${escapeHtml(`Average fit ${item.avgMatch}/100 across ${item.matchCount} reviewed trades.`)}</p>
              </div>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">Playbook coverage will appear here.</div>';
  }

  if (ids.coverageNotes) {
    ids.coverageNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk takeaway</span>
          <p>${escapeHtml(
            coveredCount
              ? "Use the better-covered playbooks as the center of the desk's trust."
              : "The desk still lacks enough repeated evidence to trust any one system fully."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Main fix</span>
          <p>${escapeHtml(
            thinCount
              ? "Either collect more reviewed examples for thin playbooks or remove them from active rotation."
              : "Keep reinforcing the same better-covered systems rather than expanding too fast."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk rule</span>
          <p>${escapeHtml("A playbook should not earn more size or freedom just because it sounds good. It needs evidence.")}</p>
        </div>
      </article>
    `;
  }
}

function renderEdgeStability() {
  if (!ids.edgeBoard && !ids.edgeNotes && !ids.edgeState) return;

  const playbooks = state.playbooks || [];
  const entries = state.snapshot?.journalEntries || [];
  const disciplineScore = Number(state.disciplineSummary?.discipline_score ?? 100);
  const consistencyScore = Number(state.journalAnalytics?.consistency_score ?? 0);
  const archiveScore = Math.min(100, (state.aplusSetups || []).length * 20);
  const protectionPenalty = state.dailyLossState?.locked ? 30 : 0;

  const playbookEvidence = playbooks.map((playbook) => {
    const matches = entries
      .map((entry) => scorePlaybookMatch(entry, playbook).score)
      .filter((score) => score >= 46);
    const avgMatch = matches.length
      ? Math.round(matches.reduce((sum, score) => sum + score, 0) / matches.length)
      : 0;
    return Math.min(100, Math.round((matches.length * 18) + (avgMatch * 0.46)));
  });

  const evidenceScore = playbookEvidence.length
    ? Math.round(playbookEvidence.reduce((sum, score) => sum + score, 0) / playbookEvidence.length)
    : 0;

  const edgeScore = Math.max(0, Math.round(
    (disciplineScore * 0.28)
    + (consistencyScore * 0.22)
    + (archiveScore * 0.18)
    + (evidenceScore * 0.32)
    - protectionPenalty
  ));

  let stateLabel = "Fragile";
  if (edgeScore >= 82) stateLabel = "Stable";
  else if (edgeScore >= 65) stateLabel = "Promising";

  let leak = "Thin Evidence";
  if (state.dailyLossState?.locked) leak = "Protection Trigger";
  else if (disciplineScore < 70) leak = "Behavioral Leakage";
  else if (evidenceScore < 55) leak = "Weak System Evidence";
  else if (consistencyScore < 45) leak = "Weak Review Habit";
  else if (archiveScore < 40) leak = "Weak Model Book";

  if (ids.edgeState) ids.edgeState.textContent = stateLabel;
  if (ids.edgeStateCopy) ids.edgeStateCopy.textContent =
    stateLabel === "Stable" ? "The edge is holding together across process, evidence, and review quality." :
    stateLabel === "Promising" ? "There is something real here, but it still needs cleaner repetition." :
    "The edge is too fragile to trust without tighter process and more proof.";
  if (ids.edgeScore) ids.edgeScore.textContent = String(edgeScore);
  if (ids.edgeScoreCopy) ids.edgeScoreCopy.textContent = "This score blends system evidence, review quality, archive strength, and trader behavior.";
  if (ids.edgeLeak) ids.edgeLeak.textContent = leak;
  if (ids.edgeLeakCopy) ids.edgeLeakCopy.textContent = "This is the main reason the edge is not more stable right now.";

  if (ids.edgeBoard) {
    const parts = [
      { label: "System Evidence", value: evidenceScore, note: `${playbooks.length} playbooks and ${entries.length} journal entries are supporting the edge.` },
      { label: "Discipline", value: disciplineScore, note: "Behavior quality either reinforces or leaks the edge." },
      { label: "Review Consistency", value: consistencyScore, note: "Better review quality makes the edge more learnable and repeatable." },
      { label: "Model Book", value: archiveScore, note: `${(state.aplusSetups || []).length} archived A+ examples are anchoring standards.` },
    ];

    ids.edgeBoard.innerHTML = parts.map((part) => `
      <article class="journal-note journal-entry">
        <div class="journal-entry-head">
          <div>
            <strong>${escapeHtml(part.label)}</strong>
            <div class="journal-entry-meta">
              <span>${escapeHtml(String(part.value))}/100</span>
            </div>
          </div>
          <span class="${part.value >= 80 ? "quality-tier-a" : part.value >= 60 ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(String(part.value))}</span>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk read</span>
          <p>${escapeHtml(part.note)}</p>
        </div>
      </article>
    `).join("");
  }

  if (ids.edgeNotes) {
    ids.edgeNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Stability read</span>
          <p>${escapeHtml(
            stateLabel === "Stable"
              ? "The edge is stable enough to deserve trust, but it still needs daily defense through process."
              : stateLabel === "Promising"
                ? "The edge looks real, but it is still one bad habit away from becoming noisy again."
                : "The edge is not stable enough to lean on. Reduce freedom and build cleaner evidence."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Main fix</span>
          <p>${escapeHtml(
            leak === "Protection Trigger"
              ? "Do not discuss edge expansion while protection mode is active."
              : leak === "Behavioral Leakage"
                ? "Fix discipline first. A leaky operator will always destabilize the edge."
                : leak === "Weak System Evidence"
                  ? "Collect more repetitions in the same playbooks before treating them as proven."
                  : leak === "Weak Review Habit"
                    ? "Improve review quality so the desk can tell what is actually working."
                    : "Archive better A+ examples to sharpen the desk's standards."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk principle</span>
          <p>${escapeHtml("An edge is not just a setup. It is a setup, repeated behavior, and review quality all working together.")}</p>
        </div>
      </article>
    `;
  }
}

function renderReviewQueue(snapshot) {
  if (!ids.reviewQueueBoard && !ids.reviewQueueNotes && !ids.reviewQueueSize) return;

  const movers = snapshot.movers || [];
  const journalEntries = state.snapshot?.journalEntries || [];
  const playbooks = state.playbooks || [];
  const journalText = journalEntries
    .map((entry) => `${entry.title || ""} ${entry.thesis || ""} ${entry.execution || ""} ${entry.lesson || ""} ${entry.tags || ""}`)
    .join(" ")
    .toLowerCase();

  const complianceItems = journalEntries.map((entry) => {
    const ranked = playbooks
      .map((playbook) => ({ playbook, score: scorePlaybookMatch(entry, playbook).score }))
      .sort((a, b) => b.score - a.score);
    const best = ranked[0];
    return {
      type: "Compliance",
      title: entry.title || "Untitled trade",
      score: 100 - (best?.score || 0),
      note: best?.score >= 55
        ? "Review execution quality, not just setup fit."
        : "This trade drifted away from the saved playbooks and deserves review.",
    };
  });

  const missedItems = movers.map((mover) => {
    const quality = scoreMover(snapshot, mover);
    const confluence = scoreConfluence(snapshot, mover);
    const mentioned = journalText.includes((mover.symbol || "").toLowerCase());
    return {
      type: "Missed",
      title: mover.symbol,
      score: mentioned ? 0 : Math.round((quality.score * 0.56) + (confluence.score * 0.44)),
      note: mentioned
        ? "Already reflected in review flow."
        : "Strong live name that does not clearly appear in the review sample.",
    };
  }).filter((item) => item.score >= 70);

  const playbookItems = playbooks.map((playbook) => {
    const matches = journalEntries
      .map((entry) => scorePlaybookMatch(entry, playbook).score)
      .filter((score) => score >= 46);
    const avg = matches.length ? Math.round(matches.reduce((sum, score) => sum + score, 0) / matches.length) : 0;
    return {
      type: "Coverage",
      title: playbook.title,
      score: Math.max(0, 100 - Math.min(100, Math.round((matches.length * 18) + (avg * 0.46)))),
      note: matches.length < 2
        ? "This playbook is under-sampled and needs more reviewed repetitions."
        : "Coverage exists, but the desk may still want more evidence.",
    };
  }).filter((item) => item.score >= 35);

  const queue = [...complianceItems, ...missedItems, ...playbookItems]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const top = queue[0];
  const themeCounts = queue.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});
  const dominantTheme = Object.entries(themeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  if (ids.reviewQueueSize) ids.reviewQueueSize.textContent = String(queue.length);
  if (ids.reviewQueueSizeCopy) ids.reviewQueueSizeCopy.textContent =
    queue.length ? `${queue.length} high-priority review items are waiting.` : "No major review bottlenecks right now.";
  if (ids.reviewTopItem) ids.reviewTopItem.textContent = top ? `${top.type} / ${top.title}` : "None";
  if (ids.reviewTopItemCopy) ids.reviewTopItemCopy.textContent = top ? top.note : "The queue is currently clear.";
  if (ids.reviewTheme) ids.reviewTheme.textContent = dominantTheme;
  if (ids.reviewThemeCopy) ids.reviewThemeCopy.textContent = "This is the strongest review theme currently demanding attention.";

  if (ids.reviewQueueBoard) {
    ids.reviewQueueBoard.innerHTML = queue.length
      ? queue.map((item) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(item.title)}</strong>
                <div class="journal-entry-meta">
                  <span>${escapeHtml(item.type)}</span>
                  <span>${escapeHtml(String(item.score))} priority</span>
                </div>
              </div>
              <span class="${item.score >= 75 ? "quality-tier-a" : item.score >= 55 ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(item.type)}</span>
            </div>
            <div class="journal-entry-row">
              <span class="journal-note-label">Review prompt</span>
              <p>${escapeHtml(item.note)}</p>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">Review items will appear here.</div>';
  }

  if (ids.reviewQueueNotes) {
    ids.reviewQueueNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk guidance</span>
          <p>${escapeHtml(
            queue.length
              ? "Work the queue from top to bottom. The first few items are where the desk can learn the most right now."
              : "The queue is relatively clean. Use the time to reinforce strong systems and archive better examples."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Dominant theme</span>
          <p>${escapeHtml(
            dominantTheme === "Compliance"
              ? "The biggest issue is whether the trader is actually following the system."
              : dominantTheme === "Missed"
                ? "The biggest issue is missed attention and under-review of strong names."
                : dominantTheme === "Coverage"
                  ? "The biggest issue is thin evidence behind saved playbooks."
                  : "No single review theme is dominating right now."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk rule</span>
          <p>${escapeHtml("Do not review randomly. Review order is part of edge development.")}</p>
        </div>
      </article>
    `;
  }
}

function renderThemeTracker(snapshot) {
  if (!ids.themeBoard && !ids.themeNotes && !ids.themeLead) return;

  const movers = snapshot.movers || [];
  const alerts = snapshot.recent_alerts || [];
  const reviewThemes = state.journalAnalytics?.top_tags || [];
  const themeCounts = {};

  movers.forEach((mover) => {
    const direction = isBreakoutMover(mover) ? "Upside Expansion" : isBreakdownMover(mover) ? "Downside Pressure" : "Mixed";
    themeCounts[direction] = (themeCounts[direction] || 0) + 2;
    (mover.flags || []).forEach((flag) => {
      const key = flag.includes("HIGH")
        ? "High Breakout"
        : flag.includes("LOW")
          ? "Low Breakdown"
          : flag.includes("WEEK")
            ? "Weekly Expansion"
            : "General Flow";
      themeCounts[key] = (themeCounts[key] || 0) + 1;
    });
  });

  alerts.forEach((alert) => {
    const scope = (alert.scope || "General").split(" ")[0];
    themeCounts[scope] = (themeCounts[scope] || 0) + 1;
  });

  const rankedThemes = Object.entries(themeCounts)
    .map(([theme, score]) => ({ theme, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const leadTheme = rankedThemes[0]?.theme || "No active theme";
  const reviewBias = reviewThemes[0]?.tag || "No review bias yet";
  const alignment =
    reviewThemes.some((item) => leadTheme.toLowerCase().includes((item.tag || "").toLowerCase()) || (item.tag || "").toLowerCase().includes(leadTheme.toLowerCase().split(" ")[0]))
      ? "Aligned"
      : reviewThemes.length
        ? "Drifting"
        : "Unclear";

  if (ids.themeLead) ids.themeLead.textContent = leadTheme;
  if (ids.themeLeadCopy) ids.themeLeadCopy.textContent = rankedThemes[0] ? `${rankedThemes[0].score} live theme points are currently supporting this idea.` : "No dominant live theme yet.";
  if (ids.themeAlignment) ids.themeAlignment.textContent = alignment;
  if (ids.themeAlignmentCopy) ids.themeAlignmentCopy.textContent =
    alignment === "Aligned"
      ? "Trader review attention is reasonably aligned with the current tape themes."
      : alignment === "Drifting"
        ? "The review habit is not fully aligned with the strongest live theme."
        : "There is not enough review evidence yet to judge alignment.";
  if (ids.themeReviewBias) ids.themeReviewBias.textContent = reviewBias;
  if (ids.themeReviewBiasCopy) ids.themeReviewBiasCopy.textContent = reviewThemes.length
    ? `${reviewThemes[0].count} mentions make this the strongest current review-side bias.`
    : "Journal tags are still too thin to define a review-side bias.";

  if (ids.themeBoard) {
    ids.themeBoard.innerHTML = rankedThemes.length
      ? rankedThemes.map((item, index) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(item.theme)}</strong>
                <div class="journal-entry-meta">
                  <span>Rank ${index + 1}</span>
                  <span>${escapeHtml(String(item.score))} theme points</span>
                </div>
              </div>
              <span class="${index === 0 ? "quality-tier-a" : index < 3 ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(index === 0 ? "Lead" : "Watch")}</span>
            </div>
            <div class="journal-entry-row">
              <span class="journal-note-label">Desk read</span>
              <p>${escapeHtml(index === 0 ? "This is the strongest repeating theme in the live board right now." : "This theme is present, but secondary to the lead idea.")}</p>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">Theme details will appear here.</div>';
  }

  if (ids.themeNotes) {
    ids.themeNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk takeaway</span>
          <p>${escapeHtml(
            alignment === "Aligned"
              ? "The desk is watching the same type of opportunity that the tape keeps producing."
              : alignment === "Drifting"
                ? "The tape and the review process are not pointing at the same thing. Fix attention before fixing tactics."
                : "Build more consistent journal tags so the desk can compare review themes against live themes."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Current theme focus</span>
          <p>${escapeHtml(`Lead with ${leadTheme} until the board proves something else deserves that attention.`)}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk rule</span>
          <p>${escapeHtml("If the trader's review themes do not match the market's live themes, the desk should expect weaker focus and slower learning.")}</p>
        </div>
      </article>
    `;
  }
}

function renderDecisionAudit() {
  if (!ids.auditBoard && !ids.auditNotes && !ids.auditState) return;

  const disciplineScore = Number(state.disciplineSummary?.discipline_score ?? 100);
  const consistencyScore = Number(state.journalAnalytics?.consistency_score ?? 0);
  const lossLocked = Boolean(state.dailyLossState?.locked);
  const playbooks = state.playbooks || [];
  const entries = state.snapshot?.journalEntries || [];

  const complianceScore = entries.length && playbooks.length
    ? Math.round(
        entries.reduce((sum, entry) => {
          const best = playbooks
            .map((playbook) => scorePlaybookMatch(entry, playbook).score)
            .sort((a, b) => b - a)[0] || 0;
          return sum + best;
        }, 0) / entries.length
      )
    : 0;

  const decisionScore = Math.max(0, Math.round(
    (disciplineScore * 0.42)
    + (complianceScore * 0.34)
    + (consistencyScore * 0.24)
    - (lossLocked ? 22 : 0)
  ));

  let stateLabel = "Messy";
  if (decisionScore >= 82) stateLabel = "Clean";
  else if (decisionScore >= 65) stateLabel = "Workable";

  let fault = "Thin Review";
  if (lossLocked) fault = "Protection Trigger";
  else if (disciplineScore < 70) fault = "Behavioral Drift";
  else if (complianceScore < 55) fault = "System Drift";
  else if (consistencyScore < 45) fault = "Weak Review Habit";

  if (ids.auditState) ids.auditState.textContent = stateLabel;
  if (ids.auditStateCopy) ids.auditStateCopy.textContent =
    stateLabel === "Clean"
      ? "Recent decisions are mostly behaving like trained desk decisions."
      : stateLabel === "Workable"
        ? "Recent decisions are usable, but still not clean enough to fully trust."
        : "Recent decisions are too noisy and need tighter process control.";
  if (ids.auditScore) ids.auditScore.textContent = String(decisionScore);
  if (ids.auditScoreCopy) ids.auditScoreCopy.textContent = "This score combines discipline, system fit, and review quality.";
  if (ids.auditFault) ids.auditFault.textContent = fault;
  if (ids.auditFaultCopy) ids.auditFaultCopy.textContent = "This is the main issue lowering decision quality right now.";

  if (ids.auditBoard) {
    const rows = [
      { label: "Discipline", value: disciplineScore, note: "Good decisions usually break down first through behavior." },
      { label: "System Fit", value: complianceScore, note: "A decision is stronger when it clearly belongs to a saved playbook." },
      { label: "Review Quality", value: consistencyScore, note: "Weak reviews make it harder to improve the next decision." },
      { label: "Protection Status", value: lossLocked ? 20 : 85, note: lossLocked ? "Protection mode is reducing trust in current decisions." : "No active protection override is distorting the session." },
    ];

    ids.auditBoard.innerHTML = rows.map((row) => `
      <article class="journal-note journal-entry">
        <div class="journal-entry-head">
          <div>
            <strong>${escapeHtml(row.label)}</strong>
            <div class="journal-entry-meta">
              <span>${escapeHtml(String(row.value))}/100</span>
            </div>
          </div>
          <span class="${row.value >= 80 ? "quality-tier-a" : row.value >= 60 ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(String(row.value))}</span>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Audit read</span>
          <p>${escapeHtml(row.note)}</p>
        </div>
      </article>
    `).join("");
  }

  if (ids.auditNotes) {
    ids.auditNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Decision read</span>
          <p>${escapeHtml(
            stateLabel === "Clean"
              ? "The desk is seeing cleaner process and more trustworthy decisions. Keep the same standards."
              : stateLabel === "Workable"
                ? "The desk can work with these decisions, but one weak habit is still limiting trust."
                : "The desk should reduce freedom until the decision process becomes cleaner."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Main fix</span>
          <p>${escapeHtml(
            fault === "Protection Trigger"
              ? "Do not evaluate decision quality as strong while protection mode is active."
              : fault === "Behavioral Drift"
                ? "Fix repeated behavioral leaks before blaming the market."
                : fault === "System Drift"
                  ? "Map more decisions back to saved systems."
                  : "Write stronger post-trade reviews so the desk can understand the actual decision chain."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk rule</span>
          <p>${escapeHtml("A profitable trade with a bad decision process should still be treated as a weak decision.")}</p>
        </div>
      </article>
    `;
  }
}

function renderWeeklyReview() {
  if (!ids.weeklyBoard && !ids.weeklyNotes && !ids.weeklyTone) return;

  const discipline = Number(state.disciplineSummary?.discipline_score ?? 100);
  const consistency = Number(state.journalAnalytics?.consistency_score ?? 0);
  const topTag = state.journalAnalytics?.top_tags?.[0]?.tag || "No consistent tag";
  const topBreach = state.disciplineSummary?.top_breaches?.[0]?.rule_type || "No recurring breach";
  const aplusCount = (state.aplusSetups || []).length;
  const playbooks = state.playbooks || [];
  const entries = state.snapshot?.journalEntries || [];

  const coverageScores = playbooks.map((playbook) => {
    const matches = entries
      .map((entry) => scorePlaybookMatch(entry, playbook).score)
      .filter((score) => score >= 46);
    const avg = matches.length ? Math.round(matches.reduce((sum, score) => sum + score, 0) / matches.length) : 0;
    return Math.min(100, Math.round((matches.length * 18) + (avg * 0.46)));
  });
  const coverage = coverageScores.length
    ? Math.round(coverageScores.reduce((sum, score) => sum + score, 0) / coverageScores.length)
    : 0;

  let tone = "Rebuild";
  if (discipline >= 80 && consistency >= 60 && coverage >= 65) tone = "Constructive";
  else if (discipline >= 70 && consistency >= 45) tone = "Building";

  const bestHabit =
    consistency >= 60 ? `Strong review around ${topTag}` :
    discipline >= 80 ? "Behavior stayed relatively clean" :
    aplusCount >= 3 ? "A+ archive is taking shape" :
    "No clear strength yet";

  const mainLeak =
    discipline < 70 ? "Behavioral leakage" :
    coverage < 55 ? "Thin system evidence" :
    consistency < 45 ? "Weak review habit" :
    topBreach !== "No recurring breach" ? topBreach :
    "No major recurring leak";

  if (ids.weeklyTone) ids.weeklyTone.textContent = tone;
  if (ids.weeklyToneCopy) ids.weeklyToneCopy.textContent =
    tone === "Constructive"
      ? "The desk is seeing a stronger, more repeatable operating pattern."
      : tone === "Building"
        ? "The week shows progress, but the edge still needs steadier reinforcement."
        : "The operating pattern still needs simplification and repair.";
  if (ids.weeklyBestHabit) ids.weeklyBestHabit.textContent = bestHabit;
  if (ids.weeklyBestHabitCopy) ids.weeklyBestHabitCopy.textContent = "This is the strongest repeated habit currently supporting the desk.";
  if (ids.weeklyMainLeak) ids.weeklyMainLeak.textContent = mainLeak;
  if (ids.weeklyMainLeakCopy) ids.weeklyMainLeakCopy.textContent = "This is the leak most worth attacking in the next stretch.";

  if (ids.weeklyBoard) {
    const rows = [
      { label: "Discipline", value: discipline, note: `${state.disciplineSummary?.breach_count ?? 0} breaches are shaping the behavior picture.` },
      { label: "Review Consistency", value: consistency, note: `${topTag} is the strongest repeated review-side theme.` },
      { label: "System Evidence", value: coverage, note: `${playbooks.length} playbooks are contributing to the current evidence base.` },
      { label: "Model Book", value: Math.min(100, aplusCount * 20), note: `${aplusCount} archived A+ examples are available.` },
    ];

    ids.weeklyBoard.innerHTML = rows.map((row) => `
      <article class="journal-note journal-entry">
        <div class="journal-entry-head">
          <div>
            <strong>${escapeHtml(row.label)}</strong>
            <div class="journal-entry-meta">
              <span>${escapeHtml(String(row.value))}/100</span>
            </div>
          </div>
          <span class="${row.value >= 80 ? "quality-tier-a" : row.value >= 60 ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(String(row.value))}</span>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Weekly read</span>
          <p>${escapeHtml(row.note)}</p>
        </div>
      </article>
    `).join("");
  }

  if (ids.weeklyNotes) {
    ids.weeklyNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Carry forward</span>
          <p>${escapeHtml(
            tone === "Constructive"
              ? "Carry forward the same operating standards and reinforce what is already proving repeatable."
              : tone === "Building"
                ? "Keep what is improving, but do not expand the system until the weaker layer catches up."
                : "Strip the process down, reduce freedom, and focus on one or two cleaner fixes only."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Do more of</span>
          <p>${escapeHtml(bestHabit)}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Do less of</span>
          <p>${escapeHtml(mainLeak)}</p>
        </div>
      </article>
    `;
  }
}

function renderSystemRotation(snapshot) {
  if (!ids.rotationBoard && !ids.rotationNotes && !ids.rotationActiveCount) return;

  const playbooks = state.playbooks || [];
  const entries = state.snapshot?.journalEntries || [];
  const movers = snapshot.movers || [];
  const breakoutCount = movers.filter(isBreakoutMover).length;
  const breakdownCount = movers.filter(isBreakdownMover).length;
  const tapeBias = breakoutCount > breakdownCount + 2 ? "bullish" : breakdownCount > breakoutCount + 2 ? "bearish" : "balanced";

  const scored = playbooks.map((playbook) => {
    const matches = entries
      .map((entry) => scorePlaybookMatch(entry, playbook).score)
      .filter((score) => score >= 46);
    const avgMatch = matches.length
      ? Math.round(matches.reduce((sum, score) => sum + score, 0) / matches.length)
      : 0;
    const evidence = Math.min(100, Math.round((matches.length * 18) + (avgMatch * 0.46)));
    const bias = (playbook.bias || "").toLowerCase();
    const tapeFit =
      tapeBias === "balanced" ? 60 :
      bias.includes("bull") && tapeBias === "bullish" ? 92 :
      bias.includes("bear") && tapeBias === "bearish" ? 92 :
      42;
    const rotationScore = Math.round((evidence * 0.62) + (tapeFit * 0.38));
    const status = rotationScore >= 78 ? "Active" : rotationScore >= 55 ? "Watch" : "Benched";
    return { ...playbook, evidence, tapeFit, rotationScore, status, matchCount: matches.length, avgMatch };
  }).sort((a, b) => b.rotationScore - a.rotationScore);

  const active = scored.filter((item) => item.status === "Active");
  const watch = scored.filter((item) => item.status === "Watch");
  const bench = scored.filter((item) => item.status === "Benched");

  if (ids.rotationActiveCount) ids.rotationActiveCount.textContent = String(active.length);
  if (ids.rotationActiveCopy) ids.rotationActiveCopy.textContent = active.length ? "These systems have enough evidence and current tape fit to stay in rotation." : "No system currently deserves full active rotation.";
  if (ids.rotationWatchCount) ids.rotationWatchCount.textContent = String(watch.length);
  if (ids.rotationWatchCopy) ids.rotationWatchCopy.textContent = watch.length ? "These systems are promising, but not yet strong enough for full trust." : "No watchlist systems right now.";
  if (ids.rotationBenchCount) ids.rotationBenchCount.textContent = String(bench.length);
  if (ids.rotationBenchCopy) ids.rotationBenchCopy.textContent = bench.length ? "These systems need more evidence or a better tape fit before they return." : "No systems are currently benched.";

  if (ids.rotationBoard) {
    ids.rotationBoard.innerHTML = scored.length
      ? scored.map((item) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(item.title)}</strong>
                <div class="journal-entry-meta">
                  <span>${escapeHtml(item.setup_type)}</span>
                  <span>${escapeHtml(item.bias)}</span>
                  <span>${escapeHtml(`${item.matchCount} matches`)}</span>
                </div>
              </div>
              <span class="${item.status === "Active" ? "quality-tier-a" : item.status === "Watch" ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(item.status)}</span>
            </div>
            <div class="journal-entry-grid">
              <div class="journal-entry-row">
                <span class="journal-note-label">Rotation read</span>
                <p>${escapeHtml(
                  item.status === "Active"
                    ? "Keep this system in active desk rotation."
                    : item.status === "Watch"
                      ? "This system is worth monitoring, but should not dominate the desk yet."
                      : "Bench this system until evidence or tape fit improves."
                )}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Evidence / fit</span>
                <p>${escapeHtml(`Evidence ${item.evidence}/100, tape fit ${item.tapeFit}/100, rotation ${item.rotationScore}/100.`)}</p>
              </div>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">System rotation will appear here.</div>';
  }

  if (ids.rotationNotes) {
    ids.rotationNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk rotation read</span>
          <p>${escapeHtml(
            active.length
              ? "Keep the active system set small. A stronger desk usually trades fewer, better systems."
              : "Do not force system rotation when the evidence base is weak."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">What earns rotation</span>
          <p>${escapeHtml("A system earns active rotation through evidence, repeatability, and current tape relevance.")}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">What loses rotation</span>
          <p>${escapeHtml("Thin coverage, weak tape fit, and poor repeatability should push a system to watch or bench status.")}</p>
        </div>
      </article>
    `;
  }
}

function renderPreparationScore(snapshot) {
  if (!ids.prepBoard && !ids.prepNotes && !ids.prepScore) return;

  const disciplineScore = Number(state.disciplineSummary?.discipline_score ?? 100);
  const consistencyScore = Number(state.journalAnalytics?.consistency_score ?? 0);
  const lossLocked = Boolean(state.dailyLossState?.locked);
  const playbooks = state.playbooks || [];
  const entries = state.snapshot?.journalEntries || [];
  const movers = snapshot.movers || [];
  const breakoutCount = movers.filter(isBreakoutMover).length;
  const breakdownCount = movers.filter(isBreakdownMover).length;
  const opportunityScore = Math.min(100, (Math.max(breakoutCount, breakdownCount) * 12) + (movers.length ? 18 : 0));

  const complianceScores = entries.length && playbooks.length
    ? entries.map((entry) => {
        const best = playbooks
          .map((playbook) => scorePlaybookMatch(entry, playbook).score)
          .sort((a, b) => b - a)[0] || 0;
        return best;
      })
    : [];
  const complianceScore = complianceScores.length
    ? Math.round(complianceScores.reduce((sum, score) => sum + score, 0) / complianceScores.length)
    : 0;

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (disciplineScore * 0.3) +
        (consistencyScore * 0.22) +
        (complianceScore * 0.2) +
        (opportunityScore * 0.18) +
        ((lossLocked ? 25 : 90) * 0.1)
      )
    )
  );

  const stateLabel =
    lossLocked ? "Blocked" :
    score >= 80 ? "Ready" :
    score >= 62 ? "Selective" :
    score >= 45 ? "Needs Work" :
    "Not Ready";

  const blocker =
    lossLocked ? "Daily loss lock is active" :
    disciplineScore < 72 ? "Discipline is leaking" :
    consistencyScore < 45 ? "Review consistency is thin" :
    complianceScore < 52 ? "System fit is weak" :
    opportunityScore < 42 ? "Tape opportunity is thin" :
    "No major blocker";

  if (ids.prepScore) ids.prepScore.textContent = String(score);
  if (ids.prepScoreCopy) ids.prepScoreCopy.textContent =
    score >= 80
      ? "The desk is prepared enough to act, but still only on quality."
      : score >= 62
        ? "The desk is usable, but entries should stay selective."
        : "Preparation is not clean enough for aggressive decisions.";
  if (ids.prepState) ids.prepState.textContent = stateLabel;
  if (ids.prepStateCopy) ids.prepStateCopy.textContent =
    stateLabel === "Ready"
      ? "The operating baseline is stable enough for disciplined execution."
      : stateLabel === "Selective"
        ? "Trade only the best-looking names and keep freedom tight."
        : stateLabel === "Blocked"
          ? "Protection has priority over opportunity right now."
          : "Fix the weak layer before pressing the session.";
  if (ids.prepBlocker) ids.prepBlocker.textContent = blocker;
  if (ids.prepBlockerCopy) ids.prepBlockerCopy.textContent =
    blocker === "No major blocker"
      ? "No single issue is dominating the preparation read."
      : "This is the first thing the desk should address.";

  if (ids.prepBoard) {
    ids.prepBoard.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Discipline layer</span>
          <p>${escapeHtml(`Discipline score is ${disciplineScore}/100, which ${disciplineScore >= 80 ? "supports stable decision-making." : "still weakens readiness."}`)}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">System layer</span>
          <p>${escapeHtml(`System fit reads ${complianceScore}/100 across saved playbooks and reviewed entries.`)}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Review layer</span>
          <p>${escapeHtml(`Consistency is ${consistencyScore}/100, so the desk ${consistencyScore >= 55 ? "has enough review continuity to trust the read." : "still needs a steadier review habit."}`)}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Opportunity layer</span>
          <p>${escapeHtml(`Live opportunity reads ${opportunityScore}/100 from current breakout and breakdown activity.`)}</p>
        </div>
      </article>
    `;
  }

  if (ids.prepNotes) {
    ids.prepNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk read</span>
          <p>${escapeHtml(
            stateLabel === "Ready"
              ? "The trader is prepared enough to participate, but the desk should still prefer the cleanest names only."
              : stateLabel === "Selective"
                ? "Preparation is workable, but the desk should trade small and stay close to the playbook."
                : stateLabel === "Blocked"
                  ? "The desk should not seek opportunity until protection constraints are cleared."
                  : "Reduce freedom, simplify the plan, and repair readiness before leaning into the tape."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">What helps readiness</span>
          <p>${escapeHtml("Stable discipline, clear playbook fit, repeatable review habits, and enough tape opportunity.")}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">What hurts readiness</span>
          <p>${escapeHtml("Thin review evidence, weak discipline, forced trading, and trying to operate without a clear system match.")}</p>
        </div>
      </article>
    `;
  }
}

function renderHabitRadar() {
  if (!ids.habitBoard && !ids.habitNotes && !ids.habitState) return;

  const disciplineScore = Number(state.disciplineSummary?.discipline_score ?? 100);
  const topBreach = state.disciplineSummary?.top_breaches?.[0];
  const topTag = state.journalAnalytics?.top_tags?.[0];
  const consistencyScore = Number(state.journalAnalytics?.consistency_score ?? 0);
  const playbooks = state.playbooks || [];
  const entries = state.snapshot?.journalEntries || [];

  const complianceScores = entries.length && playbooks.length
    ? entries.map((entry) => {
        const best = playbooks
          .map((playbook) => scorePlaybookMatch(entry, playbook).score)
          .sort((a, b) => b - a)[0] || 0;
        return best;
      })
    : [];
  const complianceScore = complianceScores.length
    ? Math.round(complianceScores.reduce((sum, score) => sum + score, 0) / complianceScores.length)
    : 0;

  const habitState =
    disciplineScore >= 82 && consistencyScore >= 55 && complianceScore >= 58
      ? "Compounding"
      : disciplineScore >= 68 && consistencyScore >= 40
        ? "Building"
        : topBreach
          ? "Leaking"
          : "Unclear";

  const strongestHabit =
    topTag?.tag
      ? `Reviewing ${topTag.tag}`
      : consistencyScore >= 50
        ? "Showing up for review"
        : "No habit is strong enough yet";

  const mainLeak =
    topBreach?.rule_type
      ? topBreach.rule_type
      : disciplineScore < 75
        ? "Discipline drift"
        : consistencyScore < 45
          ? "Inconsistent review habit"
          : "No major leak";

  if (ids.habitState) ids.habitState.textContent = habitState;
  if (ids.habitStateCopy) ids.habitStateCopy.textContent =
    habitState === "Compounding"
      ? "The trader is repeating more helpful behavior than harmful behavior."
      : habitState === "Building"
        ? "Some habits are improving, but they need more consistency."
        : habitState === "Leaking"
          ? "A repeating leak is still defining the session behavior."
          : "There is not enough repeated behavior yet for a strong read.";
  if (ids.habitStrongest) ids.habitStrongest.textContent = strongestHabit;
  if (ids.habitStrongestCopy) ids.habitStrongestCopy.textContent =
    strongestHabit === "No habit is strong enough yet"
      ? "The desk needs more clean repetition before a strength becomes visible."
      : "This is the behavior the desk should reinforce.";
  if (ids.habitLeak) ids.habitLeak.textContent = mainLeak;
  if (ids.habitLeakCopy) ids.habitLeakCopy.textContent =
    mainLeak === "No major leak"
      ? "No single behavior is clearly dragging the desk down right now."
      : "This is the habit that should be interrupted first.";

  if (ids.habitBoard) {
    ids.habitBoard.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Behavior read</span>
          <p>${escapeHtml(`Habit state is ${habitState.toLowerCase()} with discipline at ${disciplineScore}/100, review consistency at ${consistencyScore}/100, and system fit at ${complianceScore}/100.`)}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Strongest pattern</span>
          <p>${escapeHtml(strongestHabit)}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Main leak</span>
          <p>${escapeHtml(mainLeak)}</p>
        </div>
      </article>
    `;
  }

  if (ids.habitNotes) {
    ids.habitNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk coaching note</span>
          <p>${escapeHtml(
            habitState === "Compounding"
              ? "Protect the strongest habits and avoid expanding freedom faster than the habits can support."
              : habitState === "Building"
                ? "Keep the process tight and reinforce the strongest pattern until it becomes automatic."
                : habitState === "Leaking"
                  ? "Do not focus on ten fixes at once. Stop the main leak first and keep the rest of the process simple."
                  : "The desk needs more repetition before it can coach habits with confidence."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">What to reinforce</span>
          <p>${escapeHtml("Repeat the cleanest review behavior, keep system fit visible, and reward discipline over impulse.")}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">What to interrupt</span>
          <p>${escapeHtml("Recurring breaches, inconsistent review, and any habit that pulls the trader away from saved systems.")}</p>
        </div>
      </article>
    `;
  }
}

function renderMarketNarrative(snapshot) {
  if (!ids.narrativeBoard && !ids.narrativeNotes && !ids.narrativeTheme) return;

  const movers = snapshot.movers || [];
  const alerts = snapshot.recent_alerts || [];
  const smcSignals = snapshot.smc_signals || [];
  const breakouts = movers.filter(isBreakoutMover);
  const breakdowns = movers.filter(isBreakdownMover);
  const freshAlerts = alerts.slice(0, 8);
  const bullishSmc = smcSignals.filter((signal) => (signal.bias || "").toLowerCase().includes("bull")).length;
  const bearishSmc = smcSignals.filter((signal) => (signal.bias || "").toLowerCase().includes("bear")).length;

  const theme =
    breakouts.length >= breakdowns.length + 4 && bullishSmc >= bearishSmc
      ? "Expansion"
      : breakdowns.length >= breakouts.length + 4 && bearishSmc >= bullishSmc
        ? "Distribution"
        : Math.abs(breakouts.length - breakdowns.length) <= 2 && freshAlerts.length >= 4
          ? "Rotation"
          : freshAlerts.length <= 2
            ? "Drift"
            : "Mixed";

  const leadership =
    breakouts.length > breakdowns.length
      ? `${breakouts.length} upside leaders`
      : breakdowns.length > breakouts.length
        ? `${breakdowns.length} downside leaders`
        : "Balanced leadership";

  const tone =
    theme === "Expansion"
      ? "Press winners"
      : theme === "Distribution"
        ? "Protect capital"
        : theme === "Rotation"
          ? "Stay selective"
          : theme === "Drift"
            ? "Do less"
            : "Keep reads tight";

  if (ids.narrativeTheme) ids.narrativeTheme.textContent = theme;
  if (ids.narrativeThemeCopy) ids.narrativeThemeCopy.textContent =
    theme === "Expansion"
      ? "The tape is broad enough to support continuation behavior."
      : theme === "Distribution"
        ? "The market is leaning defensive and breakdown pressure is leading."
        : theme === "Rotation"
          ? "Opportunity exists, but it is moving around instead of trending cleanly."
          : theme === "Drift"
            ? "The session lacks enough clean participation to force trades."
            : "The session is mixed and needs tighter filtering.";
  if (ids.narrativeLeadership) ids.narrativeLeadership.textContent = leadership;
  if (ids.narrativeLeadershipCopy) ids.narrativeLeadershipCopy.textContent =
    "Leadership is the fastest clue for whether the tape deserves pressure or patience.";
  if (ids.narrativeTone) ids.narrativeTone.textContent = tone;
  if (ids.narrativeToneCopy) ids.narrativeToneCopy.textContent =
    "This is the desk posture the session is currently arguing for.";

  if (ids.narrativeBoard) {
    ids.narrativeBoard.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Session story</span>
          <p>${escapeHtml(
            theme === "Expansion"
              ? "Breakouts are leading, structure is supportive, and the session is behaving like a continuation tape."
              : theme === "Distribution"
                ? "Breakdowns and bearish structure are carrying the session, so the tape is arguing for defense first."
                : theme === "Rotation"
                  ? "Opportunity is present, but leadership is changing hands quickly and the tape should be treated as rotational."
                  : theme === "Drift"
                    ? "The tape does not have enough clean participation to reward unnecessary action."
                    : "The tape is sending mixed signals, so any trade needs stronger confluence than usual."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Breadth and structure</span>
          <p>${escapeHtml(`Breakouts: ${breakouts.length}, breakdowns: ${breakdowns.length}, bullish SMC: ${bullishSmc}, bearish SMC: ${bearishSmc}.`)}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Leadership clue</span>
          <p>${escapeHtml(leadership)}</p>
        </div>
      </article>
    `;
  }

  if (ids.narrativeNotes) {
    ids.narrativeNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk note</span>
          <p>${escapeHtml(
            theme === "Expansion"
              ? "Let the strongest names carry attention, but avoid diluting focus across too many second-tier setups."
              : theme === "Distribution"
                ? "Respect weakness, keep risk small, and wait for cleaner confirmation before pressing."
                : theme === "Rotation"
                  ? "Use tighter selection and shorter expectations because leadership can change quickly."
                  : theme === "Drift"
                    ? "The best decision may be to reduce activity and preserve energy for a clearer tape."
                    : "Require better evidence than usual and keep the desk from inventing certainty."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">What to watch</span>
          <p>${escapeHtml("Leadership concentration, fresh alert quality, and whether structure keeps agreeing with the direction of the tape.")}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">What to avoid</span>
          <p>${escapeHtml("Reading every move as a trend day when the tape is only rotating, drifting, or sending mixed signals.")}</p>
        </div>
      </article>
    `;
  }
}

function renderTraderScorecard() {
  if (!ids.scorecardBoard && !ids.scorecardNotes && !ids.scorecardScore) return;

  const discipline = state.disciplineSummary || {};
  const lossState = state.dailyLossState || {};
  const analytics = state.journalAnalytics || {};
  const playbooks = state.playbooks || [];
  const entries = state.snapshot?.journalEntries || [];
  const aplusCount = (state.aplusSetups || []).length;

  const complianceScores = entries.length && playbooks.length
    ? entries.map((entry) => {
        const best = playbooks
          .map((playbook) => scorePlaybookMatch(entry, playbook).score)
          .sort((a, b) => b - a)[0] || 0;
        return best;
      })
    : [];
  const complianceScore = complianceScores.length
    ? Math.round(complianceScores.reduce((sum, score) => sum + score, 0) / complianceScores.length)
    : 0;

  const disciplineScore = Number(discipline.discipline_score ?? 100);
  const consistencyScore = Number(analytics.consistency_score ?? 0);
  const protectionScore = lossState.locked ? 55 : 86;
  const archiveScore = Math.min(100, aplusCount * 18);
  const deskScore = Math.round(
    (disciplineScore * 0.28)
    + (complianceScore * 0.26)
    + (consistencyScore * 0.18)
    + (protectionScore * 0.14)
    + (archiveScore * 0.14)
  );

  const grade = deskScore >= 85 ? "A" : deskScore >= 75 ? "B" : deskScore >= 65 ? "C" : deskScore >= 50 ? "Watch" : "Reset";
  let constraint = "Build Sample";
  if (disciplineScore < 70) constraint = "Discipline Drift";
  else if (complianceScore < 55) constraint = "System Drift";
  else if (lossState.locked) constraint = "Risk Lock";
  else if (consistencyScore < 45) constraint = "Thin Journal";
  else if (archiveScore < 40) constraint = "Weak Model Book";

  if (ids.scorecardGrade) ids.scorecardGrade.textContent = grade;
  if (ids.scorecardGradeCopy) ids.scorecardGradeCopy.textContent =
    grade === "A" ? "Trader behavior is operating close to desk standards." :
    grade === "B" ? "The trader is functioning well, with a few areas to tighten." :
    grade === "C" ? "The desk sees promise, but execution quality still leaks." :
    grade === "Watch" ? "The trader is still too unstable for full confidence." :
    "The operator stack needs a reset before trust grows.";
  if (ids.scorecardScore) ids.scorecardScore.textContent = String(deskScore);
  if (ids.scorecardScoreCopy) ids.scorecardScoreCopy.textContent = "This score blends discipline, compliance, journal consistency, risk protection, and A+ archive progress.";
  if (ids.scorecardConstraint) ids.scorecardConstraint.textContent = constraint;
  if (ids.scorecardConstraintCopy) ids.scorecardConstraintCopy.textContent =
    constraint === "Discipline Drift" ? "Process errors are the main cap on trader growth right now." :
    constraint === "System Drift" ? "Trades are not staying close enough to saved playbooks." :
    constraint === "Risk Lock" ? "Capital protection is shaping the day more than opportunity." :
    constraint === "Thin Journal" ? "The review sample is still too thin for reliable self-coaching." :
    constraint === "Weak Model Book" ? "There are not enough A+ examples to anchor visual standards." :
    "The desk needs more repeated examples before the score means much.";

  if (ids.scorecardBoard) {
    const parts = [
      { label: "Discipline", value: disciplineScore, note: `${discipline.breach_count ?? 0} breaches logged.` },
      { label: "Playbook Compliance", value: complianceScore, note: `${entries.length} reviewed journal entries in the sample.` },
      { label: "Journal Consistency", value: consistencyScore, note: `${analytics.top_tags?.[0]?.tag || "No top tag yet"} is the strongest repeated journal pattern.` },
      { label: "Risk Protection", value: protectionScore, note: lossState.locked ? "Daily loss lock is active." : "Protection posture is currently healthy." },
      { label: "A+ Archive", value: archiveScore, note: `${aplusCount} model-book setups have been saved.` },
    ];

    ids.scorecardBoard.innerHTML = parts.map((part) => `
      <article class="journal-note journal-entry">
        <div class="journal-entry-head">
          <div>
            <strong>${escapeHtml(part.label)}</strong>
            <div class="journal-entry-meta">
              <span>${escapeHtml(String(part.value))}/100</span>
            </div>
          </div>
          <span class="${part.value >= 80 ? "quality-tier-a" : part.value >= 65 ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(String(part.value))}</span>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk note</span>
          <p>${escapeHtml(part.note)}</p>
        </div>
      </article>
    `).join("");
  }

  if (ids.scorecardNotes) {
    ids.scorecardNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk read</span>
          <p>${escapeHtml(
            deskScore >= 80
              ? "This trader is becoming trustworthy. The focus should be on repeating strengths and avoiding complacency."
              : deskScore >= 65
                ? "The foundation is forming, but one weak layer is still reducing trust. Improve the main constraint before expanding risk."
                : "The trader is not operating cleanly enough yet. Reduce freedom and rebuild from process quality."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Most important fix</span>
          <p>${escapeHtml(
            constraint === "Discipline Drift"
              ? "Review every rule breach and remove the repeated mistake before trying to optimize setups."
              : constraint === "System Drift"
                ? "Force each trade to map back to a saved playbook before execution."
                : constraint === "Risk Lock"
                  ? "Protect confidence first. Use the session as review mode and do not chase recovery."
                  : constraint === "Thin Journal"
                    ? "Write fuller post-trade notes so the desk has enough evidence to coach correctly."
                    : constraint === "Weak Model Book"
                      ? "Archive more A+ examples so the trader has better visual and structural standards."
                      : "Keep building repeated examples under the same conditions."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Promotion trigger</span>
          <p>${escapeHtml("To move the score materially higher, the trader needs stronger discipline, more consistent playbook adherence, and a clearer archive of best examples.")}</p>
        </div>
      </article>
    `;
  }
}

function renderTrades(snapshot) {
  const movers = snapshot.movers || [];
  const breakouts = movers.filter(isBreakoutMover);
  const breakdowns = movers.filter(isBreakdownMover);

  renderRows(
    ids.breakoutsTableBody,
    breakouts.map((mover) => {
      const quality = scoreMover(snapshot, mover);
      return `
      <tr>
        <td>${mover.symbol}</td>
        <td>${formatNumber(mover.price)}</td>
        <td class="terminal-positive">${formatPercent(mover.change_percent)}</td>
        <td><span class="${quality.toneClass}">${quality.tier} / ${quality.score}</span></td>
        <td>${(mover.flags || []).join(", ") || "Bullish Flow"}</td>
        <td>${formatTime(mover.updated_at)}</td>
      </tr>
    `;
    }),
    6,
    "No active breakouts right now.",
  );

  renderRows(
    ids.breakdownsTableBody,
    breakdowns.map((mover) => {
      const quality = scoreMover(snapshot, mover);
      return `
      <tr>
        <td>${mover.symbol}</td>
        <td>${formatNumber(mover.price)}</td>
        <td class="terminal-negative">${formatPercent(mover.change_percent)}</td>
        <td><span class="${quality.toneClass}">${quality.tier} / ${quality.score}</span></td>
        <td>${(mover.flags || []).join(", ") || "Bearish Flow"}</td>
        <td>${formatTime(mover.updated_at)}</td>
      </tr>
    `;
    }),
    6,
    "No active breakdowns right now.",
  );
}

function renderSmc(snapshot) {
  const smcSignals = snapshot.smc_signals || [];
  renderRows(
    ids.smcTableBody,
    smcSignals.map((signal) => `
      <tr>
        <td>${signal.display_symbol}</td>
        <td>${signal.signal}</td>
        <td>${signal.bias}</td>
        <td>${formatNumber(signal.reference_price)}</td>
        <td>${formatNumber(signal.live_price)}</td>
        <td>${signal.detail}</td>
      </tr>
    `),
    6,
    "No live SMC signals yet.",
  );
}

function renderJournal(snapshot) {
  if (!ids.journalBoard) return;
  const entries = snapshot.journalEntries || [];
  ids.journalBoard.innerHTML = entries.length
    ? entries.map((entry) => `
        <article class="journal-note journal-entry">
          <div class="journal-entry-head">
            <div>
              <strong>${entry.title}</strong>
              <div class="journal-entry-meta">
                <span>${formatTime(entry.created_at)}</span>
                <span>${entry.tags || "No tags"}</span>
              </div>
            </div>
            <button class="journal-delete-btn" data-entry-id="${entry.id}" type="button">Delete</button>
          </div>
          <div class="journal-entry-grid">
            <div class="journal-entry-row">
              <span class="journal-note-label">Setup</span>
              <p>${entry.thesis}</p>
            </div>
            <div class="journal-entry-row">
              <span class="journal-note-label">Execution</span>
              <p>${entry.execution}</p>
            </div>
            <div class="journal-entry-row">
              <span class="journal-note-label">Takeaway</span>
              <p>${entry.lesson}</p>
            </div>
          </div>
        </article>
      `).join("")
    : '<div class="terminal-empty-copy">No entries yet. Save your first journal note for this account.</div>';

  ids.journalBoard.querySelectorAll(".journal-delete-btn").forEach((button) => {
    button.addEventListener("click", () => deleteJournalEntry(button.dataset.entryId));
  });
}

function renderDiscipline(summary, events) {
  if (ids.disciplineScore) ids.disciplineScore.textContent = String(summary.discipline_score ?? 100);
  if (ids.disciplineScoreCopy) ids.disciplineScoreCopy.textContent =
    (summary.discipline_score ?? 100) >= 85 ? "Behavior is staying inside desk standards." :
    (summary.discipline_score ?? 100) >= 70 ? "Some drift is showing. Tighten process before it compounds." :
    "Discipline is under pressure. Reduce freedom and return to rules.";
  if (ids.disciplineBreachCount) ids.disciplineBreachCount.textContent = String(summary.breach_count ?? 0);
  if (ids.disciplineBreachCopy) ids.disciplineBreachCopy.textContent =
    (summary.breach_count ?? 0) ? "Breach count tracks repeated process mistakes over time." : "No logged breaches yet.";
  if (ids.disciplineHighCount) ids.disciplineHighCount.textContent = String(summary.high_severity_count ?? 0);
  if (ids.disciplineHighCopy) ids.disciplineHighCopy.textContent =
    (summary.high_severity_count ?? 0) ? "High-severity events need immediate review." : "No high-severity events logged.";

  if (ids.disciplineTopBoard) {
    ids.disciplineTopBoard.innerHTML = (summary.top_breaches || []).length
      ? summary.top_breaches.map((item) => `
          <div class="toolkit-inline-card">
            <strong>${escapeHtml(item.rule_type)}</strong>
            <span>${escapeHtml(String(item.count))} occurrences</span>
          </div>
        `).join("")
      : '<div class="terminal-empty-copy">Top discipline patterns will appear here.</div>';
  }

  if (ids.disciplineBoard) {
    ids.disciplineBoard.innerHTML = events.length
      ? events.map((event) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(event.rule_type)}</strong>
                <div class="journal-entry-meta">
                  <span>${escapeHtml(event.severity)}</span>
                  <span>${escapeHtml(event.symbol || "No symbol")}</span>
                  <span>${escapeHtml(formatTime(event.created_at))}</span>
                </div>
              </div>
              <button class="journal-delete-btn" data-discipline-id="${event.id}" type="button">Delete</button>
            </div>
            <div class="journal-entry-row">
              <span class="journal-note-label">What happened</span>
              <p>${escapeHtml(event.note || "No note added.")}</p>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">No discipline events logged yet.</div>';

    ids.disciplineBoard.querySelectorAll("[data-discipline-id]").forEach((button) => {
      button.addEventListener("click", () => deleteDisciplineEvent(button.dataset.disciplineId));
    });
  }
}

function renderAPlusArchive(setups) {
  if (!ids.aplusBoard) return;
  ids.aplusBoard.innerHTML = setups.length
    ? setups.map((setup) => `
        <article class="journal-note journal-entry">
          <div class="journal-entry-head">
            <div>
              <strong>${escapeHtml(setup.title)}</strong>
              <div class="journal-entry-meta">
                <span>${escapeHtml(setup.symbol)}</span>
                <span>${escapeHtml(setup.setup_type)}</span>
                <span>${escapeHtml(setup.bias)}</span>
              </div>
            </div>
            <button class="journal-delete-btn" data-aplus-id="${setup.id}" type="button">Delete</button>
          </div>
          <div class="journal-entry-grid">
            <div class="journal-entry-row">
              <span class="journal-note-label">Why it was A+</span>
              <p>${escapeHtml(setup.rationale)}</p>
            </div>
            <div class="journal-entry-row">
              <span class="journal-note-label">Context</span>
              <p>${escapeHtml(setup.context_note || "No extra context added.")}</p>
            </div>
          </div>
        </article>
      `).join("")
    : '<div class="terminal-empty-copy">No A+ setups archived yet.</div>';

  ids.aplusBoard.querySelectorAll("[data-aplus-id]").forEach((button) => {
    button.addEventListener("click", () => deleteAPlusSetup(button.dataset.aplusId));
  });
}

function renderClosingReview() {
  const snapshot = state.snapshot || {};
  const movers = snapshot.movers || [];
  const breakouts = movers.filter(isBreakoutMover).length;
  const breakdowns = movers.filter(isBreakdownMover).length;
  const discipline = state.disciplineSummary || {};
  const lossState = state.dailyLossState || {};
  const analytics = state.journalAnalytics || {};
  const aplusCount = (state.aplusSetups || []).length;

  let tone = "Balanced";
  let toneCopy = "The desk ended without strong one-way dominance.";
  if (breakouts > breakdowns + 2) {
    tone = "Constructive";
    toneCopy = "The session closed with stronger upside participation.";
  } else if (breakdowns > breakouts + 2) {
    tone = "Defensive";
    toneCopy = "The session closed with broader downside pressure.";
  }
  if (lossState.locked) {
    tone = "Protected";
    toneCopy = "The desk ended in capital-protection mode after breaching the daily limit.";
  }

  if (ids.closingTone) ids.closingTone.textContent = tone;
  if (ids.closingToneCopy) ids.closingToneCopy.textContent = toneCopy;
  if (ids.closingDisciplineScore) ids.closingDisciplineScore.textContent = String(discipline.discipline_score ?? 100);
  if (ids.closingDisciplineCopy) ids.closingDisciplineCopy.textContent =
    (discipline.discipline_score ?? 100) >= 85 ? "Behavior stayed mostly inside desk rules." :
    (discipline.discipline_score ?? 100) >= 70 ? "Behavior drifted enough to deserve tighter review." :
    "Behavior became a major problem and should shape tomorrow's restrictions.";
  if (ids.closingAplusCount) ids.closingAplusCount.textContent = String(aplusCount);
  if (ids.closingAplusCopy) ids.closingAplusCopy.textContent =
    aplusCount ? `${aplusCount} model-book setups are now saved.` : "No A+ examples were archived yet.";

  if (ids.closingSummary) {
    ids.closingSummary.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Session read</span>
          <p>${escapeHtml(`Breakouts ${breakouts}, breakdowns ${breakdowns}, discipline score ${discipline.discipline_score ?? 100}, realized P&L ${formatNumber(lossState.realized_pnl ?? 0)}.`)}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Best lesson</span>
          <p>${escapeHtml(analytics.recent_lessons?.[0]?.lesson || "Add journal entries and review discipline to sharpen the close.")}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Top breach</span>
          <p>${escapeHtml(discipline.top_breaches?.[0] ? `${discipline.top_breaches[0].rule_type} (${discipline.top_breaches[0].count})` : "No recurring discipline breach recorded.")}</p>
        </div>
      </article>
    `;
  }

  if (ids.closingCarry) {
    const carryNotes = [
      lossState.locked
        ? "Tomorrow starts from protection mode. Reduce freedom and rebuild confidence through rule quality, not revenge."
        : "Tomorrow should start with the same risk plan unless new weakness appears in discipline or breadth.",
      aplusCount
        ? `Review ${aplusCount} A+ setups before the next session to anchor what clean quality actually looks like.`
        : "Build the A+ archive so the desk has better visual standards for what deserves real size.",
      analytics.top_tags?.[0]?.tag
        ? `Your most repeated journal tag is ${analytics.top_tags[0].tag}. Use that to decide what deserves more attention tomorrow.`
        : "Journal tagging is still thin. Tag tomorrow's entries more consistently so patterns emerge faster.",
    ];

    ids.closingCarry.innerHTML = `
      <article class="journal-note journal-entry">
        ${carryNotes.map((note, index) => `
          <div class="journal-entry-row">
            <span class="journal-note-label">Carry ${index + 1}</span>
            <p>${escapeHtml(note)}</p>
          </div>
        `).join("")}
      </article>
    `;
  }
}

function renderDailyLossLock(stateData) {
  if (ids.lossLockPnl && document.activeElement !== ids.lossLockPnl) {
    ids.lossLockPnl.value = stateData.realized_pnl ?? 0;
  }
  if (ids.lossLockNote && document.activeElement !== ids.lossLockNote) {
    ids.lossLockNote.value = stateData.note || "";
  }

  if (ids.lossLockStatus) ids.lossLockStatus.textContent = stateData.locked ? "LOCKED" : "Open";
  if (ids.lossLockStatusCopy) {
    ids.lossLockStatusCopy.textContent = stateData.locked
      ? "The desk has breached the daily loss cap. No new risk should be taken."
      : "The desk is still inside its daily loss allowance.";
  }
  if (ids.lossLockLimit) ids.lossLockLimit.textContent = formatNumber(stateData.loss_limit);
  if (ids.lossLockLimitCopy) {
    ids.lossLockLimitCopy.textContent = `${formatNumber(stateData.max_daily_loss_pct, 1)}% of ${formatNumber(stateData.account_size)}`;
  }
  if (ids.lossLockBuffer) ids.lossLockBuffer.textContent = formatNumber(stateData.remaining_buffer);
  if (ids.lossLockBufferCopy) {
    ids.lossLockBufferCopy.textContent = stateData.remaining_buffer <= 0
      ? "The daily buffer is exhausted."
      : "This is the remaining room before the day is locked.";
  }
  if (ids.lossLockGuidance) {
    ids.lossLockGuidance.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-head">
          <div>
            <strong>${escapeHtml(stateData.locked ? "Protection mode active" : "Desk still open")}</strong>
            <div class="journal-entry-meta">
              <span>${escapeHtml(stateData.trade_date || "")}</span>
              <span>${escapeHtml(`Realized P&L ${formatNumber(stateData.realized_pnl)}`)}</span>
            </div>
          </div>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk action</span>
          <p>${escapeHtml(stateData.locked ? "Stop trading for the day, review the mistakes, and protect capital. The product should now be treated as review-only for this session." : "Trade normally only if setups are high quality and discipline remains intact. Do not let a green or slightly red day loosen process.")}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk note</span>
          <p>${escapeHtml(stateData.note || "No desk note saved for today.")}</p>
        </div>
      </article>
    `;
  }
}

function renderWatchlists(watchlists) {
  if (!ids.watchlistBoard) return;
  ids.watchlistBoard.innerHTML = watchlists.length
    ? watchlists.map((watchlist) => `
        <article class="journal-note journal-entry">
          <div class="journal-entry-head">
            <div>
              <strong>${watchlist.name}</strong>
              <div class="journal-entry-meta">
                <span>${watchlist.symbols}</span>
                <span>${formatTime(watchlist.created_at)}</span>
              </div>
            </div>
            <button class="journal-delete-btn" data-watchlist-id="${watchlist.id}" type="button">Delete</button>
          </div>
          <div class="journal-entry-row">
            <span class="journal-note-label">Notes</span>
            <p>${watchlist.notes || "No notes added."}</p>
          </div>
        </article>
      `).join("")
    : '<div class="terminal-empty-copy">No watchlists yet.</div>';

  ids.watchlistBoard.querySelectorAll("[data-watchlist-id]").forEach((button) => {
    button.addEventListener("click", () => deleteWatchlist(button.dataset.watchlistId));
  });
}

function renderAlertRules(alerts) {
  if (!ids.alertBoard) return;
  ids.alertBoard.innerHTML = alerts.length
    ? alerts.map((rule) => `
        <article class="journal-note journal-entry">
          <div class="journal-entry-head">
            <div>
              <strong>${rule.name}</strong>
              <div class="journal-entry-meta">
                <span>${rule.rule_type}</span>
                <span>${rule.scope}</span>
              </div>
            </div>
            <button class="journal-delete-btn" data-alert-id="${rule.id}" type="button">Delete</button>
          </div>
          <div class="journal-entry-grid">
            <div class="journal-entry-row">
              <span class="journal-note-label">Threshold</span>
              <p>${rule.threshold}</p>
            </div>
            <div class="journal-entry-row">
              <span class="journal-note-label">Notes</span>
              <p>${rule.notes || "No notes added."}</p>
            </div>
          </div>
        </article>
      `).join("")
    : '<div class="terminal-empty-copy">No alert rules yet.</div>';

  ids.alertBoard.querySelectorAll("[data-alert-id]").forEach((button) => {
    button.addEventListener("click", () => deleteAlertRule(button.dataset.alertId));
  });
}

function renderPlaybooks(playbooks) {
  if (!ids.playbookBoard) return;
  ids.playbookBoard.innerHTML = playbooks.length
    ? playbooks.map((playbook) => `
        <article class="journal-note journal-entry">
          <div class="journal-entry-head">
            <div>
              <strong>${playbook.title}</strong>
              <div class="journal-entry-meta">
                <span>${playbook.setup_type}</span>
                <span>${playbook.bias}</span>
              </div>
            </div>
            <button class="journal-delete-btn" data-playbook-id="${playbook.id}" type="button">Delete</button>
          </div>
          <div class="journal-entry-grid">
            <div class="journal-entry-row"><span class="journal-note-label">Entry</span><p>${playbook.entry_rule}</p></div>
            <div class="journal-entry-row"><span class="journal-note-label">Risk</span><p>${playbook.risk_rule}</p></div>
            <div class="journal-entry-row"><span class="journal-note-label">Exit</span><p>${playbook.exit_rule}</p></div>
          </div>
        </article>
      `).join("")
    : '<div class="terminal-empty-copy">No playbooks yet.</div>';

  ids.playbookBoard.querySelectorAll("[data-playbook-id]").forEach((button) => {
    button.addEventListener("click", () => deletePlaybook(button.dataset.playbookId));
  });
}

function tokenizeForCompliance(...values) {
  return values
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter((token) => token && token.length > 2);
}

function scorePlaybookMatch(entry, playbook) {
  const entryTokens = tokenizeForCompliance(entry.title, entry.thesis, entry.execution, entry.lesson, entry.tags);
  const playbookTokens = tokenizeForCompliance(
    playbook.title,
    playbook.setup_type,
    playbook.bias,
    playbook.entry_rule,
    playbook.risk_rule,
    playbook.exit_rule,
  );

  if (!entryTokens.length || !playbookTokens.length) {
    return { score: 0, overlap: [] };
  }

  const entrySet = new Set(entryTokens);
  const playbookSet = new Set(playbookTokens);
  const overlap = [...entrySet].filter((token) => playbookSet.has(token));
  const overlapRatio = overlap.length / Math.max(Math.min(entrySet.size, playbookSet.size), 1);

  let score = Math.round(overlapRatio * 100);
  const bias = (playbook.bias || "").toLowerCase();
  if (bias && entryTokens.includes(bias)) score += 10;
  if ((entry.tags || "").toLowerCase().includes((playbook.setup_type || "").toLowerCase())) score += 12;
  if ((entry.title || "").toLowerCase().includes((playbook.title || "").toLowerCase().slice(0, 8))) score += 8;

  return {
    score: Math.min(score, 100),
    overlap: overlap.slice(0, 6),
  };
}

function renderPlaybookCompliance() {
  const entries = state.snapshot?.journalEntries || [];
  const playbooks = state.playbooks || [];

  if (!ids.complianceBoard && !ids.complianceNotes && !ids.complianceScore) return;

  if (!playbooks.length) {
    if (ids.complianceScore) ids.complianceScore.textContent = "0";
    if (ids.complianceScoreCopy) ids.complianceScoreCopy.textContent = "Save a playbook first so the desk can compare execution against your system.";
    if (ids.complianceMatchCount) ids.complianceMatchCount.textContent = "0";
    if (ids.complianceMatchCopy) ids.complianceMatchCopy.textContent = "No playbooks available for comparison yet.";
    if (ids.complianceDrift) ids.complianceDrift.textContent = "Unknown";
    if (ids.complianceDriftCopy) ids.complianceDriftCopy.textContent = "System drift appears after the first saved playbook.";
    if (ids.complianceBoard) ids.complianceBoard.innerHTML = '<div class="terminal-empty-copy">Create a playbook to start measuring compliance.</div>';
    if (ids.complianceNotes) ids.complianceNotes.innerHTML = '<div class="terminal-empty-copy">Guidance will appear after your first saved system.</div>';
    return;
  }

  if (!entries.length) {
    if (ids.complianceScore) ids.complianceScore.textContent = "0";
    if (ids.complianceScoreCopy) ids.complianceScoreCopy.textContent = "Journal entries are needed before compliance can be measured.";
    if (ids.complianceMatchCount) ids.complianceMatchCount.textContent = "0";
    if (ids.complianceMatchCopy) ids.complianceMatchCopy.textContent = "No journal entries have been logged yet.";
    if (ids.complianceDrift) ids.complianceDrift.textContent = "Waiting";
    if (ids.complianceDriftCopy) ids.complianceDriftCopy.textContent = "Add a few trade reviews and the desk will start spotting drift.";
    if (ids.complianceBoard) ids.complianceBoard.innerHTML = '<div class="terminal-empty-copy">Your latest journal entries will be compared against playbooks here.</div>';
    if (ids.complianceNotes) ids.complianceNotes.innerHTML = '<div class="terminal-empty-copy">Desk guidance appears after the first journaled trade.</div>';
    return;
  }

  const rankedMatches = entries.map((entry) => {
    const rankedPlaybooks = playbooks
      .map((playbook) => ({ playbook, match: scorePlaybookMatch(entry, playbook) }))
      .sort((a, b) => b.match.score - a.match.score);
    const best = rankedPlaybooks[0];
    return {
      entry,
      playbook: best?.playbook || null,
      score: best?.match?.score || 0,
      overlap: best?.match?.overlap || [],
    };
  });

  const averageScore = Math.round(rankedMatches.reduce((sum, item) => sum + item.score, 0) / Math.max(rankedMatches.length, 1));
  const matchedEntries = rankedMatches.filter((item) => item.score >= 46);
  const driftRate = 100 - averageScore;
  const driftLabel = driftRate <= 24 ? "Low" : driftRate <= 44 ? "Moderate" : "High";
  const topMatches = rankedMatches.slice(0, 8);

  if (ids.complianceScore) ids.complianceScore.textContent = String(averageScore);
  if (ids.complianceScoreCopy) ids.complianceScoreCopy.textContent =
    averageScore >= 75 ? "Execution is staying close to the desk's saved systems." :
    averageScore >= 55 ? "The trader is partly aligned, but there is noticeable drift." :
    "Execution is drifting away from the saved playbooks.";
  if (ids.complianceMatchCount) ids.complianceMatchCount.textContent = String(matchedEntries.length);
  if (ids.complianceMatchCopy) ids.complianceMatchCopy.textContent =
    matchedEntries.length ? `${matchedEntries.length} journal entries matched a saved playbook strongly enough.` : "None of the recent journal entries matched a saved playbook cleanly.";
  if (ids.complianceDrift) ids.complianceDrift.textContent = driftLabel;
  if (ids.complianceDriftCopy) ids.complianceDriftCopy.textContent =
    driftLabel === "Low" ? "The trader is repeating the system with decent consistency." :
    driftLabel === "Moderate" ? "Some trades fit the playbook, but others are improvising." :
    "Current behavior looks more reactive than rule-based.";

  if (ids.complianceBoard) {
    ids.complianceBoard.innerHTML = topMatches.length
      ? topMatches.map((item) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(item.entry.title || "Untitled trade")}</strong>
                <div class="journal-entry-meta">
                  <span>${escapeHtml(formatDateTime(item.entry.created_at))}</span>
                  <span>${escapeHtml(item.playbook?.title || "No playbook match")}</span>
                </div>
              </div>
              <span class="${item.score >= 75 ? "quality-tier-a" : item.score >= 55 ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(String(item.score))}</span>
            </div>
            <div class="journal-entry-grid">
              <div class="journal-entry-row">
                <span class="journal-note-label">Best system fit</span>
                <p>${escapeHtml(item.playbook ? `${item.playbook.setup_type} / ${item.playbook.bias}` : "No saved playbook aligned strongly with this entry.")}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Overlap</span>
                <p>${escapeHtml(item.overlap.length ? item.overlap.join(", ") : "Very little language overlap with the saved system.")}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Lesson</span>
                <p>${escapeHtml(item.entry.lesson || "No lesson recorded.")}</p>
              </div>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">Compliance matches will appear here.</div>';
  }

  if (ids.complianceNotes) {
    const weakEntries = rankedMatches.filter((item) => item.score < 46).length;
    const topPlaybook = matchedEntries
      .map((item) => item.playbook?.title)
      .filter(Boolean)
      .reduce((acc, title) => {
        acc[title] = (acc[title] || 0) + 1;
        return acc;
      }, {});
    const topSystem = Object.entries(topPlaybook).sort((a, b) => b[1] - a[1])[0]?.[0] || "No repeatable system yet";

    ids.complianceNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk read</span>
          <p>${escapeHtml(
            averageScore >= 75
              ? "The trader is mostly executing from saved systems. Keep reinforcing the same patterns instead of expanding too fast."
              : averageScore >= 55
                ? "There is some system adherence, but the desk should tighten trade selection and naming discipline."
                : "Execution is too discretionary right now. Reduce size and force every journal entry to tie back to a saved playbook."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Most-followed system</span>
          <p>${escapeHtml(topSystem)}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Immediate fix</span>
          <p>${escapeHtml(
            weakEntries
              ? `${weakEntries} recent entries had weak playbook alignment. Review those trades and either formalize them into new playbooks or stop taking them.`
              : "Recent entries are aligning well. Keep naming setups consistently in the journal so compliance stays measurable."
          )}</p>
        </div>
      </article>
    `;
  }
}

function renderRiskProfile(profile) {
  if (ids.riskAccountSize) ids.riskAccountSize.value = profile.account_size ?? 100000;
  if (ids.riskPerTrade) ids.riskPerTrade.value = profile.risk_per_trade ?? 1;
  if (ids.riskMaxDailyLoss) ids.riskMaxDailyLoss.value = profile.max_daily_loss ?? 3;
  if (ids.riskPreferredRr) ids.riskPreferredRr.value = profile.preferred_rr ?? 2;
  if (ids.riskSummary) {
    const perTradeRisk = Number(profile.account_size || 0) * (Number(profile.risk_per_trade || 0) / 100);
    const dailyRisk = Number(profile.account_size || 0) * (Number(profile.max_daily_loss || 0) / 100);
    ids.riskSummary.innerHTML = `
      <div class="toolkit-metric-card"><span>Risk Budget</span><strong>${formatNumber(perTradeRisk)}</strong></div>
      <div class="toolkit-metric-card"><span>Daily Loss Cap</span><strong>${formatNumber(dailyRisk)}</strong></div>
      <div class="toolkit-metric-card"><span>Preferred Reward</span><strong>${formatNumber(profile.preferred_rr, 1)}R</strong></div>
    `;
  }
}

function renderJournalAnalytics(analytics) {
  if (ids.analyticsTotalEntries) ids.analyticsTotalEntries.textContent = String(analytics.total_entries || 0);
  if (ids.analyticsConsistency) ids.analyticsConsistency.textContent = String(analytics.consistency_score || 0);
  if (ids.analyticsTopTag) ids.analyticsTopTag.textContent = analytics.top_tags?.[0]?.tag || "-";
  if (ids.analyticsTagsBoard) {
    ids.analyticsTagsBoard.innerHTML = analytics.top_tags?.length
      ? analytics.top_tags.map((item) => `
          <div class="toolkit-inline-card">
            <strong>${item.tag}</strong>
            <span>${item.count} mentions</span>
          </div>
        `).join("")
      : '<div class="terminal-empty-copy">Your recurring journal tags will appear here.</div>';
  }
  if (ids.analyticsLessonsBoard) {
    ids.analyticsLessonsBoard.innerHTML = analytics.recent_lessons?.length
      ? analytics.recent_lessons.map((item) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${item.title}</strong>
                <div class="journal-entry-meta"><span>${formatTime(item.created_at)}</span></div>
              </div>
            </div>
            <div class="journal-entry-row">
              <span class="journal-note-label">Lesson</span>
              <p>${item.lesson}</p>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">Recent journal takeaways will appear here.</div>';
  }
}

function renderReplay(snapshot) {
  if (!ids.replayBoard && !ids.replayNotes && !ids.replayReadiness) return;

  const entries = state.snapshot?.journalEntries || [];
  const playbooks = state.playbooks || [];
  const movers = snapshot.movers || [];
  const breakouts = movers.filter(isBreakoutMover).length;
  const breakdowns = movers.filter(isBreakdownMover).length;
  const analytics = state.journalAnalytics || {};
  const topTag = analytics.top_tags?.[0]?.tag || "untagged";

  const rankedReviews = entries.map((entry) => {
    const rankedPlaybooks = playbooks
      .map((playbook) => ({ playbook, match: scorePlaybookMatch(entry, playbook) }))
      .sort((a, b) => b.match.score - a.match.score);
    const best = rankedPlaybooks[0];
    return {
      entry,
      playbook: best?.playbook || null,
      score: best?.match?.score || 0,
      overlap: best?.match?.overlap || [],
    };
  }).sort((a, b) => b.score - a.score);

  const readiness =
    entries.length >= 5 && playbooks.length >= 2 ? "Desk Ready" :
    entries.length >= 2 && playbooks.length >= 1 ? "Building" :
    "Early";
  const replayFocus = rankedReviews[0]?.playbook?.title || analytics.recent_lessons?.[0]?.title || "First repeatable setup";
  const anchor =
    breakouts > breakdowns + 2 ? "Bullish Session" :
    breakdowns > breakouts + 2 ? "Bearish Session" :
    "Balanced Session";

  if (ids.replayReadiness) ids.replayReadiness.textContent = readiness;
  if (ids.replayReadinessCopy) ids.replayReadinessCopy.textContent =
    readiness === "Desk Ready" ? "You have enough journal and playbook structure to review execution with intent." :
    readiness === "Building" ? "The review stack is taking shape, but it still needs more repeated examples." :
    "Add more journal entries and saved playbooks so replay becomes more useful.";
  if (ids.replayFocus) ids.replayFocus.textContent = replayFocus;
  if (ids.replayFocusCopy) ids.replayFocusCopy.textContent = `Current replay focus is leaning around ${topTag} and your strongest saved system.`;
  if (ids.replayAnchor) ids.replayAnchor.textContent = anchor;
  if (ids.replayAnchorCopy) ids.replayAnchorCopy.textContent =
    anchor === "Bullish Session" ? "Use long-side leaders and continuation names as your review anchor." :
    anchor === "Bearish Session" ? "Use weak bounces, breakdown flow, and defensive tape structure as the review anchor." :
    "Review both sides of the tape and focus on selectivity instead of directional bias.";

  if (ids.replayBoard) {
    ids.replayBoard.innerHTML = rankedReviews.length
      ? rankedReviews.slice(0, 6).map((item, index) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(item.entry.title || `Review ${index + 1}`)}</strong>
                <div class="journal-entry-meta">
                  <span>${escapeHtml(formatDateTime(item.entry.created_at))}</span>
                  <span>${escapeHtml(item.playbook?.title || "No matched playbook")}</span>
                </div>
              </div>
              <span class="${item.score >= 75 ? "quality-tier-a" : item.score >= 55 ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(String(item.score))}</span>
            </div>
            <div class="journal-entry-grid">
              <div class="journal-entry-row">
                <span class="journal-note-label">Review question</span>
                <p>${escapeHtml(item.score >= 70 ? "Did the trader execute the plan well, or simply get the direction right?" : "Why was this trade taken if it did not clearly match the saved system?")}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Playbook fit</span>
                <p>${escapeHtml(item.playbook ? `${item.playbook.setup_type} / ${item.playbook.bias}` : "No clear system fit found.")}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">What to replay</span>
                <p>${escapeHtml(item.overlap.length ? `Re-watch the trade around: ${item.overlap.join(", ")}.` : "Replay the entry trigger, invalidation logic, and whether the trade was forced.")}</p>
              </div>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">Execution reviews will appear here once journal entries start building.</div>';
  }

  if (ids.replayNotes) {
    const weakCount = rankedReviews.filter((item) => item.score < 46).length;
    const topMover = movers[0];
    ids.replayNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk angle</span>
          <p>${escapeHtml(
            weakCount
              ? `There are ${weakCount} trades that drifted away from saved systems. Start review there before looking at good trades.`
              : "Most recent reviews are close enough to the system. Focus on execution quality, not just setup selection."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Replay anchor</span>
          <p>${escapeHtml(topMover ? `${topMover.symbol} is the current live tape leader and a good reference point for session structure.` : "Use your strongest journaled setup as the replay anchor.")}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">What to ask on review</span>
          <p>${escapeHtml("Was the setup in the playbook, was the timing clean, and did the trader respect invalidation when the trade stopped behaving correctly?")}</p>
        </div>
      </article>
    `;
  }
}

function renderBacktest(snapshot) {
  if (!ids.backtestBoard && !ids.backtestNotes && !ids.backtestWinRate) return;

  const entries = state.snapshot?.journalEntries || [];
  const playbooks = state.playbooks || [];
  const movers = snapshot.movers || [];
  const analytics = state.journalAnalytics || {};
  const breakouts = movers.filter(isBreakoutMover).length;
  const breakdowns = movers.filter(isBreakdownMover).length;

  const scored = entries.map((entry) => {
    const rankedPlaybooks = playbooks
      .map((playbook) => ({ playbook, match: scorePlaybookMatch(entry, playbook) }))
      .sort((a, b) => b.match.score - a.match.score);
    const best = rankedPlaybooks[0];
    const lesson = (entry.lesson || "").toLowerCase();
    const execution = (entry.execution || "").toLowerCase();
    const positiveSignals = ["good", "clean", "followed", "patient", "disciplined", "worked", "strong"];
    const negativeSignals = ["late", "chase", "forced", "revenge", "broke", "hesitated", "loss", "sloppy"];
    const positives = positiveSignals.filter((token) => lesson.includes(token) || execution.includes(token)).length;
    const negatives = negativeSignals.filter((token) => lesson.includes(token) || execution.includes(token)).length;
    const qualityBoost = Math.max(0, (best?.match?.score || 0) - 45) / 8;
    const tradeScore = Math.max(0, Math.min(100, 50 + positives * 10 - negatives * 12 + qualityBoost));
    return {
      entry,
      playbook: best?.playbook || null,
      matchScore: best?.match?.score || 0,
      overlap: best?.match?.overlap || [],
      tradeScore,
      outcome: tradeScore >= 58 ? "Win" : "Loss",
      expectancy: Number((((tradeScore - 50) / 14)).toFixed(1)),
    };
  });

  const wins = scored.filter((item) => item.outcome === "Win");
  const winRate = scored.length ? Math.round((wins.length / scored.length) * 100) : 0;
  const expectancy = scored.length ? (scored.reduce((sum, item) => sum + item.expectancy, 0) / scored.length) : 0;
  const topTag = analytics.top_tags?.[0]?.tag || "untagged";
  const bestCondition =
    breakouts > breakdowns + 2 ? `Bullish breadth + ${topTag}` :
    breakdowns > breakouts + 2 ? `Bearish breadth + ${topTag}` :
    `Balanced tape + ${topTag}`;
  const ranked = scored.sort((a, b) => b.tradeScore - a.tradeScore);

  if (ids.backtestWinRate) ids.backtestWinRate.textContent = `${winRate}%`;
  if (ids.backtestWinRateCopy) ids.backtestWinRateCopy.textContent =
    scored.length ? `${wins.length} of ${scored.length} reviewed trades currently model as acceptable outcomes.` : "Log journal entries to start building a behavior-backed win rate.";
  if (ids.backtestExpectancy) ids.backtestExpectancy.textContent = `${expectancy >= 0 ? "+" : ""}${expectancy.toFixed(1)}R`;
  if (ids.backtestExpectancyCopy) ids.backtestExpectancyCopy.textContent =
    scored.length ? "Expectancy is estimated from playbook fit, lesson quality, and execution language." : "Expectancy will appear once review data exists.";
  if (ids.backtestBestCondition) ids.backtestBestCondition.textContent = bestCondition;
  if (ids.backtestBestConditionCopy) ids.backtestBestConditionCopy.textContent =
    "This is the current best condition lens from your journal behavior and the live tape backdrop.";

  if (ids.backtestBoard) {
    ids.backtestBoard.innerHTML = ranked.length
      ? ranked.slice(0, 6).map((item) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(item.entry.title || "Untitled trade")}</strong>
                <div class="journal-entry-meta">
                  <span>${escapeHtml(item.playbook?.title || "No matched playbook")}</span>
                  <span>${escapeHtml(item.outcome)}</span>
                  <span>${escapeHtml(`${item.expectancy >= 0 ? "+" : ""}${item.expectancy.toFixed(1)}R`)}</span>
                </div>
              </div>
              <span class="${item.tradeScore >= 70 ? "quality-tier-a" : item.tradeScore >= 58 ? "quality-tier-b" : "quality-tier-watch"}">${escapeHtml(String(item.tradeScore))}</span>
            </div>
            <div class="journal-entry-grid">
              <div class="journal-entry-row">
                <span class="journal-note-label">Backtest read</span>
                <p>${escapeHtml(item.tradeScore >= 70 ? "Strong process alignment and cleaner execution language." : item.tradeScore >= 58 ? "Usable setup quality, but not yet top-tier repeatability." : "Weak process quality. This would not qualify as strong system evidence yet.")}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Model fit</span>
                <p>${escapeHtml(item.playbook ? `${item.playbook.setup_type} / ${item.playbook.bias} / ${item.matchScore} fit` : "No reliable playbook fit detected.")}</p>
              </div>
              <div class="journal-entry-row">
                <span class="journal-note-label">Condition clue</span>
                <p>${escapeHtml(item.overlap.length ? item.overlap.join(", ") : "Review lesson tags and execution wording for clearer repeatability clues.")}</p>
              </div>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">Backtest reads will appear once playbooks and journal entries exist.</div>';
  }

  if (ids.backtestNotes) {
    const weakCount = ranked.filter((item) => item.tradeScore < 58).length;
    const topPlaybookCounts = wins
      .map((item) => item.playbook?.title)
      .filter(Boolean)
      .reduce((acc, title) => {
        acc[title] = (acc[title] || 0) + 1;
        return acc;
      }, {});
    const bestSystem = Object.entries(topPlaybookCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "No proven system yet";

    ids.backtestNotes.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Desk takeaway</span>
          <p>${escapeHtml(
            winRate >= 65
              ? "Your current behavior suggests there is a tradable edge, but it still depends on disciplined execution."
              : winRate >= 50
                ? "There may be an edge here, but it is not stable enough to trust with full conviction yet."
                : "The current sample does not support strong confidence. Tighten the system before pressing size."
          )}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Best current system</span>
          <p>${escapeHtml(bestSystem)}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Next refinement</span>
          <p>${escapeHtml(
            weakCount
              ? `${weakCount} reviewed trades are dragging down the model. Either formalize those conditions into a separate setup or stop mixing them into the same system.`
              : "The current sample is fairly clean. Next step is collecting more examples under the same market condition for a better edge estimate."
          )}</p>
        </div>
      </article>
    `;
  }
}

function renderToolkitSnapshot(snapshot) {
  const movers = snapshot.movers || [];
  const recentAlerts = snapshot.recent_alerts || [];
  const breakouts = movers.filter(isBreakoutMover);
  const breakdowns = movers.filter(isBreakdownMover);
  if (ids.breadthBreakouts) ids.breadthBreakouts.textContent = String(breakouts.length);
  if (ids.breadthBreakdowns) ids.breadthBreakdowns.textContent = String(breakdowns.length);

  let bias = "Balanced";
  if (breakouts.length > breakdowns.length + 2) bias = "Bullish";
  if (breakdowns.length > breakouts.length + 2) bias = "Bearish";
  if (ids.breadthBias) ids.breadthBias.textContent = bias;
  if (ids.strategyBreadthLabel) ids.strategyBreadthLabel.textContent = bias;
  if (ids.strategyBreadthCopy) {
    ids.strategyBreadthCopy.textContent =
      bias === "Bullish"
        ? "Buy-side participation is stronger across the tape."
        : bias === "Bearish"
          ? "Sell-side pressure is currently broader."
          : "Both sides are active, so selectivity matters more.";
  }

  if (ids.sectorBoard) {
    const buckets = {};
    recentAlerts.forEach((alert) => {
      const key = (alert.scope || "General").split(" ")[0];
      buckets[key] = (buckets[key] || 0) + 1;
    });
    const sectors = Object.entries(buckets).sort((a, b) => b[1] - a[1]).slice(0, 5);
    ids.sectorBoard.innerHTML = sectors.length
      ? sectors.map(([sector, score]) => `
          <div class="toolkit-inline-card">
            <strong>${sector}</strong>
            <span>${score} active signals</span>
          </div>
        `).join("")
      : '<div class="terminal-empty-copy">Sector strength will appear from live flags and alerts.</div>';
  }

  if (ids.mtfDailyBias) {
    const setFrame = (biasId, copyId, biasValue, copyValue) => {
      if (biasId) biasId.textContent = biasValue;
      if (copyId) copyId.textContent = copyValue;
    };
    const strongBull = breakouts.length > breakdowns.length + 2;
    const strongBear = breakdowns.length > breakouts.length + 2;
    const leader = movers[0]?.symbol || "the tape";

    setFrame(
      ids.mtfDailyBias,
      ids.mtfDailyCopy,
      strongBull ? "Bullish" : strongBear ? "Bearish" : "Balanced",
      strongBull ? `Daily structure currently leans constructive through ${leader}.` : strongBear ? `Daily tone is defensive and leaning lower across ${leader}.` : "Daily structure is still mixed."
    );
    setFrame(
      ids.mtfHourlyBias,
      ids.mtfHourlyCopy,
      bias,
      bias === "Bullish" ? "Hourly flow is confirming upside participation." : bias === "Bearish" ? "Hourly flow is confirming downside pressure." : "Hourly flow is not yet one-directional."
    );
    setFrame(
      ids.mtfFifteenBias,
      ids.mtfFifteenCopy,
      breakouts.length >= breakdowns.length ? "Constructive" : "Defensive",
      breakouts.length >= breakdowns.length ? "15m execution context favors stronger names." : "15m execution context favors caution and weaker names."
    );
    setFrame(
      ids.mtfFiveBias,
      ids.mtfFiveCopy,
      movers.length ? (movers[0].change_percent >= 0 ? "Active Longs" : "Active Shorts") : "Waiting",
      movers.length ? `${leader} is currently driving the fastest tape read.` : "5m trigger layer is waiting for fresh expansion."
    );
  }
}

function renderPriceAction(snapshot) {
  const movers = snapshot.movers || [];
  const breakouts = movers.filter(isBreakoutMover).length;
  const breakdowns = movers.filter(isBreakdownMover).length;
  const leader = movers[0];
  let tone = "Balanced";
  let bias = "Two-way flow";
  let reading = "Waiting for clearer directional commitment.";
  let structureRead = "The tape is still balancing and not yet showing a dominant structure regime.";
  let executionCue = "Wait for clearer confirmation before pressing size.";
  let riskPosture = "Stay balanced until directional control becomes more obvious.";

  if (breakouts > breakdowns + 2) {
    tone = "Expansion";
    bias = "Bullish dominance";
    reading = "Buy-side participation is controlling the tape with broader continuation.";
    structureRead = "Higher-side continuation is dominating the tape and structure is favoring expansion.";
    executionCue = "Focus on clean continuation names and avoid forcing late entries.";
    riskPosture = "Risk can lean constructive, but stay selective on names already extended.";
  } else if (breakdowns > breakouts + 2) {
    tone = "Pressure";
    bias = "Bearish dominance";
    reading = "Sell-side pressure is leading and weakness is spreading through the tape.";
    structureRead = "Downside control is stronger and the tape is behaving more defensively.";
    executionCue = "Prioritize weakness, failed bounces, and lower-high continuation setups.";
    riskPosture = "Reduce aggressiveness on longs and stay patient for cleaner short structure.";
  } else if (breakouts > breakdowns) {
    tone = "Constructive";
    bias = "Bullish lean";
    reading = "Upside activity is stronger, but structure is still forming.";
    structureRead = "The tape leans constructive, but it has not fully resolved into broad expansion.";
    executionCue = "Favor confirmation over anticipation and let better structure names lead.";
    riskPosture = "Stay measured and avoid treating a lean as full dominance.";
  } else if (breakdowns > breakouts) {
    tone = "Defensive";
    bias = "Bearish lean";
    reading = "Downside pressure is stronger, though not fully one-directional yet.";
    structureRead = "The tape leans defensive with more weakness than strength across the board.";
    executionCue = "Be careful with counter-trend longs until stronger reclaims appear.";
    riskPosture = "Keep risk compact while the market still behaves in mixed fashion.";
  }

  if (ids.priceActionTone) ids.priceActionTone.textContent = tone;
  if (ids.priceActionBias) ids.priceActionBias.textContent = bias;
  if (ids.priceActionReading) ids.priceActionReading.textContent = reading;
  if (ids.priceBreakoutCount) ids.priceBreakoutCount.textContent = String(breakouts);
  if (ids.priceBreakdownCount) ids.priceBreakdownCount.textContent = String(breakdowns);
  if (ids.priceLeader) ids.priceLeader.textContent = leader ? leader.symbol : "Waiting";
  if (ids.priceBreadth) ids.priceBreadth.textContent = `${breakouts} : ${breakdowns}`;
  if (ids.priceStructureRead) ids.priceStructureRead.textContent = structureRead;
  if (ids.priceExecutionCue) ids.priceExecutionCue.textContent = executionCue;
  if (ids.priceRiskPosture) ids.priceRiskPosture.textContent = riskPosture;

  renderRows(
    ids.priceActionTableBody,
    movers.slice(0, 8).map((mover) => `
      <tr>
        <td>${mover.symbol}</td>
        <td>${formatNumber(mover.price)}</td>
        <td class="${mover.change_percent >= 0 ? "terminal-positive" : "terminal-negative"}">${formatPercent(mover.change_percent)}</td>
        <td>${(mover.flags || []).join(", ") || "Watching flow"}</td>
      </tr>
    `),
    4,
    "No price action readings available yet.",
  );
}

function renderVideoStrategyResult(payload) {
  const analysis = payload.analysis || {};
  const primary = analysis.primary_strategy || {};
  const matches = payload.matches || {};
  const detected = analysis.detected_strategies || [];
  const transcriptPreview = analysis.transcript_preview || "";
  const analysisSource = analysis.analysis_source || "transcript";
  const transcriptNote = analysis.transcript_note || "";
  const moverMatches = matches.matched_movers || [];
  const alertMatches = matches.matched_alerts || [];
  const smcMatches = matches.matched_smc || [];

  if (ids.videoStrategySummary) {
    const playbookTitle = encodeURIComponent(`${primary.label || "Video Strategy"} Playbook`);
    const playbookSetup = encodeURIComponent(primary.label || "General Price Action");
    const playbookBias = encodeURIComponent(matches.scanner_lens || "Context-driven");
    const playbookEntry = encodeURIComponent(primary.scan_focus || "Use the strategy cues from the video and match them with the live scanner board.");
    const playbookRisk = encodeURIComponent(matches.guidance || "Keep risk controlled and size only when live scanner alignment is strong.");
    const playbookExit = encodeURIComponent("Reduce risk into extension, scale around structure, and exit when the setup invalidates.");
    ids.videoStrategySummary.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-head">
          <div>
            <strong>${escapeHtml(analysis.title || "Detected Strategy")}</strong>
            <div class="journal-entry-meta">
              <span>${escapeHtml(primary.label || "General Price Action")}</span>
              <span>${escapeHtml(String(analysis.confidence || 0))}% confidence</span>
              <span>${escapeHtml(String(analysis.transcript_length || 0))} transcript words</span>
              <span>${escapeHtml(analysisSource === "transcript" ? "Transcript-backed" : "Title fallback")}</span>
            </div>
          </div>
        </div>
        <div class="journal-entry-grid">
          <div class="journal-entry-row">
            <span class="journal-note-label">What the video is teaching</span>
            <p>${escapeHtml(primary.summary || "General trading education detected.")}</p>
          </div>
          <div class="journal-entry-row">
            <span class="journal-note-label">How AstraVeda will scan it</span>
            <p>${escapeHtml(primary.scan_focus || "Use current breakout, breakdown, and SMC context.")}</p>
          </div>
          <div class="journal-entry-row">
            <span class="journal-note-label">Detected tags</span>
            <p>${analysis.tags?.length ? analysis.tags.map(escapeHtml).join(", ") : "General Price Action"}</p>
          </div>
          <div class="journal-entry-row">
            <span class="journal-note-label">Analysis source</span>
            <p>${escapeHtml(
              analysisSource === "transcript"
                ? "AstraVeda detected the strategy from the transcript."
                : transcriptNote || "AstraVeda used the video title and available YouTube metadata because transcript access was unavailable."
            )}</p>
          </div>
          <div class="journal-entry-row">
            <span class="journal-note-label">Next action</span>
            <p><a class="toolkit-action-link" href="/playbooks?title=${playbookTitle}&setup=${playbookSetup}&bias=${playbookBias}&entry=${playbookEntry}&risk=${playbookRisk}&exit=${playbookExit}">Open this as a playbook draft</a></p>
          </div>
        </div>
      </article>
    `;
  }

  if (ids.videoStrategyMatches) {
    const moverHtml = moverMatches.length
      ? moverMatches.map((item) => `
          <article class="journal-note journal-entry">
            <div class="journal-entry-head">
              <div>
                <strong>${escapeHtml(item.symbol || "Unknown")}</strong>
                <div class="journal-entry-meta">
                  <span>${escapeHtml(item.setup || "Setup")}</span>
                  <span>${escapeHtml(item.bias || "Bias")}</span>
                  <span>${escapeHtml(formatNumber(item.price))}</span>
                </div>
              </div>
            </div>
            <div class="journal-entry-row">
              <span class="journal-note-label">Why it matches</span>
              <p>${escapeHtml(item.detail || "Relevant to the detected strategy lens.")}</p>
            </div>
          </article>
        `).join("")
      : '<div class="terminal-empty-copy">No direct live symbol matches yet. Try again when the scanner has fresh signals.</div>';

    const alertHtml = alertMatches.length
      ? `
        <div class="toolkit-inline-grid">
          ${alertMatches.map((item) => `
            <div class="toolkit-inline-card">
              <strong>${escapeHtml(item.symbol || "Signal")}</strong>
              <span>${escapeHtml(item.detail || "")}</span>
            </div>
          `).join("")}
        </div>
      `
      : '<div class="terminal-empty-copy">No recent alerts tied to this strategy lens right now.</div>';

    const smcHtml = smcMatches.length
      ? `
        <div class="toolkit-inline-grid">
          ${smcMatches.slice(0, 4).map((item) => `
            <div class="toolkit-inline-card">
              <strong>${escapeHtml(item.display_symbol || item.symbol || "SMC")}</strong>
              <span>${escapeHtml(item.signal || item.detail || "Structure signal")}</span>
            </div>
          `).join("")}
        </div>
      `
      : "";

    ids.videoStrategyMatches.innerHTML = `
      <div class="journal-entry-row">
        <span class="journal-note-label">${escapeHtml(matches.scanner_lens || "Scanner lens")}</span>
        <p>${escapeHtml(matches.guidance || "Relevant scanner guidance will appear here.")}</p>
      </div>
      <div class="video-strategy-stack">${moverHtml}</div>
      <div class="journal-entry-row">
        <span class="journal-note-label">Recent alert flow</span>
        ${alertHtml}
      </div>
      ${smcHtml ? `<div class="journal-entry-row"><span class="journal-note-label">Live structure context</span>${smcHtml}</div>` : ""}
    `;
  }

  if (ids.videoStrategyTranscript) {
    ids.videoStrategyTranscript.innerHTML = `
      <article class="journal-note journal-entry">
        <div class="journal-entry-row">
          <span class="journal-note-label">Keyword hits</span>
          <p>${detected.length ? detected.map((item) => `${escapeHtml(item.label)}: ${escapeHtml((item.keyword_hits || []).join(", "))}`).join(" | ") : "No named keyword clusters dominated the available video context."}</p>
        </div>
        <div class="journal-entry-row">
          <span class="journal-note-label">Transcript preview</span>
          <p>${escapeHtml(transcriptPreview || "Transcript preview unavailable.")}</p>
        </div>
      </article>
    `;
  }
}

function renderVideoStrategyHistory(history) {
  if (!ids.videoStrategyHistory) return;
  ids.videoStrategyHistory.innerHTML = history.length
    ? history.map((item) => `
        <article class="journal-note journal-entry">
          <div class="journal-entry-head">
            <div>
              <strong>${escapeHtml(item.title)}</strong>
              <div class="journal-entry-meta">
                <span>${escapeHtml(item.primary_strategy)}</span>
                <span>${escapeHtml(String(item.confidence))}% confidence</span>
                <span>${escapeHtml(formatTime(item.created_at))}</span>
              </div>
            </div>
          </div>
          <div class="journal-entry-grid">
            <div class="journal-entry-row">
              <span class="journal-note-label">Detected tags</span>
              <p>${escapeHtml(item.tags || "General Price Action")}</p>
            </div>
            <div class="journal-entry-row">
              <span class="journal-note-label">Scanner lens</span>
              <p>${escapeHtml(item.scanner_lens || "Context lens")}</p>
            </div>
            <div class="journal-entry-row">
              <span class="journal-note-label">Guidance</span>
              <p>${escapeHtml(item.guidance || "No saved guidance.")}</p>
            </div>
            <div class="journal-entry-row">
              <span class="journal-note-label">Source</span>
              <p><a class="toolkit-action-link" href="${escapeHtml(item.source_url)}" target="_blank" rel="noreferrer">Open video</a></p>
            </div>
          </div>
        </article>
      `).join("")
    : '<div class="terminal-empty-copy">Your recent YouTube strategy analyses will appear here.</div>';
}

async function loadJournalEntries() {
  if (!state.token || (!ids.journalBoard && !ids.complianceBoard && !ids.complianceNotes && !ids.complianceScore && !ids.replayBoard && !ids.backtestBoard && !ids.backtestNotes && !ids.backtestWinRate)) return;
  try {
    const response = await fetch(`/api/journal?token=${encodeURIComponent(state.token)}`);
    const data = await response.json();
    if (!data.ok) return;
    state.snapshot = state.snapshot || {};
    state.snapshot.journalEntries = data.entries || [];
    renderJournal(state.snapshot);
    renderReplay(state.snapshot);
    renderBacktest(state.snapshot);
    renderPlaybookCompliance();
  } catch {
    if (ids.journalBoard) {
      ids.journalBoard.innerHTML = '<div class="terminal-empty-copy">Could not load your journal right now.</div>';
    }
    if (ids.complianceBoard) {
      ids.complianceBoard.innerHTML = '<div class="terminal-empty-copy">Could not load journal data for compliance right now.</div>';
    }
    if (ids.backtestBoard) {
      ids.backtestBoard.innerHTML = '<div class="terminal-empty-copy">Could not load journal data for backtest reads right now.</div>';
    }
  }
}

async function loadDisciplineEvents() {
  if (!state.token || (!ids.disciplineBoard && !ids.closingSummary && !ids.scorecardBoard && !ids.scorecardNotes && !ids.scorecardScore)) return;
  try {
    const response = await fetch(`/api/discipline?token=${encodeURIComponent(state.token)}`);
    const data = await response.json();
    if (data.ok) {
      state.disciplineSummary = data.summary || {};
      renderDiscipline(data.summary || {}, data.events || []);
      renderTraderScorecard();
      renderDeskRestrictions();
      renderTraderProgression();
      renderSessionChecklist(state.snapshot || {});
      renderConfidenceLadder();
      renderMarketNarrative(state.snapshot || {});
      renderPreparationScore(state.snapshot || {});
      renderHabitRadar();
      renderClosingReview();
    }
  } catch {
    if (ids.disciplineBoard) ids.disciplineBoard.innerHTML = '<div class="terminal-empty-copy">Could not load discipline events right now.</div>';
  }
}

async function loadDailyLossLock() {
  if (!state.token || (!ids.lossLockStatus && !ids.closingSummary && !ids.scorecardBoard && !ids.scorecardNotes && !ids.scorecardScore)) return;
  try {
    const response = await fetch(`/api/risk/daily-loss-lock?token=${encodeURIComponent(state.token)}`);
    const data = await response.json();
    if (data.ok) {
      state.dailyLossState = data.state || {};
      renderDailyLossLock(data.state || {});
      renderTraderScorecard();
      renderDeskRestrictions();
      renderTraderProgression();
      renderSessionChecklist(state.snapshot || {});
      renderConfidenceLadder();
      renderMarketNarrative(state.snapshot || {});
      renderPreparationScore(state.snapshot || {});
      renderHabitRadar();
      renderClosingReview();
    }
  } catch {
    if (ids.lossLockGuidance) {
      ids.lossLockGuidance.innerHTML = '<div class="terminal-empty-copy">Could not load the daily loss lock state right now.</div>';
    }
  }
}

async function loadAPlusArchive() {
  if (!state.token || (!ids.aplusBoard && !ids.closingSummary && !ids.scorecardBoard && !ids.scorecardNotes && !ids.scorecardScore)) return;
  try {
    const response = await fetch(`/api/archive/aplus?token=${encodeURIComponent(state.token)}`);
    const data = await response.json();
    if (data.ok) {
      state.aplusSetups = data.setups || [];
      renderAPlusArchive(data.setups || []);
      renderTraderScorecard();
      renderDeskRestrictions();
      renderTraderProgression();
      renderSessionChecklist(state.snapshot || {});
      renderConfidenceLadder();
      renderClosingReview();
    }
  } catch {
    if (ids.aplusBoard) ids.aplusBoard.innerHTML = '<div class="terminal-empty-copy">Could not load the A+ setup archive right now.</div>';
  }
}

async function loadWatchlists() {
  if (!state.token || !ids.watchlistBoard) return;
  try {
    const response = await fetch(`/api/toolkit/watchlists?token=${encodeURIComponent(state.token)}`);
    const data = await response.json();
    if (data.ok) renderWatchlists(data.watchlists || []);
  } catch {
    ids.watchlistBoard.innerHTML = '<div class="terminal-empty-copy">Could not load watchlists right now.</div>';
  }
}

async function loadAlertRules() {
  if (!state.token || !ids.alertBoard) return;
  try {
    const response = await fetch(`/api/toolkit/alerts?token=${encodeURIComponent(state.token)}`);
    const data = await response.json();
    if (data.ok) renderAlertRules(data.alerts || []);
  } catch {
    ids.alertBoard.innerHTML = '<div class="terminal-empty-copy">Could not load alert rules right now.</div>';
  }
}

async function loadPlaybooks() {
  if (!state.token || (!ids.playbookBoard && !ids.complianceBoard && !ids.complianceNotes && !ids.complianceScore)) return;
  try {
    const response = await fetch(`/api/toolkit/playbooks?token=${encodeURIComponent(state.token)}`);
    const data = await response.json();
    if (data.ok) {
      state.playbooks = data.playbooks || [];
      renderPlaybooks(state.playbooks);
      renderBacktest(state.snapshot || {});
      renderTraderScorecard();
      renderDeskRestrictions();
      renderTraderProgression();
      renderSessionChecklist(state.snapshot || {});
      renderConfidenceLadder();
      renderEdgeStability();
      renderReviewQueue(state.snapshot || {});
      renderThemeTracker(state.snapshot || {});
      renderDecisionAudit();
      renderWeeklyReview();
      renderMarketNarrative(state.snapshot || {});
      renderPreparationScore(state.snapshot || {});
      renderHabitRadar();
      renderSystemRotation(state.snapshot || {});
      renderPlaybookCoverage();
      renderPlaybookCompliance();
    }
  } catch {
    if (ids.playbookBoard) ids.playbookBoard.innerHTML = '<div class="terminal-empty-copy">Could not load playbooks right now.</div>';
    if (ids.complianceBoard) ids.complianceBoard.innerHTML = '<div class="terminal-empty-copy">Could not load playbook data for compliance right now.</div>';
  }
}

async function loadRiskProfile() {
  if (!state.token || !ids.riskForm) return;
  try {
    const response = await fetch(`/api/toolkit/risk-profile?token=${encodeURIComponent(state.token)}`);
    const data = await response.json();
    if (data.ok) renderRiskProfile(data.profile || {});
  } catch {
    if (ids.riskError) ids.riskError.textContent = "Could not load your risk profile right now.";
  }
}

async function loadJournalAnalytics() {
  if (!state.token || (!ids.analyticsTotalEntries && !ids.analyticsLessonsBoard && !ids.replayBoard && !ids.backtestBoard && !ids.closingSummary)) return;
  try {
    const response = await fetch(`/api/toolkit/journal-analytics?token=${encodeURIComponent(state.token)}`);
    const data = await response.json();
    if (data.ok) {
      state.journalAnalytics = data.analytics || {};
      renderJournalAnalytics(data.analytics || {});
      renderReplay(state.snapshot || {});
      renderBacktest(state.snapshot || {});
      renderTraderScorecard();
      renderDeskRestrictions();
      renderTraderProgression();
      renderSessionChecklist(state.snapshot || {});
      renderConfidenceLadder();
      renderMarketNarrative(state.snapshot || {});
      renderPreparationScore(state.snapshot || {});
      renderHabitRadar();
      renderClosingReview();
    }
  } catch {
    if (ids.analyticsTagsBoard) {
      ids.analyticsTagsBoard.innerHTML = '<div class="terminal-empty-copy">Could not load journal analytics right now.</div>';
    }
  }
}

async function loadVideoStrategyHistory() {
  if (!state.token || !ids.videoStrategyHistory) return;
  try {
    const response = await fetch(`/api/strategy/video/history?token=${encodeURIComponent(state.token)}`);
    const data = await response.json();
    if (data.ok) renderVideoStrategyHistory(data.history || []);
  } catch {
    ids.videoStrategyHistory.innerHTML = '<div class="terminal-empty-copy">Could not load saved video analyses right now.</div>';
  }
}

async function saveJournalEntry(event) {
  event.preventDefault();
  if (!ids.journalForm) return;
  ids.journalFormError.textContent = "";

  const title = ids.journalTitle.value.trim();
  const thesis = ids.journalThesis.value.trim();
  const execution = ids.journalExecution.value.trim();
  const lesson = ids.journalLesson.value.trim();
  const tags = ids.journalTags.value.trim();

  if (!title || !thesis || !execution || !lesson) {
    ids.journalFormError.textContent = "Fill in title, setup, execution, and takeaway before saving.";
    return;
  }

  ids.journalSubmit.disabled = true;
  ids.journalSubmit.textContent = "Saving...";
  try {
    const response = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: state.token,
        title,
        thesis,
        execution,
        lesson,
        tags,
      }),
    });
    const data = await response.json();
    if (!data.ok) {
      ids.journalFormError.textContent = data.message || "Could not save this journal entry.";
      return;
    }
    ids.journalForm.reset();
    await loadJournalEntries();
  } catch {
    ids.journalFormError.textContent = "Could not save this journal entry right now.";
  } finally {
    ids.journalSubmit.disabled = false;
    ids.journalSubmit.textContent = "Save Entry";
  }
}

async function saveDisciplineEvent(event) {
  event.preventDefault();
  if (!ids.disciplineForm) return;
  ids.disciplineError.textContent = "";
  const ruleType = ids.disciplineRuleType.value.trim();
  const severity = ids.disciplineSeverity.value.trim().toLowerCase();
  const symbol = ids.disciplineSymbol.value.trim().toUpperCase();
  const note = ids.disciplineNote.value.trim();

  if (!ruleType || !severity) {
    ids.disciplineError.textContent = "Fill in rule type and severity before saving.";
    return;
  }

  ids.disciplineSubmit.disabled = true;
  ids.disciplineSubmit.textContent = "Saving...";
  try {
    const response = await fetch("/api/discipline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: state.token,
        rule_type: ruleType,
        severity,
        symbol,
        note,
      }),
    });
    const data = await response.json();
    if (!data.ok) {
      ids.disciplineError.textContent = data.message || "Could not save this discipline event.";
      return;
    }
    ids.disciplineForm.reset();
    await loadDisciplineEvents();
  } catch {
    ids.disciplineError.textContent = "Could not save this discipline event right now.";
  } finally {
    ids.disciplineSubmit.disabled = false;
    ids.disciplineSubmit.textContent = "Log Discipline Event";
  }
}

async function saveDailyLossLock(event) {
  event.preventDefault();
  if (!ids.lossLockForm) return;
  ids.lossLockError.textContent = "";

  ids.lossLockSubmit.disabled = true;
  ids.lossLockSubmit.textContent = "Saving...";
  try {
    const response = await fetch("/api/risk/daily-loss-lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: state.token,
        realized_pnl: Number(ids.lossLockPnl.value || 0),
        note: ids.lossLockNote.value.trim(),
      }),
    });
    const data = await response.json();
    if (!data.ok) {
      ids.lossLockError.textContent = data.message || "Could not update the daily loss lock.";
      return;
    }
    renderDailyLossLock(data.state || {});
  } catch {
    ids.lossLockError.textContent = "Could not update the daily loss lock right now.";
  } finally {
    ids.lossLockSubmit.disabled = false;
    ids.lossLockSubmit.textContent = "Update Daily Lock";
  }
}

async function saveAPlusSetup(event) {
  event.preventDefault();
  if (!ids.aplusForm) return;
  ids.aplusError.textContent = "";

  const title = ids.aplusTitle.value.trim();
  const symbol = ids.aplusSymbol.value.trim().toUpperCase();
  const setupType = ids.aplusSetupType.value.trim();
  const bias = ids.aplusBias.value.trim();
  const rationale = ids.aplusRationale.value.trim();
  const contextNote = ids.aplusContextNote.value.trim();

  if (!title || !symbol || !setupType || !bias || !rationale) {
    ids.aplusError.textContent = "Fill in title, symbol, setup type, bias, and rationale before saving.";
    return;
  }

  ids.aplusSubmit.disabled = true;
  ids.aplusSubmit.textContent = "Saving...";
  try {
    const response = await fetch("/api/archive/aplus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: state.token,
        title,
        symbol,
        setup_type: setupType,
        bias,
        rationale,
        context_note: contextNote,
      }),
    });
    const data = await response.json();
    if (!data.ok) {
      ids.aplusError.textContent = data.message || "Could not save this A+ setup.";
      return;
    }
    ids.aplusForm.reset();
    await loadAPlusArchive();
  } catch {
    ids.aplusError.textContent = "Could not save this A+ setup right now.";
  } finally {
    ids.aplusSubmit.disabled = false;
    ids.aplusSubmit.textContent = "Save A+ Setup";
  }
}

async function saveWatchlist(event) {
  event.preventDefault();
  if (!ids.watchlistForm) return;
  ids.watchlistError.textContent = "";
  const name = ids.watchlistName.value.trim();
  const symbols = ids.watchlistSymbols.value.trim();
  const notes = ids.watchlistNotes.value.trim();
  if (!name || !symbols) {
    ids.watchlistError.textContent = "Fill in a watchlist name and symbols before saving.";
    return;
  }
  ids.watchlistSubmit.disabled = true;
  ids.watchlistSubmit.textContent = "Saving...";
  try {
    const response = await fetch("/api/toolkit/watchlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: state.token, name, symbols, notes }),
    });
    const data = await response.json();
    if (!data.ok) {
      ids.watchlistError.textContent = data.message || "Could not save this watchlist.";
      return;
    }
    ids.watchlistForm.reset();
    await loadWatchlists();
  } catch {
    ids.watchlistError.textContent = "Could not save this watchlist right now.";
  } finally {
    ids.watchlistSubmit.disabled = false;
    ids.watchlistSubmit.textContent = "Save Watchlist";
  }
}

async function saveAlertRule(event) {
  event.preventDefault();
  if (!ids.alertForm) return;
  ids.alertError.textContent = "";
  const name = ids.alertName.value.trim();
  const ruleType = ids.alertRuleType.value.trim();
  const scope = ids.alertScope.value.trim();
  const threshold = ids.alertThreshold.value.trim();
  const notes = ids.alertNotes.value.trim();
  if (!name || !ruleType || !scope || !threshold) {
    ids.alertError.textContent = "Fill in name, rule type, scope, and threshold before saving.";
    return;
  }
  ids.alertSubmit.disabled = true;
  ids.alertSubmit.textContent = "Saving...";
  try {
    const response = await fetch("/api/toolkit/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: state.token, name, rule_type: ruleType, scope, threshold, notes }),
    });
    const data = await response.json();
    if (!data.ok) {
      ids.alertError.textContent = data.message || "Could not save this alert rule.";
      return;
    }
    ids.alertForm.reset();
    await loadAlertRules();
  } catch {
    ids.alertError.textContent = "Could not save this alert rule right now.";
  } finally {
    ids.alertSubmit.disabled = false;
    ids.alertSubmit.textContent = "Save Alert Rule";
  }
}

async function saveRiskProfile(event) {
  event.preventDefault();
  if (!ids.riskForm) return;
  ids.riskError.textContent = "";
  const payload = {
    token: state.token,
    account_size: Number(ids.riskAccountSize.value || 0),
    risk_per_trade: Number(ids.riskPerTrade.value || 0),
    max_daily_loss: Number(ids.riskMaxDailyLoss.value || 0),
    preferred_rr: Number(ids.riskPreferredRr.value || 0),
  };
  ids.riskSubmit.disabled = true;
  ids.riskSubmit.textContent = "Saving...";
  try {
    const response = await fetch("/api/toolkit/risk-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!data.ok) {
      ids.riskError.textContent = data.message || "Could not save your risk profile.";
      return;
    }
    renderRiskProfile(payload);
  } catch {
    ids.riskError.textContent = "Could not save your risk profile right now.";
  } finally {
    ids.riskSubmit.disabled = false;
    ids.riskSubmit.textContent = "Save Risk Profile";
  }
}

async function savePlaybook(event) {
  event.preventDefault();
  if (!ids.playbookForm) return;
  ids.playbookError.textContent = "";
  const title = ids.playbookTitle.value.trim();
  const setupType = ids.playbookSetupType.value.trim();
  const bias = ids.playbookBias.value.trim();
  const entryRule = ids.playbookEntryRule.value.trim();
  const riskRule = ids.playbookRiskRule.value.trim();
  const exitRule = ids.playbookExitRule.value.trim();
  if (!title || !setupType || !bias || !entryRule || !riskRule || !exitRule) {
    ids.playbookError.textContent = "Fill in every playbook field before saving.";
    return;
  }
  ids.playbookSubmit.disabled = true;
  ids.playbookSubmit.textContent = "Saving...";
  try {
    const response = await fetch("/api/toolkit/playbooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: state.token,
        title,
        setup_type: setupType,
        bias,
        entry_rule: entryRule,
        risk_rule: riskRule,
        exit_rule: exitRule,
      }),
    });
    const data = await response.json();
    if (!data.ok) {
      ids.playbookError.textContent = data.message || "Could not save this playbook.";
      return;
    }
    ids.playbookForm.reset();
    await loadPlaybooks();
  } catch {
    ids.playbookError.textContent = "Could not save this playbook right now.";
  } finally {
    ids.playbookSubmit.disabled = false;
    ids.playbookSubmit.textContent = "Save Playbook";
  }
}

function prefillPlaybookDraft() {
  if (!ids.playbookForm) return;
  const params = new URLSearchParams(window.location.search);
  const setIfPresent = (param, element) => {
    const value = params.get(param);
    if (value && element && !element.value) element.value = value;
  };
  setIfPresent("title", ids.playbookTitle);
  setIfPresent("setup", ids.playbookSetupType);
  setIfPresent("bias", ids.playbookBias);
  setIfPresent("entry", ids.playbookEntryRule);
  setIfPresent("risk", ids.playbookRiskRule);
  setIfPresent("exit", ids.playbookExitRule);
}

async function analyzeVideoStrategy(event) {
  event.preventDefault();
  if (!ids.videoStrategyForm) return;
  ids.videoStrategyError.textContent = "";
  const url = ids.videoStrategyUrl.value.trim();
  if (!url) {
    ids.videoStrategyError.textContent = "Paste a YouTube link before analyzing.";
    return;
  }

  ids.videoStrategySubmit.disabled = true;
  ids.videoStrategySubmit.textContent = "Analyzing...";

  try {
    const response = await fetch("/api/strategy/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: state.token, url }),
    });
    const data = await response.json();
    if (!data.ok) {
      ids.videoStrategyError.textContent = data.message || "Could not analyze that video right now.";
      return;
    }
    renderVideoStrategyResult(data);
  } catch {
    ids.videoStrategyError.textContent = "Could not analyze that video right now.";
  } finally {
    ids.videoStrategySubmit.disabled = false;
    ids.videoStrategySubmit.textContent = "Analyze Strategy Video";
  }
}

async function deleteJournalEntry(entryId) {
  if (!state.token || !entryId) return;
  try {
    await fetch(`/api/journal/${entryId}?token=${encodeURIComponent(state.token)}`, {
      method: "DELETE",
    });
    await loadJournalEntries();
  } catch {
    // keep current state
  }
}

async function deleteWatchlist(watchlistId) {
  if (!state.token || !watchlistId) return;
  await fetch(`/api/toolkit/watchlists/${watchlistId}?token=${encodeURIComponent(state.token)}`, { method: "DELETE" });
  await loadWatchlists();
}

async function deleteAlertRule(ruleId) {
  if (!state.token || !ruleId) return;
  await fetch(`/api/toolkit/alerts/${ruleId}?token=${encodeURIComponent(state.token)}`, { method: "DELETE" });
  await loadAlertRules();
}

async function deletePlaybook(playbookId) {
  if (!state.token || !playbookId) return;
  await fetch(`/api/toolkit/playbooks/${playbookId}?token=${encodeURIComponent(state.token)}`, { method: "DELETE" });
  await loadPlaybooks();
}

async function deleteDisciplineEvent(eventId) {
  if (!state.token || !eventId) return;
  await fetch(`/api/discipline/${eventId}?token=${encodeURIComponent(state.token)}`, { method: "DELETE" });
  await loadDisciplineEvents();
}

async function deleteAPlusSetup(setupId) {
  if (!state.token || !setupId) return;
  await fetch(`/api/archive/aplus/${setupId}?token=${encodeURIComponent(state.token)}`, { method: "DELETE" });
  await loadAPlusArchive();
}

function prefillAPlusArchiveDraft() {
  if (!ids.aplusForm) return;
  const params = new URLSearchParams(window.location.search);
  const setIfPresent = (param, element) => {
    const value = params.get(param);
    if (value && element && !element.value) element.value = value;
  };
  setIfPresent("title", ids.aplusTitle);
  setIfPresent("symbol", ids.aplusSymbol);
  setIfPresent("setup", ids.aplusSetupType);
  setIfPresent("bias", ids.aplusBias);
  setIfPresent("rationale", ids.aplusRationale);
  setIfPresent("context", ids.aplusContextNote);
}

function renderSnapshot(snapshot) {
  state.snapshot = {
    ...snapshot,
    journalEntries: state.snapshot?.journalEntries || snapshot.journalEntries || [],
  };
  renderMetricCards(snapshot);
  renderHealingFactor(snapshot);
  renderDashboard(snapshot);
  renderMorningBrief(snapshot);
  renderConfluenceEngine(snapshot);
  renderExecutionGate(snapshot);
  renderCapitalAllocation(snapshot);
  renderSetupQuality(snapshot);
  renderTrades(state.snapshot);
  renderSmc(state.snapshot);
  renderJournal(state.snapshot);
  renderPriceAction(state.snapshot);
  renderToolkitSnapshot(state.snapshot);
  renderReplay(state.snapshot);
  renderBacktest(state.snapshot);
  renderTraderScorecard();
  renderDeskRestrictions();
  renderTraderProgression();
  renderSessionChecklist(state.snapshot);
  renderConfidenceLadder();
  renderFocusBoard(state.snapshot);
  renderMissedOpportunities(state.snapshot);
  renderMarketNarrative(state.snapshot);
  renderEdgeStability();
  renderReviewQueue(state.snapshot);
  renderThemeTracker(state.snapshot);
  renderDecisionAudit();
  renderWeeklyReview();
  renderPreparationScore(state.snapshot);
  renderHabitRadar();
  renderSystemRotation(state.snapshot);
  renderPlaybookCoverage();
  renderPlaybookCompliance();
  renderClosingReview();
}

function connectSocket() {
  const socket = new WebSocket(websocketUrl());
  state.socket = socket;

  socket.onopen = () => {
    if (ids.wsDot) ids.wsDot.classList.add("active");
    if (ids.wsLabel) ids.wsLabel.textContent = "Authenticated";
    if (ids.terminalModeLabel) ids.terminalModeLabel.textContent = "Live";
    socket.send("snapshot");
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "error") {
      localStorage.removeItem("astraveda_token");
      window.location.href = "/login";
      return;
    }
    if (message.type === "snapshot") renderSnapshot(message.data);
    if (message.type === "alert" && state.snapshot) {
      state.snapshot.recent_alerts.unshift(message.data);
      renderSnapshot(state.snapshot);
    }
  };

  socket.onclose = () => {
    if (ids.wsDot) ids.wsDot.classList.remove("active");
    if (ids.wsLabel) ids.wsLabel.textContent = "Recovering...";
    if (ids.terminalModeLabel) ids.terminalModeLabel.textContent = "Recovering";
    setTimeout(connectSocket, 2000);
  };
}

async function initTerminal() {
  injectWorkspaceDirectory();
  ensureHealingStatusPill();

  if (!state.token) {
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch(`/api/auth/status?token=${encodeURIComponent(state.token)}`);
    const data = await response.json();
    if (!data.authenticated) {
      localStorage.removeItem("astraveda_token");
      window.location.href = "/login";
      return;
    }
    state.user = data;
    updateGreeting(data);
    await loadJournalEntries();
    await loadDisciplineEvents();
    await loadDailyLossLock();
    await loadAPlusArchive();
    await loadWatchlists();
    await loadAlertRules();
    await loadRiskProfile();
    await loadPlaybooks();
    await loadJournalAnalytics();
    await loadVideoStrategyHistory();
    prefillPlaybookDraft();
    prefillAPlusArchiveDraft();
    connectSocket();
  } catch {
    localStorage.removeItem("astraveda_token");
    window.location.href = "/login";
  }
}

ids.logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("astraveda_token");
  window.location.href = "/";
});

ids.journalForm?.addEventListener("submit", saveJournalEntry);
ids.disciplineForm?.addEventListener("submit", saveDisciplineEvent);
ids.lossLockForm?.addEventListener("submit", saveDailyLossLock);
ids.aplusForm?.addEventListener("submit", saveAPlusSetup);
ids.watchlistForm?.addEventListener("submit", saveWatchlist);
ids.alertForm?.addEventListener("submit", saveAlertRule);
ids.riskForm?.addEventListener("submit", saveRiskProfile);
ids.playbookForm?.addEventListener("submit", savePlaybook);
ids.videoStrategyForm?.addEventListener("submit", analyzeVideoStrategy);

initTerminal();
