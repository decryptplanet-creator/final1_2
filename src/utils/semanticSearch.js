// Semantic search utility for Skillora platform
// Searches across partial names, skills, locations, trust scores

/**
 * Semantic search function that matches based on:
 * - Partial name matching
 * - Skill type matching
 * - Location matching
 * - Trust score range matching
 */
export function semanticSearch(query, entities, filters) {
  if (!query && !filters) return entities;

  const searchTerms = query.toLowerCase().trim().split(/\s+/);

  let results = entities.filter((entity) => {
    if (!query) return true;

    const entityName = entity.name.toLowerCase();
    const entitySkills = (entity.skills || []).map((s) => s.toLowerCase());
    const entityLocation =
      typeof entity.location === 'string'
        ? entity.location.toLowerCase()
        : entity.location?.address?.toLowerCase() || '';
    const entitySpecialty = entity.specialty?.toLowerCase() || '';
    const entityTrustScore = entity.trustScore?.toString() || '';

    return searchTerms.some((term) => {
      if (entityName.includes(term)) return true;
      if (entitySkills.some((skill) => skill.includes(term))) return true;
      if (entityLocation.includes(term)) return true;
      if (entitySpecialty.includes(term)) return true;
      if (!isNaN(Number(term)) && entityTrustScore.includes(term)) return true;
      return false;
    });
  });

  if (filters?.verified) {
    results = results.filter((e) => e.verified === true);
  }

  if (filters?.topRated) {
    results = results.filter((e) => (e.rating || 0) >= 4.5);
  }

  if (filters?.nearby) {
    results = results.filter((e) => {
      const location =
        typeof e.location === 'string' ? e.location : e.location?.address || '';
      return (
        location.toLowerCase().includes('lahore') ||
        location.toLowerCase().includes('karachi') ||
        location.toLowerCase().includes('islamabad')
      );
    });
  }

  if (filters?.minTrustScore !== undefined) {
    results = results.filter((e) => (e.trustScore || 0) >= filters.minTrustScore);
  }

  results.sort((a, b) => {
    if (a.verified !== b.verified) return a.verified ? -1 : 1;
    if (a.trustScore !== b.trustScore) return (b.trustScore || 0) - (a.trustScore || 0);
    return (b.rating || 0) - (a.rating || 0);
  });

  return results;
}

/**
 * Filter entities by type to avoid mixed irrelevant data
 */
export function filterByType(entities, type) {
  return entities.filter((e) => e.type === type);
}
