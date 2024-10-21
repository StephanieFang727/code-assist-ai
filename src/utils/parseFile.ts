import * as fs from "fs";
import * as vscode from "vscode";
import * as path from "path";
import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

// 定义函数信息的接口
interface FunctionInfo {
  name: string;
  start: { line: number; column: number };
  end: { line: number; column: number };
  length: number;
}

// 读取文件内容
const filePath = path.join(__dirname, "../../test.js"); // 或 'example.js'
const code = fs.readFileSync(filePath, "utf-8");

const parseFunctions = (code: string): FunctionInfo[] => {
  // 存储函数及其位置信息的数组
  const functions: FunctionInfo[] = [];
  // 解析为 AST
  try {
    const ast = parse(code, {
      sourceType: "module",
      // plugins: ["typescript", "jsx"], // 视项目需求添加插件
    });
    console.log("ast", ast);

    // 遍历 AST
    traverse(ast, {
      FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
        const { loc } = path.node;
        if (loc && path.node.id) {
          functions.push({
            name: path.node.id.name,
            start: loc.start,
            end: loc.end,
            length: loc.end.line - loc.start.line + 1,
          });
        }
      },
      FunctionExpression(path: NodePath<t.FunctionExpression>) {
        const { loc } = path.node;
        let name = "anonymous";
        if (
          loc &&
          path.parent &&
          t.isVariableDeclarator(path.parent) &&
          t.isIdentifier(path.parent.id)
        ) {
          name = path.parent.id.name;
        }
        if (loc) {
          functions.push({
            name,
            start: loc.start,
            end: loc.end,
            length: loc.end.line - loc.start.line + 1,
          });
        }
      },
      ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>) {
        const { loc } = path.node;
        let name = "anonymous";
        if (
          loc &&
          path.parent &&
          t.isVariableDeclarator(path.parent) &&
          t.isIdentifier(path.parent.id)
        ) {
          name = path.parent.id.name;
        }
        if (loc) {
          functions.push({
            name,
            start: loc.start,
            end: loc.end,
            length: loc.end.line - loc.start.line + 1,
          });
        }
      },
    });
  } catch (error) {
    console.log("err", error);
    vscode.commands.executeCommand("extension.showErrorInfo", error);
  }

  // 输出结果
  console.log(functions);
  return functions;
};

export default parseFunctions;
