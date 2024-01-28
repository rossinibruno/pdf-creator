const cnpj = require('@fnando/cnpj/dist/node')

const isValid = value => cnpj.isValid(value)
const strip = value => cnpj.strip(value)
const format = value => cnpj.format(value)
const generate = value => cnpj.generate(value)

module.exports = {
  isValid,
  strip,
  format,
  generate,
}
