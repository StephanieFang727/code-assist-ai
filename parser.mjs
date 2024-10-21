import * as fs from "fs";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";

const code = fs.readFileSync("./test.js", "utf-8");

const ast = parser.parse(code, {
  sourceType: "module",
  plugins: ["javascript"],
});

const functions = [];

traverse.default(ast, {
  // 匹配函数声明
  FunctionDeclaration(path) {
    const { id, loc } = path.node;
    functions.push({
      name: id.name,
      start: loc.start,
      end: loc.end,
      length: loc.end.line - loc.start.line + 1, // 计算行数
    });
  },
  // 匹配函数表达式或箭头函数
  FunctionExpression(path) {
    const { loc } = path.node;
    let name = "anonymous";
    // 尝试获取函数的名称（比如赋值给变量）
    if (path.parent.type === "VariableDeclarator") {
      name = path.parent.id.name;
    }
    functions.push({
      name,
      start: loc.start,
      end: loc.end,
      length: loc.end.line - loc.start.line + 1, // 计算行数
    });
  },
  // 匹配箭头函数
  ArrowFunctionExpression(path) {
    const { loc } = path.node;
    let name = "anonymous";
    if (path.parent.type === "VariableDeclarator") {
      name = path.parent.id.name;
    }
    functions.push({
      name,
      start: loc.start,
      end: loc.end,
      length: loc.end.line - loc.start.line + 1, // 计算行数
    });
  },
});

console.log(functions);
