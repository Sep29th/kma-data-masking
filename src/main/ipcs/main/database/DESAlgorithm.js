import KeyGenerator from './KeyGenerator'
import AllData from './AllData'
class DESAlgorithm {
  constructor(key_word) {
    this.left = new Array(32)
    this.right = new Array(32)
    this.func_out = new Array(32)
    this.result = new Array(32)
    this.roundKey = new Array(48)
    this.SBox_Out = new Array(32)
    this.key = new KeyGenerator(key_word)
  }

  hexToBinary(hexString) {
    // Xác định kích thước của mảng
    var length = hexString.length * 4
    var binaryArray = new Array(length)

    // Chuyển từng ký tự hex thành chuỗi nhị phân
    var index = 0
    for (var i = 0; i < hexString.length; i++) {
      var binary = parseInt(hexString.charAt(i), 16).toString(2)
      // Đảm bảo rằng mỗi ký tự hex đều được biểu diễn bởi 4 bits
      while (binary.length < 4) {
        binary = '0' + binary
      }
      // Thêm từng số 0 hoặc 1 vào mảng dưới dạng số nguyên
      for (var j = 0; j < binary.length; j++) {
        binaryArray[index++] = parseInt(binary.charAt(j))
      }
    }
    return binaryArray
  }

  binaryArrayToHex(binaryArray) {
    // Ensure the length of the binary array is a multiple of 4
    var padding = binaryArray.length % 4
    if (padding != 0) {
      var paddedArray = new Array(binaryArray.length + (4 - padding))
      paddedArray.fill(0, 0, 4 - padding)
      paddedArray.set(binaryArray, 4 - padding)
      binaryArray = paddedArray
    }

    // Initialize string to store the resulting hexadecimal string
    var hexString = ''

    // Convert binary array to hexadecimal
    for (var i = 0; i < binaryArray.length; i += 4) {
      var decimal =
        8 * binaryArray[i] + 4 * binaryArray[i + 1] + 2 * binaryArray[i + 2] + binaryArray[i + 3]
      hexString += decimal.toString(16).toUpperCase()
    }

    return hexString
  }

  encrypt(plain_text) {
    return this.binaryArrayToHex(this.encrypt_decrypt(1, plain_text))
  }

  decrypt(cipher_text) {
    return this.binToString(this.encrypt_decrypt(2, cipher_text))
  }

  encrypt_decrypt(mode, text) {
    const input_block = this.getBinaryForTextBlock(text)
    const initial_perm_out = this.getIntialPermuted(input_block)
    this.doSegmentation(initial_perm_out)

    let round = 1
    while (round <= 16) {
      this.performOneRound(mode, round)
      round++
    }

    this.swap32()
    const final_perm_in = this.getConcatenated()
    const output_block = this.getFinalPermuted(final_perm_in)
    return output_block
  }

  getBinaryForTextBlock(plain_text) {
    const block = new Array(8).fill(null).map(() => new Array(8))
    const binary_text = new Array(64).fill(0)
    for (let i = 0; i < 8 && i < plain_text.length; i++) {
      block[i] = this.getBinaryBits(plain_text.charCodeAt(i))
    }

    let index = 0
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        binary_text[index] = block[i][j]
        index++
      }
    }
    return binary_text
  }

  getBinaryBits(ch) {
    const bin = new Array(8)
    for (let i = 0; i < 8; i++) {
      bin[7 - i] = (ch >> i) & 1
    }
    return bin
  }

  performOneRound(mode, round) {
    if (mode === 1) {
      this.roundKey = this.key.getRoundKeyForEncryption(round)
    } else if (mode === 2) {
      this.roundKey = this.key.getRoundKeyForDecryption(round)
    }

    this.func_out = this.doDESFunction(this.right, this.roundKey)
    this.result = this.getXOR_32Bit(this.left, this.func_out)

    for (let i = 0; i < 32; i++) {
      this.left[i] = this.right[i]
      this.right[i] = this.result[i]
    }
  }

  getIntialPermuted(perm_in) {
    const perm_out = new Array(64)
    const store_num = AllData.getInitialPermutationTable()
    let temp = 0
    let i = 0
    let loop = 0
    let check = 0
    while (perm_in.length !== check) {
      temp = store_num[i]
      if (temp === loop) {
        perm_out[check] = perm_in[loop - 1]
        loop = 0
        check++
        i++
      }
      loop++
    }
    return perm_out
  }

  doSegmentation(perm_out) {
    let index = 0
    for (let i = 0; i < 32; i++) {
      this.left[i] = perm_out[i]
    }

    for (let i = 32; i < 64; i++) {
      this.right[index] = perm_out[i]
      index++
    }
  }

  doDESFunction(right_in, roundKey) {
    const right_out = this.doExpansion(right_in)
    const sbox_in = this.getXOR_48Bit(right_out, roundKey)
    this.doSubstitution(sbox_in)
    return this.doPermutation(this.SBox_Out)
  }

  doExpansion(right_in) {
    const store_num = AllData.getExpansionTable()
    const right_out = new Array(48)
    let temp = 0
    let i = 0
    let loop = 0
    let check = 0

    while (check !== 48) {
      temp = store_num[i]
      if (temp === loop) {
        right_out[check] = right_in[loop - 1]
        loop = 0
        check++
        i++
      }
      loop++
    }
    return right_out
  }

  getXOR_48Bit(side1, side2) {
    const result = new Array(48)
    for (let i = 0; i < side1.length; i++) {
      result[i] = side1[i] === side2[i] ? 0 : 1
    }
    return result
  }

  doSubstitution(XOR_Out) {
    let count = 0
    let choice = 0
    let index = 0
    while (count !== 48) {
      const temp = XOR_Out.slice(count, count + 6)
      const num = this.getOutputFromSBox(choice, this.getSBoxRow(temp), this.getSBoxColumn(temp))
      this.make32bit(choice, num)
      index++
      choice++
      count += 6
    }
    this.Reverse(this.SBox_Out)
  }

  doPermutation(SBox_out) {
    const func_out = new Array(32)
    const store_num = AllData.getStraightPermutationTable()
    let temp = 0
    let i = 0
    let loop = 0
    let check = 0
    while (check !== 32) {
      temp = store_num[i]
      if (temp === loop) {
        func_out[check] = SBox_out[loop - 1]
        loop = 0
        check++
        i++
      }
      loop++
    }
    return func_out
  }

  getSBoxRow(num) {
    return 2 * num[0] + num[5]
  }

  getSBoxColumn(num) {
    return 8 * num[1] + 4 * num[2] + 2 * num[3] + num[4]
  }

  getOutputFromSBox(choice, row, col) {
    let num = 0
    switch (choice) {
      case 0:
        num = AllData.SBOX1[row][col]
        break
      case 1:
        num = AllData.SBOX2[row][col]
        break
      case 2:
        num = AllData.SBOX3[row][col]
        break
      case 3:
        num = AllData.SBOX4[row][col]
        break
      case 4:
        num = AllData.SBOX5[row][col]
        break
      case 5:
        num = AllData.SBOX6[row][col]
        break
      case 6:
        num = AllData.SBOX7[row][col]
        break
      case 7:
        num = AllData.SBOX8[row][col]
        break
    }
    return num
  }

  make32bit(index, num) {
    let num1 = num
    for (let i = 0; i < 4; i++) {
      const num2 = num1 % 2
      const num3 = Math.floor(num1 / 2)
      num1 = num3
      this.SBox_Out[index * 4 + i] = num2
    }
  }

  Reverse(num) {
    let count = 0
    let fix = 3
    while (count !== 32) {
      for (let i = 0; i < 2; i++) {
        const temp1 = num[count + i]
        num[count + i] = num[fix - (count + i)]
        num[fix - (count + i)] = temp1
      }
      fix += 8
      count += 4
    }
  }

  getXOR_32Bit(side1, side2) {
    const result = new Array(32)
    for (let i = 0; i < side1.length; i++) {
      result[i] = side1[i] === side2[i] ? 0 : 1
    }
    return result
  }

  swap32() {
    for (let i = 0; i < 32; i++) {
      const temp = this.left[i]
      this.left[i] = this.right[i]
      this.right[i] = temp
    }
  }

  getConcatenated() {
    const result = new Array(64)
    let index = 32
    for (let i = 0; i < 32; i++) {
      result[i] = this.left[i]
    }

    for (let i = 0; i < 32; i++) {
      result[index] = this.right[i]
      index++
    }
    return result
  }

  getFinalPermuted(perm_in) {
    const perm_out = new Array(64)
    const store_num = AllData.getFinalPermutationTable()
    let temp = 0
    let i = 0
    let loop = 0
    let check = 0

    while (perm_in.length !== check) {
      temp = store_num[i]
      if (temp === loop) {
        perm_out[check] = perm_in[loop - 1]
        loop = 0
        check++
        i++
      }
      loop++
    }
    return perm_out
  }

  binToString(array) {
    let sb = ''
    let output = ''

    let index = 0

    for (let j = 0; j < array.length; j = j + 4) {
      let byteArray = new Array(4).fill(0)
      for (let i = 0; i <= 3; i++) {
        byteArray[i] = array[index + i]
      }
      index = index + 4

      let decimal = byteArray[0] * 8 + byteArray[1] * 4 + byteArray[2] * 2 + byteArray[3] * 1
      sb += decimal.toString(16)
    }

    let hex = sb.toString()

    for (let i = 0; i < hex.length; i += 2) {
      let str = hex.substring(i, i + 2)
      output += String.fromCharCode(parseInt(str, 16))
    }
    return output
  }
}

export default DESAlgorithm
