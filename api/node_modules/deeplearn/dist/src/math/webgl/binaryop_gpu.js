"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var broadcast_util = require("../broadcast_util");
exports.ADD = 'return a + b;';
exports.SUB = 'return a - b;';
exports.MUL = 'return a * b;';
exports.DIV = 'return a / b;';
exports.EQUAL = "\n  if (isNaN(a)) return a;\n  if (isNaN(b)) return b;\n  return float(a == b);\n";
var BinaryOpProgram = (function () {
    function BinaryOpProgram(op, aShape, bShape) {
        this.variableNames = ['A', 'B'];
        this.supportsBroadcasting = true;
        this.params = [op];
        this.outputShape =
            broadcast_util.assertAndGetBroadcastShape(aShape, bShape);
        this.userCode = "\n      float binaryOperation(float a, float b) {\n        " + op + "\n      }\n\n      void main() {\n        float a = getAAtOutCoords();\n        float b = getBAtOutCoords();\n        setOutput(binaryOperation(a, b));\n      }\n    ";
    }
    return BinaryOpProgram;
}());
exports.BinaryOpProgram = BinaryOpProgram;
//# sourceMappingURL=binaryop_gpu.js.map