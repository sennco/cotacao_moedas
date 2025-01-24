const form = document.querySelector("form");
const amount = document.getElementById("amount");
const currency = document.getElementById("currency");
const footer = document.querySelector("main footer");
const description = document.getElementById("description");
const cotacao = document.getElementById("result");

amount.addEventListener("input", () => {
  const regex = /\D+/g;

  amount.value = amount.value.replace(regex, "");
});

form.onsubmit = async (e) => {
  e.preventDefault();

  let dolar, dolarTurismo, euro;

  try {
    const dolarResponse = await fetch(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL"
    );
    const dolarData = await dolarResponse.json();
    dolar = parseFloat(dolarData.USDBRL.bid).toFixed(2);

    const euroResponse = await fetch(
      "https://economia.awesomeapi.com.br/json/last/EUR-BRL"
    );
    const euroData = await euroResponse.json();
    euro = parseFloat(euroData.EURBRL.bid).toFixed(2);

    const dolarTurismoResponse = await fetch(
      "https://economia.awesomeapi.com.br/json/last/USD-BRLT"
    );
    const dolarTurismoData = await dolarTurismoResponse.json();
    dolarTurismo = parseFloat(dolarTurismoData.USDBRLT.bid).toFixed(2);
  } catch (error) {
    console.error("Erro ao buscar as taxas de câmbio", error);
    return;
  }

  switch (currency.value) {
    case "USD":
      convertCurrency(amount.value, dolar, "USD$");
      break;
    case "EUR":
      convertCurrency(amount.value, euro, "€");
      break;
    case "USD-T":
      convertCurrency(amount.value, dolarTurismo, "USD-T$");
      break;
  }
};

function convertCurrency(amount, price, symbol) {
  try {
    description.textContent = `${symbol} 1 = ${formatCurrencyBRL(price)}`;
    let valorConvertido = (amount * price).toFixed(2);
    valorConvertido = formatCurrencyBRL(valorConvertido).replace("R$", "");
    cotacao.textContent = `${valorConvertido} Reais`;
    footer.classList.add("show-result");
  } catch (error) {
    footer.classList.remove("show-result");
    alert("Erro ao converter a moeda");
    console.error("Erro ao converter a moeda", error);
  }
}

function formatCurrencyBRL(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
