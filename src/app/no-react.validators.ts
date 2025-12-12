// import { Directive } from '@angular/core';
// import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

// @Directive({
//   standalone: true,
//   selector: '[noReact]',
//   providers: [
//     {
//       provide: NG_VALIDATORS,
//       useExisting: NoReactValidator,
//       multi: true,
//     },
//   ],
// })
// export class NoReactValidator implements Validator {
//   change!: () => void;

//   validate(control: AbstractControl): ValidationErrors | null {
//     console.log(control.value);
//     return control.value?.toLowerCase() === 'react'
//       ? { noReact: { message: `Никаких реактов!!! ${control.status}` }
//      }
//       : null;
//   }
//   registerOnValidatorChange?(fn: () => void): void {
//     this.change = fn;
//   }
// }
