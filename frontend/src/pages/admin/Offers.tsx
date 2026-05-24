import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";

interface Offer {
  id: number;
  title: string;
  businessName: string;
  description: string;
  originalPrice: number;
  offerPrice: number;
  availableSlots: number;
  totalSlots?: number;
  category?: string;
}

const MOCK_OFFERS: Offer[] = [
  { id: 101, title: "Premium Gym VIP Pass", businessName: "FitZone Arena", description: "VIP access pass to premium gym services.", originalPrice: 4999, offerPrice: 999, availableSlots: 4, totalSlots: 15, category: "Fitness & Gym" },
  { id: 102, title: "Luxury Spa & Wellness Retreat", businessName: "Serene Palms Wellness", description: "Hot stone massage & facials.", originalPrice: 7500, offerPrice: 2499, availableSlots: 2, totalSlots: 8, category: "Wellness & Spa" },
  { id: 103, title: "5-Course Gourmet Tasting Experience", businessName: "L'Aura Fine Dining", description: "Michelin-star tasting session.", originalPrice: 12000, offerPrice: 4799, availableSlots: 6, totalSlots: 10, category: "Food & Dining" },
  { id: 104, title: "Full Stack Coding Boot Camp Access", businessName: "SmartOffer Tech Academy", description: "Lifetime academy development seat.", originalPrice: 15999, offerPrice: 1499, availableSlots: 12, totalSlots: 30, category: "Education & Tech" }
];

const Offers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    businessName: "",
    description: "",
    originalPrice: 0,
    offerPrice: 0,
    availableSlots: 0,
    category: "",
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Offer");
      if (response.data && response.data.length > 0) {
        setOffers(response.data);
      } else {
        setOffers(MOCK_OFFERS);
      }
      setIsOffline(false);
    } catch (error) {
      console.warn("Using offline mock offers catalog fallback.");
      setOffers(MOCK_OFFERS);
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      if (isOffline) {
        setOffers(offers.filter(o => o.id !== id));
        alert("Offer removed successfully (Local simulation).");
      } else {
        await api.delete(`/Offer/${id}`);
        fetchOffers();
        alert("Offer removed successfully.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete offer from backend. Simulating local deletion.");
      setOffers(offers.filter(o => o.id !== id));
    }
  };

  const handleEditClick = (offer: Offer) => {
    setEditingOffer(offer);
    setEditForm({
      title: offer.title,
      businessName: offer.businessName,
      description: offer.description,
      originalPrice: offer.originalPrice,
      offerPrice: offer.offerPrice,
      availableSlots: offer.availableSlots,
      category: offer.category || "Fitness & Gym",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    try {
      const payload = {
        ...editingOffer,
        ...editForm,
        totalSlots: editingOffer.totalSlots || editForm.availableSlots,
      };

      if (isOffline) {
        setOffers(offers.map(o => o.id === editingOffer.id ? payload : o));
        alert("Offer details updated (Local simulation).");
      } else {
        await api.put(`/Offer/${editingOffer.id}`, payload);
        fetchOffers();
        alert("Offer details updated successfully.");
      }
      setEditingOffer(null);
    } catch (error) {
      console.error(error);
      alert("Could not save to API. Simulating local update instead.");
      const payload = {
        ...editingOffer,
        ...editForm,
      };
      setOffers(offers.map(o => o.id === editingOffer.id ? payload : o));
      setEditingOffer(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">Offers Catalog</h3>
            <p className="text-xs text-slate-400">Add, edit, or remove live client campaigns</p>
          </div>
          <button
            onClick={() => window.location.href = "/admin/create-offer"}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-lg shadow-indigo-600/10 cursor-pointer"
          >
            <Plus size={14} />
            <span>Launch Campaign</span>
          </button>
        </div>

        {/* Modal edit overlay */}
        {editingOffer && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-white/10 relative">
              <h4 className="text-lg font-black text-white mb-4">Edit Campaign</h4>
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  placeholder="Offer Title"
                  required
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 p-3 rounded-lg text-sm text-slate-200 outline-none"
                />
                <input
                  type="text"
                  placeholder="Business Name"
                  required
                  value={editForm.businessName}
                  onChange={e => setEditForm({ ...editForm, businessName: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 p-3 rounded-lg text-sm text-slate-200 outline-none"
                />
                <textarea
                  placeholder="Description"
                  required
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 p-3 rounded-lg text-sm text-slate-200 outline-none h-20"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Regular Price"
                    required
                    value={editForm.originalPrice}
                    onChange={e => setEditForm({ ...editForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 p-3 rounded-lg text-sm text-slate-200 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Offer Price"
                    required
                    value={editForm.offerPrice}
                    onChange={e => setEditForm({ ...editForm, offerPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 p-3 rounded-lg text-sm text-slate-200 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Available Slots"
                    required
                    value={editForm.availableSlots}
                    onChange={e => setEditForm({ ...editForm, availableSlots: Number(e.target.value) })}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 p-3 rounded-lg text-sm text-slate-200 outline-none"
                  />
                  <select
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 p-3 rounded-lg text-sm text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="Fitness & Gym">Fitness & Gym</option>
                    <option value="Wellness & Spa">Wellness & Spa</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Education & Tech">Education & Tech</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingOffer(null)}
                    className="bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white px-4 py-2 rounded-xl text-xs transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs transition font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Offers Grid/Table view */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          {loading ? (
            <div className="py-20 text-center text-slate-500 text-sm font-semibold">
              Loading campaigns catalog...
            </div>
          ) : offers.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm font-semibold">
              No offers launched yet. Launch one today!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-4">Title</th>
                    <th className="py-4">Provider</th>
                    <th className="py-4">Pricing</th>
                    <th className="py-4">Available slots</th>
                    <th className="py-4">Category</th>
                    <th className="py-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                  {offers.map((off) => (
                    <tr key={off.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4">
                        <p className="text-white font-bold">{off.title}</p>
                        <p className="text-xs text-slate-500 max-w-sm truncate">{off.description}</p>
                      </td>
                      <td className="py-4 text-indigo-300">{off.businessName}</td>
                      <td className="py-4">
                        <span className="line-through text-slate-500 mr-2 text-xs">₹{off.originalPrice}</span>
                        <span className="text-emerald-400 font-bold">₹{off.offerPrice}</span>
                      </td>
                      <td className="py-4 font-mono font-bold text-slate-400">{off.availableSlots} Left</td>
                      <td className="py-4">
                        <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs px-2 py-1 rounded-lg">
                          {off.category || "Fitness & Gym"}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(off)}
                          className="p-2 hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300 rounded-lg transition inline-flex cursor-pointer"
                          title="Modify details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(off.id)}
                          className="p-2 hover:bg-rose-600/20 text-rose-400 hover:text-rose-300 rounded-lg transition inline-flex cursor-pointer"
                          title="Tear down campaign"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Offers;
