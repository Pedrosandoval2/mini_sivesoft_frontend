export const formatNumberWithZero = (number) => {
    if(!number) return '0000';
    return number.toString().padStart(4, '0');
}