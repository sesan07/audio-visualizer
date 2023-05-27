import { RGBA } from 'ngx-color';
import { Entity, EntityLayer } from '../app.types';
import { TrackByFunction } from '@angular/core';

export const trackByEntityId = (_: number, entity: Entity): string => entity.id;
export const trackByLayerId = (_: number, layer: EntityLayer): string => layer.id;

export function getRandomNumber(min: number, max: number): number {
    const diff: number = max - min;
    return Math.random() * diff + min;
}

export function getRadians(degrees: number): number {
    return (Math.PI / 180) * degrees;
}

export function getGradientColor(startColor: RGBA, endColor: RGBA, fadePercent: number): RGBA {
    let diffRed: number = endColor.r - startColor.r;
    let diffGreen: number = endColor.g - startColor.g;
    let diffBlue: number = endColor.b - startColor.b;

    diffRed = diffRed * fadePercent + startColor.r;
    diffGreen = diffGreen * fadePercent + startColor.g;
    diffBlue = diffBlue * fadePercent + startColor.b;

    return {
        r: Math.floor(diffRed),
        g: Math.floor(diffGreen),
        b: Math.floor(diffBlue),
        a: 1,
    };
}

export function getRandomColor(): RGBA {
    return {
        r: Math.round(getRandomNumber(0, 255)),
        g: Math.round(getRandomNumber(0, 255)),
        b: Math.round(getRandomNumber(0, 255)),
        a: 1,
    };
}

export function moveItemInArray<T = any>(array: T[], fromIndex: number, toIndex: number): void {
    const from: number = clamp(fromIndex, array.length - 1);
    const to: number = clamp(toIndex, array.length - 1);

    if (from === to) {
        return;
    }

    const target: T = array[from];
    const delta: number = to < from ? -1 : 1;

    for (let i: number = from; i !== to; i += delta) {
        array[i] = array[i + delta];
    }

    array[to] = target;
}

function clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, value));
}
