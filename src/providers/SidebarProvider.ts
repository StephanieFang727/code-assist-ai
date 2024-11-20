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
    // 设置 Webview 的 HTML 内容
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

  public updateRefactorBefore(content: string) {
    if (this._view) {
      console.log("do update");
      this._view.webview.postMessage({
        command: "updateRefactorBefore",
        text: content,
      });
    }
  }

  public updateTransformToTsBefore(content: string) {
    if (this._view) {
      console.log("do update");
      this._view.webview.postMessage({
        command: "updateTransformToTsBefore",
        text: content,
      });
    }
  }

  public updateAfter(content: string) {
    if (this._view) {
      this._view.webview.postMessage({
        command: "updateAfter",
        text: content,
      });
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
                  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css">
                  <script src="https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.1/markdown-it.min.js"></script>
                  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script></script>
                  <script type="module" src="${scriptUri}"></script>
              </head>
              <body>
                  <h1>CodeAssist - Refactor with AI</h1>
                  <h5 id="complex">· 函数复杂度检测</h5>
                  <h5 id="refactor">· 复杂函数重构</h5>
                  <h5 id="transform">· js函数转ts</h5>
                  
                  <div class="container hide">
                    <h5>原函数：</h5>
                    <pre><code id="content_before" class="javascript"></code></pre>
                    <h5 id="loading">转换中...</h5>
                    <div id="after" class="hide">
                      <h5>转换后：</h2>
                      <pre><code id="content_after" class="javascript"></code></pre>
                    </div>
                  </div>
                </script>
              </body>
              </html>`;
  }
}

export default SidebarProvider;
