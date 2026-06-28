const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtl15W2lRjLUSaO28IQLEEQBG6Ekqshn7ezMvEhFonEhaxwz5cQtaigJbCVYkIdEUW3NqQCLh4fsaP/pub?gid=0&single=true&output=csv";

async function loadData() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").slice(1);

  let donations = {};
  let total = 0;

  rows.forEach(r => {
    const [date, name, amount] = r.split(",");
    const value = parseFloat(amount);

    if (!donations[name]) donations[name] = 0;
    donations[name] += value;
    total += value;
  });

  document.getElementById("raised").innerText = total;

  let sorted = Object.entries(donations)
    .sort((a,b)=>b[1]-a[1]);

  document.getElementById("top").innerHTML =
    sorted.slice(0,3)
      .map(x => `<li>${x[0]} - €${x[1]}</li>`)
      .join("");

  document.getElementById("all").innerHTML =
    sorted
      .map(x => `<li>${x[0]} - €${x[1]}</li>`)
      .join("");
}

loadData();
