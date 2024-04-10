export var handleDB = { connect: null, config: null }

export const maskTypeGateway = (option, value) => {
  switch (option) {
    case 'email':
      return emailMask(value)
    case 'phone':
      return phoneNumberMask(value)
    case 'random':
      return randomString()
    default:
      return '•••••••••••'
  }
}

const emailMask = (email) => {
  email = email.trimEnd()
  let [localPart, domain] = email.split('@')
  let maskedLocalPart = localPart[0] + '•'.repeat(localPart.length - 1)
  let maskedDomain = '•'.repeat(domain.length - 1) + domain[domain.length - 1]
  return maskedLocalPart + '@' + maskedDomain
}

const phoneNumberMask = (phone) => {
  phone = phone.trimEnd()
  let firstThree = phone.slice(0, 3)
  let lastTwo = phone.slice(-2)
  let masked = phone.slice(3, -2).replace(/\d/g, '•')
  return firstThree + masked + lastTwo
}

const randomString = () => {
  let result = ''
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
