import { ServerWebSocket } from "bun";

const port = 8080; // サーバーのポート番号
console.log(`WebSocket Server is running on port ${port}`);
const clients = new Set<ServerWebSocket>(); // 接続中のクライアントを格納するSet

Bun.serve({
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed :(", { status: 500 });
  },
  port,
  websocket: {
    open(ws: ServerWebSocket) {
      console.log("Client has connected");
      clients.add(ws); // 新しいクライアントを追加
    },
    message(_ws, message) {
      console.log(`Received message => ${message}`);
      // すべてのクライアントにメッセージをブロードキャスト
      // Biomeに従った書き方
      for (const client of clients) {
        if (client.readyState !== WebSocket.OPEN) continue;
        client.send(`\nClient said: ${message}`);
      }
    },
    close(ws) {
      console.log("Client has disconnected");
      clients.delete(ws); // クライアントが切断したら削除
    },
  },
});
