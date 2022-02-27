const fs = require('fs')
const { copyFile } = require('fs/promises')

/**
 * Performs a copy from source to destination if destination does not exist.
 */
module.exports = async function copyWithoutOverwrite (source, destination) {
  try {
    await copyFile(
      source,
      destination,
      fs.constants.COPYFILE_EXCL,
    )
  }
  catch (error) {
    if (error.code !== 'EEXIST') throw error
  }
}
