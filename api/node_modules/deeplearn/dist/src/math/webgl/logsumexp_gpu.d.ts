import { GPGPUProgram } from './gpgpu_math';
export declare class LogSumExpProgram implements GPGPUProgram {
    variableNames: string[];
    params: Array<{}>;
    outputShape: number[];
    userCode: string;
    numBatchDims: number;
    constructor(shape: number[], axes: number[]);
}
