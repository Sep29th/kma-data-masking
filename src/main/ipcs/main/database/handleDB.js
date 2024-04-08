export var handleDB = { connect: null, config: null }

export const maskTypeGateway = (option, value) => {
  switch (option) {
    case 'email':
      return emailMask(value)
    default:
      return 'masked'
  }
}

export const emailMask = (email) => {
  let [localPart, domain] = email.split('@')
  let maskedLocalPart = localPart[0] + '•'.repeat(localPart.length - 1)
  let maskedDomain = '•'.repeat(domain.length - 1) + domain[domain.length - 1]
  return maskedLocalPart + '@' + maskedDomain
}
