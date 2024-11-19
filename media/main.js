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

// 重置样式
const reset = () => {
  // document.getElementsByTagName("h5").forEach((element) => {
  //   element.style = "";
  // });
  document.getElementById("refactor").style = "";
  document.getElementById("transform").style = "";
  document.getElementsByClassName("container")[0].classList.remove("show");
  document.getElementById("after").classList.remove("show");
  document.getElementById("loading").classList.remove("hide");
};
window.addEventListener("message", (event) => {
  console.log("get msg");
  const message = event.data;
  const md = window.markdownit({
    highlight: function (str, lang) {
      if (lang && window.hljs.getLanguage(lang)) {
        try {
          return window.hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
      return ""; // use external default escaping
    },
  });
  if (message.command === "update") {
    document.getElementById("content").textContent = message.text;
  }
  if (message.command === "updateRefactorBefore") {
    reset();
    document.getElementById("refactor").style =
      "color: #007acc; font-size: 14px";
    document.getElementById("content_before").textContent = message.text;
    document.getElementsByClassName("container")[0].classList.add("show");
    hljs.highlightAll();
  }

  if (message.command === "updateTransformToTsBefore") {
    reset();
    document.getElementById("transform").style =
      "color: #007acc; font-size: 14px";
    document.getElementById("content_before").textContent = message.text;
    document.getElementsByClassName("container")[0].classList.add("show");
    hljs.highlightAll();
  }

  if (message.command === "updateAfter") {
    //  document.getElementById("content_after").textContent = message.text;

    // Render Markdown content
    document.getElementById("content_after").innerHTML = md.render(
      message.text
    );

    document.getElementById("loading").classList.add("hide");
    document.getElementById("after").classList.add("show");
    hljs.highlightAll();
  }
});
