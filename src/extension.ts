import * as vscode from "vscode";
import SidebarProvider from "./providers/SidebarProvider";
import refactorCommand from "./commands/refactorCommand";
export function activate(context: vscode.ExtensionContext) {
  // 注册侧边栏视图提供程序
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("sidebarView", sidebarProvider)
  );

  // 注册重构函数命令
  const refactorFunctionDisposable = vscode.commands.registerCommand(
    refactorCommand.name,
    refactorCommand.execute
  );
  context.subscriptions.push(refactorFunctionDisposable);

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

  // 注册打开侧边栏的命令
  const openSidebarCommand = vscode.commands.registerCommand(
    "extension.openSidebar",
    () => {
      vscode.commands.executeCommand("sidebarView.focus");
    }
  );
  context.subscriptions.push(openSidebarCommand);

  console.log('Congratulations, your extension "sidebar" is now active!');
}

export function deactivate() {}
