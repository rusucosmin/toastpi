import { GPGPUProgram } from './gpgpu_math';
export declare class TransposeProgram implements GPGPUProgram {
    variableNames: string[];
    params: Array<{}>;
    outputShape: number[];
    userCode: string;
    rank: number;
    constructor(aShape: number[], newDim: number[]);
}
