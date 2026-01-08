import { DadataSuggestion } from '../interfaces/dadata.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { DADATA_TOKEN } from '../tokens/address-token';

@Injectable({
  providedIn: 'root',
})
export class DadataService {
  #apiUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
  #http = inject(HttpClient);

  // getSuggestion(query: string) {
  //   return this.#http
  //     .post<{ suggestions: DadataSuggestion[] }>(
  //       this.#apiUrl,
  //       { query },
  //       {
  //         headers: {
  //           Authorization: `Token ${DADATA_TOKEN}`,
  //         },
  //       }
  //     ).pipe(
  //       map((res) => {
  //         return Array.from(
  //           new Set(
  //               res.suggestions.map(
  //                   (suggestion: DadataSuggestion) => {
  //                       return suggestion.data.city
  //                   }
  //         )));
  //       })
  //     ); 
  // }

  getSuggestion(query: string) {
    return this.#http
      .post<{ suggestions: DadataSuggestion[] }>(
        this.#apiUrl,
        { query },
        {
          headers: {
            Authorization: `Token ${DADATA_TOKEN}`,
          },
        }
      ).pipe(map(res => { return res.suggestions}))
}
}
