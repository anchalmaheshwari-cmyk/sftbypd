import { useState, useEffect } from 'react';
import { supabase, type Listing } from '../lib/supabase';
import { Plus, Edit2, Trash2, Save, X, Lock, Upload, Image as ImageIcon, ChevronUp, ChevronDown } from 'lucide-react';

const Admin = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingListing, setEditingListing] = useState<Partial<Listing> | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugClicks, setDebugClicks] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchAllListings();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      fetchAllListings();
      setPasswordInput('');
    } else {
      alert('Incorrect password');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setListings([]);
  };

  const fetchAllListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const handleNew = () => {
    setEditingListing({
      title: '',
      price: '',
      location: '',
      size: '',
      bhk: '',
      highlights: [],
      amenities: [],
      images: [],
      status: 'Available',
      property_type: 'Purchase',
      sort_order: listings.length + 1,
    });
    setIsEditing(true);
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setDebugClicks(prev => prev + 1);
    console.log('=== SAVE BUTTON CLICKED ===');
    console.log('editingListing:', JSON.stringify(editingListing, null, 2));

    if (!editingListing) {
      alert('No listing data to save');
      return;
    }

    if (!editingListing.title?.trim()) {
      alert('Title is required');
      return;
    }

    setLoading(true);

    try {
      const listingData = {
        title: editingListing.title,
        price: editingListing.price || '',
        location: editingListing.location || '',
        size: editingListing.size || '',
        bhk: editingListing.bhk || '',
        highlights: editingListing.highlights || [],
        amenities: editingListing.amenities || [],
        images: editingListing.images || [],
        status: editingListing.status || 'Available',
        property_type: editingListing.property_type || 'Purchase',
        sort_order: editingListing.sort_order || 0,
        neighborhood: editingListing.neighborhood || null,
        featured: editingListing.featured || false,
      };

      console.log('Prepared listing data:', JSON.stringify(listingData, null, 2));

      if (editingListing.id) {
        console.log('Updating listing with ID:', editingListing.id);
        const { data, error } = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', editingListing.id)
          .select();

        console.log('Update response:', { data, error });
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Update successful, data returned:', data);
        alert('Listing updated successfully!');
      } else {
        console.log('Inserting new listing');
        const { data, error } = await supabase
          .from('listings')
          .insert([listingData])
          .select();

        console.log('Insert response:', { data, error });
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Insert successful, data returned:', data);
        alert('Listing created successfully!');
      }

      console.log('Fetching all listings after save...');
      await fetchAllListings();
      console.log('Closing editor...');
      setIsEditing(false);
      setEditingListing(null);
    } catch (error: any) {
      console.error('Error saving listing:', error);
      alert(`Failed to save listing: ${error.message || JSON.stringify(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAllListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingListing(null);
  };

  const updateField = (field: keyof Listing, value: any) => {
    setEditingListing(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addToArray = (field: 'highlights' | 'amenities' | 'images', value: string) => {
    if (!value.trim()) return;
    setEditingListing(prev => {
      if (!prev) return null;
      const currentArray = (prev[field] as string[]) || [];
      return { ...prev, [field]: [...currentArray, value.trim()] };
    });
  };

  const removeFromArray = (field: 'highlights' | 'amenities' | 'images', index: number) => {
    setEditingListing(prev => {
      if (!prev) return null;
      const currentArray = (prev[field] as string[]) || [];
      return { ...prev, [field]: currentArray.filter((_, i) => i !== index) };
    });
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setEditingListing(prev => {
      if (!prev) return null;
      const images = [...(prev.images as string[])];
      const [movedImage] = images.splice(fromIndex, 1);
      images.splice(toIndex, 0, movedImage);
      return { ...prev, images };
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError, data } = await supabase.storage
          .from('property-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setEditingListing(prev => {
        if (!prev) return null;
        const currentImages = (prev.images as string[]) || [];
        return { ...prev, images: [...currentImages, ...uploadedUrls] };
      });

      alert(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      alert(`Failed to upload images: ${error.message}`);
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c0c0c0]/20 rounded-full mb-4">
              <Lock className="text-[#c0c0c0]" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Admin Access</h2>
            <p className="text-gray-400">Enter password to manage listings</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#c0c0c0] focus:outline-none"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#c0c0c0] text-black rounded-lg hover:bg-[#a8a8a8] font-semibold transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isEditing && editingListing) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-6">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              {editingListing.id ? 'Edit Listing' : 'New Listing'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={editingListing.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#c0c0c0]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                <textarea
                  value={editingListing.price || ''}
                  onChange={(e) => updateField('price', e.target.value)}
                  placeholder="e.g., ₹3.8 Cr or 75 lakhs + 5000/month maintenance"
                  rows={2}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#c0c0c0] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={editingListing.location || ''}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#c0c0c0]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Size (sq ft)</label>
                <input
                  type="text"
                  value={editingListing.size || ''}
                  onChange={(e) => updateField('size', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#c0c0c0]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">BHK</label>
                <input
                  type="text"
                  value={editingListing.bhk || ''}
                  onChange={(e) => updateField('bhk', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#c0c0c0]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={editingListing.status || 'Available'}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#c0c0c0]"
                >
                  <option value="Available">Available</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Property Type</label>
                <select
                  value={editingListing.property_type || 'Purchase'}
                  onChange={(e) => updateField('property_type', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#c0c0c0]"
                >
                  <option value="Purchase">Purchase</option>
                  <option value="Rental">Rental</option>
                  <option value="Commercial Rental">Commercial Rental</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
                <input
                  type="number"
                  value={editingListing.sort_order || 0}
                  onChange={(e) => updateField('sort_order', parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#c0c0c0]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Featured Property</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingListing.featured || false}
                    onChange={(e) => updateField('featured', e.target.checked)}
                    className="w-5 h-5 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-[#c0c0c0]"
                  />
                  <span className="ml-3 text-gray-300">Show as featured property on homepage</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Neighborhood Information</label>
              <textarea
                value={editingListing.neighborhood || ''}
                onChange={(e) => updateField('neighborhood', e.target.value)}
                placeholder="Describe nearby amenities (schools, hospitals, shopping centers, restaurants, etc.)"
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#c0c0c0] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Highlights</label>
              <div className="space-y-2">
                {((editingListing.highlights as string[]) || []).map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={highlight}
                      readOnly
                      className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg"
                    />
                    <button
                      onClick={() => removeFromArray('highlights', index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="new-highlight"
                    placeholder="Add highlight..."
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#d4af37]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        addToArray('highlights', input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('new-highlight') as HTMLInputElement;
                      addToArray('highlights', input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-[#c0c0c0] text-black rounded-lg hover:bg-[#a8a8a8]"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Amenities</label>
              <div className="space-y-2">
                {((editingListing.amenities as string[]) || []).map((amenity, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={amenity}
                      readOnly
                      className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg"
                    />
                    <button
                      onClick={() => removeFromArray('amenities', index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="new-amenity"
                    placeholder="Add amenity..."
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#d4af37]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        addToArray('amenities', input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('new-amenity') as HTMLInputElement;
                      addToArray('amenities', input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-[#c0c0c0] text-black rounded-lg hover:bg-[#a8a8a8]"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Images</label>

              <div className="mb-4">
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#c0c0c0] text-black rounded-lg hover:bg-[#a8a8a8] font-semibold cursor-pointer transition-colors"
                >
                  {uploadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      <span>Upload Images</span>
                    </>
                  )}
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
                <p className="text-sm text-gray-400 mt-2">Upload JPEG, PNG, or WebP (max 10MB each)</p>
              </div>

              <div className="space-y-2">
                {((editingListing.images as string[]) || []).map((image, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveImage(index, index - 1)}
                        disabled={index === 0}
                        className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => moveImage(index, index + 1)}
                        disabled={index === ((editingListing.images as string[]) || []).length - 1}
                        className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                    <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <input
                      type="text"
                      value={image}
                      readOnly
                      className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm"
                    />
                    <button
                      onClick={() => removeFromArray('images', index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {((editingListing.images as string[]) || []).length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <ImageIcon size={48} className="mb-2" />
                    <p>No images uploaded yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#c0c0c0] text-black rounded-lg hover:bg-[#a8a8a8] font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {loading ? 'Saving...' : `Save Listing ${debugClicks > 0 ? `(${debugClicks})` : ''}`}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Manage Listings</h1>
          <div className="flex gap-4">
            <button
              onClick={handleNew}
              className="px-6 py-3 bg-[#c0c0c0] text-black rounded-lg hover:bg-[#a8a8a8] font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              New Listing
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-semibold flex items-center gap-2"
            >
              <Lock size={20} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{listing.title}</h3>
                    <p className="text-[#c0c0c0] text-2xl font-bold">{listing.price}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      listing.status === 'Available'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-600/20 text-gray-400'
                    }`}
                  >
                    {listing.status}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">
                  {listing.location} • {listing.bhk} BHK • {listing.size} sq ft
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(listing)}
                    className="flex-1 px-4 py-2 bg-[#c0c0c0] text-black rounded-lg hover:bg-[#a8a8a8] font-semibold flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
