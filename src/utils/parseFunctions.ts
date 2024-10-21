import * as fs from "fs";
import * as vscode from "vscode";
import * as path from "path";
import { parse } from "@babel/parser";
import traverse, { NodePath, Node } from "@babel/traverse";
import * as t from "@babel/types";
import complexityMap from "./metrics";

// 定义函数信息的接口
interface FunctionInfo {
  name: string;
  start: { line: number; column: number };
  end: { line: number; column: number };
  length: number;
  content: string; // 函数的内容
  complexity?: number;
}

// 获取特定位置的代码片段
function getCodeFromPosition(
  code: string,
  start: { line: number; column: number },
  end: { line: number; column: number }
): string {
  // 将代码分成行数组，方便基于行提取
  const lines = code.split("\n");

  // 如果函数位于同一行
  if (start.line === end.line) {
    return lines[start.line - 1].substring(start.column, end.column); // 同行提取
  }

  // 跨行提取
  const resultLines = [
    lines[start.line - 1].substring(start.column), // 提取第一行，从起始列开始
    ...lines.slice(start.line, end.line - 1), // 提取中间的完整行
    lines[end.line - 1].substring(0, end.column), // 提取最后一行，到结束列
  ];

  return resultLines.join("\n"); // 将多行代码重新组合为字符串
}

// 定义函数复杂度的接口
interface FunctionComplexity {
  name: string;
  complexity: number;
}

// 存储函数复杂度信息的数组
const functionComplexities: FunctionComplexity[] = [];

// 计算函数的复杂度
function calculateComplexity(
  path: NodePath<
    t.FunctionDeclaration | t.FunctionExpression | t.ArrowFunctionExpression
  >
) {
  let complexity = 1; // 初始复杂度（每个函数至少1）

  path.traverse({
    enter(subPath) {
      const nodeType = subPath.node.type as keyof typeof complexityMap;
      if (complexityMap[nodeType]) {
        console.log("sub", nodeType);
        complexity += complexityMap[nodeType];
      }
    },
  });

  return complexity;
}

const parseFunctions = (code: string): FunctionInfo[] => {
  // 存储函数及其位置信息的数组
  const functions: FunctionInfo[] = [];
  const processedNodes = new Set<t.Node>(); // 存储已处理的节点
  // 解析为 AST
  try {
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"], // 视项目需求添加插件
    });
    // console.log("ast", ast);
    // 遍历 AST
    traverse(ast, {
      // 处理函数声明
      FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
        if (processedNodes.has(path.node)) return; // 如果节点已处理，跳过
        // 获取函数位置信息和复杂度
        const { loc } = path.node;
        if (loc && path.node.id) {
          const functionContent = getCodeFromPosition(code, loc.start, loc.end);
          functions.push({
            name: path.node.id.name,
            start: loc.start,
            end: loc.end,
            length: loc.end.line - loc.start.line + 1,
            content: functionContent,
            complexity: calculateComplexity(path),
          });
          processedNodes.add(path.node); // 标记节点为已处理
        }
      },
      // 处理函数表达式（包括箭头函数）
      VariableDeclarator(path: NodePath<t.VariableDeclarator>) {
        if (processedNodes.has(path.node)) return; // 如果节点已处理，跳过

        if (
          t.isFunctionExpression(path.node.init) ||
          t.isArrowFunctionExpression(path.node.init)
        ) {
          const parentLoc = path.parent.loc; // 获取整个变量声明的位置信息
          if (parentLoc && t.isIdentifier(path.node.id)) {
            const functionContent = getCodeFromPosition(
              code,
              parentLoc.start,
              parentLoc.end
            ); // 提取整个变量声明部分
            functions.push({
              name: path.node.id.name,
              start: parentLoc.start,
              end: parentLoc.end,
              length: parentLoc.end.line - parentLoc.start.line + 1,
              content: functionContent,
              complexity: calculateComplexity(
                path.get("init") as NodePath<
                  t.FunctionExpression | t.ArrowFunctionExpression
                >
              ),
            });
            processedNodes.add(path.node.init!); // 标记节点为已处理
          }
        }
      },
      // 处理匿名函数
      FunctionExpression(path: NodePath<t.FunctionExpression>) {
        if (processedNodes.has(path.node)) return; // 如果节点已处理，跳过

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
          const functionContent = getCodeFromPosition(code, loc.start, loc.end);
          functions.push({
            name,
            start: loc.start,
            end: loc.end,
            length: loc.end.line - loc.start.line + 1,
            content: functionContent,
            complexity: calculateComplexity(path),
          });
          processedNodes.add(path.node); // 标记节点为已处理
        }
      },
      // ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>) {
      //   if (processedNodes.has(path.node)) return; // 如果节点已处理，跳过

      //   const { loc } = path.node;
      //   let name = "anonymous";
      //   if (
      //     loc &&
      //     path.parent &&
      //     t.isVariableDeclarator(path.parent) &&
      //     t.isIdentifier(path.parent.id)
      //   ) {
      //     name = path.parent.id.name;
      //   }
      //   if (loc) {
      //     const newLoc = path.parent.loc || loc; // 获取整个父级 VariableDeclarator 的位置
      //     const functionContent = getCodeFromPosition(
      //       code,
      //       newLoc.start,
      //       newLoc.end
      //     ); // 提取包含变量声明部分的代码
      //     functions.push({
      //       name,
      //       start: newLoc.start,
      //       end: newLoc.end,
      //       length: newLoc.end.line - newLoc.start.line + 1,
      //       content: functionContent,
      //     });
      //     processedNodes.add(path.node); // 标记节点为已处理
      //   }
      // },
    });
  } catch (error) {
    console.log("err", error);
    vscode.commands.executeCommand("extension.showErrorInfo", error);
  }

  // 输出结果
  return functions;
};

export default parseFunctions;
