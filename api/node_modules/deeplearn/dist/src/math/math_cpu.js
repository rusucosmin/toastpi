"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var seedrandom = require("seedrandom");
var util = require("../util");
var axis_util = require("./axis_util");
var broadcast_util = require("./broadcast_util");
var concat_util = require("./concat_util");
var conv_util = require("./conv_util");
var copy2D_util = require("./copy2d_util");
var math_1 = require("./math");
var ndarray_1 = require("./ndarray");
var NDArrayMathCPU = (function (_super) {
    __extends(NDArrayMathCPU, _super);
    function NDArrayMathCPU(safeMode) {
        if (safeMode === void 0) { safeMode = false; }
        return _super.call(this, safeMode) || this;
    }
    NDArrayMathCPU.prototype.cloneInternal = function (ndarray) {
        return ndarray_1.NDArray.make(ndarray.shape, { values: new Float32Array(ndarray.getValues()) });
    };
    NDArrayMathCPU.prototype.slice1DInternal = function (input, begin, size) {
        var newVals = input.getValues().slice(begin, begin + size);
        return ndarray_1.Array1D.new(newVals);
    };
    NDArrayMathCPU.prototype.slice2DInternal = function (input, begin, size) {
        var result = ndarray_1.Array2D.zeros(size);
        var startI = begin[0], startJ = begin[1];
        for (var i = 0; i < size[0]; ++i) {
            for (var j = 0; j < size[1]; ++j) {
                var val = input.get(i + startI, j + startJ);
                result.set(val, i, j);
            }
        }
        return result;
    };
    NDArrayMathCPU.prototype.slice3DInternal = function (input, begin, size) {
        var result = ndarray_1.Array3D.zeros(size);
        var startI = begin[0], startJ = begin[1], startK = begin[2];
        for (var i = 0; i < size[0]; ++i) {
            for (var j = 0; j < size[1]; ++j) {
                for (var k = 0; k < size[2]; ++k) {
                    var val = input.get(i + startI, j + startJ, k + startK);
                    result.set(val, i, j, k);
                }
            }
        }
        return result;
    };
    NDArrayMathCPU.prototype.slice4DInternal = function (input, begin, size) {
        var result = ndarray_1.Array4D.zeros(size);
        var startI = begin[0], startJ = begin[1], startK = begin[2], startL = begin[3];
        for (var i = 0; i < size[0]; ++i) {
            for (var j = 0; j < size[1]; ++j) {
                for (var k = 0; k < size[2]; ++k) {
                    for (var l = 0; l < size[3]; ++l) {
                        var val = input.get(i + startI, j + startJ, k + startK, l + startL);
                        result.set(val, i, j, k, l);
                    }
                }
            }
        }
        return result;
    };
    NDArrayMathCPU.prototype.copy2DInternal = function (source, sourceBeginRowCol, sourceSizeRowCol, dest, destBeginRowCol, destSizeRowCol) {
        copy2D_util.validateShapes(sourceSizeRowCol, destSizeRowCol);
        var srcValues = source.getValues();
        var dstValues = dest.getValues();
        var n = sourceSizeRowCol[0] * sourceSizeRowCol[1];
        for (var i = 0; i < n; ++i) {
            var srcRow = sourceBeginRowCol[0] + Math.floor(i / sourceSizeRowCol[1]);
            var srcCol = sourceBeginRowCol[1] + (i % sourceSizeRowCol[1]);
            var srcOff = srcRow * source.shape[1] + srcCol;
            var dstRow = destBeginRowCol[0] + Math.floor(i / destSizeRowCol[1]);
            var dstCol = destBeginRowCol[1] + (i % destSizeRowCol[1]);
            var dstOff = dstRow * dest.shape[1] + dstCol;
            dstValues[dstOff] = srcValues[srcOff];
        }
    };
    NDArrayMathCPU.prototype.concat1DInternal = function (a, b) {
        var outShape = concat_util.computeOutShape(a.shape, b.shape, 0);
        var result = ndarray_1.Array1D.zeros(outShape);
        var aVals = a.getValues();
        var bVals = b.getValues();
        var vals = result.getValues();
        vals.set(aVals, 0);
        vals.set(bVals, a.size);
        return result;
    };
    NDArrayMathCPU.prototype.concat2DInternal = function (a, b, axis) {
        var outShape = concat_util.computeOutShape(a.shape, b.shape, axis);
        var result = ndarray_1.Array2D.zeros(outShape);
        if (axis === 0) {
            var aVals = a.getValues();
            var bVals = b.getValues();
            var vals = result.getValues();
            vals.set(aVals, 0);
            vals.set(bVals, a.size);
            return result;
        }
        for (var i = 0; i < outShape[0]; ++i) {
            for (var j = 0; j < outShape[1]; ++j) {
                var index = [i, j];
                var value = void 0;
                if (index[axis] < a.shape[axis]) {
                    value = a.get(i, j);
                }
                else {
                    index[axis] -= a.shape[axis];
                    var i2 = index[0], j2 = index[1];
                    value = b.get(i2, j2);
                }
                result.set(value, i, j);
            }
        }
        return result;
    };
    NDArrayMathCPU.prototype.concat3DInternal = function (a, b, axis) {
        var outShape = concat_util.computeOutShape(a.shape, b.shape, axis);
        var result = ndarray_1.Array3D.zeros(outShape);
        if (axis === 0) {
            var aVals = a.getValues();
            var bVals = b.getValues();
            var vals = result.getValues();
            vals.set(aVals, 0);
            vals.set(bVals, a.size);
            return result;
        }
        for (var i = 0; i < outShape[0]; ++i) {
            for (var j = 0; j < outShape[1]; ++j) {
                for (var k = 0; k < outShape[2]; ++k) {
                    var index = [i, j, k];
                    var value = void 0;
                    if (index[axis] < a.shape[axis]) {
                        value = a.get(i, j, k);
                    }
                    else {
                        index[axis] -= a.shape[axis];
                        var i2 = index[0], j2 = index[1], k2 = index[2];
                        value = b.get(i2, j2, k2);
                    }
                    result.set(value, i, j, k);
                }
            }
        }
        return result;
    };
    NDArrayMathCPU.prototype.concat4DInternal = function (a, b, axis) {
        var outShape = concat_util.computeOutShape(a.shape, b.shape, axis);
        var result = ndarray_1.Array4D.zeros(outShape);
        if (axis === 0) {
            var aVals = a.getValues();
            var bVals = b.getValues();
            var vals = result.getValues();
            vals.set(aVals, 0);
            vals.set(bVals, a.size);
            return result;
        }
        for (var i = 0; i < outShape[0]; ++i) {
            for (var j = 0; j < outShape[1]; ++j) {
                for (var k = 0; k < outShape[2]; ++k) {
                    for (var l = 0; l < outShape[3]; ++l) {
                        var index = [i, j, k, l];
                        var value = void 0;
                        if (index[axis] < a.shape[axis]) {
                            value = a.get(i, j, k, l);
                        }
                        else {
                            index[axis] -= a.shape[axis];
                            var i2 = index[0], j2 = index[1], k2 = index[2], l2 = index[3];
                            value = b.get(i2, j2, k2, l2);
                        }
                        result.set(value, i, j, k, l);
                    }
                }
            }
        }
        return result;
    };
    NDArrayMathCPU.prototype.scaledArrayAddInternal = function (c1, a, c2, b) {
        var c1Val = c1.get();
        var c2Val = c2.get();
        return this.broadcastedBinaryOp(a, b, 'float32', function (aVal, bVal) {
            return c1Val * aVal + c2Val * bVal;
        });
    };
    NDArrayMathCPU.prototype.negInternal = function (a) {
        return this.scalarTimesArray(ndarray_1.Scalar.NEG_ONE, a);
    };
    NDArrayMathCPU.prototype.addInternal = function (a, b) {
        return this.scaledArrayAddInternal(ndarray_1.Scalar.ONE, a, ndarray_1.Scalar.ONE, b);
    };
    NDArrayMathCPU.prototype.subtractInternal = function (a, b) {
        return this.scaledArrayAddInternal(ndarray_1.Scalar.ONE, a, ndarray_1.Scalar.NEG_ONE, b);
    };
    NDArrayMathCPU.prototype.matMulInternal = function (a, b, aOrientation, bOrientation) {
        if (aOrientation === void 0) { aOrientation = math_1.MatrixOrientation.REGULAR; }
        if (bOrientation === void 0) { bOrientation = math_1.MatrixOrientation.REGULAR; }
        var sharedDim = (aOrientation === math_1.MatrixOrientation.REGULAR) ? a.shape[1] : a.shape[0];
        var leftDim = (aOrientation === math_1.MatrixOrientation.REGULAR) ? a.shape[0] : a.shape[1];
        var rightDim = (bOrientation === math_1.MatrixOrientation.REGULAR) ? b.shape[1] : b.shape[0];
        var normalGetter = function (matrix, i, j) {
            return matrix.get(i, j);
        };
        var transposedGetter = function (matrix, i, j) {
            return matrix.get(j, i);
        };
        var aGetter = (aOrientation === math_1.MatrixOrientation.REGULAR) ?
            normalGetter :
            transposedGetter;
        var bGetter = (bOrientation === math_1.MatrixOrientation.REGULAR) ?
            normalGetter :
            transposedGetter;
        var values = new Float32Array(leftDim * rightDim);
        var index = 0;
        for (var i = 0; i < leftDim; ++i) {
            for (var j = 0; j < rightDim; ++j) {
                var sum = 0;
                for (var k = 0; k < sharedDim; ++k) {
                    sum += aGetter(a, i, k) * bGetter(b, k, j);
                }
                values[index++] = sum;
            }
        }
        return ndarray_1.Array2D.new([leftDim, rightDim], values);
    };
    NDArrayMathCPU.prototype.multiplyInternal = function (a, b) {
        var newShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var newValues = new Float32Array(util.sizeFromShape(newShape));
        var aValues = a.getValues();
        var bValues = b.getValues();
        for (var i = 0; i < newValues.length; ++i) {
            newValues[i] = aValues[i % a.size] * bValues[i % b.size];
        }
        return ndarray_1.NDArray.make(newShape, { values: newValues });
    };
    NDArrayMathCPU.prototype.divideInternal = function (a, b) {
        var newShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var newValues = new Float32Array(util.sizeFromShape(newShape));
        var aValues = a.getValues();
        var bValues = b.getValues();
        for (var i = 0; i < newValues.length; ++i) {
            newValues[i] = aValues[i % a.size] / bValues[i % b.size];
        }
        return ndarray_1.NDArray.make(newShape, { values: newValues });
    };
    NDArrayMathCPU.prototype.sumInternal = function (input, axes) {
        axis_util.assertAxesAreInnerMostDims('sum', axes, input.rank);
        var _a = axis_util.computeOutAndReduceShapes(input.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var resultDtype = math_1.SumTypesMap[input.dtype];
        var result = ndarray_1.NDArray.zeros(outShape, resultDtype);
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.getValues();
        var aVals = input.getValues();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var sum = 0;
            for (var j = 0; j < reduceSize; ++j) {
                sum += aVals[offset + j];
            }
            vals[i] = sum;
        }
        return result;
    };
    NDArrayMathCPU.prototype.argMinInternal = function (input, axes) {
        axis_util.assertAxesAreInnerMostDims('argMax', axes, input.rank);
        var _a = axis_util.computeOutAndReduceShapes(input.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ndarray_1.NDArray.zeros(outShape, 'int32');
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.getValues();
        var aVals = input.getValues();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var min = aVals[offset];
            var minIndex = 0;
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (isNaN(value)) {
                    minIndex = util.NAN_INT32;
                    break;
                }
                if (value < min) {
                    min = value;
                    minIndex = j;
                }
            }
            vals[i] = minIndex;
        }
        return result;
    };
    NDArrayMathCPU.prototype.argMaxInternal = function (input, axes) {
        axis_util.assertAxesAreInnerMostDims('argMax', axes, input.rank);
        var _a = axis_util.computeOutAndReduceShapes(input.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ndarray_1.NDArray.zeros(outShape, 'int32');
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.getValues();
        var aVals = input.getValues();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var max = aVals[offset];
            var maxIndex = 0;
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (isNaN(value)) {
                    maxIndex = util.NAN_INT32;
                    break;
                }
                if (value > max) {
                    max = value;
                    maxIndex = j;
                }
            }
            vals[i] = maxIndex;
        }
        return result;
    };
    NDArrayMathCPU.prototype.equalInternal = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return (aVal === bVal) ? 1 : 0;
            }
        });
    };
    NDArrayMathCPU.prototype.topKInternal = function (ndarray, k) {
        var values = ndarray.getValues();
        var valuesAndIndices = [];
        for (var i = 0; i < values.length; i++) {
            valuesAndIndices.push({ value: values[i], index: i });
        }
        valuesAndIndices.sort(function (a, b) {
            return b.value - a.value;
        });
        var topkValues = new Float32Array(k);
        var topkIndices = new Float32Array(k);
        for (var i = 0; i < k; i++) {
            topkValues[i] = valuesAndIndices[i].value;
            topkIndices[i] = valuesAndIndices[i].index;
        }
        return { values: ndarray_1.Array1D.new(topkValues), indices: ndarray_1.Array1D.new(topkIndices) };
    };
    NDArrayMathCPU.prototype.minInternal = function (input, axes) {
        axis_util.assertAxesAreInnerMostDims('min', axes, input.rank);
        var _a = axis_util.computeOutAndReduceShapes(input.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ndarray_1.NDArray.zeros(outShape, input.dtype);
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.getValues();
        var aVals = input.getValues();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var min = aVals[0];
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (isNaN(value)) {
                    min = Number.NaN;
                    break;
                }
                if (value < min) {
                    min = value;
                }
            }
            vals[i] = min;
        }
        return result;
    };
    NDArrayMathCPU.prototype.maxInternal = function (input, axes) {
        axis_util.assertAxesAreInnerMostDims('max', axes, input.rank);
        var _a = axis_util.computeOutAndReduceShapes(input.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ndarray_1.NDArray.zeros(outShape, input.dtype);
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.getValues();
        var aVals = input.getValues();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var max = aVals[0];
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (isNaN(value)) {
                    max = Number.NaN;
                    break;
                }
                if (value > max) {
                    max = value;
                }
            }
            vals[i] = max;
        }
        return result;
    };
    NDArrayMathCPU.prototype.ceilInternal = function (ndarray) {
        var values = ndarray.getValues();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.ceil(values[i]);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: newValues });
    };
    NDArrayMathCPU.prototype.floorInternal = function (ndarray) {
        var values = ndarray.getValues();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.floor(values[i]);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: newValues });
    };
    NDArrayMathCPU.prototype.expInternal = function (ndarray) {
        var values = ndarray.getValues();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.exp(values[i]);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: newValues });
    };
    NDArrayMathCPU.prototype.logInternal = function (ndarray) {
        var values = ndarray.getValues();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = Math.log(value);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: newValues });
    };
    NDArrayMathCPU.prototype.sqrtInternal = function (ndarray) {
        var values = ndarray.getValues();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = Math.sqrt(value);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: newValues });
    };
    NDArrayMathCPU.prototype.logSumExpInternal = function (input, axes) {
        axis_util.assertAxesAreInnerMostDims('logSumExp', axes, input.rank);
        var xMax = this.max(input, axes, true);
        var a = this.subtract(input, xMax);
        var b = this.exp(a);
        var c = this.sum(b, axes);
        var d = this.log(c);
        var result = this.add(xMax.reshape(d.shape), d);
        return result;
    };
    NDArrayMathCPU.prototype.reluInternal = function (input) {
        var res = ndarray_1.NDArray.zeros(input.shape, input.dtype);
        var resVals = res.getValues();
        var inVals = input.getValues();
        for (var i = 0; i < inVals.length; ++i) {
            var val = inVals[i];
            if (util.isValNaN(val, input.dtype)) {
                resVals[i] = util.getNaN(res.dtype);
            }
            else {
                resVals[i] = Math.max(0, inVals[i]);
            }
        }
        return res;
    };
    NDArrayMathCPU.prototype.eluInternal = function (ndarray) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.dataSync();
        for (var i = 0; i < values.length; ++i) {
            var v = values[i];
            if (v >= 0) {
                resultValues[i] = v;
            }
            else {
                resultValues[i] = (Math.exp(v) - 1);
            }
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.leakyReluInternal = function (ndarray, alpha) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.dataSync();
        for (var i = 0; i < values.length; i++) {
            var v = values[i];
            if (v >= 0) {
                resultValues[i] = v;
            }
            else {
                resultValues[i] = alpha * v;
            }
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.clipInternal = function (ndarray, min, max) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.getValues();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.min(max, Math.max(min, values[i]));
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.absInternal = function (ndarray) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.getValues();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.abs(values[i]);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.sigmoidInternal = function (ndarray) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.getValues();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = 1 / (1 + Math.exp(-values[i]));
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.sinInternal = function (ndarray) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.getValues();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.sin(values[i]);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.cosInternal = function (ndarray) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.getValues();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.cos(values[i]);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.tanInternal = function (ndarray) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.getValues();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.tan(values[i]);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.asinInternal = function (ndarray) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.getValues();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.asin(values[i]);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.acosInternal = function (ndarray) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.getValues();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.acos(values[i]);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.atanInternal = function (ndarray) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.getValues();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.atan(values[i]);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.sinhInternal = function (ndarray) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.getValues();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.sinh(values[i]);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.coshInternal = function (ndarray) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.getValues();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.cosh(values[i]);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.tanhInternal = function (ndarray) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.getValues();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = util.tanh(values[i]);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.stepInternal = function (ndarray) {
        var resultValues = new Float32Array(ndarray.size);
        var values = ndarray.getValues();
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            resultValues[i] = value > 0 ? 1 : (value < 0 ? 0 : value);
        }
        return ndarray_1.NDArray.make(ndarray.shape, { values: resultValues });
    };
    NDArrayMathCPU.prototype.conv2dInternal = function (x, filter, bias, convInfo) {
        var _a = x.shape, xRows = _a[0], xCols = _a[1], inputDepth = _a[2];
        var filterHeight = filter.shape[0];
        var filterWidth = filter.shape[1];
        var outDepth = filter.shape[3];
        var padLeft = convInfo.padInfo.left;
        var padTop = convInfo.padInfo.top;
        var y = ndarray_1.Array3D.zeros(convInfo.outShape);
        for (var d2 = 0; d2 < outDepth; ++d2) {
            for (var yR = 0; yR < y.shape[0]; ++yR) {
                var xRCorner = yR * convInfo.strideHeight - padLeft;
                var xRMin = Math.max(0, xRCorner);
                var xRMax = Math.min(xRows, filterHeight + xRCorner);
                for (var yC = 0; yC < y.shape[1]; ++yC) {
                    var xCCorner = yC * convInfo.strideWidth - padTop;
                    var xCMin = Math.max(0, xCCorner);
                    var xCMax = Math.min(xCols, filterWidth + xCCorner);
                    var dotProd = 0;
                    for (var xR = xRMin; xR < xRMax; ++xR) {
                        var wR = xR - xRCorner;
                        for (var xC = xCMin; xC < xCMax; ++xC) {
                            var wC = xC - xCCorner;
                            for (var d1 = 0; d1 < inputDepth; ++d1) {
                                var pixel = x.get(xR, xC, d1);
                                var weight = filter.get(wR, wC, d1, d2);
                                dotProd += pixel * weight;
                            }
                        }
                    }
                    var biasVal = (bias != null) ? bias.get(d2) : 0;
                    y.set(dotProd + biasVal, yR, yC, d2);
                }
            }
        }
        return y;
    };
    NDArrayMathCPU.prototype.conv2dDerInputInternal = function (dy, filter, convInfo) {
        var inDepth = filter.shape[2];
        var outDepth = filter.shape[3];
        var yRows = dy.shape[0];
        var yCols = dy.shape[1];
        var filterHeight = filter.shape[0];
        var filterWidth = filter.shape[1];
        var topPad = filterHeight - 1 - convInfo.padInfo.top;
        var leftPad = filterWidth - 1 - convInfo.padInfo.left;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var dx = ndarray_1.Array3D.zeros(convInfo.inShape);
        for (var d1 = 0; d1 < inDepth; ++d1) {
            for (var xR = 0; xR < dx.shape[0]; ++xR) {
                var xRCorner = xR - leftPad;
                var xRMin = Math.max(0, Math.ceil(xRCorner / strideHeight));
                var yRMax = Math.min(yRows, (filterHeight + xRCorner) / strideHeight);
                for (var xC = 0; xC < dx.shape[1]; ++xC) {
                    var xCCorner = xC - topPad;
                    var xCMin = Math.max(0, Math.ceil(xCCorner / strideWidth));
                    var yCMax = Math.min(yCols, (filterWidth + xCCorner) / strideWidth);
                    var dotProd = 0;
                    for (var yR = xRMin; yR < yRMax; ++yR) {
                        var wR = yR * strideHeight - xRCorner;
                        for (var yC = xCMin; yC < yCMax; ++yC) {
                            var wC = yC * strideWidth - xCCorner;
                            for (var d2 = 0; d2 < outDepth; ++d2) {
                                var pixel = dy.get(yR, yC, d2);
                                var weight = filter.get(filterHeight - 1 - wR, filterWidth - 1 - wC, d1, d2);
                                dotProd += pixel * weight;
                            }
                        }
                    }
                    dx.set(dotProd, xR, xC, d1);
                }
            }
        }
        return dx;
    };
    NDArrayMathCPU.prototype.conv2dDerFilterInternal = function (x, dY, convInfo) {
        var inputDepth = x.shape[2];
        var outputDepth = dY.shape[2];
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var weightsShape = conv_util.computeWeightsShape4D(inputDepth, outputDepth, filterHeight, filterWidth);
        var dW = ndarray_1.Array4D.zeros(weightsShape);
        var yNumRows = dY.shape[0];
        var yNumCols = dY.shape[1];
        var xNumRows = x.shape[0];
        var xNumCols = x.shape[1];
        var leftPad = convInfo.padInfo.left;
        var topPad = convInfo.padInfo.top;
        for (var wR = 0; wR < filterHeight; ++wR) {
            var yRMin = Math.max(0, Math.ceil((topPad - wR) / strideHeight));
            var yRMax = Math.min(yNumRows, (xNumRows + topPad - wR) / strideHeight);
            for (var wC = 0; wC < filterWidth; ++wC) {
                var yCMin = Math.max(0, Math.ceil((leftPad - wC) / strideWidth));
                var yCMax = Math.min(yNumCols, (xNumCols + leftPad - wC) / strideWidth);
                for (var d1 = 0; d1 < inputDepth; ++d1) {
                    for (var d2 = 0; d2 < outputDepth; ++d2) {
                        var dotProd = 0;
                        for (var yR = yRMin; yR < yRMax; ++yR) {
                            var xR = wR + yR * strideHeight - topPad;
                            for (var yC = yCMin; yC < yCMax; ++yC) {
                                var xC = wC + yC * strideWidth - leftPad;
                                dotProd += x.get(xR, xC, d1) * dY.get(yR, yC, d2);
                            }
                        }
                        dW.set(dotProd, wR, wC, d1, d2);
                    }
                }
            }
        }
        return dW;
    };
    NDArrayMathCPU.prototype.conv2dDerBiasInternal = function (dY) {
        var outputDepth = dY.shape[2];
        var numRows = dY.shape[0];
        var numCols = dY.shape[1];
        var values = new Float32Array(outputDepth);
        for (var d2 = 0; d2 < outputDepth; ++d2) {
            var sum = 0;
            for (var r = 0; r < numRows; ++r) {
                for (var c = 0; c < numCols; ++c) {
                    sum += dY.get(r, c, d2);
                }
            }
            values[d2] = sum;
        }
        return ndarray_1.Array1D.new(values);
    };
    NDArrayMathCPU.prototype.transposeInternal = function (a, perm) {
        var newShape = new Array(a.rank);
        for (var i = 0; i < newShape.length; i++) {
            newShape[i] = a.shape[perm[i]];
        }
        var resultValues = new Float32Array(a.size);
        var values = a.getValues();
        var result = ndarray_1.NDArray.make(newShape, { values: resultValues });
        for (var i = 0; i < a.size; ++i) {
            var loc = a.indexToLoc(i);
            var newLoc = new Array(loc.length);
            for (var i_1 = 0; i_1 < newLoc.length; i_1++) {
                newLoc[i_1] = loc[perm[i_1]];
            }
            var newIndex = result.locToIndex(newLoc);
            resultValues[newIndex] = values[i];
        }
        return result;
    };
    NDArrayMathCPU.prototype.pool = function (x, convInfo, poolType) {
        var _a = x.shape, xRows = _a[0], xCols = _a[1], depth = _a[2];
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var y = ndarray_1.Array3D.zeros(convInfo.outShape);
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        for (var d = 0; d < depth; ++d) {
            for (var yR = 0; yR < y.shape[0]; ++yR) {
                var xRCorner = yR * strideHeight - padTop;
                var xRMin = Math.max(0, xRCorner);
                var xRMax = Math.min(xRows, filterHeight + xRCorner);
                for (var yC = 0; yC < y.shape[1]; ++yC) {
                    var xCCorner = yC * strideWidth - padLeft;
                    var xCMin = Math.max(0, xCCorner);
                    var xCMax = Math.min(xCols, filterWidth + xCCorner);
                    var minMaxValue = (poolType === 'max' ? Number.NEGATIVE_INFINITY :
                        Number.POSITIVE_INFINITY);
                    var avgValue = 0;
                    for (var xR = xRMin; xR < xRMax; ++xR) {
                        for (var xC = xCMin; xC < xCMax; ++xC) {
                            var pixel = x.get(xR, xC, d);
                            if (isNaN(pixel)) {
                                minMaxValue = NaN;
                                avgValue = NaN;
                                break;
                            }
                            if ((poolType === 'max' && pixel > minMaxValue) ||
                                (poolType === 'min' && pixel < minMaxValue)) {
                                minMaxValue = pixel;
                            }
                            else if (poolType === 'avg') {
                                avgValue += pixel / (filterHeight * filterWidth);
                            }
                        }
                        if (isNaN(minMaxValue)) {
                            break;
                        }
                    }
                    y.set(poolType === 'avg' ? avgValue : minMaxValue, yR, yC, d);
                }
            }
        }
        return y;
    };
    NDArrayMathCPU.prototype.maxPoolInternal = function (x, convInfo) {
        return this.pool(x, convInfo, 'max');
    };
    NDArrayMathCPU.prototype.maxPoolPositions = function (x, convInfo) {
        var _a = x.shape, xRows = _a[0], xCols = _a[1], depth = _a[2];
        var outputShape = convInfo.outShape;
        var maxPositions = ndarray_1.Array3D.zeros(outputShape);
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        for (var d = 0; d < depth; ++d) {
            for (var yR = 0; yR < outputShape[0]; ++yR) {
                var xRCorner = yR * strideHeight - padTop;
                var xRMin = Math.max(0, xRCorner);
                var xRMax = Math.min(xRows, filterHeight + xRCorner);
                for (var yC = 0; yC < outputShape[1]; ++yC) {
                    var xCCorner = yC * strideWidth - padLeft;
                    var xCMin = Math.max(0, xCCorner);
                    var xCMax = Math.min(xCols, filterWidth + xCCorner);
                    var maxValue = Number.NEGATIVE_INFINITY;
                    var maxPosition = -1;
                    for (var xR = xRMin; xR < xRMax; ++xR) {
                        var wR = xR - xRCorner;
                        for (var xC = xCMin; xC < xCMax; ++xC) {
                            var wC = xC - xCCorner;
                            var pixel = x.get(xR, xC, d);
                            if (pixel > maxValue) {
                                maxValue = pixel;
                                maxPosition = wR * filterWidth + wC;
                            }
                        }
                    }
                    maxPositions.set(maxPosition, yR, yC, d);
                }
            }
        }
        return maxPositions;
    };
    NDArrayMathCPU.prototype.maxPoolBackpropInternal = function (dy, x, convInfo) {
        var maxPositions = this.maxPoolPositions(x, convInfo);
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var _a = dy.shape, dyRows = _a[0], dyCols = _a[1], depth = _a[2];
        var dx = ndarray_1.Array3D.zeros(x.shape);
        for (var d = 0; d < depth; ++d) {
            for (var dxR = 0; dxR < dx.shape[0]; ++dxR) {
                for (var dxC = 0; dxC < dx.shape[1]; ++dxC) {
                    var dyRCorner = dxR - padTop;
                    var dyCCorner = dxC - padLeft;
                    var dotProd = 0;
                    for (var wR = 0; wR < filterHeight; ++wR) {
                        var dyR = (dyRCorner + wR) / strideHeight;
                        if (dyR < 0 || dyR >= dyRows || Math.floor(dyR) !== dyR) {
                            continue;
                        }
                        for (var wC = 0; wC < filterWidth; ++wC) {
                            var dyC = (dyCCorner + wC) / strideWidth;
                            if (dyC < 0 || dyC >= dyCols || Math.floor(dyC) !== dyC) {
                                continue;
                            }
                            var maxPos = filterHeight * filterWidth - 1 -
                                maxPositions.get(dyR, dyC, d);
                            var curPos = wR * filterWidth + wC;
                            var mask = maxPos === curPos ? 1 : 0;
                            if (mask === 0) {
                                continue;
                            }
                            var pixel = dy.get(dyR, dyC, d);
                            dotProd += pixel * mask;
                        }
                    }
                    dx.set(dotProd, dxR, dxC, d);
                }
            }
        }
        return dx;
    };
    NDArrayMathCPU.prototype.minPoolInternal = function (x, convInfo) {
        return this.pool(x, convInfo, 'min');
    };
    NDArrayMathCPU.prototype.avgPoolInternal = function (x, convInfo) {
        return this.pool(x, convInfo, 'avg');
    };
    NDArrayMathCPU.prototype.resizeBilinear3DInternal = function (x, newShape2D, alignCorners) {
        var output = ndarray_1.Array3D.zeros([newShape2D[0], newShape2D[1], x.shape[2]]);
        var effectiveInputSize = alignCorners ? [x.shape[0] - 1, x.shape[1] - 1, x.shape[2]] : x.shape;
        var effectiveOutputSize = alignCorners ?
            [output.shape[0] - 1, output.shape[1] - 1, output.shape[2]] :
            output.shape;
        for (var r = 0; r < output.shape[0]; r++) {
            for (var c = 0; c < output.shape[1]; c++) {
                for (var d = 0; d < output.shape[2]; d++) {
                    var sourceFracRow = (effectiveInputSize[0]) * r / (effectiveOutputSize[0]);
                    var sourceFracCol = (effectiveInputSize[1]) * c / (effectiveOutputSize[1]);
                    var sourceRowFloor = Math.floor(sourceFracRow);
                    var sourceRowCeil = Math.min(x.shape[0] - 1, Math.ceil(sourceFracRow));
                    var sourceColFloor = Math.floor(sourceFracCol);
                    var sourceColCeil = Math.min(x.shape[1] - 1, Math.ceil(sourceFracCol));
                    var topLeft = x.get(sourceRowFloor, sourceColFloor, d);
                    var bottomLeft = x.get(sourceRowCeil, sourceColFloor, d);
                    var topRight = x.get(sourceRowFloor, sourceColCeil, d);
                    var bottomRight = x.get(sourceRowCeil, sourceColCeil, d);
                    var rowFrac = sourceFracRow - sourceRowFloor;
                    var colFrac = sourceFracCol - sourceColFloor;
                    var top_1 = topLeft + (topRight - topLeft) * colFrac;
                    var bottom = bottomLeft + (bottomRight - bottomLeft) * colFrac;
                    var newValue = top_1 + (bottom - top_1) * rowFrac;
                    output.set(newValue, r, c, d);
                }
            }
        }
        return output;
    };
    NDArrayMathCPU.prototype.batchNormalization3DInternal = function (x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        var xValues = x.getValues();
        var meanValues = mean.getValues();
        var varianceValues = variance.getValues();
        var scaleValues = scale ? scale.getValues() : new Float32Array([1]);
        var offsetValues = offset ? offset.getValues() : new Float32Array([0]);
        var outValues = new Float32Array(xValues.length);
        for (var i = 0; i < xValues.length; i++) {
            outValues[i] = offsetValues[i % offsetValues.length] +
                (xValues[i] - meanValues[i % meanValues.length]) *
                    scaleValues[i % scaleValues.length] /
                    Math.sqrt(varianceValues[i % varianceValues.length] + varianceEpsilon);
        }
        return ndarray_1.Array3D.new(x.shape, outValues);
    };
    NDArrayMathCPU.prototype.multinomialInternal = function (probabilities, numSamples, seed) {
        var batchSize = probabilities.shape[0];
        var numEvents = probabilities.shape[1];
        var res = ndarray_1.Array2D.zeros([batchSize, numSamples], 'int32');
        var resVals = res.getValues();
        var probVals = probabilities.getValues();
        for (var b = 0; b < batchSize; ++b) {
            var offset = b * numEvents;
            var cdf = new Float32Array(numEvents - 1);
            cdf[0] = probVals[offset];
            for (var event_1 = 1; event_1 < cdf.length; ++event_1) {
                cdf[event_1] = cdf[event_1 - 1] + probVals[offset + event_1];
            }
            var random = seedrandom.alea(seed.toString());
            var outOffset = b * numSamples;
            for (var sampleId = 0; sampleId < numSamples; ++sampleId) {
                var r = random();
                resVals[outOffset + sampleId] = cdf.length;
                for (var event_2 = 0; event_2 < cdf.length; event_2++) {
                    if (r < cdf[event_2]) {
                        resVals[outOffset + sampleId] = event_2;
                        break;
                    }
                }
            }
        }
        return res;
    };
    NDArrayMathCPU.prototype.oneHotInternal = function (indices, depth, onValue, offValue) {
        var res = new Float32Array(indices.size * depth);
        res.fill(offValue);
        for (var event_3 = 0; event_3 < indices.size; ++event_3) {
            res[event_3 * depth + indices.get(event_3)] = onValue;
        }
        return ndarray_1.Array2D.new([indices.size, depth], res);
    };
    NDArrayMathCPU.prototype.broadcastedBinaryOp = function (a, b, dtype, op) {
        var newShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var result = ndarray_1.NDArray.zeros(newShape, dtype);
        var newValues = result.getValues();
        var aValues = a.getValues();
        var bValues = b.getValues();
        var aBroadcastDims = broadcast_util.getBroadcastDims(a.shape, newShape);
        var bBroadcastDims = broadcast_util.getBroadcastDims(b.shape, newShape);
        var _loop_1 = function (i) {
            var loc = result.indexToLoc(i);
            var aLoc = loc.slice(-a.rank);
            aBroadcastDims.forEach(function (d) { return aLoc[d] = 0; });
            var aIndex = a.locToIndex(aLoc);
            var bLoc = loc.slice(-b.rank);
            bBroadcastDims.forEach(function (d) { return bLoc[d] = 0; });
            var bIndex = b.locToIndex(bLoc);
            newValues[i] = op(aValues[aIndex], bValues[bIndex]);
        };
        for (var i = 0; i < newValues.length; ++i) {
            _loop_1(i);
        }
        return result;
    };
    return NDArrayMathCPU;
}(math_1.NDArrayMath));
exports.NDArrayMathCPU = NDArrayMathCPU;
//# sourceMappingURL=math_cpu.js.map