import { TextureType } from './tex_util';
export declare type ShapeInfo = {
    logicalShape: number[];
    texShape: [number, number];
    textureType: TextureType;
};
export declare type InputInfo = {
    name: string;
    shapeInfo: ShapeInfo;
};
export declare function makeShader(inputsInfo: InputInfo[], outputShape: ShapeInfo, userCode: string, broadcast: boolean, numBatchDims: number): string;
