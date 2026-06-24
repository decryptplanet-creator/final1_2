import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, MapPin, Navigation, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Badge } from './ui/badge';

const SIALKOT_BOUNDS = { north: 32.6, south: 32.4, east: 74.65, west: 74.4 };

function isWithinSialkot(lat, lng) {
  return lat >= SIALKOT_BOUNDS.south && lat <= SIALKOT_BOUNDS.north &&
    lng >= SIALKOT_BOUNDS.west && lng <= SIALKOT_BOUNDS.east;
}

export function LocationModal({ onClose, userName, onSelect, userCity }) {
  const { isDarkMode } = useTheme();
  const [address, setAddress] = useState(userCity || '');
  const [gpsStatus, setGpsStatus] = useState('idle'); // 'idle' | 'loading' | 'verified' | 'failed' | 'outside'
  const [coords, setCoords] = useState(null);

  const handleVerifyGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('failed');
      return;
    }
    setGpsStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCoords({ lat, lng });

        // 1. Sialkot bounds check
        if (!isWithinSialkot(lat, lng)) {
          setGpsStatus('outside');
          return;
        }

        // 2. Reverse geocode — check ke GPS actually Sialkot ka hai
        try {
          const geo = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          ).then(r => r.json());

          const city = (geo.address?.city || geo.address?.town || geo.address?.county || '').toLowerCase();
          if (!city.includes('sialkot')) {
            setGpsStatus('address_mismatch');
            return;
          }
        } catch {
          // Agar geocode fail ho toh bounds check kaafi hai
        }

        // 3. Duplicate location check
        const AUTH_API = import.meta.env.VITE_API_URL || 'http://localhost:5003';
        try {
          const res = await fetch(`${AUTH_API}/api/auth/check-location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude: lat, longitude: lng }),
          }).then(r => r.json());

          if (res.isDuplicate) {
            setGpsStatus('duplicate');
            return;
          }
        } catch {
          // Backend check fail ho toh proceed
        }

        setGpsStatus('verified');
      },
      () => setGpsStatus('failed'),
      { timeout: 10000 }
    );
  };

  const handleConfirm = () => {
    if (onSelect && coords) {
      onSelect({ lat: coords.lat, lng: coords.lng, address: address || `Sialkot, Punjab, Pakistan` });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className={`max-w-lg w-full my-auto ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-[#2563EB]" />
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                Verify Your Location
              </CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}
              className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div>
            <label className={`text-sm font-medium block mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Your Address (Sialkot area)
            </label>
            <Input
              value={address}
              onChange={(e) => { setAddress(e.target.value); setGpsStatus('idle'); setCoords(null); }}
              placeholder="e.g. Ugoki Road, Sialkot"
              className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
            />
          </div>

          {/* Map preview when verified */}
          {coords && (
            <div className="rounded-lg overflow-hidden h-48 border border-gray-200">
              <iframe
                title="Location Map"
                width="100%" height="100%"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=14&output=embed`}
              />
            </div>
          )}

          {/* GPS Status messages */}
          {gpsStatus === 'verified' && (
            <div className={`p-3 rounded-lg border-2 ${isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-5 text-green-600" />
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>GPS Verified — Within Sialkot</span>
                </div>
                <Badge className="bg-green-600 text-white border-green-600">Verified</Badge>
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
              </p>
            </div>
          )}

          {gpsStatus === 'outside' && (
            <div className={`p-3 rounded-lg border-2 ${isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2">
                <AlertCircle className="size-5 text-red-600" />
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>Outside Sialkot Boundaries</p>
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                Your GPS location is not within Sialkot. Skillora is only available for Sialkot.
              </p>
            </div>
          )}

          {gpsStatus === 'address_mismatch' && (
            <div className={`p-3 rounded-lg border-2 ${isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2">
                <AlertCircle className="size-5 text-red-600" />
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>Address Mismatch</p>
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                Aapka GPS location Sialkot confirm nahi kar raha. Apni actual factory location par ja kar verify karain.
              </p>
            </div>
          )}

          {gpsStatus === 'duplicate' && (
            <div className={`p-3 rounded-lg border-2 ${isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2">
                <AlertCircle className="size-5 text-red-600" />
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>Location Already Registered</p>
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                Is location par pehle se koi user registered hai. Ek hi jagah se do accounts nahi ban sakte.
              </p>
            </div>
          )}

          {gpsStatus === 'failed' && (
            <div className={`p-3 rounded-lg border-2 ${isDarkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex items-center gap-2">
                <AlertCircle className="size-5 text-yellow-600" />
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>GPS Access Denied</p>
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                Please allow location access in your browser and try again.
              </p>
            </div>
          )}

          <div className="space-y-2 pt-2">
            {gpsStatus !== 'verified' && (
              <Button
                onClick={handleVerifyGPS}
                disabled={gpsStatus === 'loading' || !address.trim()}
                className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white disabled:opacity-50"
              >
                {gpsStatus === 'loading'
                  ? <><Loader2 className="size-4 mr-2 animate-spin" />Verifying GPS...</>
                  : <><Navigation className="size-4 mr-2" />{['outside','address_mismatch','duplicate','failed'].includes(gpsStatus) ? 'Try Again' : 'Verify My GPS Location'}</>}
              </Button>
            )}

            {onSelect && (
              <Button
                onClick={handleConfirm}
                disabled={gpsStatus !== 'verified'}
                className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="size-4 mr-2" />
                Confirm Location
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
