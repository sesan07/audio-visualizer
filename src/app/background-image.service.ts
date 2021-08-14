import { Injectable } from '@angular/core';
import { SourceService } from './shared/source-service/source.service';
import { ISource } from './shared/source-service/source.service.types';

@Injectable({
  providedIn: 'root'
})
export class BackgroundImageService extends SourceService {

  sources: ISource[] = [
    { name: 'Ryuko and Satsuki', src: 'assets/background-image/1.png' },
  ];
}
