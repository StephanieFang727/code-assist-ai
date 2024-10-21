import * as fs from "fs";
import * as vscode from "vscode";
import * as path from "path";
import { parse } from "@babel/parser";
import traverse, { NodePath, Node } from "@babel/traverse";
import * as t from "@babel/types";

const calculateFunctionComplexity = (code: string): number => {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"], // 视项目需求添加插件
  });
  let complexity = 0;

  function processNode(node: Node) {
    switch (node.type) {
      case "IfStatement":
        complexity += 1;
        break;
      case "ForStatement":
        complexity += 1;
        break;
      case "WhileStatement":
        complexity += 11;
        break;
      case "FunctionDeclaration":
        // 处理嵌套函数
        let nestedComplexity = 0;
        node.body.body.forEach((nestedNode) => {
          processNode(nestedNode);
        });
        complexity += nestedComplexity + 1;
        break;
      default:
        complexity += 0;
    }
  }

  traverse(ast, {
    FunctionDeclaration(path) {
      path.node.body.body.forEach((node) => {
        processNode(node);
      });
    },
  });

  return complexity;
};
export default calculateFunctionComplexity;
