// const button = document.getElementById("myButton");
// button.addEventListener("click", () => {
//   vscode.postMessage({
//     command: "alert",
//     text: "Button clicked!",
//   });
// });

// // 监听来自插件的消息
// window.addEventListener("message", (event) => {
//   const message = event.data;
//   switch (message.command) {
//     case "alert":
//       alert(message.text);
//       console.log(message.text);
//       break;
//   }
// });

const vscode = acquireVsCodeApi();
console.log("vs");
window.addEventListener("message", (event) => {
  console.log("get msg");
  const message = event.data;
  if (message.command === "update") {
    document.getElementById("content").textContent = message.text;
  }
});
