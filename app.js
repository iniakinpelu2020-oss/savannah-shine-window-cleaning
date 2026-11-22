/* Savannah Shine Window Cleaning — visit builder */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return "$" + n; };

  var PHONE = "+19126634902";
  var TZ = "America/New_York";

  var PKGS = {
    ext: { label: "Exterior Pure-Water", price: 135 },
    inout: { label: "Interior & Exterior", price: 215 }
  };
  var ADDS = {
    gutter: { label: "Gutter Flush", price: 125 },
    screen: { label: "Screen & Track Detail", price: 65 },
    upper: { label: "Second-Story / Sunroom", price: 75 }
  };
  var ADD_ORDER = ["gutter", "screen", "upper"];

  var state = { pkg: "inout", adds: [] };

  /* ---------- boot failsafe ---------- */
  var boot = $("#boot");
  if (boot) {
    window.setTimeout(function () {
      if (boot && boot.parentNode) { boot.parentNode.removeChild(boot); }
    }, 2600);
  }

  /* ---------- today in Savannah ---------- */
  (function today() {
    var rows = $$(".hours__table tr[data-day]");
    if (!rows.length) { return; }
    var label;
    try {
      label = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: TZ }).format(new Date());
    } catch (err) {
      label = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
    }
    rows.forEach(function (row) {
      if (row.getAttribute("data-day") === label) {
        row.classList.add("is-today");
        var cell = $(".hours__now", row);
        if (cell) { cell.textContent = "Today"; }
      }
    });
  })();

  /* ---------- elements ---------- */
  var qTotal = $("#qTotal");
  var qList = $("#qList");
  var qCount = $("#qCount");
  var qText = $("#qText");
  var qCall = $("#qCall");

  var drawerNum = $("#drawerTotal");
  var drawerSub = $("#drawerSub");
  var drawerList = $("#drawerList");
  var drawerText = $("#drawerText");
  var drawerCall = $("#drawerCall");

  var barTotal = $("#barTotal");

  function pkg() { return PKGS[state.pkg]; }

  function total() {
    return ADD_ORDER.reduce(function (sum, k) {
      return state.adds.indexOf(k) !== -1 ? sum + ADDS[k].price : sum;
    }, pkg().price);
  }

  function subText() {
    return pkg().label;
  }

  function countText() {
    var n = state.adds.length + 1;
    return n + (n === 1 ? " item" : " items");
  }

  function message() {
    var parts = [pkg().label + " " + money(pkg().price)];
    ADD_ORDER.forEach(function (k) {
      if (state.adds.indexOf(k) !== -1) { parts.push(ADDS[k].label + " " + money(ADDS[k].price)); }
    });
    return "Hi Savannah Shine — visit estimate from your site: " + parts.join(" + ") +
      " = " + money(total()) + " (starting). Savannah. Can you hold a window?";
  }

  function rowsHtml() {
    var out = '<li class="is-pkg"><span>' + pkg().label + "</span><span>" + money(pkg().price) + "</span></li>";
    ADD_ORDER.forEach(function (k) {
      if (state.adds.indexOf(k) !== -1) {
        out += '<li class="is-add"><span>' + ADDS[k].label + "</span><span>" + money(ADDS[k].price) + "</span></li>";
      }
    });
    return out;
  }

  function render(pop) {
    var t = total();
    var href = "sms:" + PHONE + "?&body=" + encodeURIComponent(message());
    var rows = rowsHtml();

    if (qTotal) {
      qTotal.textContent = money(t);
      if (pop) {
        qTotal.style.transform = "scale(1.03)";
        window.setTimeout(function () { qTotal.style.transform = ""; }, 180);
      }
    }
    if (qList) { qList.innerHTML = rows; }
    if (qCount) { qCount.textContent = countText(); }
    if (qText) { qText.href = href; }
    if (qCall) { qCall.href = "tel:" + PHONE; }

    if (drawerNum) { drawerNum.textContent = money(t); }
    if (drawerSub) { drawerSub.textContent = subText(); }
    if (drawerList) { drawerList.innerHTML = rows; }
    if (drawerText) { drawerText.href = href; }
    if (drawerCall) { drawerCall.href = "tel:" + PHONE; }
    if (barTotal) { barTotal.textContent = money(t); }

    $$(".pkg[data-pkg]").forEach(function (b) {
      var on = b.getAttribute("data-pkg") === state.pkg;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    $$(".addon[data-add]").forEach(function (b) {
      var on = state.adds.indexOf(b.getAttribute("data-add")) !== -1;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    $$(".row").forEach(function (row) {
      var pkgKey = row.getAttribute("data-pkg");
      var addKey = row.getAttribute("data-add");
      var on = pkgKey ? pkgKey === state.pkg : addKey ? state.adds.indexOf(addKey) !== -1 : false;
      row.classList.toggle("is-on", on);
      row.setAttribute("aria-pressed", on ? "true" : "false");
      var flag = $("[data-flag]", row);
      if (flag) { flag.textContent = on ? (pkgKey ? "Current" : "Added") : "Add"; }
    });
  }

  function pickPkg(key) {
    if (!PKGS[key]) { return; }
    state.pkg = key;
    render(true);
  }

  function toggleAdd(key) {
    if (!ADDS[key]) { return; }
    var i = state.adds.indexOf(key);
    if (i === -1) { state.adds.push(key); } else { state.adds.splice(i, 1); }
    render(true);
  }

  /* ---------- events ---------- */
  $$(".pkg[data-pkg]").forEach(function (b) {
    b.addEventListener("click", function () { pickPkg(b.getAttribute("data-pkg")); });
  });

  $$(".addon[data-add]").forEach(function (b) {
    b.addEventListener("click", function () { toggleAdd(b.getAttribute("data-add")); });
  });

  $$(".row").forEach(function (row) {
    row.addEventListener("click", function () {
      var pkgKey = row.getAttribute("data-pkg");
      var addKey = row.getAttribute("data-add");
      if (pkgKey) { pickPkg(pkgKey); } else if (addKey) { toggleAdd(addKey); }
      if (window.matchMedia("(max-width:1024px)").matches) {
        var target = $("#visit");
        if (target) { target.scrollIntoView({ behavior: "smooth", block: "start" }); }
      }
    });
  });

  /* ---------- row glint on pointer ---------- */
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (fine && !calm) {
    $$(".row").forEach(function (row) {
      row.addEventListener("pointermove", function (e) {
        var r = row.getBoundingClientRect();
        var p = ((e.clientX - r.left) / r.width) * 100;
        row.style.backgroundImage = "radial-gradient(420px 120px at " + p.toFixed(1) + "% 50%, rgba(255,255,255,.65), transparent 70%)";
      });
      row.addEventListener("pointerleave", function () { row.style.backgroundImage = ""; });
    });
  }

  render(false);

  /* ---------- drawer ---------- */
  var drawer = $("#drawer");
  var scrim = $("#scrim");
  var drawerClose = $("#drawerClose");
  var lastFocus = null;

  function openDrawer() {
    if (!drawer) { return; }
    lastFocus = document.activeElement;
    render(false);
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    if (scrim) {
      scrim.hidden = false;
      window.requestAnimationFrame(function () { scrim.classList.add("is-open"); });
    }
    document.body.style.overflow = "hidden";
    if (drawerClose) { drawerClose.focus(); }
  }

  function closeDrawer() {
    if (!drawer) { return; }
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    if (scrim) {
      scrim.classList.remove("is-open");
      window.setTimeout(function () {
        if (!drawer.classList.contains("is-open")) { scrim.hidden = true; }
      }, 400);
    }
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
  }

  $$("[data-open-estimate]").forEach(function (b) { b.addEventListener("click", openDrawer); });
  if (drawerClose) { drawerClose.addEventListener("click", closeDrawer); }
  if (scrim) { scrim.addEventListener("click", closeDrawer); }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) { closeDrawer(); }
  });
})();
