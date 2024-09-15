function getData() {
  fetch("https://api.hackthenorth.com/v3/graphql", {
  method: "POST",
  headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Authorization": `${token}`  
  },
  body: JSON.stringify({
      query: `
      mutation HandleNetworkingScan {
          handleNetworkingScan(badge_code: "${code}") {
          hackerNetworkingPayload {
              name
          }
          }
      }
      `
  }),
  })
  .then(response => response.json())
  .then(data => {
      console.log("data returned:", data);
      console.log(data.data.handleNetworkingScan.hackerNetworkingPayload.name)
  })
  .catch(error => {
      console.error("Error:", error);
  });
}


const token = process.env.HTN_TOKEN;


const button = document.querySelector("button");
button.addEventListener("click", () => {
  scanQRCode((lastPart) => {
      console.log('QR Code Last Part:', lastPart);
      const b_code = lastPart;
      getData();
  });
})
