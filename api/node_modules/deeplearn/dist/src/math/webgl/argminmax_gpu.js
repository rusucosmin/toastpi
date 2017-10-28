"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../../util");
var axis_util = require("../axis_util");
function getArgMinMaxSnippet(op, texName, size) {
    var compOp = (op === 'min') ? '<' : '>';
    return "\n    float getArgMinMax" + texName + "() {\n      int bestIndex = 0;\n      float bestValue = get" + texName + "Flat(0);\n\n      for (int i = 0; i < " + size + "; i++) {\n        float candidate = get" + texName + "Flat(i);\n        if (isNaN(candidate)) {\n          return candidate;\n        }\n        if (candidate " + compOp + " bestValue) {\n          bestValue = candidate;\n          bestIndex = i;\n        }\n      }\n      return float(bestIndex);\n    }\n  ";
}
exports.getArgMinMaxSnippet = getArgMinMaxSnippet;
var ArgMinMaxProgram = (function () {
    function ArgMinMaxProgram(shape, axes, opType) {
        this.variableNames = ['A'];
        this.params = [opType];
        var _a = axis_util.computeOutAndReduceShapes(shape, axes), outShape = _a[0], reduceShape = _a[1];
        this.outputShape = outShape;
        this.numBatchDims = outShape.length;
        var size = util.sizeFromShape(reduceShape);
        var aSnippet = getArgMinMaxSnippet(opType, 'A', size);
        this.userCode = "\n      " + aSnippet + "\n\n      void main() {\n        setOutput(getArgMinMaxA());\n      }\n    ";
    }
    return ArgMinMaxProgram;
}());
exports.ArgMinMaxProgram = ArgMinMaxProgram;
//# sourceMappingURL=argminmax_gpu.js.map