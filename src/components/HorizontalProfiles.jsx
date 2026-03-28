import { Star, CheckCircle, MessageSquare } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function HorizontalProfiles({ userType, onProfileClick, onChatClick, onViewAllClick }) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const scrollContainerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-scroll animation (Tamasha style)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isHovering) return;

    let scrollInterval;
    let direction = 1; // 1 for right, -1 for left

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!container) return;

        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;

        // Change direction when reaching edges
        if (currentScroll >= maxScroll) {
          direction = -1;
        } else if (currentScroll <= 0) {
          direction = 1;
        }

        // Smooth scroll
        container.scrollBy({
          left: direction * 2,
          behavior: 'smooth'
        });
      }, 50);
    };

    startAutoScroll();

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [isHovering]);

  // Mock data based on user type with real images
  const getProfiles = () => {
    if (userType === 'client') {
      return [
        { 
          id: '1', 
          name: 'ABC Textiles', 
          type: 'manufacturer', 
          rating: 4.8, 
          verified: true, 
          specialty: 'Cotton Products',
          avatar: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Leading textile manufacturer with 15+ years experience',
          experience: '15 years',
          completedJobs: 234
        },
        { 
          id: '2', 
          name: 'Premium Stitching Co.', 
          type: 'manufacturer', 
          rating: 4.9, 
          verified: true, 
          specialty: 'Garment Stitching',
          avatar: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Expert stitching and garment manufacturing',
          experience: '12 years',
          completedJobs: 189
        },
        { 
          id: '3', 
          name: 'Fashion House', 
          type: 'manufacturer', 
          rating: 4.7, 
          verified: true, 
          specialty: 'Designer Wear',
          avatar: 'https://images.unsplash.com/photo-1558769132-cb1aea9c01c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Premium fashion manufacturing with modern facilities',
          experience: '10 years',
          completedJobs: 156
        },
        { 
          id: '4', 
          name: 'Ali Ahmed', 
          type: 'labour', 
          rating: 4.6, 
          verified: true, 
          specialty: 'Cutting Master',
          avatar: 'https://images.unsplash.com/photo-1630272777562-17735957d8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Expert fabric cutting and pattern making',
          experience: '8 years',
          completedJobs: 342
        },
        { 
          id: '5', 
          name: 'Quality Fabrics Ltd', 
          type: 'manufacturer', 
          rating: 4.8, 
          verified: true, 
          specialty: 'Fabric Warehouse',
          avatar: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Large fabric warehouse with premium materials',
          experience: '20 years',
          completedJobs: 278
        },
        { 
          id: '6', 
          name: 'Sara Bibi', 
          type: 'labour', 
          rating: 4.9, 
          verified: true, 
          specialty: 'Embroidery',
          avatar: 'https://images.unsplash.com/photo-1606159425081-b0b1a1a2ad53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Master embroidery artist with traditional skills',
          experience: '12 years',
          completedJobs: 456
        },
        { 
          id: '7', 
          name: 'Packing Solutions', 
          type: 'manufacturer', 
          rating: 4.5, 
          verified: true, 
          specialty: 'Packing Department',
          avatar: 'https://images.unsplash.com/photo-1553413077-190dd305871c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Professional packing and shipping services',
          experience: '9 years',
          completedJobs: 134
        },
      ];
    } else if (userType === 'manufacturer') {
      return [
        { 
          id: '1', 
          name: 'Ali Ahmed', 
          type: 'labour', 
          rating: 4.8, 
          verified: true, 
          specialty: 'Tailor',
          avatar: 'https://images.unsplash.com/photo-1630272777562-17735957d8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Skilled tailor with attention to detail',
          experience: '8 years',
          completedJobs: 342
        },
        { 
          id: '2', 
          name: 'Sara Bibi', 
          type: 'labour', 
          rating: 4.9, 
          verified: true, 
          specialty: 'Embroidery',
          avatar: 'https://images.unsplash.com/photo-1606159425081-b0b1a1a2ad53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Master embroidery artist with traditional skills',
          experience: '12 years',
          completedJobs: 456
        },
        { 
          id: '3', 
          name: 'Hassan Khan', 
          type: 'labour', 
          rating: 4.7, 
          verified: true, 
          specialty: 'Carpenter',
          avatar: 'https://images.unsplash.com/photo-1626081063434-79a2169791b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Expert carpenter for all wood projects',
          experience: '15 years',
          completedJobs: 289
        },
        { 
          id: '4', 
          name: 'Fatima Noor', 
          type: 'labour', 
          rating: 4.6, 
          verified: true, 
          specialty: 'Stitching',
          avatar: 'https://images.unsplash.com/photo-1630272777562-17735957d8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Professional stitching and alterations',
          experience: '7 years',
          completedJobs: 398
        },
        { 
          id: '5', 
          name: 'Ahmed Raza', 
          type: 'labour', 
          rating: 4.8, 
          verified: true, 
          specialty: 'Welder',
          avatar: 'https://images.unsplash.com/photo-1742934027647-bc4b88c35f50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Certified welder with industrial experience',
          experience: '10 years',
          completedJobs: 176
        },
        { 
          id: '6', 
          name: 'Zainab Ali', 
          type: 'labour', 
          rating: 4.9, 
          verified: true, 
          specialty: 'Quality Check',
          avatar: 'https://images.unsplash.com/photo-1606159425081-b0b1a1a2ad53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Detail-oriented quality control specialist',
          experience: '9 years',
          completedJobs: 512
        },
        { 
          id: '7', 
          name: 'Imran Malik', 
          type: 'labour', 
          rating: 4.7, 
          verified: true, 
          specialty: 'Machine Operator',
          avatar: 'https://images.unsplash.com/photo-1742934027647-bc4b88c35f50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Experienced machine operator for textile production',
          experience: '11 years',
          completedJobs: 423
        },
      ];
    } else {
      return [
        { 
          id: '1', 
          name: 'ABC Textiles', 
          type: 'manufacturer', 
          rating: 4.8, 
          verified: true, 
          specialty: 'Cotton Products',
          avatar: 'https://images.unsplash.com/photo-1742934027647-bc4b88c35f50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Leading textile manufacturer with 15+ years experience',
          experience: '15 years',
          completedJobs: 234
        },
        { 
          id: '2', 
          name: 'Premium Leather', 
          type: 'manufacturer', 
          rating: 4.9, 
          verified: true, 
          specialty: 'Leather Goods',
          avatar: 'https://images.unsplash.com/photo-1599694522028-65abc96dfd2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Expert leather craftsmanship and quality products',
          experience: '12 years',
          completedJobs: 189
        },
        { 
          id: '3', 
          name: 'Fashion House', 
          type: 'manufacturer', 
          rating: 4.7, 
          verified: true, 
          specialty: 'Designer Wear',
          avatar: 'https://images.unsplash.com/photo-1632914146475-bfe6fa6b2a12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Premium fashion manufacturing with modern facilities',
          experience: '10 years',
          completedJobs: 156
        },
        { 
          id: '4', 
          name: 'Khan Furniture', 
          type: 'manufacturer', 
          rating: 4.8, 
          verified: true, 
          specialty: 'Wooden Items',
          avatar: 'https://images.unsplash.com/photo-1626081063434-79a2169791b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Custom furniture and woodwork specialist',
          experience: '20 years',
          completedJobs: 278
        },
        { 
          id: '5', 
          name: 'Modern Crafts', 
          type: 'manufacturer', 
          rating: 4.5, 
          verified: true, 
          specialty: 'Handicrafts',
          avatar: 'https://images.unsplash.com/photo-1632914146475-bfe6fa6b2a12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Traditional handicrafts with modern designs',
          experience: '9 years',
          completedJobs: 134
        },
        { 
          id: '6', 
          name: 'Sports Gear Ltd', 
          type: 'manufacturer', 
          rating: 4.9, 
          verified: true, 
          specialty: 'Sports Items',
          avatar: 'https://images.unsplash.com/photo-1632914146475-bfe6fa6b2a12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Quality sports equipment manufacturer',
          experience: '8 years',
          completedJobs: 167
        },
        { 
          id: '7', 
          name: 'Textile Masters', 
          type: 'manufacturer', 
          rating: 4.6, 
          verified: true, 
          specialty: 'Fabrics',
          avatar: 'https://images.unsplash.com/photo-1742934027647-bc4b88c35f50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
          bio: 'Premium fabric production and dyeing',
          experience: '18 years',
          completedJobs: 312
        },
      ];
    }
  };

  const profiles = getProfiles();

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    if (onProfileClick) {
      onProfileClick(profile);
    }
  };

  const getProfileColor = (type) => {
    if (type === 'manufacturer') return 'from-[#2563EB] to-[#1d4ed8]';
    if (type === 'labour') return 'from-[#2563EB] to-[#1d4ed8]';
    return 'from-[#2563EB] to-[#1d4ed8]';
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white">
          {userType === 'client' ? 'Top Manufacturers & Labour' : 
           userType === 'manufacturer' ? 'Available Labour' : 
           'Top Manufacturers'}
        </h3>
        <button className="text-sm text-[#2563EB] hover:text-[#1d4ed8]" onClick={onViewAllClick}>
          View All
        </button>
      </div>
      
      {/* Instagram-style horizontal scroll */}
      <div 
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
        ref={scrollContainerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleProfileClick(profile)}
            className={`flex-shrink-0 text-center cursor-pointer transition-transform hover:scale-105 ${
              selectedProfile?.id === profile.id ? 'scale-105' : ''
            }`}
          >
            <div className="relative mb-2">
              {/* Ring around avatar for selected/Instagram effect */}
              <div className={`p-0.5 rounded-full bg-gradient-to-tr ${
                selectedProfile?.id === profile.id 
                  ? 'from-[#2563EB] to-[#1d4ed8]' 
                  : getProfileColor(profile.type)
              }`}>
                <div className="p-0.5 rounded-full bg-black">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt={profile.name}
                      className="size-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`size-16 rounded-full bg-gradient-to-br ${getProfileColor(profile.type)} flex items-center justify-center text-white`}>
                      {profile.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              {/* Verification Badge */}
              {profile.verified && (
                <div className="absolute bottom-0 right-0 bg-black rounded-full p-0.5">
                  <CheckCircle className="size-4 text-[#2563EB] fill-[#2563EB]" />
                </div>
              )}
            </div>
            <div className="w-20">
              <div className="text-xs text-white truncate">{profile.name}</div>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Star className="size-2.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-400">{profile.rating}</span>
              </div>
              {profile.specialty && (
                <div className="text-xs text-gray-500 truncate">{profile.specialty}</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Show selected profile details */}
      {selectedProfile && (
        <div className="mt-4 p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <div className="flex items-start gap-4">
            {selectedProfile.avatar ? (
              <img 
                src={selectedProfile.avatar} 
                alt={selectedProfile.name}
                className="size-16 rounded-full object-cover"
              />
            ) : (
              <div className={`size-16 rounded-full bg-gradient-to-br ${getProfileColor(selectedProfile.type)} flex items-center justify-center text-white`}>
                {selectedProfile.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white">{selectedProfile.name}</h4>
                {selectedProfile.verified && (
                  <CheckCircle className="size-4 text-[#2563EB] fill-[#2563EB]" />
                )}
              </div>
              <p className="text-sm text-gray-400 mb-2">{selectedProfile.bio}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span>{selectedProfile.experience} experience</span>
                <span>•</span>
                <span>{selectedProfile.completedJobs} jobs completed</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  <span>{selectedProfile.rating} rating</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onProfileClick && onProfileClick(selectedProfile)}
                  className="flex-1 px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-lg transition-colors"
                >
                  View Full Profile
                </button>
                <button 
                  onClick={() => onChatClick && onChatClick(selectedProfile)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="size-4" />
                  Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
/*Purpose: Displays a horizontally scrollable list of user profiles (manufacturers/labour/clients) with auto-scroll and quick actions like view profile or chat.
Type: Web-based (React UI), but can be adapted for both web and mobile apps. */