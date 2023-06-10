import { Pipe, PipeTransform } from '@angular/core';

import { Entity } from 'src/app/entity-service/entity.types';

@Pipe({
    name: 'entityName',
    standalone: true,
    pure: false,
})
export class EntityNamePipe implements PipeTransform {
    transform(entity: Entity): unknown {
        return `${entity.name} (${entity.type}${entity.isEmitter ? ' Spawner' : ''})`;
    }
}
