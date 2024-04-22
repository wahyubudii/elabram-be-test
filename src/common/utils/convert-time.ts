export function convertToJakartaTime(date: Date) {
  const jakartaTime = date.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
  });

  return jakartaTime;
}
