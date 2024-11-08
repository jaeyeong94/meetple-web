export const formatNumber = (num: number): string => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// export const validateDate = (date: string): boolean => {
//   const regex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
//   if (!regex.test(date)) {
//     return false;
//   }
//
//   const [year, month, day] = date.split('.').map(Number);
//   const checkDate = new Date(year, month - 1, day);
//
//   return (
//     checkDate.getFullYear() === year &&
//     checkDate.getMonth() === month - 1 &&
//     checkDate.getDate() === day
//   );
// }

export const validateDate = (date: string): boolean => {
  const regex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
  return regex.test(date)
}

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const regex = /^\d{3}-\d{3,4}-\d{4}$/
  return regex.test(phoneNumber);
}

export const calculateAge = (birthDateString: string) => {
  const birthDate = new Date(birthDateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // 생일이 지나지 않았으면 나이를 1살 줄임
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}
