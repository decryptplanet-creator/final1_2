import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/labelstatus';
import { X, HardHat, Star, MapPin, Award } from 'lucide-react';
import { Input } from './ui/input';
import { useState } from 'react';

export function HireLabourModal({ onClose }) {
  const [searchQuery, setSearchQuery] = useState('');

  const labourProfiles = [
    {
      id: '1',
      name: 'Ahmed Khan',
      rating: 4.9,
      reviews: 67,
      skills: ['Stitching', 'Pattern Making', 'Quality Control'],
      location: 'Lahore',
      rate: 650,
      verified: true,
      availability: 'available',
      completedJobs: 45,
    },
    {
      id: '2',
      name: 'Muhammad Ali',
      rating: 4.7,
      reviews: 45,
      skills: ['Cutting', 'Measuring', 'Fabric Handling'],
      location: 'Faisalabad',
      rate: 600,
      verified: true,
      availability: 'available',
      completedJobs: 38,
    },
    {
      id: '3',
      name: 'Hassan Raza',
      rating: 4.8,
      reviews: 52,
      skills: ['Welding', 'Metal Work', 'Fabrication'],
      location: 'Gujranwala',
      rate: 700,
      verified: true,
      availability: 'busy',
      completedJobs: 41,
    },
    {
      id: '4',
      name: 'Bilal Ahmed',
      rating: 4.6,
      reviews: 34,
      skills: ['Carpentry', 'Wood Working', 'Finishing'],
      location: 'Karachi',
      rate: 620,
      verified: true,
      availability: 'available',
      completedJobs: 29,
    },
  ];

  const filteredLabour = labourProfiles.filter(labour =>
    labour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    labour.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Hire Labour</CardTitle>
              <CardDescription>Find and hire skilled labour for your projects</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
          <Input
            placeholder="Search by name or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {filteredLabour.map(labour => (
              <Card key={labour.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="size-12 rounded-full bg-[#2563EB]/20 flex items-center justify-center">
                        <HardHat className="size-6 text-[#2563EB]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg">{labour.name}</h3>
                          {labour.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <Award className="size-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge variant={labour.availability === 'available' ? 'default' : 'outline'}>
                            {labour.availability}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                            <span>{labour.rating}</span>
                            <span className="text-gray-400">({labour.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            <span>{labour.location}</span>
                          </div>
                          <span>{labour.completedJobs} jobs completed</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {labour.skills.map(skill => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl text-[#2563EB]">PKR {labour.rate}</div>
                      <div className="text-sm text-gray-500">per hour</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">View Profile</Button>
                    <Button 
                      className="flex-1"
                      disabled={labour.availability === 'busy'}
                    >
                      {labour.availability === 'available' ? 'Hire Now' : 'Not Available'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredLabour.length === 0 && (
              <div className="text-center py-12">
                <HardHat className="size-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No labour found matching your search</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
/*Purpose: This file creates a modal to search, view, and hire labour profiles with details like skills, rating, and availability.

Type: It is a frontend component, so it can be used for both web apps and hybrid (mobile/web) apps. */