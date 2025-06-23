import { prime } from "../constants";
import { NoiseOptions } from "../types";
import { lerpCubic, valueCoordinateR2, valueCoordinateR3 } from "../utilities";

export function valueCubicR2(options: NoiseOptions, x: number, y: number): number {
    const seed = options.seed;
    
    let x1 = Math.floor(x);
    let y1 = Math.floor(y);

    let xs = x - x1;
    let ys = y - y1;

    x1 = Math.imul(x1, prime.x);
    y1 = Math.imul(y1, prime.y);

    let x0 = x1 - prime.x;
    let y0 = y1 - prime.y;
    let x2 = x1 + prime.x;
    let y2 = y1 + prime.y;
    let x3 = x1 + (prime.x << 1);
    let y3 = y1 + (prime.y << 1);

    return (
        lerpCubic(
            lerpCubic(
                valueCoordinateR2(seed, x0, y0),
                valueCoordinateR2(seed, x1, y0),
                valueCoordinateR2(seed, x2, y0),
                valueCoordinateR2(seed, x3, y0),
                xs
            ),
            lerpCubic(
                valueCoordinateR2(seed, x0, y1),
                valueCoordinateR2(seed, x1, y1),
                valueCoordinateR2(seed, x2, y1),
                valueCoordinateR2(seed, x3, y1),
                xs
            ),
            lerpCubic(
                valueCoordinateR2(seed, x0, y2),
                valueCoordinateR2(seed, x1, y2),
                valueCoordinateR2(seed, x2, y2),
                valueCoordinateR2(seed, x3, y2),
                xs
            ),
            lerpCubic(
                valueCoordinateR2(seed, x0, y3),
                valueCoordinateR2(seed, x1, y3),
                valueCoordinateR2(seed, x2, y3),
                valueCoordinateR2(seed, x3, y3),
                xs
            ),
            ys
        ) *
        (1 / (1.5 * 1.5))
    );
}

export function valueCubicR3(options: NoiseOptions, x: number, y: number, z: number): number {
    const seed = options.seed;

    let x1 = Math.floor(x);
    let y1 = Math.floor(y);
    let z1 = Math.floor(z);

    let xs = x - x1;
    let ys = y - y1;
    let zs = z - z1;

    x1 = Math.imul(x1, prime.x);
    y1 = Math.imul(y1, prime.y);
    z1 = Math.imul(z1, prime.z);

    let x0 = x1 - prime.x;
    let y0 = y1 - prime.y;
    let z0 = z1 - prime.z;
    let x2 = x1 + prime.x;
    let y2 = y1 + prime.y;
    let z2 = z1 + prime.z;
    let x3 = x1 + (prime.x << 1);
    let y3 = y1 + (prime.y << 1);
    let z3 = z1 + (prime.z << 1);

    return (
        lerpCubic(
            lerpCubic(
                lerpCubic(
                    valueCoordinateR3(seed, x0, y0, z0),
                    valueCoordinateR3(seed, x1, y0, z0),
                    valueCoordinateR3(seed, x2, y0, z0),
                    valueCoordinateR3(seed, x3, y0, z0),
                    xs
                ),
                lerpCubic(
                    valueCoordinateR3(seed, x0, y1, z0),
                    valueCoordinateR3(seed, x1, y1, z0),
                    valueCoordinateR3(seed, x2, y1, z0),
                    valueCoordinateR3(seed, x3, y1, z0),
                    xs
                ),
                lerpCubic(
                    valueCoordinateR3(seed, x0, y2, z0),
                    valueCoordinateR3(seed, x1, y2, z0),
                    valueCoordinateR3(seed, x2, y2, z0),
                    valueCoordinateR3(seed, x3, y2, z0),
                    xs
                ),
                lerpCubic(
                    valueCoordinateR3(seed, x0, y3, z0),
                    valueCoordinateR3(seed, x1, y3, z0),
                    valueCoordinateR3(seed, x2, y3, z0),
                    valueCoordinateR3(seed, x3, y3, z0),
                    xs
                ),
                ys
            ),
            lerpCubic(
                lerpCubic(
                    valueCoordinateR3(seed, x0, y0, z1),
                    valueCoordinateR3(seed, x1, y0, z1),
                    valueCoordinateR3(seed, x2, y0, z1),
                    valueCoordinateR3(seed, x3, y0, z1),
                    xs
                ),
                lerpCubic(
                    valueCoordinateR3(seed, x0, y1, z1),
                    valueCoordinateR3(seed, x1, y1, z1),
                    valueCoordinateR3(seed, x2, y1, z1),
                    valueCoordinateR3(seed, x3, y1, z1),
                    xs
                ),
                lerpCubic(
                    valueCoordinateR3(seed, x0, y2, z1),
                    valueCoordinateR3(seed, x1, y2, z1),
                    valueCoordinateR3(seed, x2, y2, z1),
                    valueCoordinateR3(seed, x3, y2, z1),
                    xs
                ),
                lerpCubic(
                    valueCoordinateR3(seed, x0, y3, z1),
                    valueCoordinateR3(seed, x1, y3, z1),
                    valueCoordinateR3(seed, x2, y3, z1),
                    valueCoordinateR3(seed, x3, y3, z1),
                    xs
                ),
                ys
            ),
            lerpCubic(
                lerpCubic(
                    valueCoordinateR3(seed, x0, y0, z2),
                    valueCoordinateR3(seed, x1, y0, z2),
                    valueCoordinateR3(seed, x2, y0, z2),
                    valueCoordinateR3(seed, x3, y0, z2),
                    xs
                ),
                lerpCubic(
                    valueCoordinateR3(seed, x0, y1, z2),
                    valueCoordinateR3(seed, x1, y1, z2),
                    valueCoordinateR3(seed, x2, y1, z2),
                    valueCoordinateR3(seed, x3, y1, z2),
                    xs
                ),
                lerpCubic(
                    valueCoordinateR3(seed, x0, y2, z2),
                    valueCoordinateR3(seed, x1, y2, z2),
                    valueCoordinateR3(seed, x2, y2, z2),
                    valueCoordinateR3(seed, x3, y2, z2),
                    xs
                ),
                lerpCubic(
                    valueCoordinateR3(seed, x0, y3, z2),
                    valueCoordinateR3(seed, x1, y3, z2),
                    valueCoordinateR3(seed, x2, y3, z2),
                    valueCoordinateR3(seed, x3, y3, z2),
                    xs
                ),
                ys
            ),
            lerpCubic(
                lerpCubic(
                    valueCoordinateR3(seed, x0, y0, z3),
                    valueCoordinateR3(seed, x1, y0, z3),
                    valueCoordinateR3(seed, x2, y0, z3),
                    valueCoordinateR3(seed, x3, y0, z3),
                    xs
                ),
                lerpCubic(
                    valueCoordinateR3(seed, x0, y1, z3),
                    valueCoordinateR3(seed, x1, y1, z3),
                    valueCoordinateR3(seed, x2, y1, z3),
                    valueCoordinateR3(seed, x3, y1, z3),
                    xs
                ),
                lerpCubic(
                    valueCoordinateR3(seed, x0, y2, z3),
                    valueCoordinateR3(seed, x1, y2, z3),
                    valueCoordinateR3(seed, x2, y2, z3),
                    valueCoordinateR3(seed, x3, y2, z3),
                    xs
                ),
                lerpCubic(
                    valueCoordinateR3(seed, x0, y3, z3),
                    valueCoordinateR3(seed, x1, y3, z3),
                    valueCoordinateR3(seed, x2, y3, z3),
                    valueCoordinateR3(seed, x3, y3, z3),
                    xs
                ),
                ys
            ),
            zs
        ) *
        (1 / (1.5 * 1.5 * 1.5))
    );
}