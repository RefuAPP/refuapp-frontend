export function formatPhone(phone: string): string {
  /*
  Input format: (+34) 123 456 789
  Output format: 12345679
  */
  phone = phone.replace(/\D/g, ''); // Strip all spaces
  phone = phone.substring(2); // Remove country code
  return phone;
}
