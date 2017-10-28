import { GPGPUProgram } from './gpgpu_math';
export declare function getArgMinMaxSnippet(op: 'min' | 'max', texName: string, size: number): string;
export declare class ArgMinMaxProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    params: Array<{}>;
    userCode: string;
    numBatchDims: number;
    constructor(shape: number[], axes: number[], opType: 'min' | 'max');
}
