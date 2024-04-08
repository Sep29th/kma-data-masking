import DESAlgorithm from './DESAlgorithm'
class DESImplementation {
  static des
  static textFromFile

  static doPadding(input_text) {
    if (input_text.length % 8 !== 0) {
      const paddingLength = 8 - (input_text.length % 8)
      for (let i = 0; i < paddingLength; i++) {
        input_text = input_text.concat(' ')
      }
    }
    return input_text
  }

  static doECB(plain_text) {
    let start = 0,
      end = 8
    const noOfBlock = Math.floor(plain_text.length / 8)
    const text_array = new Array(noOfBlock)
    let temp

    for (let i = 0; i < noOfBlock; i++) {
      temp = plain_text.substring(start, end)
      text_array[i] = temp
      start = end
      end = end + 8
    }
    return text_array
  }

  static des_encrypt(plain_text, key) {
    this.des = new DESAlgorithm(key)

    const plain_text_array = this.doECB(this.doPadding(plain_text))
    let cipher_text = ''

    for (let i = 0; i < plain_text_array.length; i++) {
      const cipher_block = this.des.encrypt(plain_text_array[i])
      cipher_text += cipher_block
    }
    return cipher_text
  }

  static des_decrypt(cipher_text, key) {
    this.des = new DESAlgorithm(key)
    cipher_text = this.des.binToString(this.des.hexToBinary(cipher_text))

    const cipher_text_array = this.doECB(this.doPadding(cipher_text))
    let gen_plain_text = ''

    for (let i = 0; i < cipher_text_array.length; i++) {
      const plain_block = this.des.decrypt(cipher_text_array[i])
      gen_plain_text += plain_block
    }
    return gen_plain_text
  }
}

export default DESImplementation
