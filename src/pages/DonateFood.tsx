import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Utensils, Package, MapPin, Clock, Phone, Image as ImageIcon,
  Loader2, CheckCircle, ArrowLeft, Upload, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/useAuth';
import { supabase, FOOD_TYPES, FoodType } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

export default function DonateFood() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    food_name: '',
    food_type: 'Cooked' as FoodType,
    quantity: '',
    pickup_address: profile?.address || '',
    pickup_time: '',
    expiry_time: '',
    contact_number: profile?.phone || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null;
    const ext = imageFile.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('food-images')
      .upload(fileName, imageFile);
    if (uploadError) throw new Error('Image upload failed: ' + uploadError.message);
    const { data } = supabase.storage.from('food-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const imageUrl = await uploadImage();
      const { error: insertError } = await supabase.from('donations').insert({
        donor_id: user!.id,
        donor_name: profile?.full_name || 'Unknown',
        food_name: form.food_name,
        food_type: form.food_type,
        quantity: form.quantity,
        pickup_address: form.pickup_address,
        pickup_time: new Date(form.pickup_time).toISOString(),
        expiry_time: new Date(form.expiry_time).toISOString(),
        contact_number: form.contact_number,
        image_url: imageUrl,
        status: 'available',
      });

      if (insertError) throw new Error(insertError.message);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center px-6">
          <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-brand-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Donation Posted!</h2>
          <p className="text-gray-500 mb-8">
            Your food listing is now live. Volunteers in your area will be able to
            claim it and arrange pickup shortly.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/donations')} className="btn-primary">
              View Available Food
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setForm({ food_name: '', food_type: 'Cooked', quantity: '', pickup_address: profile?.address || '', pickup_time: '', expiry_time: '', contact_number: profile?.phone || '' });
                setImageFile(null);
                setImagePreview(null);
              }}
              className="btn-secondary"
            >
              Donate More
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Donate Surplus Food" subtitle="Share details about your food and pickup location. A volunteer will claim it and deliver it to someone in need." />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-brand-600 transition-colors mb-6 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-6">
          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Food Photo</label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Food preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-gray-300" />
                )}
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 text-gray-700 font-medium text-sm hover:bg-gray-100 transition-all border border-gray-200">
                  <Upload className="w-4 h-4" />
                  {imagePreview ? 'Change Photo' : 'Upload Photo'}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB. Optional but recommended.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Food Name *</label>
            <div className="relative">
              <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" required value={form.food_name} onChange={(e) => update('food_name', e.target.value)} placeholder="e.g. 50 Veg Sandwiches" className="input-field pl-10" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Food Type *</label>
              <select value={form.food_type} onChange={(e) => update('food_type', e.target.value)} className="input-field">
                {FOOD_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" required value={form.quantity} onChange={(e) => update('quantity', e.target.value)} placeholder="e.g. 50 meals, 10 kg" className="input-field pl-10" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Address *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" required value={form.pickup_address} onChange={(e) => update('pickup_address', e.target.value)} placeholder="Full address for pickup" className="input-field pl-10" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Time *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="datetime-local" required value={form.pickup_time} onChange={(e) => update('pickup_time', e.target.value)} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Time *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="datetime-local" required value={form.expiry_time} onChange={(e) => update('expiry_time', e.target.value)} className="input-field pl-10" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="tel" required value={form.contact_number} onChange={(e) => update('contact_number', e.target.value)} placeholder="So volunteers can reach you" className="input-field pl-10" />
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Posting Donation...</>
            ) : (
              <>Post Donation</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
