export function numberToWordsPtBr(value: number): string {
  const units = [
    '',
    'um',
    'dois',
    'três',
    'quatro',
    'cinco',
    'seis',
    'sete',
    'oito',
    'nove',
    'dez',
    'onze',
    'doze',
    'treze',
    'quatorze',
    'quinze',
    'dezesseis',
    'dezessete',
    'dezoito',
    'dezenove',
  ]
  const tens = [
    '',
    '',
    'vinte',
    'trinta',
    'quarenta',
    'cinquenta',
    'sessenta',
    'setenta',
    'oitenta',
    'noventa',
  ]
  const hundreds = [
    '',
    'cento',
    'duzentos',
    'trezentos',
    'quatrocentos',
    'quinhentos',
    'seiscentos',
    'setecentos',
    'oitocentos',
    'novecentos',
  ]

  function toWords(n: number): string {
    if (n === 100) return 'cem'
    if (n < 20) return units[n]
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? ` e ${units[n % 10]}` : '')
    if (n < 1000)
      return (
        hundreds[Math.floor(n / 100)] +
        (n % 100 ? ` e ${toWords(n % 100)}` : '')
      )
    return ''
  }

  const reais = Math.floor(value)
  const centavos = Math.round((value - reais) * 100)

  let result = ''

  if (reais === 0) {
    result = 'zero real'
  } else if (reais === 1) {
    result = 'um real'
  } else {
    result = `${toWords(reais)} reais`
  }

  if (centavos > 0) {
    result += ` e ${toWords(centavos)} centavos`
  }

  return result
}
