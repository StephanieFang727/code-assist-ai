import * as vscode from "vscode";
import * as babylon from "@babel/parser";
import aiRequest from "../utils/aiRequst";

const translateToTsFunction = {
  name: "extension.translateToTsFunction",
  execute: async (text: string) => {
    // 打开侧边栏
    vscode.commands.executeCommand("extension.openSidebar");

    if (text) {
      vscode.commands.executeCommand(
        "extension.showInWebview",
        "代码转换中..."
      );

      //  const responseText = await aiRequest(text);
      console.log("text:", text);
      // vscode.commands.executeCommand("extension.showInWebview", responseText);

      setTimeout(() => {
        vscode.commands.executeCommand("extension.showInWebview", text);
      }, 3000);
    } else {
      // vscode.window.showWarningMessage("请先选中一个函数！");
    }
  },
};

export default translateToTsFunction;
