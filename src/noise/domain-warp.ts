import { gradients2D, gradients3D, prime, randomVectors2D, randomVectors3D } from "../constants";
import { NoiseOptions, Vector2, Vector3 } from "../types";
import { hashR2, hashR3, interpolateHermite, lerp } from "../utilities";

function doSingleDomainWarpR2(options: NoiseOptions, amp: number, coord: Vector2, x: number, y: number): void {
    switch (options.domainWarpType) {
        case "open-simplex-2":
            singleDomainWarpOpenSimplex2GradientR2(
                options.seed,
                amp * 38.283687591552734375,
                options.frequency,
                coord,
                false,
                x,
                y
            );
            break;
        case "open-simplex-2-reduced":
            singleDomainWarpOpenSimplex2GradientR2(
                options.seed,
                amp * 16.0,
                options.frequency,
                coord,
                true,
                x,
                y
            );
            break;
        case "basic-grid":
            singleDomainWarpBasicGridR2(options.seed, amp, options.frequency, coord, x, y);
            break;
    }
}

function doSingleDomainWarpR3(options: NoiseOptions, amp: number, coord: Vector3, x: number, y: number, z: number): void {
    switch (options.domainWarpType) {
        case "open-simplex-2":
            singleDomainWarpOpenSimplex2GradientR3(
                options.seed,
                amp * 32.69428253173828125,
                options.frequency,
                coord,
                false,
                x,
                y,
                z
            );
            break;
        case "open-simplex-2-reduced":
            singleDomainWarpOpenSimplex2GradientR3(
                options.seed,
                amp * 7.71604938271605,
                options.frequency,
                coord,
                true,
                x,
                y,
                z
            );
            break;
        case "basic-grid":
            singleDomainWarpBasicGridR3(options.seed, amp, options.frequency, coord, x, y, z);
            break;
    }
}

function domainWarpSingleR2(options: NoiseOptions, coord: Vector2): void {
    let amp = options.domainWarpAmp! * options.fractalBounding!;
    
    let xs = coord.x;
    let ys = coord.y;
    switch (options.domainWarpType) {
        case "open-simplex-2":
        case "open-simplex-2-reduced":
            const SQRT3 = 1.7320508075688772935274463415059;
            const F2 = 0.5 * (SQRT3 - 1);
            let t = (xs + ys) * F2;
            xs += t;
            ys += t;
            break;
        default:
            break;
    }
    
    doSingleDomainWarpR2(options, amp, coord, xs, ys);
}

function domainWarpSingleR3(options: NoiseOptions, coord: Vector3): void {
    let amp = options.domainWarpAmp! * options.fractalBounding!;
    
    let xs = coord.x;
    let ys = coord.y;
    let zs = coord.z;
    switch (options.transformType3D) {
        case "improve-xy-planes":
        {
            let xy = xs + ys;
            let s2 = xy * -0.211324865405187;
            zs *= 0.577350269189626;
            xs += s2 - zs;
            ys = ys + s2 - zs;
            zs += xy * 0.577350269189626;
        }
            break;
        
        case "improve-xz-planes":
        {
            let xz = xs + zs;
            let s2 = xz * -0.211324865405187;
            ys *= 0.577350269189626;
            xs += s2 - ys;
            zs += s2 - ys;
            ys += xz * 0.577350269189626;
        }
            break;
        case "default-open-simplex-2":
            const R3 = 2.0 / 3.0;
            let r = (xs + ys + zs) * R3; // Rotation, not skew
            xs = r - xs;
            ys = r - ys;
            zs = r - zs;
            break;
        default:
            break;
    }
    
    doSingleDomainWarpR3(options, amp, coord, xs, ys, zs);
}

function domainWarpFractalProgressiveR2(options: NoiseOptions, coord: Vector2): void {
    let amp = options.domainWarpAmp! * options.fractalBounding!;
    
    for (let i = 0; i < options.octaves!; i++) {
        let xs = coord.x;
        let ys = coord.y;
        switch (options.domainWarpType) {
            case "open-simplex-2":
            case "open-simplex-2-reduced":
                const SQRT3 = 1.7320508075688772935274463415059;
                const F2 = 0.5 * (SQRT3 - 1);
                let t = (xs + ys) * F2;
                xs += t;
                ys += t;
                break;
            default:
                break;
        }
        
        doSingleDomainWarpR2(options, amp, coord, xs, ys);
        
        options.seed++;
        amp *= options.gain!;
        options.frequency *= options.lacunarity!;
    }
}

function domainWarpFractalProgressiveR3(options: NoiseOptions, coord: Vector3): void {
    let amp = options.domainWarpAmp! * options.fractalBounding!;
    
    for (let i = 0; i < options.octaves!; i++) {
        let xs = coord.x;
        let ys = coord.y;
        let zs = coord.z;
        switch (options.transformType3D) {
            case "improve-xy-planes":
            {
                let xy = xs + ys;
                let s2 = xy * -0.211324865405187;
                zs *= 0.577350269189626;
                xs += s2 - zs;
                ys = ys + s2 - zs;
                zs += xy * 0.577350269189626;
            }
                break;
            case "improve-xz-planes":
            {
                let xz = xs + zs;
                let s2 = xz * -0.211324865405187;
                ys *= 0.577350269189626;
                xs += s2 - ys;
                zs += s2 - ys;
                ys += xz * 0.577350269189626;
            }
                break;
            case "default-open-simplex-2":
            {
                const R3 = 2.0 / 3.0;
                let r = (xs + ys + zs) * R3; // Rotation, not skew
                xs = r - xs;
                ys = r - ys;
                zs = r - zs;
            }
                break;
            default:
                break;
        }
        
        doSingleDomainWarpR3(options, amp, coord, xs, ys, zs);
        
        options.seed++;
        amp *= options.gain!;
        options.frequency *= options.lacunarity!;
    }
}

function domainWarpFractalIndependentR2(options: NoiseOptions, coord: Vector2): void {
    let xs = coord.x;
    let ys = coord.y;
    switch (options.domainWarpType) {
        case "open-simplex-2":
        case "open-simplex-2-reduced":
            const SQRT3 = 1.7320508075688772935274463415059;
            const F2 = 0.5 * (SQRT3 - 1);
            let t = (xs + ys) * F2;
            xs += t;
            ys += t;
            break;
        default:
            break;
    }

    let amp = options.domainWarpAmp! * options.fractalBounding!;
    for (let i = 0; i < options.octaves!; i++) {
        doSingleDomainWarpR2(options, amp, coord, xs, ys);
        
        options.seed++;
        amp *= options.gain!;
        options.frequency *= options.lacunarity!;
    }
}

function domainWarpFractalIndependentR3(options: NoiseOptions, coord: Vector3): void {
    let xs = coord.x;
    let ys = coord.y;
    let zs = coord.z;
    switch (options.transformType3D) {
        case "improve-xy-planes":
        {
            let xy = xs + ys;
            let s2 = xy * -0.211324865405187;
            zs *= 0.577350269189626;
            xs += s2 - zs;
            ys = ys + s2 - zs;
            zs += xy * 0.577350269189626;
        }
            break;
        case "improve-xz-planes":
        {
            let xz = xs + zs;
            let s2 = xz * -0.211324865405187;
            ys *= 0.577350269189626;
            xs += s2 - ys;
            zs += s2 - ys;
            ys += xz * 0.577350269189626;
        }
            break;
        case "default-open-simplex-2":
        {
            const R3 = 2.0 / 3.0;
            let r = (xs + ys + zs) * R3; // Rotation, not skew
            xs = r - xs;
            ys = r - ys;
            zs = r - zs;
        }
            break;
        default:
            break;
    }
    
    let amp = options.domainWarpAmp! * options.fractalBounding!;
    for (let i = 0; i < options.octaves!; i++) {
        doSingleDomainWarpR3(options, amp, coord, xs, ys, zs);
        
        options.seed++;
        amp *= options.gain!;
        options.frequency *= options.lacunarity!;
    }
}

function singleDomainWarpBasicGridR2(seed: number, warpAmp: number, frequency: number, coord: Vector2, x: number, y: number): void {
    let xf = x * frequency;
    let yf = y * frequency;
    
    let x0 = Math.floor(xf);
    let y0 = Math.floor(yf);
    
    let xs = interpolateHermite(xf - x0);
    let ys = interpolateHermite(yf - y0);
    
    x0 = Math.imul(x0, prime.x);
    y0 = Math.imul(y0, prime.y);
    let x1 = x0 + prime.x;
    let y1 = y0 + prime.y;
    
    let hash0 = hashR2(seed, x0, y0) & (255 << 1);
    let hash1 = hashR2(seed, x1, y0) & (255 << 1);
    
    let lx0x = lerp(randomVectors2D[hash0], randomVectors2D[hash1], xs);
    let ly0x = lerp(randomVectors2D[hash0 | 1], randomVectors2D[hash1 | 1], xs);
    
    hash0 = hashR2(seed, x0, y1) & (255 << 1);
    hash1 = hashR2(seed, x1, y1) & (255 << 1);
    
    let lx1x = lerp(randomVectors2D[hash0], randomVectors2D[hash1], xs);
    let ly1x = lerp(randomVectors2D[hash0 | 1], randomVectors2D[hash1 | 1], xs);
    
    coord.x += lerp(lx0x, lx1x, ys) * warpAmp;
    coord.y += lerp(ly0x, ly1x, ys) * warpAmp;
}

function singleDomainWarpBasicGridR3(seed: number, warpAmp: number, frequency: number, coord: Vector3, x: number, y: number, z: number): void {
    let xf = x * frequency;
    let yf = y * frequency;
    let zf = z * frequency;
    
    let x0 = Math.floor(xf);
    let y0 = Math.floor(yf);
    let z0 = Math.floor(zf);
    
    let xs = interpolateHermite(xf - x0);
    let ys = interpolateHermite(yf - y0);
    let zs = interpolateHermite(zf - z0);
    
    x0 = Math.imul(x0, prime.x);
    y0 = Math.imul(y0, prime.y);
    z0 = Math.imul(z0, prime.z);
    let x1 = x0 + prime.x;
    let y1 = y0 + prime.y;
    let z1 = z0 + prime.z;
    
    let hash0 = hashR3(seed, x0, y0, z0) & (255 << 2);
    let hash1 = hashR3(seed, x1, y0, z0) & (255 << 2);
    
    let lx0x = lerp(randomVectors3D[hash0], randomVectors3D[hash1], xs);
    let ly0x = lerp(randomVectors3D[hash0 | 1], randomVectors3D[hash1 | 1], xs);
    let lz0x = lerp(randomVectors3D[hash0 | 2], randomVectors3D[hash1 | 2], xs);
    
    hash0 = hashR3(seed, x0, y1, z0) & (255 << 2);
    hash1 = hashR3(seed, x1, y1, z0) & (255 << 2);
    
    let lx1x = lerp(randomVectors3D[hash0], randomVectors3D[hash1], xs);
    let ly1x = lerp(randomVectors3D[hash0 | 1], randomVectors3D[hash1 | 1], xs);
    let lz1x = lerp(randomVectors3D[hash0 | 2], randomVectors3D[hash1 | 2], xs);
    
    let lx0y = lerp(lx0x, lx1x, ys);
    let ly0y = lerp(ly0x, ly1x, ys);
    let lz0y = lerp(lz0x, lz1x, ys);
    
    hash0 = hashR3(seed, x0, y0, z1) & (255 << 2);
    hash1 = hashR3(seed, x1, y0, z1) & (255 << 2);
    
    lx0x = lerp(randomVectors3D[hash0], randomVectors3D[hash1], xs);
    ly0x = lerp(randomVectors3D[hash0 | 1], randomVectors3D[hash1 | 1], xs);
    lz0x = lerp(randomVectors3D[hash0 | 2], randomVectors3D[hash1 | 2], xs);
    
    hash0 = hashR3(seed, x0, y1, z1) & (255 << 2);
    hash1 = hashR3(seed, x1, y1, z1) & (255 << 2);
    
    lx1x = lerp(randomVectors3D[hash0], randomVectors3D[hash1], xs);
    ly1x = lerp(randomVectors3D[hash0 | 1], randomVectors3D[hash1 | 1], xs);
    lz1x = lerp(randomVectors3D[hash0 | 2], randomVectors3D[hash1 | 2], xs);
    
    coord.x += lerp(lx0y, lerp(lx0x, lx1x, ys), zs) * warpAmp;
    coord.y += lerp(ly0y, lerp(ly0x, ly1x, ys), zs) * warpAmp;
    coord.z += lerp(lz0y, lerp(lz0x, lz1x, ys), zs) * warpAmp;
}

function singleDomainWarpOpenSimplex2GradientR2(seed: number, warpAmp: number, frequency: number, coord: Vector2, outGradOnly: boolean, x: number, y: number): void {
    const SQRT3 = 1.7320508075688772935274463415059;
    const G2 = (3 - SQRT3) / 6;
    
    x *= frequency;
    y *= frequency;
    
    let i = Math.floor(x);
    let j = Math.floor(y);
    let xi = x - i;
    let yi = y - j;
    
    let t = (xi + yi) * G2;
    let x0 = xi - t;
    let y0 = yi - t;
    
    i = Math.imul(i, prime.x);
    j = Math.imul(j, prime.y);
    
    let vx, vy;
    vx = vy = 0;
    
    let a = 0.5 - x0 * x0 - y0 * y0;
    if (a > 0) {
        let aaaa = a * a * (a * a);
        let xo, yo;
        if (outGradOnly) {
            let hash = hashR2(seed, i, j) & (255 << 1);
            xo = randomVectors2D[hash];
            yo = randomVectors2D[hash | 1];
        } else {
            let hash = hashR2(seed, i, j);
            let index1 = hash & (127 << 1);
            let index2 = (hash >> 7) & (255 << 1);
            let xg = gradients2D[index1];
            let yg = gradients2D[index1 | 1];
            let value = x0 * xg + y0 * yg;
            let xgo = randomVectors2D[index2];
            let ygo = randomVectors2D[index2 | 1];
            xo = value * xgo;
            yo = value * ygo;
        }
        vx += aaaa * xo;
        vy += aaaa * yo;
    }
    
    let c = 2 * (1 - 2 * G2) * (1 / G2 - 2) * t + (-2 * (1 - 2 * G2) * (1 - 2 * G2) + a);
    if (c > 0) {
        let x2 = x0 + (2 * G2 - 1);
        let y2 = y0 + (2 * G2 - 1);
        let cccc = c * c * (c * c);
        let xo, yo;
        if (outGradOnly) {
            let hash = hashR2(seed, i + prime.x, j + prime.y) & (255 << 1);
            xo = randomVectors2D[hash];
            yo = randomVectors2D[hash | 1];
        } else {
            let hash = hashR2(seed, i + prime.x, j + prime.y);
            let index1 = hash & (127 << 1);
            let index2 = (hash >> 7) & (255 << 1);
            let xg = gradients2D[index1];
            let yg = gradients2D[index1 | 1];
            let value = x2 * xg + y2 * yg;
            let xgo = randomVectors2D[index2];
            let ygo = randomVectors2D[index2 | 1];
            xo = value * xgo;
            yo = value * ygo;
        }
        vx += cccc * xo;
        vy += cccc * yo;
    }
    
    if (y0 > x0) {
        let x1 = x0 + G2;
        let y1 = y0 + (G2 - 1);
        let b = 0.5 - x1 * x1 - y1 * y1;
        if (b > 0) {
            let bbbb = b * b * (b * b);
            let xo, yo;
            if (outGradOnly) {
                let hash = hashR2(seed, i, j + prime.y) & (255 << 1);
                xo = randomVectors2D[hash];
                yo = randomVectors2D[hash | 1];
            } else {
                let hash = hashR2(seed, i, j + prime.y);
                let index1 = hash & (127 << 1);
                let index2 = (hash >> 7) & (255 << 1);
                let xg = gradients2D[index1];
                let yg = gradients2D[index1 | 1];
                let value = x1 * xg + y1 * yg;
                let xgo = randomVectors2D[index2];
                let ygo = randomVectors2D[index2 | 1];
                xo = value * xgo;
                yo = value * ygo;
            }
            vx += bbbb * xo;
            vy += bbbb * yo;
        }
    } else {
        let x1 = x0 + (G2 - 1);
        let y1 = y0 + G2;
        let b = 0.5 - x1 * x1 - y1 * y1;
        if (b > 0) {
            let bbbb = b * b * (b * b);
            let xo, yo;
            if (outGradOnly) {
                let hash = hashR2(seed, i + prime.x, j) & (255 << 1);
                xo = randomVectors2D[hash];
                yo = randomVectors2D[hash | 1];
            } else {
                let hash = hashR2(seed, i + prime.x, j);
                let index1 = hash & (127 << 1);
                let index2 = (hash >> 7) & (255 << 1);
                let xg = gradients2D[index1];
                let yg = gradients2D[index1 | 1];
                let value = x1 * xg + y1 * yg;
                let xgo = randomVectors2D[index2];
                let ygo = randomVectors2D[index2 | 1];
                xo = value * xgo;
                yo = value * ygo;
            }
            vx += bbbb * xo;
            vy += bbbb * yo;
        }
    }
    
    coord.x += vx * warpAmp;
    coord.y += vy * warpAmp;
}

function singleDomainWarpOpenSimplex2GradientR3(seed: number, warpAmp: number, frequency: number, coord: Vector3, outGradOnly: boolean, x: number, y: number, z: number): void {
    x *= frequency;
    y *= frequency;
    z *= frequency;
    
    let i = Math.round(x);
    let j = Math.round(y);
    let k = Math.round(z);
    let x0 = x - i;
    let y0 = y - j;
    let z0 = z - k;
    
    let xNSign = (-x0 - 1.0) | 1;
    let yNSign = (-y0 - 1.0) | 1;
    let zNSign = (-z0 - 1.0) | 1;
    
    let ax0 = xNSign * -x0;
    let ay0 = yNSign * -y0;
    let az0 = zNSign * -z0;
    
    i = Math.imul(i, prime.x);
    j = Math.imul(j, prime.y);
    k = Math.imul(k, prime.z);
    
    let vx, vy, vz;
    vx = vy = vz = 0;
    
    let a = 0.6 - x0 * x0 - (y0 * y0 + z0 * z0);
    for (let l = 0; ; l++) {
        if (a > 0) {
            let aaaa = a * a * (a * a);
            let xo, yo, zo;
            if (outGradOnly) {
                let hash = hashR3(seed, i, j, k) & (255 << 2);
                xo = randomVectors3D[hash];
                yo = randomVectors3D[hash | 1];
                zo = randomVectors3D[hash | 2];
            } else {
                let hash = hashR3(seed, i, j, k);
                let index1 = hash & (63 << 2);
                let index2 = (hash >> 6) & (255 << 2);
                let xg = gradients3D[index1];
                let yg = gradients3D[index1 | 1];
                let zg = gradients3D[index1 | 2];
                let value = x0 * xg + y0 * yg + z0 * zg;
                let xgo = randomVectors3D[index2];
                let ygo = randomVectors3D[index2 | 1];
                let zgo = randomVectors3D[index2 | 2];
                xo = value * xgo;
                yo = value * ygo;
                zo = value * zgo;
            }
            vx += aaaa * xo;
            vy += aaaa * yo;
            vz += aaaa * zo;
        }
        
        let b = a;
        let i1 = i;
        let j1 = j;
        let k1 = k;
        let x1 = x0;
        let y1 = y0;
        let z1 = z0;
        
        if (ax0 >= ay0 && ax0 >= az0) {
            x1 += xNSign;
            b = b + ax0 + ax0;
            i1 -= xNSign * prime.x;
        } else if (ay0 > ax0 && ay0 >= az0) {
            y1 += yNSign;
            b = b + ay0 + ay0;
            j1 -= yNSign * prime.y;
        } else {
            z1 += zNSign;
            b = b + az0 + az0;
            k1 -= zNSign * prime.z;
        }
        
        if (b > 1) {
            b -= 1;
            let bbbb = b * b * (b * b);
            let xo, yo, zo;
            if (outGradOnly) {
                let hash = hashR3(seed, i1, j1, k1) & (255 << 2);
                xo = randomVectors3D[hash];
                yo = randomVectors3D[hash | 1];
                zo = randomVectors3D[hash | 2];
            } else {
                let hash = hashR3(seed, i1, j1, k1);
                let index1 = hash & (63 << 2);
                let index2 = (hash >> 6) & (255 << 2);
                let xg = gradients3D[index1];
                let yg = gradients3D[index1 | 1];
                let zg = gradients3D[index1 | 2];
                let value = x1 * xg + y1 * yg + z1 * zg;
                let xgo = randomVectors3D[index2];
                let ygo = randomVectors3D[index2 | 1];
                let zgo = randomVectors3D[index2 | 2];
                xo = value * xgo;
                yo = value * ygo;
                zo = value * zgo;
            }
            vx += bbbb * xo;
            vy += bbbb * yo;
            vz += bbbb * zo;
        }
        
        if (l === 1) break;
        
        ax0 = 0.5 - ax0;
        ay0 = 0.5 - ay0;
        az0 = 0.5 - az0;
        
        x0 = xNSign * ax0;
        y0 = yNSign * ay0;
        z0 = zNSign * az0;
        
        a += 0.75 - ax0 - (ay0 + az0);
        
        i += (xNSign >> 1) & prime.x;
        j += (yNSign >> 1) & prime.y;
        k += (zNSign >> 1) & prime.z;
        
        xNSign = -xNSign;
        yNSign = -yNSign;
        zNSign = -zNSign;
        
        seed += 1293373;
    }
    
    coord.x += vx * warpAmp;
    coord.y += vy * warpAmp;
    coord.z += vz * warpAmp;
}

export function domainWarp(options: NoiseOptions, coord: Vector2 | Vector3): void {
    if ("z" in coord) {
        switch (options.fractalType) {
            case "domain-warp-progressive":
                domainWarpFractalProgressiveR3(options, coord as Vector3);
                break;
            case "domain-warp-independent":
                domainWarpFractalIndependentR3(options, coord as Vector3);
                break;
            default:
                domainWarpSingleR3(options, coord as Vector3);
                break;
        }
    }
    else {
        switch (options.fractalType) {
            case "domain-warp-progressive":
                domainWarpFractalProgressiveR2(options, coord as Vector2);
                break;
            case "domain-warp-independent":
                domainWarpFractalIndependentR2(options, coord as Vector2);
                break;
            default:
                domainWarpSingleR2(options, coord as Vector2);
                break;
        }
    }
}