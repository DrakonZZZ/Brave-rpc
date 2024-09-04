function logBoxedObject(obj) {
  let maxKeyLength = 0
  let maxValueLength = 0
  for (let key in obj) {
    maxKeyLength = Math.max(maxKeyLength, key.length)
    maxValueLength = Math.max(maxValueLength, obj[key].toString().length)
  }

  console.log('╔' + '═'.repeat(maxKeyLength + maxValueLength + 8) + '╗')
  console.log('║        RPC data        ║')
  console.log('╟' + '─'.repeat(maxKeyLength + maxValueLength + 6) + '╢')
  for (let key in obj) {
    const paddedKey = key.padEnd(maxKeyLength)
    const paddedValue = obj[key].toString().padEnd(maxValueLength)
    console.log('║ ' + paddedKey + ': ' + paddedValue + ' ║')
  }
  console.log('╚' + '═'.repeat(maxKeyLength + maxValueLength + 6) + '╝')
}

const truncateString = (str, maxLength) => {
  return str.length > maxLength ? str.slice(0, maxLength) : str
}

export { logBoxedObject, truncateString }
