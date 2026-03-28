import { X, FileText, Download, Printer, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

export function DocumentViewModal({ document, onClose }) {
  const { isDarkMode } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className={`w-full max-w-4xl rounded-lg shadow-xl max-h-[90vh] overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              title="Back to Documents"
            >
              <ArrowLeft className="size-5" />
            </button>
            <FileText className="size-5 text-[#1a4d4d]" />
            <div>
              <h2 className="text-lg">{document.name}</h2>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {document.type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Download className="size-4 mr-1" />
              Download
            </Button>
            <Button size="sm" variant="outline">
              <Printer className="size-4 mr-1" />
              Print
            </Button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Document Preview */}
        <div className={`flex-1 p-6 overflow-auto ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className={`max-w-3xl mx-auto rounded-lg p-8 ${
            isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            {/* Document Preview Placeholder */}
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl mb-2">{document.name}</h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Document Preview
                </p>
              </div>
              
              <div className={`aspect-[8.5/11] rounded border-2 border-dashed flex items-center justify-center ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'
              }`}>
                <div className="text-center">
                  <FileText className="size-16 mx-auto mb-4 text-gray-400" />
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Document Preview
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {document.type} • {document.size}
                  </p>
                </div>
              </div>

              {/* Document Info */}
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
              }`}>
                <h4 className="font-semibold mb-2">Document Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Upload Date:
                    </span>{' '}
                    {new Date(document.uploadDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      File Size:
                    </span>{' '}
                    {document.size}
                  </div>
                  <div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Status:
                    </span>{' '}
                    <span className="capitalize">{document.status}</span>
                  </div>
                  <div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Document Type:
                    </span>{' '}
                    {document.type}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/* Purpose: Yeh file selected document ko preview, download aur print karne ke liye detailed view modal provide karti hai.
Type: Yeh web-based application ke liye hai (React frontend), mobile ke liye directly nahi.


 */