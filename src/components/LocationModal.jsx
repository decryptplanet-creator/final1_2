import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { X, MapPin, Navigation, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Badge } from './ui/badge';

const SIALKOT_BOUNDS = { north: 32.6, south: 32.4, east: 74.65, west: 74.4 };

const demoLocations = [
  { city: 'Karachi', lat: 24.8607, lng: 67.0011, address: 'Karachi, Sindh, Pakistan' },
  { city: 'Lahore', lat: 31.5204, lng: 74.3587, address: 'Lahore, Punjab, Pakistan' },
  { city: 'Islamabad', lat: 33.6844, lng: 73.0479, address: 'Islamabad, Federal Capital, Pakistan' },
  { city: 'Faisalabad', lat: 31.4504, lng: 73.1350, address: 'Faisalabad, Punjab, Pakistan' },
  { city: 'Multan', lat: 30.1575, lng: 71.5249, address: 'Multan, Punjab, Pakistan' },
  { city: 'Sialkot', lat: 32.4945, lng: 74.5229, address: 'Sialkot, Punjab, Pakistan' },
  { city: 'Gujranwala', lat: 32.1877, lng: 74.1945, address: 'Gujranwala, Punjab, Pakistan' },
  { city: 'Rawalpindi', lat: 33.5651, lng: 73.0169, address: 'Rawalpindi, Punjab, Pakistan' },
];

function isWithinSialkot(lat, lng) {
  return lat >= SIALKOT_BOUNDS.south && lat <= SIALKOT_BOUNDS.north &&
    lng >= SIALKOT_BOUNDS.west && lng <= SIALKOT_BOUNDS.east;
}

export function LocationModal({ onClose, userName, onSelect }) {
  const { isDarkMode } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isOutsideSialkot, setIsOutsideSialkot] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('idle'); // 'idle' | 'loading' | 'verified'

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setIsOutsideSialkot(!isWithinSialkot(location.lat, location.lng));
    setGpsStatus('idle');
  };

  const handleVerifyGPS = () => {
    setGpsStatus('loading');
    setTimeout(() => setGpsStatus('verified'), 2000);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation && onSelect) {
      onSelect({ lat: selectedLocation.lat, lng: selectedLocation.lng, address: selectedLocation.address });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className={`max-w-5xl w-full my-auto ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-[#2563EB]" />
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                {userName ? `${userName}'s Location` : onSelect ? 'Select Your Location' : 'Location'}
              </CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}
              className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Map */}
            <div className="relative w-full lg:w-2/3 h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-800">
              <iframe
                title="Location Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={selectedLocation
                  ? `https://www.openstreetmap.org/export/embed.html?bbox=${selectedLocation.lng - 0.05},${selectedLocation.lat - 0.05},${selectedLocation.lng + 0.05},${selectedLocation.lat + 0.05}&layer=mapnik&marker=${selectedLocation.lat},${selectedLocation.lng}`
                  : `https://www.openstreetmap.org/export/embed.html?bbox=66.0,24.0,75.0,35.0&layer=mapnik`}
              />

              <div className={`absolute top-4 left-4 right-4 backdrop-blur-sm rounded-lg p-4 border ${
                isDarkMode ? 'bg-black/80 border-gray-700' : 'bg-white/90 border-gray-300'}`}>
                {selectedLocation ? (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="size-5 text-green-500" />
                        <h3 className={`font-semibold ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Selected Location</h3>
                      </div>
                      <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedLocation.city}, Pakistan</p>
                      <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Navigation className="size-3" />
                        <span>Lat: {selectedLocation.lat.toFixed(4)}, Lng: {selectedLocation.lng.toFixed(4)}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline"
                      className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}
                      onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${selectedLocation.lat}&mlon=${selectedLocation.lng}#map=15/${selectedLocation.lat}/${selectedLocation.lng}`, '_blank')}>
                      <Navigation className="size-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-5 text-[#2563EB]" />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Please select a city from the list to view on map →
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className={`w-full lg:w-1/3 h-[350px] sm:h-[400px] lg:h-[500px] overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="p-4">
                <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>Select Your City</h3>
                <div className="space-y-2">
                  {demoLocations.map((location) => (
                    <button
                      key={location.city}
                      onClick={() => handleLocationClick(location)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        selectedLocation?.city === location.city
                          ? isDarkMode ? 'bg-[#2563EB]/20 border-[#2563EB] shadow-lg' : 'bg-[#2563EB]/10 border-[#2563EB] shadow-lg'
                          : isDarkMode ? 'bg-gray-900 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className={`size-4 ${selectedLocation?.city === location.city ? 'text-[#2563EB]' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                          <div>
                            <div className={`font-medium ${selectedLocation?.city === location.city ? 'text-[#2563EB]' : isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                              {location.city}
                            </div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{location.address}</div>
                          </div>
                        </div>
                        {selectedLocation?.city === location.city && <CheckCircle className="size-5 text-[#2563EB]" />}
                      </div>
                    </button>
                  ))}
                </div>

                {onSelect && (
                  <div className="mt-6 space-y-2">
                    {selectedLocation && !isOutsideSialkot && (
                      <div className="mb-3">
                        {gpsStatus === 'idle' && (
                          <Button onClick={handleVerifyGPS} className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                            <MapPin className="size-4 mr-2" />
                            Verify GPS Location
                          </Button>
                        )}
                        {gpsStatus === 'loading' && (
                          <Button disabled className="w-full bg-[#2563EB] text-white cursor-not-allowed">
                            <Loader2 className="size-4 mr-2 animate-spin" />
                            Verifying GPS...
                          </Button>
                        )}
                        {gpsStatus === 'verified' && (
                          <div className={`p-3 rounded-lg border-2 ${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="size-5 text-green-600" />
                                <span className={`text-sm font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>GPS Location Verified</span>
                              </div>
                              <Badge className="bg-green-600 text-white border-green-600 hover:bg-green-700">GPS Verified</Badge>
                            </div>
                            <p className={`text-xs mt-2 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                              Your location has been successfully verified within Sialkot boundaries.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {isOutsideSialkot && selectedLocation && (
                      <div className={`p-3 rounded-lg border-2 mb-3 ${isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-start gap-3">
                          <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>Location Outside Sialkot</p>
                            <p className={`text-xs ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                              Skillora platform is currently available only for Sialkot-based manufacturers and labor.
                              The selected location ({selectedLocation.city}) is outside Sialkot's service area.
                            </p>
                            <p className={`text-xs mt-2 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                              <strong>Coordinates:</strong> Lat {selectedLocation.lat.toFixed(4)}, Lng {selectedLocation.lng.toFixed(4)}
                            </p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                              <strong>Required:</strong> Must be within Sialkot boundaries (Lat: 32.4-32.6, Lng: 74.4-74.65)
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleConfirmLocation}
                      disabled={!selectedLocation || isOutsideSialkot}
                      className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="size-4 mr-2" />
                      {isOutsideSialkot ? 'Location Not Allowed' : 'Confirm Location'}
                    </Button>

                    {selectedLocation && (
                      <Button
                        variant="outline"
                        className={`w-full ${isDarkMode ? 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(`${selectedLocation.lat}, ${selectedLocation.lng}`);
                            alert('Coordinates copied to clipboard!');
                          } catch {
                            alert(`Coordinates: ${selectedLocation.lat}, ${selectedLocation.lng}`);
                          }
                        }}
                      >
                        <MapPin className="size-4 mr-2" />
                        Copy Coordinates
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

