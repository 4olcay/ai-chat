export function truncateString(
  text: string,
  maxLength: number = 50,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + suffix;
}
