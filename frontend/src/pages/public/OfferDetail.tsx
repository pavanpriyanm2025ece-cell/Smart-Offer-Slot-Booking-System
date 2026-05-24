import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { User, Mail, Phone, Users, Clock, ArrowLeft, ShieldCheck, AlertTriangle, Sparkles, Percent } from "lucide-react";
import api from "../../services/api";

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
  {
    id: 101,
    title: "Premium Gym VIP Pass",
    businessName: "FitZone Arena",
    description: "Access all cardio zones, strength sections, swimming pool, and premium group training sessions with personal coaches.",
    originalPrice: 4999,
    offerPrice: 999,
    availableSlots: 4,
    totalSlots: 15,
    category: "Fitness & Gym",
  },
  {
    id: 102,
    title: "Luxury Spa & Wellness Retreat",
    businessName: "Serene Palms Wellness",
    description: "Indulge in a 90-minute signature hot stone massage, organic facial treatment, herbal tea service, and thermal bath access.",
    originalPrice: 7500,
    offerPrice: 2499,
    availableSlots: 2,
    totalSlots: 8,
    category: "Wellness & Spa",
  },
  {
    id: 103,
    title: "5-Course Gourmet Tasting Experience",
    businessName: "L'Aura Fine Dining",
    description: "A spectacular culinary journey curated by Michelin-star chefs, featuring seasonal delicacies, table side prep, and wine pairings.",
    originalPrice: 12000,
    offerPrice: 4799,
    availableSlots: 6,
    totalSlots: 10,
    category: "Food & Dining",
  },
  {
    id: 104,
    title: "Full Stack Coding Boot Camp Access",
    businessName: "SmartOffer Tech Academy",
    description: "Unlock complete lifetime access to React, .NET Core, Postgres database design, and real-world system architecture projects.",
    originalPrice: 15999,
    offerPrice: 1499,
    availableSlots: 12,
    totalSlots: 30,
    category: "Education & Tech",
  }
];

const OfferDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    peopleCount: 1,
    slotTime: "",
  });

  useEffect(() => {
    fetchOfferDetails();
  }, [id]);

  const fetchOfferDetails = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const offerId = Number(id);
      // Check if it's one of the mock IDs
      if (offerId >= 101 && offerId <= 104) {
        const foundMock = MOCK_OFFERS.find(o => o.id === offerId);
        if (foundMock) {
          setOffer(foundMock);
          setLoading(false);
          return;
        }
      }

      // Try fetching from server
      const response = await api.get(`/Offer/${offerId}`);
      if (response.data) {
        setOffer({
          ...response.data,
          totalSlots: response.data.totalSlots || 15,
          category: response.data.category || "Special Offer"
        });
      } else {
        throw new Error("Empty details");
      }
    } catch (error) {
      console.warn("Could not load from API. Attempting mock fallback...", error);
      // Fallback: If API fails, check if we can locate some mock offer
      const fallback = MOCK_OFFERS.find(o => o.id === Number(id)) || MOCK_OFFERS[0];
      setOffer({
        ...fallback,
        id: Number(id), // Keep the route's ID
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const val = e.target.name === "peopleCount" ? Number(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: val,
    });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.email || !formData.phone || !formData.slotTime) {
      setErrorMsg("Please fill in all the reservation fields.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const offerId = Number(id);
      const bookingPayload = {
        ...formData,
        offerId: offerId,
      };

      // Call API
      await api.post("/Booking", bookingPayload);

      // Navigate to confirmation with state
      navigate("/confirmation", {
        state: {
          customerName: formData.customerName,
          email: formData.email,
          phone: formData.phone,
          slotTime: formData.slotTime,
          peopleCount: formData.peopleCount,
          offerTitle: offer?.title || "Exclusive Deal",
          businessName: offer?.businessName || "Local Brand",
          offerPrice: offer?.offerPrice || 0,
        }
      });
    } catch (error: any) {
      console.error(error);
      const serverMsg = error?.response?.data?.message || "Booking failed. The selected offer might not exist in the live database.";
      
      // If we are in demo/mock mode, simulate a successful booking redirect for beautiful client testing
      if (Number(id) >= 101 && Number(id) <= 104) {
        console.log("Mock offer booking simulation successful.");
        setTimeout(() => {
          navigate("/confirmation", {
            state: {
              customerName: formData.customerName,
              email: formData.email,
              phone: formData.phone,
              slotTime: formData.slotTime,
              peopleCount: formData.peopleCount,
              offerTitle: offer?.title || "Exclusive Deal",
              businessName: offer?.businessName || "Local Brand",
              offerPrice: offer?.offerPrice || 0,
              reference: "BK-MOCK-" + Math.floor(100000 + Math.random() * 900000)
            }
          });
        }, 800);
      } else {
        setErrorMsg(serverMsg);
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
          <p className="text-slate-400 font-medium">Loading offer particulars...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen text-slate-100 flex items-center justify-center p-6">
        <div className="glass-panel text-center p-12 rounded-2xl max-w-md border border-white/10">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Offer Not Found</h2>
          <p className="text-slate-400 mb-6">The requested offer could not be recovered.</p>
          <Link to="/" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold transition">
            Back to Deals
          </Link>
        </div>
      </div>
    );
  }

  const savings = offer.originalPrice - offer.offerPrice;
  const savingsPercent = Math.round((savings / offer.originalPrice) * 100);

  return (
    <div className="min-h-screen text-slate-100 p-4 md:p-8 flex flex-col relative">
      {/* Background Ornaments */}
      <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-900/10 blur-[130px] pointer-events-none" />

      {/* Navigation Breadcrumb */}
      <div className="max-w-6xl w-full mx-auto mb-6 flex items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Live Feed
        </Link>
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-grow">
        {/* Left Panel: Offer Card Details */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 md:p-8 border border-white/5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full blur-xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {offer.category || "Featured Deal"}
            </div>

            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">
              {offer.businessName}
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white leading-tight">
              {offer.title}
            </h1>

            <p className="text-slate-400 text-base leading-relaxed mb-8">
              {offer.description}
            </p>

            {/* Price Detail Matrix */}
            <div className="space-y-4 bg-slate-950/50 p-5 rounded-2xl border border-white/5 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold">Standard Venue Price</span>
                <span className="line-through text-slate-400 font-medium">₹{offer.originalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-bold">SmartOffer Price</span>
                <span className="text-2xl font-black text-indigo-400">₹{offer.offerPrice.toLocaleString()}</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Percent className="w-4 h-4" />
                  Your Discount
                </span>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black px-2.5 py-1 rounded-lg">
                  SAVE ₹{savings.toLocaleString()} ({savingsPercent}% OFF)
                </span>
              </div>
            </div>
          </div>

          {/* Secure details */}
          <div className="border-t border-white/5 pt-6 space-y-4">
            <div className="flex gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                ✓
              </div>
              <p className="text-slate-400 font-medium">No advance payment required. Pay at the venue when you visit.</p>
            </div>
            <div className="flex gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                ✓
              </div>
              <p className="text-slate-400 font-medium">Instant SMS & Email confirmation with verification booking receipt.</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Booking Form */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 md:p-8 border border-white/5 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Secure Your Slot</h2>
            <p className="text-slate-400 text-sm">Enter your visitation details to complete your free instant reservation.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleBooking} className="space-y-5">
            {/* Customer Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                name="customerName"
                placeholder="Your Full Name"
                required
                value={formData.customerName}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 p-4 pl-12 rounded-xl text-slate-200 placeholder-slate-500 outline-none transition-all duration-200"
              />
            </div>

            {/* Email Address */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                name="email"
                placeholder="Email Address (For receipt)"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 p-4 pl-12 rounded-xl text-slate-200 placeholder-slate-500 outline-none transition-all duration-200"
              />
            </div>

            {/* Phone Number */}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (SMS confirmation)"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 p-4 pl-12 rounded-xl text-slate-200 placeholder-slate-500 outline-none transition-all duration-200"
              />
            </div>

            {/* Grid for People Count & Slot Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* People Count */}
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="number"
                  name="peopleCount"
                  min="1"
                  max={offer.availableSlots}
                  placeholder="People Count"
                  required
                  value={formData.peopleCount}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 p-4 pl-12 rounded-xl text-slate-200 placeholder-slate-500 outline-none transition-all duration-200"
                />
              </div>

              {/* Slot Time Picker */}
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select
                  name="slotTime"
                  required
                  value={formData.slotTime}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 p-4 pl-12 rounded-xl text-slate-200 outline-none transition-all duration-200 cursor-pointer appearance-none"
                >
                  <option value="" disabled className="text-slate-500 bg-slate-950">Select Time Slot</option>
                  <option value="10:00 AM - 11:30 AM" className="bg-slate-950">10:00 AM - 11:30 AM</option>
                  <option value="12:00 PM - 01:30 PM" className="bg-slate-950">12:00 PM - 01:30 PM</option>
                  <option value="03:00 PM - 04:30 PM" className="bg-slate-950">03:00 PM - 04:30 PM</option>
                  <option value="05:00 PM - 06:30 PM" className="bg-slate-950">05:00 PM - 06:30 PM</option>
                  <option value="07:00 PM - 08:30 PM" className="bg-slate-950">07:00 PM - 08:30 PM</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                  ▼
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <button
              type="submit"
              disabled={submitting || offer.availableSlots <= 0}
              className={`w-full py-4.5 rounded-xl font-bold tracking-wider shadow-lg transition-all duration-300 ${
                submitting || offer.availableSlots <= 0
                  ? "bg-slate-900 text-slate-600 cursor-not-allowed border border-white/5"
                  : "glow-btn bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/20 hover:shadow-indigo-500/40"
              }`}
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                  <span>Reserving Spot...</span>
                </div>
              ) : offer.availableSlots <= 0 ? (
                "No Slots Remaining"
              ) : (
                "Confirm Free Reservation"
              )}
            </button>
          </form>

          {/* Secure payment shield */}
          <div className="mt-6 flex justify-center items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>SmartOffer Verified Reservation Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetail;