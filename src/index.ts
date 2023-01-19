type T1 = {
  a: 'A'
}
type T2 = {
  b: 'B'
}
type T = T1 & T2

interface I {
  a: 'A'
}
interface I {
  b: 'B'
}

const t1: T = { a: 'A', b: 'B' }
const t2: I = t1