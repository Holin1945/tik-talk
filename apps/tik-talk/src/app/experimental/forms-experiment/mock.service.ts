import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Feature } from './mock.interface';

@Injectable({ providedIn: 'root' })
export class MockService {
  getAddresses() {
    return of([
      // {
      //   'city': 'Москва',
      //   'street': 'Тверская',
      //   'building': 14,
      //   'apartment': 32
      // },
      // {
      //   'city': 'Санкт-Петербург',
      //   'street': 'Ленина',
      //   'building': 100,
      //   'apartment': 30
      // }
    ]);
  }

  getData(val: string) {
    return of(`Data from backend: ${val}`);
  }

  getFeatures(): Observable<Feature[]> {
    return of([
      {
        code: 'lift',
        label: 'Подъем на этаж',
        value: false,
      },
      {
        code: 'strong-package',
        label: 'Усиленная упаковка',
        value: false,
      },
      {
        code: 'fast',
        label: 'Ускоренная доставка',
        value: false,
      },
    ]);
  }
}
