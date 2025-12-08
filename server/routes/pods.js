const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const getPodFiles = require('../lib/getPodFiles');
const loadPodFile = require('../lib/loadPodFile');
const sortPodsByName = require('../lib/sortPodsByName');

const PODS_DIR = path.join(__dirname, '..', '..', 'pods');

/**
 * GET /api/pods/:version
 * Get all pods for a specific version
 */
router.get('/:version', async (req, res) => {
  try {
    const { version } = req.params;
    const podsPath = path.join(PODS_DIR, version);
    
    // Check if version directory exists
    try {
      await fs.access(podsPath);
    } catch (error) {
      return res.status(404).json({ error: `Version ${version} not found` });
    }
    
    // Get all JSON files in the version directory
    const podFiles = await getPodFiles(podsPath);
    
    if (podFiles.length === 0) {
      return res.json([]);
    }
    
    // Load all pod files
    const pods = [];
    for (const file of podFiles) {
      const filePath = path.join(podsPath, file);
      const pod = await loadPodFile(filePath);
      if (pod) {
        pods.push(pod);
      }
    }
    
    // Sort pods alphabetically by name
    const sortedPods = sortPodsByName(pods);
    
    res.json(sortedPods);
  } catch (error) {
    console.error('Error loading pods:', error);
    res.status(500).json({ error: 'Failed to load pods' });
  }
});

module.exports = router;

