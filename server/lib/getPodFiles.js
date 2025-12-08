const fs = require('fs').promises;

/**
 * Get all JSON files in a directory
 * @param {string} versionPath - Path to the version directory
 * @returns {Promise<string[]>} Array of JSON file names
 */
async function getPodFiles(versionPath) {
  try {
    const entries = await fs.readdir(versionPath, { withFileTypes: true });
    return entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
      .map(entry => entry.name)
      .sort();
  } catch (error) {
    console.error(`Error reading directory ${versionPath}:`, error);
    return [];
  }
}

module.exports = getPodFiles;

