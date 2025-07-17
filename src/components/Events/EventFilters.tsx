import React from 'react';
import { Search, Filter } from 'lucide-react';

interface EventFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  categories: string[];
  locations: string[];
}

const EventFilters: React.FC<EventFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
  categories,
  locations
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center mb-6">
        <Filter className="h-5 w-5 text-gray-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Filter Events</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* Location Filter */}
        <div>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;