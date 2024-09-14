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
          handleNetworkingScan(badge_code: "derby-jack-accord-market") {
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


const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjE4ODMsIm5hbWUiOiJMdWNhcyBKaW4iLCJlbWFpbCI6ImtibGF6ZXIyMEBnbWFpbC5jb20iLCJpc19hZG1pbiI6ZmFsc2UsImlzX29yZ2FuaXplciI6ZmFsc2UsInJvbGVzIjp7ImhhY2t0aGVub3J0aDIwMjQiOlsiaGFja2VyIl19LCJpYXQiOjE3MjYxOTQ4OTQsImV4cCI6MTcyNjQxMDg5NCwiaXNzIjoiaHR0cHM6Ly9hcGkuaGFja3RoZW5vcnRoLmNvbS8ifQ.nNe0cOTXy7CHtkT_fZvby9cMubynGp5UkWl-zPv_NXHW4V9Dn9M5zgcqh9CvGSqNyDBkuaGThy0tyRFwsTItDCsAzWTG3nsPpzKZ_LBJy-wpbYWVLy7QiNHUat8cTDvEnO8w2HYt00NCxjJwsR0hloABysEGhHepDs6NJZ4bWROVP9CK03d-Pva1ovAQhqioNRYzXaNHKDofijDIgPwRV5aYv9CPrjjsyf-Dt5HEqw1ybZ2z_pY2lYOTuRIjNbkip9AkOOTMyD5ZxrbEplyX_tkvr7qZ3PrpGmf7P3nue8us5iFAIyhmFxUBwOoQbhaJItBwoFFb3hthfofhKMcEMg";


const button = document.querySelector("button");
button.addEventListener("click", () => {
  scanQRCode((lastPart) => {
      console.log('QR Code Last Part:', lastPart);
      const b_code = lastPart;
      getData();
  });
})
