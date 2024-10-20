const button = document.getElementById("myButton");
button.addEventListener("click", () => {
  vscode.postMessage({
    command: "alert",
    text: "Button clicked!",
  });
});

// 监听来自插件的消息
window.addEventListener("message", (event) => {
  const message = event.data;
  switch (message.command) {
    case "alert":
      alert(message.text);
      console.log(message.text);
      break;
  }
});
