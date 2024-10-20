import * as vscode from "vscode";
import * as babylon from "@babel/parser";

const refactorCommand = {
  name: "extension.refactorFunction",
  execute: async () => {
    vscode.commands.executeCommand("extension.openSidebar");
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (selectedText) {
        // 判断是否为一个完整的js函数
        // ========================
        const code1 = "function add(a, b) { return a + b; }";
        const code2 =
          'console.log("Hello"); function add(a, b) { return a + b; }';
        // console.log(isCompleteFunction(code1)); // true
        //  console.log(isCompleteFunction(code2)); // false
        // ================================

        // vscode.commands.executeCommand(
        //   "extension.showInWebview",
        //   "正在请求 AI 进行重构..."
        // );

        console.log("selectedText:", selectedText);
        vscode.commands.executeCommand(
          "extension.showInWebview",
          isCompleteFunction(selectedText)
        );

        // setTimeout(() => {
        //   vscode.commands.executeCommand(
        //     "extension.showInWebview",
        //     isCompleteFunction(selectedText)
        //   );
        // }, 2000);
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

const isCompleteFunction = (code: string): boolean => {
  const ast = babylon.parse(code);
  let isFunction = false;

  if (
    ast.program.body.length === 1 &&
    ast.program.body[0].type === "ExpressionStatement" &&
    ast.program.body[0].expression.type === "ArrowFunctionExpression"
  ) {
    return true;
  }
  ast.program.body.forEach((node) => {
    if (
      node.type === "FunctionDeclaration" ||
      (node.type === "VariableDeclaration" &&
        node.declarations[0].init &&
        node.declarations[0].init.type === "ArrowFunctionExpression")
    ) {
      isFunction = true;
    }
  });
  return isFunction;
};

export default refactorCommand;
