"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TransposeProgram = (function () {
    function TransposeProgram(aShape, newDim) {
        this.variableNames = ['A'];
        var outputShape = new Array(aShape.length);
        for (var i = 0; i < outputShape.length; i++) {
            outputShape[i] = aShape[newDim[i]];
        }
        this.outputShape = outputShape;
        this.rank = outputShape.length;
        this.params = [newDim.toString()];
        var dtype = getDataType(this.rank);
        var switched = getSwitchedCoords(newDim);
        this.userCode = "\n    void main() {\n      " + dtype + " resRC = getOutputCoords();\n      setOutput(getA(" + switched + "));\n    }\n    ";
    }
    return TransposeProgram;
}());
exports.TransposeProgram = TransposeProgram;
function getSwitchedCoords(newDim) {
    var rank = newDim.length;
    if (rank > 4) {
        throw Error("SwitchDim for rank " + rank + " is not yet supported");
    }
    var originalOrder = ['resRC.x', 'resRC.y', 'resRC.z', 'resRC.w'];
    var switchedCoords = new Array(rank);
    for (var i = 0; i < newDim.length; i++) {
        switchedCoords[newDim[i]] = originalOrder[i];
    }
    return switchedCoords.join();
}
function getDataType(rank) {
    if (rank === 1) {
        return 'int';
    }
    else if (rank === 2) {
        return 'ivec2';
    }
    else if (rank === 3) {
        return 'ivec3';
    }
    else if (rank === 4) {
        return 'ivec4';
    }
    else {
        throw Error("SwitchDim for rank " + rank + " is not yet supported");
    }
}
//# sourceMappingURL=transpose_gpu.js.map