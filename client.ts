import readline from "readline";

const url = "ws://localhost:8080";
const ws = new WebSocket(url);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

ws.onopen = () => {
  console.log("Connected to the server.");
  promptInput();
};

function promptInput() {
  rl.question("Enter message to send: ", (message) => {
    if (message === "exit") {
      // 'exit'と入力した場合、プログラムを終了
      rl.close();
      ws.close();
    } else {
      ws.send(message);
    }
  });
}

ws.onmessage = (e) => {
  console.log(`Received: ${e.data}`);
  promptInput();
};

ws.onerror = (error) => {
  console.error(`WebSocket Error: ${error}`);
};

ws.onclose = () => {
  console.log("Disconnected from the server");
  rl.close();
};
