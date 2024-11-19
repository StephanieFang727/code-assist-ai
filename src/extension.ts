import * as vscode from "vscode";
import SidebarProvider from "./providers/SidebarProvider";
import FunctionCodeLensProvider from "./providers/FunctionCodeLensProvider";
import refactorFunction from "./commands/refactorFunction";
import translateToTsFunction from "./commands/translateToTsFunction";
import { error } from "console";

export function activate(context: vscode.ExtensionContext) {
  // 注册侧边栏视图提供程序
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("sidebarView", sidebarProvider)
  );

  // 注册重构函数命令
  const refactorFunctionDisposable = vscode.commands.registerCommand(
    refactorFunction.name,
    refactorFunction.execute
  );
  context.subscriptions.push(refactorFunctionDisposable);

  // 注册js转ts函数命令
  const translateToTsFunctionDisposable = vscode.commands.registerCommand(
    translateToTsFunction.name,
    translateToTsFunction.execute
  );
  context.subscriptions.push(translateToTsFunctionDisposable);

  // 注册显示 WebView 的命令
  const showView = vscode.commands.registerCommand(
    "extension.showInWebview",
    (content: string) => {
      console.log("content", SidebarProvider.currentPanel);
      // 打开 WebView 并显示内容
      SidebarProvider.currentPanel?.updateContent(content);
    }
  );
  context.subscriptions.push(showView);

  const refactorFunctionStart = vscode.commands.registerCommand(
    "extension.refactorFunction.start",
    (content: string) => {
      console.log("content", SidebarProvider.currentPanel);
      // 打开 WebView 并显示内容
      SidebarProvider.currentPanel?.updateRefactorBefore(content);
    }
  );
  context.subscriptions.push(refactorFunctionStart);

  const refactorFunctionEnd = vscode.commands.registerCommand(
    "extension.refactorFunction.end",
    (content: string) => {
      console.log("content", SidebarProvider.currentPanel);
      // 打开 WebView 并显示内容
      SidebarProvider.currentPanel?.updateAfter(content);
    }
  );
  context.subscriptions.push(refactorFunctionEnd);

  const transformToTsStart = vscode.commands.registerCommand(
    "extension.transformToTs.start",
    (content: string) => {
      console.log("content", SidebarProvider.currentPanel);
      // 打开 WebView 并显示内容
      SidebarProvider.currentPanel?.updateTransformToTsBefore(content);
    }
  );
  context.subscriptions.push(transformToTsStart);

  const transformToTsEnd = vscode.commands.registerCommand(
    "extension.transformToTs.end",
    (content: string) => {
      console.log("content", SidebarProvider.currentPanel);
      // 打开 WebView 并显示内容
      SidebarProvider.currentPanel?.updateAfter(content);
    }
  );
  context.subscriptions.push(transformToTsEnd);

  // 注册打开侧边栏的命令
  const openSidebarCommand = vscode.commands.registerCommand(
    "extension.openSidebar",
    () => {
      vscode.commands.executeCommand("sidebarView.focus");
    }
  );
  context.subscriptions.push(openSidebarCommand);

  // 函数提示
  const functionCodeLensProvider = new FunctionCodeLensProvider();
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      [
        { language: "javascript" },
        { language: "typescript" },
        { language: "javascriptreact" },
      ],
      functionCodeLensProvider
    )
  );

  // 提示错误信息
  const showErrorInfo = vscode.commands.registerCommand(
    "extension.showErrorInfo",
    (errorMsg: string) => {
      vscode.window.showErrorMessage(`Easy Code Error: ${errorMsg}`);
    }
  );
  context.subscriptions.push(showErrorInfo);

  // 空白命令
  const emptyCommand = vscode.commands.registerCommand(
    "extension.empty",
    () => {}
  );
  context.subscriptions.push(openSidebarCommand);

  console.log('Congratulations, your extension "sidebar" is now active!');
}

export function deactivate() {}
