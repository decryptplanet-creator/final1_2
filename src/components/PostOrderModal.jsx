import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { X, Upload } from 'lucide-react';

export function PostOrderModal({ onClose, onSubmit }) {
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    budget: '',
    deadline: '',
    category: '',
    specifications: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: parseInt(formData.quantity),
      budget: parseInt(formData.budget),
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1F2933]">Post New Order</CardTitle>
              <CardDescription className="text-gray-500">Fill in the details for your manufacturing order</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-[#1F2933] hover:bg-gray-100">
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-[#1F2933]">Order Title</Label>
              <Input 
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Cotton T-Shirts Manufacturing"
                className="bg-white border-gray-300 text-[#1F2933]"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-[#1F2933]">Category</Label>
              <Input 
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Textiles, Leather, Furniture"
                className="bg-white border-gray-300 text-[#1F2933]"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-[#1F2933]">Description</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide detailed description of what you need..."
                rows={4}
                className="bg-white border-gray-300 text-[#1F2933]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity" className="text-[#1F2933]">Quantity</Label>
                <Input 
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="Number of units"
                  className="bg-white border-gray-300 text-[#1F2933]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="budget" className="text-[#1F2933]">Budget (PKR)</Label>
                <Input 
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="Total budget"
                  className="bg-white border-gray-300 text-[#1F2933]"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="deadline" className="text-[#1F2933]">Deadline</Label>
              <Input 
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="bg-white border-gray-300 text-[#1F2933]"
                required
              />
            </div>

            <div>
              <Label htmlFor="specifications" className="text-[#1F2933]">Specifications</Label>
              <Textarea 
                id="specifications"
                value={formData.specifications}
                onChange={(e) => handleInputChange('specification', e.target.value)}
                placeholder="Any specific requirements or standards..."
                rows={3}
                className="bg-white border-gray-300 text-[#1F2933]"
              />
            </div>

            {/* File Upload */}
            <div>
              <Label className="text-[#1F2933]">Attachments (Optional)</Label>
              <div className="mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files) {
                      setUploadedFiles(Array.from(e.target.files));
                    }
                  }}
                  className="hidden"
                  multiple
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-dashed border-2 border-gray-300 text-[#1F2933] hover:bg-gray-50"
                >
                  <Upload className="size-4 mr-2" />
                  Upload Files
                </Button>
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="text-sm text-gray-500">{file.name}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-300 text-[#1F2933] hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
              >
                Post Order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
/* New order create karne ka modal (user order details fill karke submit karta hai).

Yeh web-based React component hai, lekin same functionality mobile app me bhi implement ho sakti hai (dono ke liye adaptable).





 */