import { X, Briefcase, Clock, MapPin, DollarSign, Calendar, User, CheckCircle, Star, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/labelstatus';
import { useTheme } from '../contexts/ThemeContext';

export function JobDetailModal({ job, onClose, userType = 'active' }) {
  const { isDarkMode } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className={`w-full max-w-2xl rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              title="Back to Jobs"
            >
              <ArrowLeft className="size-5" />
            </button>
            <Briefcase className="size-6 text-green-500" />
            <div>
              <h2 className="text-xl">{job.orderTitle}</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Job Details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge className={
              job.status === 'completed' 
                ? 'bg-green-600/20 text-green-400 border-green-600/30' 
                : 'bg-[#138f8a]/20 text-[#138f8a] border-[#138f8a]/30'
            }>
              {job.status === 'completed' ? <CheckCircle className="size-3 mr-1" /> : <Clock className="size-3 mr-1" />}
              {job.status === 'completed' ? 'Completed' : 'In Progress'}
            </Badge>
            <div className="text-right">
              <div className="text-green-500 text-xl">PKR {job.rate}</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>per hour</div>
            </div>
          </div>

          {/* Manufacturer Info */}
          <div className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white">
                {job.manufacturerName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {job.manufacturerName}
                  </h3>
                  <CheckCircle className="size-4 text-green-500" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    4.8 • Verified Manufacturer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-4 text-gray-400" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Duration
                </span>
              </div>
              <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {job.duration}
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="size-4 text-gray-400" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Location
                </span>
              </div>
              <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                On-site Work
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4 text-gray-400" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Start Date
                </span>
              </div>
              <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                Jan 15, 2026
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="size-4 text-gray-400" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Payment Status
                </span>
              </div>
              <div className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {job.status === 'completed' ? 'Paid' : 'In Escrow'}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Job Description
            </h3>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Work on {job.orderTitle} project. Requires expertise in manufacturing processes 
              and quality control. All materials will be provided on-site. Expected to complete 
              within the given timeline with high quality standards.
            </p>
          </div>

          {/* Requirements */}
          <div className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Requirements
            </h3>
            <ul className={`list-disc list-inside space-y-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <li>Experienced in manufacturing work</li>
              <li>Able to work on-site</li>
              <li>Good attention to detail</li>
              <li>Team collaboration skills</li>
            </ul>
          </div>

          {/* Completed Job Rating */}
          {job.status === 'completed' && (
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-green-950/30 border-green-900' : 'bg-green-50 border-green-200'
            }`}>
              <h3 className="font-semibold text-green-500 mb-2">Job Completed</h3>
              <div className="flex items-center gap-2">
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  5.0 Rating from Manufacturer
                </span>
              </div>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                "Excellent work quality and completed on time. Highly recommended!"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            {job.status !== 'completed' && (
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                Mark as Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
/*Purpose: Job detail modal UI that shows complete information of a selected job including status, manufacturer, payment, and requirements.
Type: Web-based (React component), usable in both web and mobile apps if adapted.





 */