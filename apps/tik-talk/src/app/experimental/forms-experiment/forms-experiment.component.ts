import { NameValidator } from './name.validator';
import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLinkWithHref } from '@angular/router';
import { MaskitoDirective } from '@maskito/angular';
import { phoneMask } from './mask';
import { Address, Feature } from './mock.interface';
import { MockService } from './mock.service';

enum ReceiverType {
  PERSON = 'PERSON',
  GARBAGE = 'GARBAGE',
}

function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    building: new FormControl<number | null>(initialValue.building ?? null),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null),
  });
}

function validateStartWith(forbiddenLetter: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value.startsWith(forbiddenLetter)
      ? { startWith: `${forbiddenLetter} - последняя буква алфавита` }
      : null;
  };
}

function validateDateRange({
  fromControlName,
  toControlName,
}: {
  fromControlName: string;
  toControlName: string;
}) {
  return (control: AbstractControl) => {
    const fromControl = control.get(fromControlName);
    const toControl = control.get(toControlName);

    if (!fromControl || !toControl) return null;

    const fromDate = new Date(fromControl.value);
    const toDate = new Date(toControl.value);

    if (fromDate && toDate && fromDate > toDate) {
      toControl.setErrors({
        dateRange: { message: 'Дата начала не может быть позднее даты конца' },
      });
      return { dateRange: { message: 'Дата начала не может быть позднее даты конца' } };
    }
    return null;
  };
}

@Component({
  selector: 'tt-forms-experiment',
  imports: [CommonModule, ReactiveFormsModule, MaskitoDirective, RouterLinkWithHref],
  templateUrl: './forms-experiment.component.html',
  styleUrl: './forms-experiment.component.scss',
})
export class FormsExperimentComponent {
  readonly phoneMask = phoneMask;
  // readonly dateMask = dateMask; 
  sort = () => 0;

  ReceiverType = ReceiverType;

  mockService = inject(MockService);
  nameValidator = inject(NameValidator);
  features: Feature[] = [];

  form = new FormGroup({
    type: new FormControl<ReceiverType>(ReceiverType.PERSON),
    name: new FormControl<string>('', {
      validators: [Validators.required],
      asyncValidators: [this.nameValidator.validate.bind(this.nameValidator)],
      updateOn: 'blur',
    }),
    garbage: new FormControl<string>(''),
    lastName: new FormControl<string>(''),
    phone: new FormControl(),
    addresses: new FormArray([getAddressForm()]),
    feature: new FormRecord({}),
    dateRange: new FormGroup(
      {
        from: new FormControl<string>(''),
        to: new FormControl<string>(''),
      },
      validateDateRange({ fromControlName: 'from', toControlName: 'to' })
    ),
  });

  constructor() {
    this.mockService
      .getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe((addrs) => {
        this.form.controls.addresses.clear();

        for (const addr of addrs) {
          this.form.controls.addresses.push(getAddressForm(addr));
        }
        this.form.controls.addresses.setControl(1, getAddressForm(addrs[0]));
        // console.log(this.form.controls.addresses.at(0))
      });

    this.mockService
      .getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe((features) => {
        this.features = features;

        for (const feature of features) {
          this.form.controls.feature.addControl(feature.code, new FormControl(feature.value));
        }
      });

    this.form.controls.type.valueChanges.pipe(takeUntilDestroyed()).subscribe((val) => {
      this.form.controls.garbage.clearValidators();

      if (val === ReceiverType.GARBAGE) {
        this.form.controls.garbage.setValidators([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(5),
        ]);
      }
    });
  }

  onSubmit(event: SubmitEvent) {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    console.log('this.form.valid', this.form.valid);
    console.log('getRawValue', this.form.getRawValue());
  }

  addAddress() {
    this.form.controls.addresses.insert(0, getAddressForm());
  }

  deleteAddress(index: number) {
    this.form.controls.addresses.removeAt(index, { emitEvent: false });
  }
}
