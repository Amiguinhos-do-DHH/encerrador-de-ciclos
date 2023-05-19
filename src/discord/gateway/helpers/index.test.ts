// import type { SentPayload } from "../sentPayload";
// import { describe, expect, test } from "bun:test";
// import { sendPayload } from "./index";

// describe("", () => {
//   // TODO: Pôr nome
//   test("", async () => {
//     // TODO: Pôr nome e entender como funciona
//     const heartbeatPayload: SentPayload = {
//       op: 1,
//       d: 1,
//     };
//     const ws = new WebSocket("wss://ws.postman-echo.com/raw");
//     await new Promise((resolve, reject) => {
//       ws.onopen = resolve;
//       ws.onerror = reject;
//       ws.onclose = () => {
//         reject("WebSocket closed");
//       };
//     });
//     const promise = new Promise((resolve, reject) => {
//       ws.onmessage = event => {
//         expect(event.data).toBe(JSON.stringify(heartbeatPayload));
//         resolve(1);
//       };
//     });

//     sendPayload(ws, heartbeatPayload);

//     await promise;
//     ws.close();
//   });
// });
