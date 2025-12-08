/**
 * Sort pods alphabetically by name
 * @param {Object[]} pods - Array of pod objects
 * @returns {Object[]} Sorted array of pods
 */
function sortPodsByName(pods) {
  return pods.sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });
}

module.exports = sortPodsByName;

