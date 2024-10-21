import * as vscode from "vscode";
import { Range, Position } from "vscode";
import * as ts from "typescript";
import parseFunctions from "../utils/parseFile";

// 定义 Babel 解析出的位置信息类型
interface Location {
  line: number;
  column: number;
}

// 将 Babel 的位置信息转换为 VSCode 的 Range 对象
function convertToVSCodeRange(start: Location, end: Location): Range {
  // Babel 的行数和列数都是从 1 开始的，VSCode 中是从 0 开始的
  const startPos = new Position(start.line - 1, start.column);
  const endPos = new Position(end.line - 1, end.column);
  return new Range(startPos, endPos);
}

class FunctionCodeLensProvider implements vscode.CodeLensProvider {
  public provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.CodeLens[] {
    const codeLenses: vscode.CodeLens[] = [];

    const text: string = document.getText();
    console.log("text", text);

    const functions = parseFunctions(text);
    console.log("func", functions);
    functions.forEach((item) => {
      const range = convertToVSCodeRange(item.start, item.end);
      codeLenses.push(
        new vscode.CodeLens(range, {
          title: "转为TS",
          command: "extension.refactorFunction",
          arguments: ["test"],
        }),
        new vscode.CodeLens(range, {
          title: "重构函数",
          command: "extension.refactorFunction",
          arguments: ["test"],
        })
      );
    });
    console.log("code", codeLenses);

    return codeLenses;
  }

  public resolveCodeLens(
    codeLens: vscode.CodeLens,
    token: vscode.CancellationToken
  ) {
    return codeLens;
  }
}

export default FunctionCodeLensProvider;
