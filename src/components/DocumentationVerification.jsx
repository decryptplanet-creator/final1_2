import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, FileText, CheckCircle, Download, Eye } from 'lucide-react';

export function DocumentationModal({ onClose, userType, userName }) {
  const [selectedDoc, setSelectedDoc] = useState(null);

  const documents = userType === 'client' ? [
    {
      id: '1',
      name: 'Export License',
      type: 'PDF',
      uploadDate: 'Dec 15, 2024',
      status: 'approved',
      url: '#'
    },
    {
      id: '2',
      name: 'Business Registration Certificate',
      type: 'PDF',
      uploadDate: 'Dec 15, 2024',
      status: 'approved',
      url: '#'
    },
    {
      id: '3',
      name: 'CNIC Copy',
      type: 'Image',
      uploadDate: 'Dec 15, 2024',
      status: 'approved',
      url: '#'
    },
    {
      id: '4',
      name: 'Tax Registration (NTN)',
      type: 'PDF',
      uploadDate: 'Dec 15, 2024',
      status: 'approved',
      url: '#'
    }
  ] : userType === 'manufacturer' ? [
    {
      id: '1',
      name: 'Manufacturing License',
      type: 'PDF',
      uploadDate: 'Dec 10, 2024',
      status: 'approved',
      url: '#'
    },
    {
      id: '2',
      name: 'Business Registration',
      type: 'PDF',
      uploadDate: 'Dec 10, 2024',
      status: 'approved',
      url: '#'
    },
    {
      id: '3',
      name: 'Affidavit & PPC Compliance',
      type: 'PDF',
      uploadDate: 'Dec 10, 2024',
      status: 'approved',
      url: '#'
    },
    {
      id: '4',
      name: 'CNIC Copy',
      type: 'Image',
      uploadDate: 'Dec 10, 2024',
      status: 'approved',
      url: '#'
    },
    {
      id: '5',
      name: 'Facility Photos',
      type: 'Images',
      uploadDate: 'Dec 10, 2024',
      status: 'approved',
      url: '#'
    }
  ] : [
    {
      id: '1',
      name: 'CNIC Copy',
      type: 'Image',
      uploadDate: 'Dec 5, 2024',
      status: 'approved',
      url: '#'
    },
    {
      id: '2',
      name: 'Welding Skills - Photo',
      type: 'Image',
      uploadDate: 'Dec 5, 2024',
      status: 'approved',
      url: '#'
    },
    {
      id: '3',
      name: 'Welding Skills - Video',
      type: 'Video',
      uploadDate: 'Dec 5, 2024',
      status: 'approved',
      url: '#'
    },
    {
      id: '4',
      name: 'Fabrication Work Sample',
      type: 'Image',
      uploadDate: 'Dec 5, 2024',
      status: 'approved',
      url: '#'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-[#2563EB]/20 text-[#2563EB] border-[#2563EB]/30">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600/20 text-red-400 border-red-600/30">Rejected</Badge>;
      default:
        return null;
    }
  };

  const viewDocument = (doc) => {
    setSelectedDoc(doc);
    // In a real app, this would open the actual document
    alert(`Opening ${doc.name}...\n\nIn production, this would display the actual document.`);
  };

  const downloadDocument = (doc) => {
    // In a real app, this would download the actual document
    alert(`Downloading ${doc.name}...\n\nIn production, this would download the actual file.`);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-4xl w-full my-8 bg-gray-900 border-gray-800">
        <CardHeader className="border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-red-600" />
              <div>
                <CardTitle className="text-white">Documents & Verification</CardTitle>
                <p className="text-sm text-gray-400 mt-1">{userName}'s uploaded documents</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Verification Status */}
          <div className="bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="size-5 text-[#2563EB]" />
              <div>
                <p className="text-[#2563EB] font-semibold">Fully Verified</p>
                <p className="text-sm text-gray-400">All documents have been verified and approved</p>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold mb-3">Uploaded Documents</h3>
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-red-600/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="size-12 rounded bg-gray-700 flex items-center justify-center">
                      <FileText className="size-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">{doc.name}</span>
                        {getStatusBadge(doc.status)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewDocument(doc)}
                      className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      <Eye className="size-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => downloadDocument(doc)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Download className="size-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Verification Timeline */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-white font-semibold mb-4">Verification Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="size-2 rounded-full bg-[#2563EB] mt-2" />
                <div>
                  <p className="text-white">Documents Approved</p>
                  <p className="text-sm text-gray-400">All documents verified successfully</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {userType === 'client' ? 'Dec 15, 2024' : userType === 'manufacturer' ? 'Dec 10, 2024' : 'Dec 5, 2024'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="size-2 rounded-full bg-[#2563EB] mt-2" />
                <div>
                  <p className="text-white">Selfie Verification Passed</p>
                  <p className="text-sm text-gray-400">Facial recognition matched with CNIC</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {userType === 'client' ? 'Dec 15, 2024' : userType === 'manufacturer' ? 'Dec 10, 2024' : 'Dec 5, 2024'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="size-2 rounded-full bg-[#2563EB] mt-2" />
                <div>
                  <p className="text-white">Documents Submitted</p>
                  <p className="text-sm text-gray-400">Initial documents uploaded for review</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {userType === 'client' ? 'Dec 15, 2024' : userType === 'manufacturer' ? 'Dec 10, 2024' : 'Dec 5, 2024'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
/* Purpose: This file shows a user documents & verification modal where uploaded files can be viewed, downloaded, and checked with status.

Type: It is mainly for web-based apps (React UI) but can also be used in hybrid/mobile apps (so usable for both). */