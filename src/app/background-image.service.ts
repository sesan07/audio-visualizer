import { Injectable } from '@angular/core';
import { FileService } from './shared/file-service/file.service';
import { IFileSource } from './shared/file-service/file.service.types';

@Injectable({
  providedIn: 'root'
})
export class BackgroundImageService extends FileService {

  sources: IFileSource[] = [
    { name: 'Ryuko and Satsuki', src: 'assets/background-image/1.png' },
  ];
}
