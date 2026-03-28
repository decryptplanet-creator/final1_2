import { X, FileText, Download, Eye, CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import { UploadDocumentModal } from './UploadDocumentModal';

const dummyDocuments = [
  {
    id: 'doc1',
    name: 'CNIC Copy',
    type: 'Identity Verification',
    uploadDate: '2025-01-10',
    status: 'verified',
    size: '2.4 MB'
  },
  {
    id: 'doc2',
    name: 'Trade License',
    type: 'Business License',
    uploadDate: '2025-01-12',
    status: 'verified',
    size: '1.8 MB'
  },
  {
    id: 'doc3',
    name: 'Tax Certificate',
    type: 'Tax Document',
    uploadDate: '2025-01-15',
    status: 'pending',
    size: '3.1 MB'
  },
  {
    id: 'doc4',
    name: 'Bank Statement',
    type: 'Financial Document',
    uploadDate: '2025-01-08',
    status: 'rejected',
    size: '4.2 MB'
  }
];

export function DocumentListModal({ onClose, onViewDocument }) {
  const { isDarkMode } = useTheme();
  const [downloadingDoc, setDownloadingDoc] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleDownload = (doc) => {
    setDownloadingDoc(doc.id);
    
    // Simulate download process
    setTimeout(() => {
      // Create a dummy file download
      const blob = new Blob([`Document: ${doc.name}\nType: ${doc.type}\nSize: ${doc.size}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setDownloadingDoc(null);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/30">
            <CheckCircle className="size-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
            <Clock className="size-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-600/20 text-red-400 border-red-600/30">
            <XCircle className="size-3 mr-1" />
            Rejected
          </Badge>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className={`w-full max-w-3xl rounded-lg shadow-xl max-h-[90vh] overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              title="Back to Settings"
            >
              <ArrowLeft className="size-5" />
            </button>
            <FileText className="size-6 text-[#1a4d4d]" />
            <div>
              <h2 className="text-xl">My Documents</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage your uploaded documents
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

        {/* Documents List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            {dummyDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`size-12 rounded-lg flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-700' : 'bg-white'
                    }`}>
                      <FileText className="size-6 text-[#1a4d4d]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                          {doc.name}
                        </h3>
                        {getStatusBadge(doc.status)}
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {doc.type}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                        <span>Size: {doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDocument(doc)}
                      className={isDarkMode ? 'border-gray-700' : 'border-gray-300'}
                    >
                      <Eye className="size-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(doc)}
                      disabled={downloadingDoc === doc.id}
                      className={isDarkMode ? 'border-gray-700' : 'border-gray-300'}
                    >
                      <Download className={`size-4 mr-1 ${downloadingDoc === doc.id ? 'animate-bounce' : ''}`} />
                      {downloadingDoc === doc.id ? 'Downloading...' : 'Download'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
            <Button
              className="flex-1 bg-[#1a4d4d] hover:bg-[#1e5252]"
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload New Document
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <UploadDocumentModal
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}
    </div>
  );
}


/* Purpose: Yeh file user ke uploaded documents ko list, view aur download manage karne ke liye modal UI provide karti hai.
Type: Yeh web-based application ke liye hai (React frontend), mobile ke liye directly nahi. */