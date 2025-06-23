import { gradients2D, gradients3D } from "./constants";

export function lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
}

export function lerpCubic(a: number, b: number, c: number, d: number, t: number): number {
    let p = d - c - (a - b);
    return t * t * t * p + t * t * (a - b - p) + t * (c - a) + b;
}

export function interpolateHermite(t: number): number {
    return t * t * (3 - 2 * t);
}

export function interpolateQuintic(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

export function pingPong(t: number): number {
    t -= Math.trunc(t * 0.5) * 2;
    return t < 1 ? t : 2 - t;
}

export function hashR2(seed: number, xPrimed: number, yPrimed: number): number {
    let hash = seed ^ xPrimed ^ yPrimed;
    hash = Math.imul(hash, 0x27d4eb2d);
    return hash;
}

export function hashR3(seed: number, xPrimed: number, yPrimed: number, zPrimed: number): number {
    let hash = seed ^ xPrimed ^ yPrimed ^ zPrimed;
    hash = Math.imul(hash, 0x27d4eb2d);
    return hash;
}

export function valueCoordinateR2(seed: number, xPrimed: number, yPrimed: number): number {
    let hash = hashR2(seed, xPrimed, yPrimed);

    hash = Math.imul(hash, hash);
    hash ^= hash << 19;
    return hash * (1 / 2147483648.0);
}

export function valueCoordinateR3(seed: number, xPrimed: number, yPrimed: number, zPrimed: number): number {
    let hash = hashR3(seed, xPrimed, yPrimed, zPrimed);

    hash = Math.imul(hash, hash);
    hash ^= hash << 19;
    return hash * (1 / 2147483648.0);
}

export function gradientCoordinateR2(seed: number, xPrimed: number, yPrimed: number, xd: number, yd: number): number {
    let hash = hashR2(seed, xPrimed, yPrimed);
    hash ^= hash >> 15;
    hash &= 127 << 1;

    let xg = gradients2D[hash];
    let yg = gradients2D[hash | 1];

    return xd * xg + yd * yg;
}

export function gradientCoordinateR3(seed: number, xPrimed: number, yPrimed: number, zPrimed: number, xd: number, yd: number, zd: number): number {
    let hash = hashR3(seed, xPrimed, yPrimed, zPrimed);
    hash ^= hash >> 15;
    hash &= 63 << 2;

    let xg = gradients3D[hash];
    let yg = gradients3D[hash | 1];
    let zg = gradients3D[hash | 2];

    return xd * xg + yd * yg + zd * zg;
}