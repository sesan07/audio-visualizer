import { animate, AnimationTriggerMetadata, keyframes, style, transition, trigger } from '@angular/animations';

export const animations: AnimationTriggerMetadata[] = [
    trigger('controllerEnterLeaveTrigger', [
        transition(':enter', [
            style({
                opacity: '0',
                transform: 'scale(0)'
            }),
            animate(100, keyframes([
                style({
                    offset: 0.5,
                    opacity: '1',
                    transform: 'scale(1)'
                }),
                style({
                    offset: 0.75,
                    opacity: '1',
                    transform: 'scale(1.03)'
                }),
                style({
                    offset: 1,
                    opacity: '1',
                    transform: 'scale(1)'
                })
            ]))
        ]),
        transition(':leave', [
            style({
                opacity: '*',
                transform: '*'
            }),
            animate(100, style({
                opacity: '0',
                transform: 'scale(0)'
            }))
        ])
    ])
]
