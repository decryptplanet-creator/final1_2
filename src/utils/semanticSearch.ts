// Semantic search utility for Skillora platform
// Searches across partial names, skills, locations, trust scores

export interface SearchableEntity {
  id: string;
  name: string;
  type?: 'client' | 'manufacturer' | 'labour';
  skills?: string[];
  location?: string | { lat: number; lng: number; address: string };
  trustScore?: number;
  rating?: number;
  verified?: boolean;
  specialty?: string;
}

/**
 * Semantic search function that matches based on:
 * - Partial name matching
 * - Skill type matching
 * - Location matching
 * - Trust score range matching
 */
export function semanticSearch<T extends SearchableEntity>(
  query: string,
  entities: T[],
  filters?: {
    verified?: boolean;
    topRated?: boolean;
    nearby?: boolean;
    minTrustScore?: number;
  }
): T[] {
  if (!query && !filters) return entities;

  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  
  let results = entities.filter(entity => {
    // If no search query, skip text matching
    if (!query) return true;

    const entityName = entity.name.toLowerCase();
    const entitySkills = (entity.skills || []).map(s => s.toLowerCase());
    const entityLocation = typeof entity.location === 'string' 
      ? entity.location.toLowerCase() 
      : entity.location?.address?.toLowerCase() || '';
    const entitySpecialty = entity.specialty?.toLowerCase() || '';
    const entityTrustScore = entity.trustScore?.toString() || '';

    // Check if any search term matches
    return searchTerms.some(term => {
      // Partial name match
      if (entityName.includes(term)) return true;
      
      // Skill match
      if (entitySkills.some(skill => skill.includes(term))) return true;
      
      // Location match
      if (entityLocation.includes(term)) return true;
      
      // Specialty match
      if (entitySpecialty.includes(term)) return true;
      
      // Trust score match (if searching for numbers)
      if (!isNaN(Number(term)) && entityTrustScore.includes(term)) return true;
      
      return false;
    });
  });

  // Apply filters
  if (filters?.verified) {
    results = results.filter(e => e.verified === true);
  }

  if (filters?.topRated) {
    results = results.filter(e => (e.rating || 0) >= 4.5);
  }

  if (filters?.nearby) {
    // Mock nearby filter - in production, this would use actual geolocation
    results = results.filter(e => {
      const location = typeof e.location === 'string' ? e.location : e.location?.address || '';
      return location.toLowerCase().includes('lahore') || 
             location.toLowerCase().includes('karachi') || 
             location.toLowerCase().includes('islamabad');
    });
  }

  if (filters?.minTrustScore !== undefined) {
    results = results.filter(e => (e.trustScore || 0) >= filters.minTrustScore!);
  }

  // Sort by relevance (verified first, then by trust score/rating)
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
export function filterByType<T extends SearchableEntity>(
  entities: T[],
  type: 'client' | 'manufacturer' | 'labour'
): T[] {
  return entities.filter(e => e.type === type);
}
