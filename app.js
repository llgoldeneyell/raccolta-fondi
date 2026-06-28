const SHEET_URL = "INCOLLA_QUI_LINK_CSV_GOOGLE_SHEET";

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
