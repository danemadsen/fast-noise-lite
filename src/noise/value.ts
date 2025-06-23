import { prime } from "../constants";
import { NoiseOptions } from "../types";
import { interpolateHermite, lerp, valueCoordinateR2, valueCoordinateR3 } from "../utilities";

export function valueR2(options: NoiseOptions, x: number, y: number): number {
    const seed = options.seed;

    let x0 = Math.floor(x);
    let y0 = Math.floor(y);

    let xs = interpolateHermite(x - x0);
    let ys = interpolateHermite(y - y0);

    x0 = Math.imul(x0, prime.x);
    y0 = Math.imul(y0, prime.y);
    let x1 = x0 + prime.x;
    let y1 = y0 + prime.y;

    let xf0 = lerp(valueCoordinateR2(seed, x0, y0), valueCoordinateR2(seed, x1, y0), xs);
    let xf1 = lerp(valueCoordinateR2(seed, x0, y1), valueCoordinateR2(seed, x1, y1), xs);

    return lerp(xf0, xf1, ys);
}

export function valueR3(options: NoiseOptions, x: number, y: number, z: number): number {
    const seed = options.seed;

    let x0 = Math.floor(x);
    let y0 = Math.floor(y);
    let z0 = Math.floor(z);

    let xs = interpolateHermite(x - x0);
    let ys = interpolateHermite(y - y0);
    let zs = interpolateHermite(z - z0);

    x0 = Math.imul(x0, prime.x);
    y0 = Math.imul(y0, prime.y);
    z0 = Math.imul(z0, prime.z);
    let x1 = x0 + prime.x;
    let y1 = y0 + prime.y;
    let z1 = z0 + prime.z;

    let xf00 = lerp(
        valueCoordinateR3(seed, x0, y0, z0),
        valueCoordinateR3(seed, x1, y0, z0),
        xs
    );
    let xf10 = lerp(
        valueCoordinateR3(seed, x0, y1, z0),
        valueCoordinateR3(seed, x1, y1, z0),
        xs
    );
    let xf01 = lerp(
        valueCoordinateR3(seed, x0, y0, z1),
        valueCoordinateR3(seed, x1, y0, z1),
        xs
    );
    let xf11 = lerp(
        valueCoordinateR3(seed, x0, y1, z1),
        valueCoordinateR3(seed, x1, y1, z1),
        xs
    );

    let yf0 = lerp(xf00, xf10, ys);
    let yf1 = lerp(xf01, xf11, ys);

    return lerp(yf0, yf1, zs);
}