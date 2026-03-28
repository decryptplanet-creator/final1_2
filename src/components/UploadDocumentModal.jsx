import { X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

export function UploadDocumentModal({ onClose, onUploadComplete }) {
  const { isDarkMode } = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !documentType) return;

    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      
      setTimeout(() => {
        onUploadComplete?.();
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className={`w-full max-w-lg rounded-lg shadow-xl ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <Upload className="size-6 text-[#10b981]" />
            <h2 className="text-xl">Upload New Document</h2>
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

        {/* Body */}
        <div className="p-6 space-y-4">
          {uploadSuccess ? (
            <div className="py-12 text-center">
              <div className="size-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="size-8 text-green-500" />
              </div>
              <h3 className="text-xl mb-2">Document Uploaded Successfully!</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Your document has been uploaded and is being verified.
              </p>
            </div>
          ) : (
            <>
              {/* Document Type */}
              <div>
                <label className={`block text-sm mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Document Type *
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select document type</option>
                  <option value="cnic">CNIC Copy</option>
                  <option value="license">Trade License</option>
                  <option value="tax">Tax Certificate</option>
                  <option value="bank">Bank Statement</option>
                  <option value="utility">Utility Bill</option>
                  <option value="certificate">Skill Certificate</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className={`block text-sm mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Select File *
                </label>
                <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDarkMode 
                    ? 'border-gray-700 bg-gray-800' 
                    : 'border-gray-300 bg-gray-50'
                }`}>
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer"
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="size-8 text-[#10b981]" />
                        <div className="text-left">
                          <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload className="size-12 mx-auto mb-3 text-gray-400" />
                        <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PDF, JPG, PNG (Max 10MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Info Alert */}
              <div className={`p-4 rounded-lg border flex gap-3 ${
                isDarkMode 
                  ? 'bg-blue-500/10 border-blue-500/30' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <AlertCircle className="size-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>
                    Your document will be reviewed within 24-48 hours. You'll receive a notification once verified.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!uploadSuccess && (
          <div className={`p-4 border-t flex gap-3 ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !documentType || uploading}
              className="flex-1 bg-[#10b981] hover:bg-[#059669]"
            >
              {uploading ? (
                'Uploading...'
              ) : (
                <>
                  <Upload className="size-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
/* This file is used to upload user documents (CNIC, license, certificates, etc.) with file selection, status handling, and success feedback.

It is web-based (React UI component) but can also work for both web & app (if integrated into mobile frontend).*/