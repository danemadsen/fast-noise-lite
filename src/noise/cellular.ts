import { prime, randomVectors2D, randomVectors3D } from "../constants";
import { NoiseOptions } from "../types";
import { hashR2, hashR3 } from "../utilities";

export function cellularR2(options: NoiseOptions, x: number, y: number): number {
    const seed = options.seed;

    let xr = Math.round(x);
    let yr = Math.round(y);

    let distance0 = Number.MAX_VALUE;
    let distance1 = Number.MAX_VALUE;

    let closestHash = 0;

    let cellularJitter = 0.43701595 * (options.cellularJitterModifier ?? 1.0);

    let xPrimed = (xr - 1) * prime.x;
    let yPrimedBase = (yr - 1) * prime.y;

    switch (options.cellularDistanceFunction) {
        default:
        case "euclidean":
        case "euclidean-squared":
            for (let xi = xr - 1; xi <= xr + 1; xi++) {
                let yPrimed = yPrimedBase;
            
                for (let yi = yr - 1; yi <= yr + 1; yi++) {
                    let hash = hashR2(seed, xPrimed, yPrimed);
                    let idx = hash & (255 << 1);
                
                    let vecX = xi - x + randomVectors2D[idx] * cellularJitter;
                    let vecY = yi - y + randomVectors2D[idx | 1] * cellularJitter;
                
                    let newDistance = vecX * vecX + vecY * vecY;
                
                    distance1 = Math.max(Math.min(distance1, newDistance), distance0);
                    if (newDistance < distance0) {
                        distance0 = newDistance;
                        closestHash = hash;
                    }
                    yPrimed += prime.y;
                }
                xPrimed += prime.x;
            }
            break;
        case "manhattan":
            for (let xi = xr - 1; xi <= xr + 1; xi++) {
                let yPrimed = yPrimedBase;
            
                for (let yi = yr - 1; yi <= yr + 1; yi++) {
                    let hash = hashR2(seed, xPrimed, yPrimed);
                    let idx = hash & (255 << 1);
                
                    let vecX = xi - x + randomVectors2D[idx] * cellularJitter;
                    let vecY = yi - y + randomVectors2D[idx | 1] * cellularJitter;
                
                    let newDistance = Math.abs(vecX) + Math.abs(vecY);
                
                    distance1 = Math.max(Math.min(distance1, newDistance), distance0);
                    if (newDistance < distance0) {
                        distance0 = newDistance;
                        closestHash = hash;
                    }
                    yPrimed += prime.y;
                }
                xPrimed += prime.x;
            }
            break;
        case "hybrid":
            for (let xi = xr - 1; xi <= xr + 1; xi++) {
                let yPrimed = yPrimedBase;
            
                for (let yi = yr - 1; yi <= yr + 1; yi++) {
                    let hash = hashR2(seed, xPrimed, yPrimed);
                    let idx = hash & (255 << 1);
                
                    let vecX = xi - x + randomVectors2D[idx] * cellularJitter;
                    let vecY = yi - y + randomVectors2D[idx | 1] * cellularJitter;
                
                    let newDistance =
                        Math.abs(vecX) + Math.abs(vecY) + (vecX * vecX + vecY * vecY);
                
                    distance1 = Math.max(Math.min(distance1, newDistance), distance0);
                    if (newDistance < distance0) {
                        distance0 = newDistance;
                        closestHash = hash;
                    }
                    yPrimed += prime.y;
                }
                xPrimed += prime.x;
            }
            break;
    }

    if (
        options.cellularDistanceFunction === "euclidean" &&
        options.cellularReturnType !== "cell-value"
    ) {
        distance0 = Math.sqrt(distance0);
        distance1 = Math.sqrt(distance1);
    }

    switch (options.cellularReturnType) {
        case "cell-value":
            return closestHash * (1 / 2147483648.0);
        case "distance":
            return distance0 - 1;
        case "distance-2":
            return distance1 - 1;
        case "distance-2-add":
            return (distance1 + distance0) * 0.5 - 1;
        case "distance-2-sub":
            return distance1 - distance0 - 1;
        case "distance-2-mul":
            return distance1 * distance0 * 0.5 - 1;
        case "distance-2-div":
            return distance0 / distance1 - 1;
        default:
            return 0;
    }
}

export function cellularR3(options: NoiseOptions, x: number, y: number, z: number): number {
    const seed = options.seed;

    let xr = Math.round(x);
    let yr = Math.round(y);
    let zr = Math.round(z);

    let distance0 = Number.MAX_VALUE;
    let distance1 = Number.MAX_VALUE;
    let closestHash = 0;

    let cellularJitter = 0.39614353 * (options.cellularJitterModifier ?? 1.0);

    let xPrimed = (xr - 1) * prime.x;
    let yPrimedBase = (yr - 1) * prime.y;
    let zPrimedBase = (zr - 1) * prime.z;

    switch (options.cellularDistanceFunction) {
        case "euclidean":
        case "euclidean-squared":
            for (let xi = xr - 1; xi <= xr + 1; xi++) {
                let yPrimed = yPrimedBase;
            
                for (let yi = yr - 1; yi <= yr + 1; yi++) {
                    let zPrimed = zPrimedBase;
                
                    for (let zi = zr - 1; zi <= zr + 1; zi++) {
                        let hash = hashR3(seed, xPrimed, yPrimed, zPrimed);
                        let idx = hash & (255 << 2);
                    
                        let vecX = xi - x + randomVectors3D[idx] * cellularJitter;
                        let vecY = yi - y + randomVectors3D[idx | 1] * cellularJitter;
                        let vecZ = zi - z + randomVectors3D[idx | 2] * cellularJitter;
                    
                        let newDistance = vecX * vecX + vecY * vecY + vecZ * vecZ;
                    
                        distance1 = Math.max(Math.min(distance1, newDistance), distance0);
                        if (newDistance < distance0) {
                            distance0 = newDistance;
                            closestHash = hash;
                        }
                        zPrimed += prime.z;
                    }
                    yPrimed += prime.y;
                }
                xPrimed += prime.x;
            }
            break;
        case "manhattan":
            for (let xi = xr - 1; xi <= xr + 1; xi++) {
                let yPrimed = yPrimedBase;
            
                for (let yi = yr - 1; yi <= yr + 1; yi++) {
                    let zPrimed = zPrimedBase;
                
                    for (let zi = zr - 1; zi <= zr + 1; zi++) {
                        let hash = hashR3(seed, xPrimed, yPrimed, zPrimed);
                        let idx = hash & (255 << 2);
                    
                        let vecX = xi - x + randomVectors3D[idx] * cellularJitter;
                        let vecY = yi - y + randomVectors3D[idx | 1] * cellularJitter;
                        let vecZ = zi - z + randomVectors3D[idx | 2] * cellularJitter;
                    
                        let newDistance = Math.abs(vecX) + Math.abs(vecY) + Math.abs(vecZ);
                    
                        distance1 = Math.max(Math.min(distance1, newDistance), distance0);
                        if (newDistance < distance0) {
                            distance0 = newDistance;
                            closestHash = hash;
                        }
                        zPrimed += prime.z;
                    }
                    yPrimed += prime.y;
                }
                xPrimed += prime.x;
            }
            break;
        case "hybrid":
            for (let xi = xr - 1; xi <= xr + 1; xi++) {
                let yPrimed = yPrimedBase;
            
                for (let yi = yr - 1; yi <= yr + 1; yi++) {
                    let zPrimed = zPrimedBase;
                
                    for (let zi = zr - 1; zi <= zr + 1; zi++) {
                        let hash = hashR3(seed, xPrimed, yPrimed, zPrimed);
                        let idx = hash & (255 << 2);
                    
                        let vecX = xi - x + randomVectors3D[idx] * cellularJitter;
                        let vecY = yi - y + randomVectors3D[idx | 1] * cellularJitter;
                        let vecZ = zi - z + randomVectors3D[idx | 2] * cellularJitter;
                    
                        let newDistance =
                            Math.abs(vecX) +
                            Math.abs(vecY) +
                            Math.abs(vecZ) +
                            (vecX * vecX + vecY * vecY + vecZ * vecZ);
                    
                        distance1 = Math.max(Math.min(distance1, newDistance), distance0);
                        if (newDistance < distance0) {
                            distance0 = newDistance;
                            closestHash = hash;
                        }
                        zPrimed += prime.z;
                    }
                    yPrimed += prime.y;
                }
                xPrimed += prime.x;
            }
            break;
        default:
            break;
    }

    if (
        options.cellularDistanceFunction === "euclidean" &&
        options.cellularReturnType !== "cell-value"
    ) {
        distance0 = Math.sqrt(distance0);
        distance1 = Math.sqrt(distance1);
    }

    switch (options.cellularReturnType) {
        case "cell-value":
            return closestHash * (1 / 2147483648.0);
        case "distance":
            return distance0 - 1;
        case "distance-2":
            return distance1 - 1;
        case "distance-2-add":
            return (distance1 + distance0) * 0.5 - 1;
        case "distance-2-sub":
            return distance1 - distance0 - 1;
        case "distance-2-mul":
            return distance1 * distance0 * 0.5 - 1;
        case "distance-2-div":
            return distance0 / distance1 - 1;
        default:
            return 0;
    }
}