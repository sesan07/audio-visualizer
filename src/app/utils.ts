import { TrackByFunction } from '@angular/core';

import { RGBA } from 'ngx-color';

import { Entity } from './entity-service/entity.types';

export const trackByEntityId: TrackByFunction<Entity> = (_: number, entity: Entity): string => entity.id;

export const getRandomNumber = (min: number, max: number): number => {
    const diff: number = max - min;
    return Math.random() * diff + min;
};

export const getRadians = (degrees: number): number => {
    return (Math.PI / 180) * degrees;
};

export const getGradientColor = (startColor: RGBA, endColor: RGBA, fadePercent: number): RGBA => {
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
};

export const getRandomColor = (): RGBA => {
    return {
        r: Math.round(getRandomNumber(0, 255)),
        g: Math.round(getRandomNumber(0, 255)),
        b: Math.round(getRandomNumber(0, 255)),
        a: 1,
    };
};

export const canMove = ({ transform }: Entity, point: { x: number; y: number }): boolean => {
    return (
        point.x > transform.left &&
        point.x <= transform.left + transform.width &&
        point.y > transform.top &&
        point.y <= transform.top + transform.height
    );
};

const clamp = (value: number, max: number): number => {
    return Math.max(0, Math.min(max, value));
};
