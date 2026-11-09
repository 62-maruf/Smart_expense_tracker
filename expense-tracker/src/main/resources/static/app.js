const $ = id => document.getElementById(id);

async function api(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error("Request failed: " + res.status);
  return res.status === 204 || res.headers.get("content-length") === "0" ? null : res.json();
}

// ---------- Setup ----------
async function loadCurrencies() {
  try {
    const codes = await api("/api/currencies");
    const options = codes.map(c => `<option>${c}</option>`).join("");
    ["currency", "total-currency", "conv-from", "conv-to"].forEach(id => $(id).innerHTML = options);
    $("currency").value = "USD";
    $("total-currency").value = "USD";
    $("conv-from").value = "USD";
    $("conv-to").value = "BDT";
  } catch (e) {
    alert("Could not load currencies. Check your internet connection.");
  }
}

// ---------- Expenses ----------
async function loadExpenses() {
  const expenses = await api("/api/expenses");
  $("list").innerHTML = expenses.map(e => `
    <tr>
      <td>${e.date}</td>
      <td>${e.title}</td>
      <td>${e.category}</td>
      <td>${e.amount.toFixed(2)} ${e.currency}</td>
      <td><button onclick="removeExpense(${e.id})">Delete</button></td>
    </tr>`).join("");
  loadTotal();
}

async function loadTotal() {
  try {
    const data = await api("/api/total?currencyCode=" + $("total-currency").value);
    $("total").textContent = data.total.toFixed(2) + " " + data.currency;
  } catch (e) {
    $("total").textContent = "unavailable";
  }
}

async function removeExpense(id) {
  await api("/api/expenses/" + id, { method: "DELETE" });
  loadExpenses();
}

$("expense-form").addEventListener("submit", async e => {
  e.preventDefault();
  const expense = {
    title: $("title").value,
    amount: parseFloat($("amount").value),
    currency: $("currency").value,
    category: $("category").value,
    date: $("date").value || null
  };
  await api("/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense)
  });
  e.target.reset();
  $("currency").value = expense.currency;
  loadExpenses();
});

$("total-currency").addEventListener("change", loadTotal);

// ---------- Converter ----------
$("conv-btn").addEventListener("click", async () => {
  const amount = $("conv-amount").value;
  const from = $("conv-from").value;
  const to = $("conv-to").value;
  try {
    const data = await api(`/api/convert?amount=${amount}&from=${from}&to=${to}`);
    $("conv-result").textContent = `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
  } catch (e) {
    $("conv-result").textContent = "Conversion failed. Try again.";
  }
});

// ---------- Start ----------
loadCurrencies().then(loadExpenses);
