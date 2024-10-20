import * as vscode from "vscode";

const refactorCommand = {
  name: "extension.refactorFunction",
  execute: async () => {
    vscode.commands.executeCommand("extension.openSidebar");
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (selectedText) {
        //  vscode.window.showInformationMessage("正在请求 AI 进行重构...");
        vscode.commands.executeCommand(
          "extension.showInWebview",
          "正在请求 AI 进行重构..."
        );
        setTimeout(() => {
          vscode.commands.executeCommand(
            "extension.showInWebview",
            selectedText
          );
        }, 2000);
        // 打开侧边栏并显示选中的文本
        //  vscode.commands.executeCommand("workbench.view.extension.sidebarView");

        //   vscode.commands.executeCommand("extension.showInWebview", selectedText);

        // 调用 AI 接口进行重构（伪代码，可以替换为实际 API 调用）
        // const refactoredCode = await callAIForRefactor(selectedText);

        // 打开或更新 Webview，显示重构后的代码
        //   RefactorPanel.createOrShow(context.extensionUri, refactoredCode);
      } else {
        vscode.window.showWarningMessage("请先选中一个函数！");
      }
    }
  },
};

// 模拟 AI 接口调用
async function callAIForRefactor(code: string): Promise<string> {
  // 实际上应在此发送 HTTP 请求到 AI 接口，例如：
  // const response = await fetch('http://ai-api.com/refactor', { method: 'POST', body: JSON.stringify({ code }) });
  // const data = await response.json();
  // return data.refactoredCode;

  // 这里用假数据模拟返回
  return `AI 重构后的代码:\n${code.replace("function", "async function")}`;
}

export default refactorCommand;
