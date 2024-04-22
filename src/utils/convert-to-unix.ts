export function convertToUnixTimestamp(isoDateString: string | Date) {
  const date = new Date(isoDateString);
  const unixTimestamp = Math.floor(date.getTime() / 1000);
  return unixTimestamp;
}
