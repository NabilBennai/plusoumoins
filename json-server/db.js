const fs = require('fs')
const path = require('path')

module.exports = () => {
  const dataDir = path.join(__dirname, 'data')
  return fs.readdirSync(dataDir)
    .filter(f => f.endsWith('.json'))
    .reduce((acc, file) => {
      acc[path.basename(file, '.json')] = JSON.parse(
        fs.readFileSync(path.join(dataDir, file), 'utf8')
      )
      return acc
    }, {})
}
