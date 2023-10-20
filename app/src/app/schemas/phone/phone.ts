import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';

export type Phone = string;

export const spainPhoneMask: MaskitoOptions = {
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

export const phoneMaskPredicate: MaskitoElementPredicateAsync = async (el) =>
  (el as HTMLIonInputElement).getInputElement();

export function isValid(phone: Phone): boolean {
  return phone.length === 9;
}

/**
 * @param phone the phone number in format: (+34) 123 456 789
 * @return the phone number in format: 123456789 or null if the phone number is not valid
 */
export function format(phone: string): Phone | null {
  const replaced = phone.replace(/\D/g, ''); // Strip all spaces
  const result = replaced.substring(2); // Remove country code
  if (!isValid(result)) return null;
  return result;
}
