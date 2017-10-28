"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment = require("./environment");
var environment_1 = require("./environment");
var math_cpu_1 = require("./math/math_cpu");
var math_gpu_1 = require("./math/math_gpu");
var util = require("./util");
exports.TEST_EPSILON = 1e-2;
function expectArraysClose(actual, expected, epsilon) {
    if (epsilon === void 0) { epsilon = exports.TEST_EPSILON; }
    var aType = actual.constructor.name;
    var bType = expected.constructor.name;
    if (aType !== bType) {
        throw new Error("Arrays are of different type " + aType + " vs " + bType);
    }
    if (actual.length !== expected.length) {
        throw new Error("Matrices have different lengths (" + actual.length + " vs " +
            (expected.length + ")."));
    }
    for (var i = 0; i < expected.length; ++i) {
        var a = actual[i];
        var e = expected[i];
        if (!areClose(a, e, epsilon)) {
            var actualStr = "actual[" + i + "] === " + a;
            var expectedStr = "expected[" + i + "] === " + e;
            throw new Error('Arrays differ: ' + actualStr + ', ' + expectedStr);
        }
    }
}
exports.expectArraysClose = expectArraysClose;
function expectNumbersClose(a, e, epsilon) {
    if (epsilon === void 0) { epsilon = exports.TEST_EPSILON; }
    if (!areClose(a, e, epsilon)) {
        throw new Error("Numbers differ: actual === " + a + ", expected === " + e);
    }
}
exports.expectNumbersClose = expectNumbersClose;
function areClose(a, e, epsilon) {
    if (isNaN(a) && isNaN(e)) {
        return true;
    }
    if (isNaN(a) || isNaN(e) || Math.abs(a - e) > epsilon) {
        return false;
    }
    return true;
}
function randomArrayInRange(n, minValue, maxValue) {
    var v = new Float32Array(n);
    var range = maxValue - minValue;
    for (var i = 0; i < n; ++i) {
        v[i] = (Math.random() * range) + minValue;
    }
    return v;
}
exports.randomArrayInRange = randomArrayInRange;
function makeIdentity(n) {
    var i = new Float32Array(n * n);
    for (var j = 0; j < n; ++j) {
        i[(j * n) + j] = 1;
    }
    return i;
}
exports.makeIdentity = makeIdentity;
function cpuMultiplyMatrix(a, aRow, aCol, b, bRow, bCol) {
    var result = new Float32Array(aRow * bCol);
    for (var r = 0; r < aRow; ++r) {
        var aOffset = (r * aCol);
        var cOffset = (r * bCol);
        for (var c = 0; c < bCol; ++c) {
            var d = 0;
            for (var k = 0; k < aCol; ++k) {
                d += a[aOffset + k] * b[(k * bCol) + c];
            }
            result[cOffset + c] = d;
        }
    }
    return result;
}
exports.cpuMultiplyMatrix = cpuMultiplyMatrix;
function cpuDotProduct(a, b) {
    if (a.length !== b.length) {
        throw new Error('cpuDotProduct: incompatible vectors.');
    }
    var d = 0;
    for (var i = 0; i < a.length; ++i) {
        d += a[i] * b[i];
    }
    return d;
}
exports.cpuDotProduct = cpuDotProduct;
function describeMathCPU(name, tests, featuresList) {
    var testNameBase = 'math_cpu.' + name;
    describeWithFeaturesAndExecutor(testNameBase, tests, function (testName, tests, features) { return executeMathTests(testName, tests, function () { return new math_cpu_1.NDArrayMathCPU(); }, features); }, featuresList);
}
exports.describeMathCPU = describeMathCPU;
function describeMathGPU(name, tests, featuresList) {
    var testNameBase = 'math_gpu.' + name;
    describeWithFeaturesAndExecutor(testNameBase, tests, function (testName, tests, features) { return executeMathTests(testName, tests, function () { return new math_gpu_1.NDArrayMathGPU(); }, features); }, featuresList);
}
exports.describeMathGPU = describeMathGPU;
function describeCustom(name, tests, featuresList, customBeforeEach, customAfterEach) {
    describeWithFeaturesAndExecutor(name, [tests], function (testName, tests, features) { return executeTests(testName, tests, features, customBeforeEach, customAfterEach); }, featuresList);
}
exports.describeCustom = describeCustom;
function describeWithFeaturesAndExecutor(testNameBase, tests, executor, featuresList) {
    if (featuresList != null) {
        featuresList.forEach(function (features) {
            var testName = testNameBase + ' ' + JSON.stringify(features);
            executor(testName, tests, features);
        });
    }
    else {
        executor(testNameBase, tests);
    }
}
var PROMISE_IT = function (name, testFunc) {
    it(name, function (done) {
        var result = testFunc();
        if (result instanceof Promise) {
            result.then(done, function (e) {
                fail(e);
                done();
            });
        }
        else {
            done();
        }
    });
};
function executeMathTests(testName, tests, mathFactory, features) {
    var math;
    var customBeforeEach = function () {
        math = mathFactory();
        math.startScope();
    };
    var customAfterEach = function () {
        math.endScope(null);
        math.dispose();
    };
    var customIt = function (name, testFunc) {
        PROMISE_IT(name, function () { return testFunc(math); });
    };
    executeTests(testName, tests, features, customBeforeEach, customAfterEach, customIt);
}
exports.executeMathTests = executeMathTests;
function executeTests(testName, tests, features, customBeforeEach, customAfterEach, customIt) {
    if (customIt === void 0) { customIt = PROMISE_IT; }
    describe(testName, function () {
        beforeEach(function () {
            if (features != null) {
                environment.setEnvironment(new environment_1.Environment(features));
            }
            if (customBeforeEach != null) {
                customBeforeEach();
            }
        });
        afterEach(function () {
            if (customAfterEach != null) {
                customAfterEach();
            }
            if (features != null) {
                environment.setEnvironment(new environment_1.Environment());
            }
        });
        tests.forEach(function (test) { return test(customIt); });
    });
}
exports.executeTests = executeTests;
function assertIsNan(val, dtype) {
    if (!util.isValNaN(val, dtype)) {
        throw new Error("Value " + val + " does not represent NaN for dtype " + dtype);
    }
}
exports.assertIsNan = assertIsNan;
//# sourceMappingURL=test_util.js.map