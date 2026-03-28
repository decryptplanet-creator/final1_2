import { useState, useEffect } from 'react';
import { X, Search, MapPin, Star, Shield, Filter, Users, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/labelstatus';
import { Card } from './ui/card';
import { semanticSearch } from '../utils/semanticSearch';
import { mockManufacturers, mockLabour, mockClients } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

export function EnhancedSearchModal({ 
  onClose, 
  searchType, 
  onProfileClick,
  onContactClick 
}) {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    verified: false,
    topRated: false,
    nearby: false,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  // Get data based on search type
  const getAllData = () => {
    switch (searchType) {
      case 'manufacturer': return mockManufacturers;
      case 'labour': return mockLabour;
      case 'client': return mockClients;
      default: return [];
    }
  };

  // AI Recommendation Engine
  const getAIRecommendations = (query, results) => {
    if (!query || results.length === 0) return [];
    
    // AI logic: Recommend based on trust score and quality history
    const topResults = results
      .filter(r => r.verified && r.trustScore && r.trustScore >= 85)
      .sort((a, b) => (b.trustScore || 0) - (a.trustScore || 0))
      .slice(0, 3)
      .map(r => r.id);
    
    return topResults;
  };

  // Perform semantic search
  useEffect(() => {
    const allData = getAllData();
    const results = semanticSearch(searchQuery, allData, {
      verified: activeFilters.verified || undefined,
      topRated: activeFilters.topRated || undefined,
      nearby: activeFilters.nearby || undefined,
    });
    setSearchResults(results);
    
    // Get AI recommendations
    const recommendations = getAIRecommendations(searchQuery, results);
    setAiRecommendations(recommendations);
  }, [searchQuery, activeFilters, searchType]);

  const toggleFilter = (filter) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const getTypeLabel = () => {
    switch (searchType) {
      case 'manufacturer': return 'Manufacturers';
      case 'labour': return 'Labour';
      case 'client': return 'Clients';
      default: return 'Users';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
        {/* Header */}
        <div className="bg-[#138f8a] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
              <Search className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Search {getTypeLabel()}</h2>
              <p className="text-sm text-white/90">Find by name, skills, location, or trust score</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              placeholder={`Search ${getTypeLabel().toLowerCase()} by name, skills, location...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilters.verified ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleFilter('verified')}
              className={activeFilters.verified ? 'bg-[#138f8a] hover:bg-[#0d7973]' : ''}
            >
              <Shield className="size-4 mr-2" />
              Verified Only
            </Button>
            <Button
              variant={activeFilters.topRated ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleFilter('topRated')}
              className={activeFilters.topRated ? 'bg-[#138f8a] hover:bg-[#0d7973]' : ''}
            >
              <Star className="size-4 mr-2" />
              Top Rated (4.5+)
            </Button>
            <Button
              variant={activeFilters.nearby ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleFilter('nearby')}
              className={activeFilters.nearby ? 'bg-[#138f8a] hover:bg-[#0d7973]' : ''}
            >
              <MapPin className="size-4 mr-2" />
              Nearby
            </Button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            <Users className="size-4 inline mr-1" />
            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Search className="size-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No results found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {/* AI Recommendation Banner */}
              {aiRecommendations.length > 0 && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 mb-2"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="size-5 text-[#2563EB]" />
                    <h4 className="font-medium text-[#2563EB]">AI Recommended</h4>
                    <Badge className="bg-[#2563EB] text-xs">Based on Trust Score & Quality</Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    These profiles match your search and have exceptional trust scores and quality history
                  </p>
                </motion.div>
              )}

              {searchResults.map((result) => {
                const isAIRecommended = aiRecommendations.includes(result.id);
                
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    {/* AI Recommendation Glow Effect */}
                    {isAIRecommended && (
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur-sm"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                    
                    <Card className={`relative p-4 hover:shadow-md transition-shadow ${
                      isAIRecommended ? 'border-2 border-[#2563EB] bg-blue-50/50' : ''
                    }`}>
                      {/* AI Recommended Badge */}
                      {isAIRecommended && (
                        <div className="absolute top-2 right-2">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                          >
                            <Badge className="bg-[#2563EB] text-white flex items-center gap-1 shadow-lg">
                              <Sparkles className="size-3" />
                              AI Recommended
                            </Badge>
                          </motion.div>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        {/* Profile Image */}
                        <div className="relative">
                          {result.profileImage ? (
                            <img
                              src={result.profileImage}
                              alt={result.name}
                              className="size-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`size-16 rounded-full ${
                              isAIRecommended 
                                ? 'bg-gradient-to-br from-[#2563EB] to-[#1d4ed8]'
                                : 'bg-gradient-to-br from-[#138f8a] to-[#0d7973]'
                            } flex items-center justify-center text-white text-xl font-medium`}>
                              {result.name.charAt(0)}
                            </div>
                          )}
                          {result.verified && (
                            <div className="absolute -bottom-1 -right-1 size-6 bg-[#2563EB] rounded-full flex items-center justify-center border-2 border-white">
                              <Shield className="size-3 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h3 className="font-medium text-gray-900">{result.name}</h3>
                              <p className="text-sm text-gray-600">{result.specialty || 'Skilled Professional'}</p>
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                              isAIRecommended ? 'bg-[#2563EB]/10' : 'bg-[#138f8a]/10'
                            }`}>
                              <Star className={`size-3 ${
                                isAIRecommended 
                                  ? 'text-[#2563EB] fill-[#2563EB]'
                                  : 'text-[#138f8a] fill-[#138f8a]'
                              }`} />
                              <span className={`text-xs font-medium ${
                                isAIRecommended ? 'text-[#2563EB]' : 'text-[#138f8a]'
                              }`}>
                                {result.trustScore || 0}
                              </span>
                            </div>
                          </div>

                          {/* Trust Score Indicator for AI Recommended */}
                          {isAIRecommended && result.trustScore && (
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="size-3 text-[#2563EB]" />
                              <span className="text-xs text-[#2563EB] font-medium">
                                High Trust Score • Verified Quality History
                              </span>
                            </div>
                          )}

                          {/* Skills */}
                          {result.skills && result.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {result.skills.slice(0, 3).map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Location & Rating */}
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              <span className="text-xs">
                                {typeof result.location === 'string' 
                                  ? result.location 
                                  : result.location?.address?.split(',')[0] || 'Location'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="size-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{result.rating} ({result.totalReviews} reviews)</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onProfileClick(result)}
                              className="flex-1"
                            >
                              View Profile
                            </Button>
                            {onContactClick && (
                              <Button
                                size="sm"
                                onClick={() => onContactClick(result)}
                                className={`flex-1 ${
                                  isAIRecommended 
                                    ? 'bg-[#2563EB] hover:bg-[#1d4ed8]'
                                    : 'bg-[#138f8a] hover:bg-[#0d7973]'
                                }`}
                              >
                                Contact
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
/*This file provides an AI-powered search system to find manufacturers, labour, or clients using filters, semantic search, and trust-based recommendations.
It is web-based (React UI) but can be used for both web and mobile apps (hybrid) if integrated. */