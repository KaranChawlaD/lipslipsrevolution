export async function startSymphonic(videoId = null, duration = 10, fps = 15) {
  console.log("Starting Symphonic");

  let frameQueue1 = [];
  let frameQueue2 = [];
  let frameQueue3 = [];

  const video = videoId
    ? document.getElementById(videoId)
    : document.createElement("video");

  if (!videoId) {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    video.srcObject = stream;
    video.autoplay = true;
    document.body.appendChild(video);
  }

  //   let imCap = new ImageCapture(stream.getVideoTracks()[0]);
  let capInt = setInterval(async () => {
    // const frame = await imCap.grabFrame();
    const canvas = document.createElement("canvas");
    let { videoWidth, videoHeight } = video;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, videoWidth, videoHeight);
    let base64String = canvas.toDataURL();
    base64String = base64String.replace("data:image/png;base64,", "");

    const data = {
      videoFrame: base64String,
      userId: "WUZkdllLaXQ2Z1huNnhxaUxvVnlIdnJ4OWl4MQ==",
      pcmAudioData:
        "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pZ0Ju17tB7vkxAe7S9IGu5kSBbtVhQK7m/MBuxpIALsLof+6DQr9uqZP9roqKvK61O/0un5V9LoY2+26mRXsulga7rpUZvC6fenvush787rA2eu6yMHqutjl6rpQyOq6oUrpuv8G6LqB+uK6mXrguo4h4LrVt9269F7cuj1b1bqtldS6PfjRutOxyrqA48K6OXLHupMlxLrbQb669oK7ukIgtbrwXKy6Wv2nus9ipLpY/J66JwaXuqttkbq28I66mcWNuv9Tirp3koS69meFuu2Wf7ruWny69w11utkCcbqgs2O6KBtYujnbT7pRFU66IOdQuux3TrpRH0q67UdEumhaPrqkqz66jNpEuoMVP7qGvjW6GEssuv9AJbpwoRy6MiwdutgyD7pJegu6C70Julr8Cbq/gQ26RHEUuqtSFbpRbRa6TO8fuuxnLLpgcjy6FeY+umgIRLrdx0O6w9A8upIPO7ous0e6hSBHustmSbpnuky6q/VSumnGUbp9vFO6HpxXunf4ULo2FEi6RA49upVFLLpbACW6RvQquujzLrpARDK6MaQjutQwIbqMMhu6D+0QunVDDboS4gm6fKTiuS1kwbmHN6O5VGt9ueSLVrnfyje57k8muQzBD7my3AK5Z8L0uMt8AbmJV8240xUKuRCz+rgyIee4J6QIuRFLAbmChtC4YhKluGELbbhtq424h1OauP/WPrjOTEW4L8hQuCs8mrWU6t03s0y1ttzuhDcOUT44z4OPOKduCzicG8c30uBpOGXBeDguYTM4bRUjOHrqtjd7AXM3Hfz0NQuF4zVkZHk3MbaiNqdqqTfU7e03nls/t2cwgLh19ky4shBSuOEpU7hWpxa4khYguMtIh7hb71y4uxpUuCz1G7icbde3nP17uCpo3bh3pO64OzLWuFfFCLmd2Du5TkxGuYkLUrnfmIK58vKGueQqm7mmeZi5rXSoudSkurn+ZbW5syK0ueKMxLkqnMO5N3m+uepv17m7y+G5i9/ruQMV9bmetPu5fiDwuYvi67kxHu650vH1ubUx8bk7m/W59oD6ue4HALoG7AC66sMDurfFCboAbRO63SccuqM2I7oi3Te6HUA7upysMroblTa6I8xIuttMVLpMNlq66uxUusxgW7pbS2G65VVfutGoYrqte2y6Cg5wugkHbbqF4nW61c5/utbUgro30YK6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",
    };
    let dataStr = JSON.stringify(data);
    let bytes = new TextEncoder().encode(dataStr);
    frameQueue1.push(bytes);
    frameQueue2.push(bytes);
    frameQueue3.push(bytes);
  }, 1000 / fps);

  let wsInt1 = null;
  let wsInt2 = null;
  let wsInt3 = null;
  let capStopped = false;

  return new Promise((resolve) => {
    const ws1 = new WebSocket(
      "wss://symphoniclabs--symphonet-vsr-modal-model-upload-dynamic.modal.run/ws"
    );
    const ws2 = new WebSocket(
      "wss://symphoniclabs--symphonet-vsr-modal-model-upload-dynamic.modal.run/ws"
    );
    const ws3 = new WebSocket(
      "wss://symphoniclabs--symphonet-vsr-modal-model-upload-dynamic.modal.run/ws"
    );
    ws1.onopen = () => {
      console.log("Connected to Symphonic");
      wsInt1 = setInterval(() => {
        if (frameQueue1.length > 0) {
          let data = frameQueue1.pop();
          console.log("Sending frame");
          ws1.send(data);
        } else if (capStopped) {
          ws1.send("STOP");
          clearInterval(wsInt1);
        }
      }, 10);
    };
    ws2.onopen = () => {
      console.log("Connected to Symphonic");
      wsInt2 = setInterval(() => {
        if (frameQueue2.length > 0) {
          let data = frameQueue2.pop();
          ws2.send(data);
        } else if (capStopped) {
          ws2.send("STOP");
          clearInterval(wsInt2);
        }
      }, 10);
    };
    ws3.onopen = () => {
      console.log("Connected to Symphonic");
      wsInt3 = setInterval(() => {
        if (frameQueue3.length > 0) {
          let data = frameQueue3.pop();
          ws3.send(data);
        } else if (capStopped) {
          ws3.send("STOP");
          clearInterval(wsInt3);
        }
      }, 10);
    };
    let result = null;
    ws1.onmessage = (event) => {
      result = event.data;
      console.log(`Received ${result}`);

      if (wsInt1) clearInterval(wsInt1);
      if (wsInt2) clearInterval(wsInt2);
      if (wsInt3) clearInterval(wsInt3);
      ws1.close();
      ws2.close();
      ws3.close();
      resolve(result);
    };
    ws2.onmessage = ws1.onmessage;
    ws3.onmessage = ws1.onmessage;

    setTimeout(() => {
      if (capInt) clearInterval(capInt);
      capStopped = true;
      if (!videoId) {
        video.srcObject.getTracks().forEach((track) => track.stop());
        video.remove();
      }
    }, duration * 1000);
  });
}
