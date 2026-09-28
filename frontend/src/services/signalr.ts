import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
} from "@microsoft/signalr";

let connection: HubConnection | null = null;

export function createHubConnection() {
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/notificationHub")
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();
  }
  return connection;
}

export async function subscribeCategory(category: string) {
  const conn = createHubConnection();
  if (conn.state !== "Connected") await conn.start();
  await conn.invoke("SubscribeCategory", category);
}
