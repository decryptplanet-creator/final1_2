import { X, Filter, MapPin, Star, Shield, DollarSign, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/labelstatus';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import { Slider } from './ui/slider';

export function FilterModal({ onClose, onApplyFilters, type }) {
  const { isDarkMode } = useTheme();
  const [selectedFilters, setSelectedFilters] = useState({
    verifiedOnly: false,
    minRating: 0,
    maxRate: 1000,
    location: [],
    skills: [],
    trustScore: 0,
  });

  const locations = ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Multan', 'Sialkot', 'Gujranwala'];
  
  const manufacturerSpecializations = [
    'Textile Manufacturing',
    'Leather Goods',
    'Furniture Making',
    'Garment Production',
    'Metal Works',
    'Wood Products',
  ];

  const labourSkills = [
    'Stitching',
    'Cutting',
    'Welding',
    'Carpentry',
    'Electrician',
    'Plumbing',
    'Painting',
    'Finishing',
  ];

  const skills = type === 'manufacturer' ? manufacturerSpecializations : labourSkills;

  const toggleLocation = (loc) => {
    setSelectedFilters(prev => ({
      ...prev,
      location: prev.location.includes(loc)
        ? prev.location.filter(l => l !== loc)
        : [...prev.location, loc]
    }));
  };

  const toggleSkill = (skill) => {
    setSelectedFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleApply = () => {
    onApplyFilters(selectedFilters);
    onClose();
  };

  const handleReset = () => {
    setSelectedFilters({
      verifiedOnly: false,
      minRating: 0,
      maxRate: 1000,
      location: [],
      skills: [],
      trustScore: 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-lg shadow-xl max-h-[90vh] overflow-hidden ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <Filter className="size-6 text-[#a78bfa]" />
            <div>
              <h2 className="text-xl font-semibold">Advanced Filters</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Refine your search results
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* Verified Only Toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.verifiedOnly}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                className="size-5 rounded border-gray-700 text-[#a78bfa] focus:ring-[#a78bfa]"
              />
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-[#2563EB]" />
                <span className="font-medium">Show Verified Only</span>
              </div>
            </label>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="flex items-center gap-2 mb-3">
              <Star className="size-5 text-yellow-400" />
              <span className="font-medium">Minimum Rating: {selectedFilters.minRating.toFixed(1)}</span>
            </label>
            <Slider
              value={[selectedFilters.minRating]}
              onValueChange={(values) => setSelectedFilters(prev => ({ ...prev, minRating: values[0] }))}
              max={5}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>2.5</span>
              <span>5</span>
            </div>
          </div>

          {/* Max Rate Filter (for Labour) */}
          {type === 'labour' && (
            <div>
              <label className="flex items-center gap-2 mb-3">
                <DollarSign className="size-5 text-[#2563EB]" />
                <span className="font-medium">Max Hourly Rate: PKR {selectedFilters.maxRate}</span>
              </label>
              <Slider
                value={[selectedFilters.maxRate]}
                onValueChange={(values) => setSelectedFilters(prev => ({ ...prev, maxRate: values[0] }))}
                max={2000}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>PKR 0</span>
                <span>PKR 1000</span>
                <span>PKR 2000</span>
              </div>
            </div>
          )}

          {/* Trust Score Filter */}
          <div>
            <label className="flex items-center gap-2 mb-3">
              <Award className="size-5 text-[#a78bfa]" />
              <span className="font-medium">Minimum Trust Score: {selectedFilters.trustScore}%</span>
            </label>
            <Slider
              value={[selectedFilters.trustScore]}
              onValueChange={(values) => setSelectedFilters(prev => ({ ...prev, trustScore: values[0] }))}
              max={100}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="flex items-center gap-2 mb-3">
              <MapPin className="size-5 text-red-500" />
              <span className="font-medium">Location</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <Badge
                  key={loc}
                  onClick={() => toggleLocation(loc)}
                  className={`cursor-pointer transition-all ${
                    selectedFilters.location.includes(loc)
                      ? 'bg-[#a78bfa] text-white border-[#a78bfa]'
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                  variant="outline"
                >
                  {loc}
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills/Specialization Filter */}
          <div>
            <label className="flex items-center gap-2 mb-3">
              <Award className="size-5 text-blue-500" />
              <span className="font-medium">{type === 'manufacturer' ? 'Specialization' : 'Skills'}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`cursor-pointer transition-all ${
                    selectedFilters.skills.includes(skill)
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                  variant="outline"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t flex gap-3 ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1"
          >
            Reset All
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-[#a78bfa] hover:bg-[#9333ea]"
          >
            <Filter className="size-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
/*Purpose: This file creates an advanced filter modal to refine manufacturer or labour search results based on rating, location, skills, and trust score.

Type: It is a frontend component, so it can be used for both web apps and hybrid (mobile/web) apps. */