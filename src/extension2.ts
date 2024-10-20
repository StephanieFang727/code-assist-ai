import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // 注册侧边栏视图提供程序
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("sidebarView", sidebarProvider)
  );

  console.log('Congratulations, your extension "sidebar" is now active!');
}

class SidebarProvider implements vscode.WebviewViewProvider {
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
      //   localResourceRoots: [this._extensionUri],
    };
    console.log("ff");
    // 设置 Webview 的 HTML 内容
    //  console.log(this.getHtmlForWebview(webviewView.webview));
    webviewView.webview.html = this.getHtmlForWebview(
      webviewView.webview,
      this._extensionUri
    );
  }

  private getHtmlForWebview(
    webview: vscode.Webview,
    extensionUri: vscode.Uri
  ): string {
    // 获取 Webview 中使用的 CSS 和 JS 文件的 URI
    // const styleUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(extensionUri, "media", "style.css")
    // );
    // const scriptUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(extensionUri, "media", "main.js")
    // );

    // 返回 Webview 的 HTML 页面
    return /*html*/ `
          <!DOCTYPE html>
          <html lang="en">
              <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Input Code</title>
              </head>
              <body>
                  <table>
                      <tr>
                          <th class="title">Input Code</th>
                      </tr>
                  </table>             
              </body>
          </html>
          `;
  }
}

export function deactivate() {}
