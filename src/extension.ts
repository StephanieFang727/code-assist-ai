import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // 注册侧边栏视图提供程序
  const mySidebarProvider = new MySidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "mySidebarView",
      mySidebarProvider
    )
  );

  console.log('Congratulations, your extension "mySidebar" is now active!');
}

class MySidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;
    // 设置 Webview 的选项
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    console.log("ff");
    // 设置 Webview 的 HTML 内容
    //  console.log(this.getHtmlForWebview(webviewView.webview));
    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    // 获取 Webview 中使用的 CSS 和 JS 文件的 URI
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "style.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );

    // 返回 Webview 的 HTML 页面
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleUri}" rel="stylesheet">
                <title>My Sidebar</title>
            </head>
            <body>
                <h1>Hello from My Sidebar!</h1>
                <button id="myButton">Click me</button>
                <script src="${scriptUri}"></script>
            </body>
            </html>`;
  }
}

export function deactivate() {}
