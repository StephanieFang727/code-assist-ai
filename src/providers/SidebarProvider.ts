import * as vscode from "vscode";

class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  public static currentPanel: SidebarProvider | undefined;

  constructor(private readonly _extensionUri: vscode.Uri) {
    SidebarProvider.currentPanel = this;
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;
    // 设置 Webview 的选项
    webviewView.webview.options = {
      enableScripts: true,
      //   localResourceRoots: [this._extensionUri],
    };
    console.log("ff");
    // 设置 Webview 的 HTML 内容
    //  console.log(this.getHtmlForWebview(webviewView.webview));
    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
  }

  // 更新 WebView 中的内容
  public updateContent(content: string) {
    console.log("update");
    if (this._view) {
      console.log("do update");
      this._view.webview.postMessage({ command: "update", text: content });
    }
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
                  <script type="module" src="${scriptUri}"></script>
              </head>
              <body>
                  <h1>Hello from My Sidebar!</h1>
                  <pre id="content"></pre>
                </script>
              </body>
              </html>`;
  }
}

export default SidebarProvider;
