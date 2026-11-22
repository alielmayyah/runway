(() => {
  const METERS = [
    { key: "cash", label: "Cash", icon: "💰" },
    { key: "team", label: "Team", icon: "👥" },
    { key: "users", label: "Users", icon: "📈" },
    { key: "investors", label: "Investors", icon: "🤝" },
  ];
  const START_VALUE = 50;
  const DANGER_LOW = 20;
  const DANGER_HIGH = 80;
  const BIG_EFFECT = 10;
  const BEST_KEY = "runway.bestWeeks";

  const $ = (id) => document.getElementById(id);
  const screens = { start: $("start"), game: $("game"), end: $("end") };
  const meterEls = {};
  let state = null;

  // ---------- Storage (may be unavailable, e.g. in private mode) ----------

  function getBest() {
    try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
  }
  function saveBest(weeks) {
    try { if (weeks > getBest()) localStorage.setItem(BEST_KEY, String(weeks)); } catch {}
  }

  // ---------- Screens ----------

  function show(name) {
    for (const [key, el] of Object.entries(screens)) el.hidden = key !== name;
  }

  function renderBestOnStart() {
    const best = getBest();
    $("best-start").textContent = best ? `Best run: ${best} of ${CARDS.length} weeks` : "";
  }

  // ---------- Meters ----------

  function buildMeters() {
    const wrap = $("meters");
    wrap.innerHTML = "";
    for (const m of METERS) {
      const el = document.createElement("div");
      el.className = "meter";
      el.innerHTML = `
        <div class="meter-dot"></div>
        <div class="meter-icon" aria-hidden="true">${m.icon}</div>
        <div class="bar" role="meter" aria-label="${m.label}" aria-valuemin="0" aria-valuemax="100">
          <div class="bar-fill"></div>
        </div>
        <div class="meter-label">${m.label}</div>
        <div class="meter-delta"></div>`;
      wrap.appendChild(el);
      meterEls[m.key] = {
        root: el,
        dot: el.querySelector(".meter-dot"),
        bar: el.querySelector(".bar"),
        fill: el.querySelector(".bar-fill"),
        delta: el.querySelector(".meter-delta"),
      };
    }
  }

  function renderMeters(deltas = {}) {
    for (const m of METERS) {
      const v = state.meters[m.key];
      const els = meterEls[m.key];
      els.fill.style.height = `${v}%`;
      els.bar.setAttribute("aria-valuenow", String(v));
      els.root.classList.toggle("danger", v <= DANGER_LOW || v >= DANGER_HIGH);

      const d = deltas[m.key];
      if (d) {
        els.delta.className = "meter-delta";
        void els.delta.offsetWidth; // restart the animation
        els.delta.textContent = d > 0 ? "▲" : "▼";
        els.delta.classList.add(d > 0 ? "up" : "down");
      }
    }
  }

  function preview(effects) {
    for (const m of METERS) {
      const d = Math.abs(effects?.[m.key] ?? 0);
      const dot = meterEls[m.key].dot;
      dot.classList.toggle("small", d > 0 && d < BIG_EFFECT);
      dot.classList.toggle("big", d >= BIG_EFFECT);
    }
  }
  const clearPreview = () => preview({});

  // ---------- Game flow ----------

  function startGame() {
    state = {
      index: 0,
      meters: Object.fromEntries(METERS.map((m) => [m.key, START_VALUE])),
      history: [],
      busy: false,
      ending: null,
    };
    buildMeters();
    renderMeters();
    show("game");
    renderCard();
  }

  function renderCard() {
    const card = CARDS[state.index];
    const who = CHARACTERS[card.who];
    const week = state.index + 1;

    $("week-label").textContent = `Week ${week} of ${CARDS.length}`;
    $("progress-fill").style.width = `${(state.index / CARDS.length) * 100}%`;
    $("avatar").textContent = who.avatar;
    $("who-name").textContent = who.name;
    $("who-role").textContent = who.role;
    $("card-text").textContent = card.text;

    const choicesEl = $("choices");
    choicesEl.innerHTML = "";
    card.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.className = "choice";
      btn.innerHTML = `<span class="key">${i + 1}</span><span></span>`;
      btn.lastChild.textContent = choice.label;
      btn.addEventListener("click", () => choose(i));
      btn.addEventListener("mouseenter", () => preview(choice.effects));
      btn.addEventListener("mouseleave", clearPreview);
      btn.addEventListener("focus", () => preview(choice.effects));
      btn.addEventListener("blur", clearPreview);
      choicesEl.appendChild(btn);
    });

    choicesEl.hidden = false;
    $("result").hidden = true;
    state.busy = false;

    const cardEl = $("card");
    cardEl.classList.remove("enter");
    void cardEl.offsetWidth;
    cardEl.classList.add("enter");
  }

  function choose(i) {
    if (state.busy) return;
    state.busy = true;

    const card = CARDS[state.index];
    const choice = card.choices[i];
    clearPreview();

    const deltas = {};
    for (const m of METERS) {
      const d = choice.effects?.[m.key] ?? 0;
      if (!d) continue;
      state.meters[m.key] = Math.max(0, Math.min(100, state.meters[m.key] + d));
      deltas[m.key] = d;
    }
    state.history.push({ week: state.index + 1, who: CHARACTERS[card.who].name, label: choice.label });
    renderMeters(deltas);
    state.ending = checkEnding();

    if (choice.result) {
      $("choices").hidden = true;
      $("result-text").textContent = choice.result;
      $("continue-btn").textContent = state.ending ? "See what happened" : "Continue";
      $("result").hidden = false;
      $("continue-btn").focus();
    } else {
      setTimeout(advance, 450);
    }
  }

  function checkEnding() {
    for (const m of METERS) {
      const v = state.meters[m.key];
      if (v <= 0) return ENDINGS[m.key].low;
      if (v >= 100) return ENDINGS[m.key].high;
    }
    return null;
  }

  function advance() {
    if (state.ending) return finish(state.ending, state.index + 1);
    state.index += 1;
    if (state.index >= CARDS.length) return finish(winEnding(), CARDS.length);
    renderCard();
  }

  function winEnding() {
    const top = METERS.reduce((a, b) => (state.meters[b.key] > state.meters[a.key] ? b : a));
    return ARCHETYPES[top.key];
  }

  function finish(ending, weeks) {
    $("progress-fill").style.width = `${(weeks / CARDS.length) * 100}%`;
    saveBest(weeks);

    $("end-mark").textContent = ending.mark;
    $("end-title").textContent = ending.title;
    $("end-text").textContent = ending.text;
    $("stat-weeks").textContent = `${weeks}/${CARDS.length}`;
    $("stat-best").textContent = `${getBest()}/${CARDS.length}`;

    const list = $("history-list");
    list.innerHTML = "";
    for (const h of state.history.slice(-5)) {
      const li = document.createElement("li");
      li.innerHTML = `<span class="h-week"></span> <span></span>`;
      li.firstChild.textContent = `Week ${h.week}, ${h.who}:`;
      li.lastChild.textContent = h.label;
      list.appendChild(li);
    }

    setTimeout(() => show("end"), 300);
  }

  // ---------- Input ----------

  $("start-btn").addEventListener("click", startGame);
  $("restart-btn").addEventListener("click", startGame);
  $("continue-btn").addEventListener("click", advance);

  document.addEventListener("keydown", (e) => {
    if (!screens.game.hidden && state) {
      const resultOpen = !$("result").hidden;
      if (!resultOpen && /^[1-9]$/.test(e.key)) {
        const i = Number(e.key) - 1;
        if (i < CARDS[state.index].choices.length) choose(i);
      }
      return;
    }
    if (e.key === "Enter" && document.activeElement === document.body) {
      if (!screens.start.hidden) startGame();
      else if (!screens.end.hidden) startGame();
    }
  });

  renderBestOnStart();
})();
