export const formatNumberWithZero = (number) => {
    return number ? number.toString().padStart(4, '0') : null
}