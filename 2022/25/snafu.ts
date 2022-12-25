const SnafuDigit = {
  '=': BigInt(-2),
  '-': BigInt(-1),
  '0': BigInt(0),
  '1': BigInt(1),
  '2': BigInt(2),
  'Base': BigInt(5)
} as const

type SnafuDigit = keyof typeof SnafuDigit

export type SnafuStr = string

export function snafuToBigInt(snafu: SnafuStr): bigint {

  return convert(snafu.split('') as Array<SnafuDigit>)

  function convert(a: Array<SnafuDigit>): bigint {
    let value = SnafuDigit[a.pop()]
    if (a.length > 0)
      value += convert(a) * SnafuDigit.Base
    return value
  }
}

//4
// 5
//6

export function numberToSnafu(d: bigint): SnafuStr {
  // Get close, by converting to base 5
  return convert(d.toString(5).split(''))

  function convert(a: Array<string>, carry = 0): SnafuStr {
    let digit = (parseInt(a.pop()) + carry).toString()
    let overflow = 0
    if (digit == '3') {
      digit = '='
      overflow += 1
    }
    if (digit == '4') {
      digit = '-'
      overflow += 1
    }
    if (digit == '5') {
      digit = '0'
      overflow += 1
    }
    if (digit == '6') {
      digit = '1'
      overflow += 1
    }
    const rest =
      a.length > 0 ? convert(a, overflow) : (overflow > 0 ? overflow.toString() : '')
    return rest + digit
  }
}
