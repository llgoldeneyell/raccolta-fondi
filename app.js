const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtl15W2lRjLUSaO28IQLEEQBG6Ekqshn7ezMvEhFonEhaxwz5cQtaigJbCVYkIdEUW3NqQCLh4fsaP/pub?gid=0&single=true&output=csv";
const SETTINGS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtl15W2lRjLUSaO28IQLEEQBG6Ekqshn7ezMvEhFonEhaxwz5cQtaigJbCVYkIdEUW3NqQCLh4fsaP/pub?gid=732762212&single=true&output=csv";

async function fetchCSV(url) {
  const res = await fetch(url);
  const text = await res.text();
  return text.trim().split("\n").map(r => r.split(","));
}

async function loadData() {
  const donationsRaw = await fetchCSV(SHEET_URL);
  const settingsRaw = await fetchCSV(SETTINGS_URL);

  // -------------------------
  // IMPOSTAZIONI
  // -------------------------
  let goal = 0;

  settingsRaw.slice(1).forEach(row => {
    const key = row[0];
    const value = parseFloat(row[1]);

    if (key === "Obiettivo") goal = value;
  });

  animateValue(document.getElementById("goal"), 0, goal, 900);

  // -------------------------
  // DONAZIONI
  // -------------------------
  let donations = {};
  let total = 0;

  donationsRaw.slice(1).forEach(row => {
    const name = row[1];
    const value = parseFloat(row[2]);

    if (!donations[name]) donations[name] = 0;
    donations[name] += value;
    total += value;
  });
  
  animateValue(document.getElementById("raised"), 0, total, 900);

  // -------------------------
  // PROGRESS BAR
  // -------------------------
  let percent = goal > 0 ? (total / goal) * 100 : 0;
  if (percent > 100) percent = 100;

  document.getElementById("bar").style.width = percent + "%";
  document.getElementById("percent").innerText = Math.round(percent) + "%";

  // -------------------------
  // TOP DONATORI (PODIO PRO)
  // -------------------------
  
  let sorted = Object.entries(donations)
    .sort((a,b)=>b[1]-a[1]);
  
  const podium = document.getElementById("podium");
  
  const medals = ["🥇", "🥈", "🥉"];
  const classes = ["first", "second", "third"];
  
  podium.innerHTML = sorted.slice(0, 3)
    .map((x, i) => {
      return `
        <div class="podium-item ${classes[i]}" style="animation-delay:${i * 180}ms">
          <div class="rank">${medals[i]}</div>
          <div class="name">${x[0]}</div>
          <div class="amount">€ ${x[1]}</div>
        </div>
      `;
    })
    .join("");

  // -------------------------
  // LISTA COMPLETA
  // -------------------------
  document.getElementById("all").innerHTML =
    sorted
      .map(x => `<li>${x[0]} — €${x[1]}</li>`)
      .join("");
}

function animateValue(el, start, end, duration) {
  let startTimestamp = null;

  const easeOut = t => t * (2 - t);

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;

    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const eased = easeOut(progress);

    const value = Math.floor(eased * (end - start) + start);
    el.innerText = value;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

loadData();
