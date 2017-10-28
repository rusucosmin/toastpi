import { GPGPUProgram } from './gpgpu_math';
export declare class ClipProgram implements GPGPUProgram {
    variableNames: string[];
    params: Array<{}>;
    userCode: string;
    outputShape: number[];
    constructor(aShape: number[], min: number, max: number);
}
