export function convertToJakartaTime(date: Date) {
  const jakartaOffset = 7 * 60 * 60 * 1000; // UTC+7
  const jakartaTime = new Date(date.getTime() + jakartaOffset);
  return jakartaTime;
}
