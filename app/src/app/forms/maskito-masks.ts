import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';

class MaskitoMasks {
  readonly phoneMask: MaskitoOptions = {
    mask: [
      '(',
      '+',
      '3',
      '4',
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      ' ',
      /\d/,
      /\d/,
      /\d/,
      ' ',
      /\d/,
      /\d/,
      /\d/,
    ],
  };

  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) =>
    (el as HTMLIonInputElement).getInputElement();
}

export default new MaskitoMasks();
