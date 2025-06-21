export const cpfMask = (value: string) => {
  const numbers = value.replace(/\D/g, '')

  if (!numbers) return ''

  return numbers
    .slice(0, 11) // limita a 11 dígitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export const phoneMask = (value: string) => {
  const numbers = value.replace(/\D/g, '')

  if (!numbers) return ''

  if (numbers.length <= 10) {
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  return numbers
    .slice(0, 11) // limita a 11 dígitos
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}
