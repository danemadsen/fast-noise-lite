export type NoiseType = 
    | "open-simplex-2"  
    | "open-simplex-2s"  
    | "cellular"  
    | "perlin"  
    | "value-cubic"  
    | "value";

export type RotationType3D = 
    | "none"
    | "improve-xy-planes" 
    | "improve-xz-planes";

export type FractalType = 
    | "none"
    | "fbm" 
    | "ridged" 
    | "ping-pong" 
    | "domain-warp-progressive" 
    | "domain-warp-independent";

export type CellularDistanceFunction = 
    | "euclidean" 
    | "euclidean-squared" 
    | "manhattan" 
    | "hybrid";

export type CellularReturnType =
    | "cell-value"
    | "distance"
    | "distance-2"
    | "distance-2-add"
    | "distance-2-sub"
    | "distance-2-mul"
    | "distance-2-div";

export type DomainWarpType =
    | "open-simplex-2"
    | "open-simplex-2-reduced"
    | "basic-grid";

export type TransformType3D =
    | "none"
    | "improve-xy-planes"
    | "improve-xz-planes"
    | "default-open-simplex-2";

export type NoiseOptions = {
    seed: number;
    frequency: number;
    domainWarpAmp?: number;
    octaves?: number;
    lacunarity?: number;
    gain?: number;
    weightedStrength?: number;
    pingPongStrength?: number;
    fractalBounding?: number;
    cellularJitterModifier?: number;
    noiseType: NoiseType;
    rotationType3D?: RotationType3D;
    fractalType: FractalType;
    cellularDistanceFunction?: CellularDistanceFunction;
    cellularReturnType?: CellularReturnType;
    domainWarpType?: DomainWarpType;
    warpTransformType3D?: TransformType3D;
    transformType3D?: TransformType3D;
}

export interface Vector2 {
    x: number;
    y: number;
}

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}