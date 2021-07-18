import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

export const animations: AnimationTriggerMetadata[] = [
    trigger('controllerEnterLeaveTrigger', [
        transition(':enter', [
            style({
                opacity: '0',
                transform: 'scaleY(0)'
            }),
            animate(100, style({
                opacity: '1',
                transform: 'scaleY(1)'
            }))
        ]),
        transition(':leave', [
            style({
                opacity: '*',
                transform: '*'
            }),
            animate(100, style({
                opacity: '0',
                transform: 'scaleY(0)'
            }))
        ])
    ]),
    trigger('entityEnterLeaveTrigger', [
        transition(':enter', [
            style({ opacity: '0' }),
            animate(1000, style({ opacity: '1' }))
        ]),
        transition(':leave', [
            style({ opacity: '1' }),
            animate(1000, style({ opacity: '0' }))
        ])
    ])
];
