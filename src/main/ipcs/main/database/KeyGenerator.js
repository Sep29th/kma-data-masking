import AllData from './AllData'

class KeyGenerator {
  constructor(keyWord) {
    this.leftKey = new Array(28)
    this.rightKey = new Array(28)
    this.key64 = new Array(64)
    this.key56 = new Array(56)
    this.allRoundKey = new Array(16).fill(null).map(() => new Array(48))

    this.key64 = this.getEncryptedKeyword(keyWord)
    this.key56 = this.getPermutedByPC1(this.key64)
    this.doKeySegmentation(this.key56)

    for (let round = 1; round <= 16; round++) {
      this.allRoundKey[round - 1] = this.getRoundKey(round)
    }
  }

  getRoundKeyForEncryption(roundNumber) {
    return this.allRoundKey[roundNumber - 1]
  }

  getRoundKeyForDecryption(roundNumber) {
    return this.allRoundKey[16 - roundNumber]
  }

  getRoundKey(roundNumber) {
    let roundKey = new Array(48)
    this.doLeftShift(roundNumber)
    roundKey = this.getPermutedByPC2(this.combineLeftRight())
    return roundKey
  }

  getEncryptedKeyword(keyWord) {
    const block = new Array(8).fill(null).map(() => new Array(8))
    let encryptKey = new Array(64).fill(0)
    for (let i = 0; i < 8 && i < keyWord.length; i++) {
      block[i] = this.getBinaryBits(keyWord.charCodeAt(i))
    }

    let index = 0
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        encryptKey[index] = block[i][j]
        index++
      }
    }
    return encryptKey
  }

  getBinaryBits(ch) {
    const bin = new Array(8).fill(0)
    for (let i = 0; i < 8; i++) {
      bin[7 - i] = (ch >> i) & 1
    }
    return bin
  }

  doKeySegmentation(key56) {
    let index = 0
    for (let i = 0; i < 28; i++) {
      this.leftKey[i] = key56[i]
    }

    for (let i = 28; i < 56; i++) {
      this.rightKey[index] = key56[i]
      index++
    }
  }

  doLeftShift(round) {
    const leftShiftNumber = AllData.numOfLeftRotation[round - 1]
    if (leftShiftNumber === 1) {
      this.doOneLeftShift(this.leftKey, this.rightKey)
    } else {
      this.doOneLeftShift(this.leftKey, this.rightKey)
      this.doOneLeftShift(this.leftKey, this.rightKey)
    }
  }

  doOneLeftShift(side1, side2) {
    let temp = side1[0]
    for (let i = 1; i < side1.length; i++) {
      side1[i - 1] = side1[i]
    }
    side1[side1.length - 1] = temp

    temp = side2[0]
    for (let i = 1; i < side2.length; i++) {
      side2[i - 1] = side2[i]
    }
    side2[side2.length - 1] = temp
  }

  combineLeftRight() {
    const key56 = new Array(56)
    let index = 28

    for (let i = 0; i < 28; i++) {
      key56[i] = this.leftKey[i]
    }

    for (let i = 0; i < 28; i++) {
      key56[index] = this.rightKey[i]
      index++
    }

    return key56
  }

  getPermutedByPC1(key_in) {
    const store_num = AllData.getPermutedChoice1Table()
    const key_out = new Array(56).fill(0)
    let temp = 0
    let i = 0
    let loop = 0
    let check = 0

    while (check !== 56) {
      temp = store_num[i]
      if (temp === loop) {
        key_out[check] = key_in[loop - 1]
        loop = 0
        check++
        i++
      }
      loop++
    }
    return key_out
  }

  getPermutedByPC2(key_in) {
    const store_num = AllData.getPermutedChoice2Table()
    const key_out = new Array(48).fill(0)
    let temp = 0
    let i = 0
    let loop = 0
    let check = 0

    while (check !== 48) {
      temp = store_num[i]
      if (temp === loop) {
        key_out[check] = key_in[loop - 1]
        loop = 0
        check++
        i++
      }
      loop++
    }
    return key_out
  }
}

export default KeyGenerator
