export function getRandomNumber(min: number, max: number) : number {
    const diff: number = max - min;
    return Math.random() * diff + min;
}

export function getRadians(degrees: number): number {
    return Math.PI / 180 * degrees;
}
