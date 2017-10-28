import * as util from '../util';
import { GPGPUContext } from './webgl/gpgpu_context';
import { TextureType } from './webgl/tex_util';
import { TextureManager } from './webgl/texture_manager';
export declare let GPGPU: GPGPUContext;
export declare let TEXTURE_MANAGER: TextureManager;
export declare enum DType {
    float32 = "float32",
    int32 = "int32",
    bool = "bool",
}
export interface DataTypes {
    float32: Float32Array;
    int32: Int32Array;
    bool: Uint8Array;
}
export interface NDArrayData<T extends keyof DataTypes> {
    values?: DataTypes[T];
    texture?: WebGLTexture;
    textureShapeRC?: [number, number];
    textureType?: TextureType;
}
export declare function initializeGPU(gpgpu: GPGPUContext, textureManager: TextureManager): void;
export declare class NDArray<T extends keyof DataTypes = keyof DataTypes> {
    shape: number[];
    size: number;
    dtype: T;
    protected strides: number[];
    private ndarrayData;
    protected constructor(shape: number[], data: NDArrayData<T>, dtype: T);
    static zeros<T extends keyof DataTypes = keyof DataTypes>(shape: number[], dtype?: T): NDArray<T>;
    static zerosLike<G extends keyof DataTypes, T extends NDArray<G>>(another: T): T;
    static like<G extends keyof DataTypes, T extends NDArray<G>>(another: T): T;
    static make<T extends keyof DataTypes = keyof DataTypes>(shape: number[], data: NDArrayData<T>, dtype?: T): NDArray<T>;
    static fromPixels(pixels: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, numChannels?: number): Array3D<'int32'>;
    reshape(newShape: number[]): NDArray<T>;
    flatten(): Array1D<T>;
    asScalar(): Scalar<T>;
    as1D(): Array1D<T>;
    as2D(rows: number, columns: number): Array2D<T>;
    as3D(rows: number, columns: number, depth: number): Array3D<T>;
    as4D(rows: number, columns: number, depth: number, depth2: number): Array4D<T>;
    asType<G extends keyof DataTypes>(dtype: G): NDArray<G>;
    readonly rank: number;
    get(...locs: number[]): number;
    add(value: number, ...locs: number[]): void;
    set(value: number, ...locs: number[]): void;
    val(...locs: number[]): Promise<number>;
    locToIndex(locs: number[]): number;
    indexToLoc(index: number): number[];
    fill(value: number): void;
    getData(): NDArrayData<T>;
    getValues(): DataTypes[T];
    getValuesAsync(): Promise<DataTypes[T]>;
    data(): Promise<DataTypes[T]>;
    dataSync(): DataTypes[T];
    private uploadToGPU(preferredTexShape?);
    getTexture(preferredShapeRC?: [number, number]): WebGLTexture;
    getTextureShapeRC(preferredShapeRC?: [number, number]): [number, number];
    dispose(): void;
    private disposeTexture();
    inGPU(): boolean;
    equals(t: NDArray<T>): boolean;
    static rand(shape: number[], randFunction: () => number): NDArray<'float32'>;
    static randNormal(shape: number[], mean?: number, stdDev?: number): NDArray<'float32'>;
    static randTruncatedNormal(shape: number[], mean?: number, stdDev?: number): NDArray<'float32'>;
    static randUniform(shape: number[], a: number, b: number): NDArray<'float32'>;
}
export declare class Scalar<T extends keyof DataTypes = keyof DataTypes> extends NDArray<T> {
    constructor(data: NDArrayData<T>, dtype: T);
    static new<T extends keyof DataTypes = keyof DataTypes>(value: number | boolean, dtype?: T): Scalar<T>;
    static ZERO: Scalar<util.DType>;
    static ONE: Scalar<util.DType>;
    static TWO: Scalar<util.DType>;
    static NEG_ONE: Scalar<util.DType>;
    get(): number;
    val(): Promise<number>;
    set(value: number): void;
    add(value: number): void;
    asType<G extends keyof DataTypes>(dtype: G): Scalar<G>;
    locToIndex(loc: number[]): number;
    indexToLoc(index: number): number[];
}
export declare class Array1D<T extends keyof DataTypes = keyof DataTypes> extends NDArray<T> {
    shape: [number];
    constructor(data: NDArrayData<T>, dtype: T);
    static new<T extends keyof DataTypes = keyof DataTypes>(values: DataTypes[T] | number[] | boolean[], dtype?: T): Array1D<T>;
    get(i: number): number;
    set(value: number, i: number): void;
    val(i: number): Promise<number>;
    add(value: number, i: number): void;
    locToIndex(loc: [number]): number;
    indexToLoc(index: number): [number];
    asType<G extends keyof DataTypes>(dtype: G): Array1D<G>;
    static zeros<T extends keyof DataTypes = keyof DataTypes>(shape: [number], dtype?: T): Array1D<T>;
    static randNormal(shape: [number], mean?: number, stdDev?: number): Array1D<'float32'>;
    static randTruncatedNormal(shape: [number], mean?: number, stdDev?: number): Array1D<'float32'>;
    static randUniform(shape: [number], a: number, b: number): Array1D<'float32'>;
}
export declare class Array2D<T extends keyof DataTypes = keyof DataTypes> extends NDArray<T> {
    shape: [number, number];
    private stride0;
    constructor(shape: [number, number], data: NDArrayData<T>, dtype: T);
    static new<T extends keyof DataTypes = keyof DataTypes>(shape: [number, number], values: DataTypes[T] | number[] | number[][] | boolean[] | boolean[][], dtype?: T): Array2D<T>;
    get(i: number, j: number): number;
    set(value: number, i: number, j: number): void;
    add(value: number, i: number, j: number): void;
    val(i: number, j: number): Promise<number>;
    locToIndex(locs: [number, number]): number;
    indexToLoc(index: number): [number, number];
    asType<G extends keyof DataTypes>(dtype: G): Array2D<G>;
    static zeros<T extends keyof DataTypes = keyof DataTypes>(shape: [number, number], dtype?: T): Array2D<T>;
    static randNormal(shape: [number, number], mean?: number, stdDev?: number): Array2D<'float32'>;
    static randTruncatedNormal(shape: [number, number], mean?: number, stdDev?: number): Array2D<'float32'>;
    static randUniform(shape: [number, number], a: number, b: number): Array2D<'float32'>;
}
export declare class Array3D<T extends keyof DataTypes = keyof DataTypes> extends NDArray<T> {
    shape: [number, number, number];
    private stride0;
    private stride1;
    constructor(shape: [number, number, number], data: NDArrayData<T>, dtype: T);
    static new<T extends keyof DataTypes = keyof DataTypes>(shape: [number, number, number], values: DataTypes[T] | number[] | number[][][] | boolean[] | boolean[][][], dtype?: T): Array3D<T>;
    get(i: number, j: number, k: number): number;
    set(value: number, i: number, j: number, k: number): void;
    val(i: number, j: number, k: number): Promise<number>;
    add(value: number, i: number, j: number, k: number): void;
    locToIndex(locs: [number, number, number]): number;
    indexToLoc(index: number): [number, number, number];
    asType<G extends keyof DataTypes>(dtype: G): Array3D<G>;
    static zeros<T extends keyof DataTypes = keyof DataTypes>(shape: [number, number, number], dtype?: T): Array3D<T>;
    static randNormal(shape: [number, number, number], mean?: number, stdDev?: number): Array3D<'float32'>;
    static randTruncatedNormal(shape: [number, number, number], mean?: number, stdDev?: number): Array3D<'float32'>;
    static randUniform(shape: [number, number, number], a: number, b: number): Array3D<'float32'>;
}
export declare class Array4D<T extends keyof DataTypes = keyof DataTypes> extends NDArray<T> {
    shape: [number, number, number, number];
    private stride0;
    private stride1;
    private stride2;
    constructor(shape: [number, number, number, number], data: NDArrayData<T>, dtype: T);
    static new<T extends keyof DataTypes = keyof DataTypes>(shape: [number, number, number, number], values: DataTypes[T] | number[] | number[][][][] | boolean[] | boolean[][][][], dtype?: T): Array4D<T>;
    get(i: number, j: number, k: number, l: number): number;
    set(value: number, i: number, j: number, k: number, l: number): void;
    val(i: number, j: number, k: number, l: number): Promise<number>;
    add(value: number, i: number, j: number, k: number, l: number): void;
    locToIndex(locs: [number, number, number, number]): number;
    indexToLoc(index: number): [number, number, number, number];
    asType<G extends keyof DataTypes>(dtype: G): Array4D<G>;
    static zeros<T extends keyof DataTypes = keyof DataTypes>(shape: [number, number, number, number], dtype?: T): Array4D<T>;
    static randNormal(shape: [number, number, number, number], mean?: number, stdDev?: number): Array4D<'float32'>;
    static randTruncatedNormal(shape: [number, number, number, number], mean?: number, stdDev?: number): Array4D<'float32'>;
    static randUniform(shape: [number, number, number, number], a: number, b: number): Array4D<'float32'>;
}
