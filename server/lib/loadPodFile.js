const fs = require('fs').promises;

/**
 * Load a pod JSON file
 * @param {string} filePath - Full path to the pod JSON file
 * @returns {Promise<Object|null>} Parsed pod data or null if error
 */
async function loadPodFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn(`Could not load ${filePath}:`, error.message);
    return null;
  }
}

module.exports = loadPodFile;

