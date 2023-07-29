import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export class PostValidators {
  static mimeType = (
    control: AbstractControl
  ): Promise<ValidationErrors> | Observable<ValidationErrors> => {
    const file = control.value as File;
    const fileReader = new FileReader();
    const observable = Observable.create(
      (observer: Observer<ValidationErrors>) => {
        fileReader.addEventListener('loadend', (event) => {
          const arrayBuffer = new Uint8Array(
            fileReader.result as ArrayBuffer
          ).subarray(0, 4);
          let header = '';
          for (let i = 0; i < arrayBuffer.length; i++) {
            header += arrayBuffer[i].toString(16);
          }
          switch (header) {
            case '89504e47': // type = "image/png";
            case '47494638': // type = "image/gif";
            case 'ffd8ffe0': // type = "image/jpeg";
            case 'ffd8ffe1':
            case 'ffd8ffe2':
            case 'ffd8ffe3':
            case 'ffd8ffe8':
              observer.next(null);
              break;
            default:
              observer.next({ invalidMimeType: true });
              break;
          }
          observer.complete();
        });

        if (file) {
          fileReader.readAsArrayBuffer(file);
        }
      }
    );
    return observable;
  };
}
