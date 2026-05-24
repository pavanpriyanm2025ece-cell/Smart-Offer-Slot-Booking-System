import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles, Flame, Tag, Calendar, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
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
  imageUrl?: string;
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

const Home = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Offer");
      if (response.data && response.data.length > 0) {
        // Hydrate offers with mock values for totalSlots/category if backend doesn't supply them
        const hydrated = response.data.map((off: Offer) => ({
          ...off,
          totalSlots: off.totalSlots || Math.max(off.availableSlots + 5, 10),
          category: off.category || "General",
        }));
        setOffers(hydrated);
        setIsDemoMode(false);
      } else {
        // Fall back to Mock Offers if empty database
        setOffers(MOCK_OFFERS);
        setIsDemoMode(true);
      }
    } catch (error) {
      console.warn("Backend API not reachable. Switching to interactive Demo Mode.", error);
      setOffers(MOCK_OFFERS);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Fitness & Gym", "Wellness & Spa", "Food & Dining", "Education & Tech", "General"];

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      offer.category === selectedCategory ||
      (selectedCategory === "General" && !offer.category);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen text-slate-100 flex flex-col relative">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-900/15 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-blue-900/20 blur-[100px] pointer-events-none" />

      {/* Floating Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              Smart<span className="text-indigo-400">Offer</span>
            </h1>
            <p className="text-[10px] text-indigo-300/60 font-semibold tracking-wider uppercase hidden sm:block">
              Premium Slot Booking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isDemoMode && (
            <span className="text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
              Demo Mode
            </span>
          )}
          <Link
            to="/admin/login"
            className="group flex items-center gap-2 bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-400 text-slate-100 hover:text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-sm shadow-black/50"
          >
            <UserCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative text-center py-20 px-6 max-w-5xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in">
          <Flame className="w-3.5 h-3.5 text-indigo-400 animate-bounce" />
          <span>Supercharged Time-Limited Deals</span>
        </div>

        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
          Book Exclusive Spots,{" "}
          <span className="gradient-text font-black">
            Save Unbelievably
          </span>
        </h2>

        <p className="text-slate-400 text-base md:text-xl max-w-2xl mb-10 leading-relaxed">
          Grab premium offers from localized brands, reserve your real-time booking slots in seconds, and pay at the venue. Fast. Seamless. Unmissable.
        </p>

        {/* Search & Category Filter Dashboard */}
        <div className="w-full max-w-3xl glass-panel p-3 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search fitness, dining, spas, deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 p-4 pl-12 rounded-xl text-slate-200 placeholder-slate-500 outline-none transition-all duration-200"
            />
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={fetchOffers}
              className="p-4 bg-slate-900/60 border border-slate-800 hover:border-indigo-500 text-slate-400 hover:text-indigo-400 rounded-xl font-medium transition-all cursor-pointer"
              title="Refresh API Data"
            >
              🔄
            </button>
            <button className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all duration-300 flex items-center gap-2 group">
              <span>Find Deals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Categories Carousel */}
        <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-3xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/20"
                  : "bg-slate-900/40 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border-white/5 hover:border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow px-6 md:px-12 pb-24 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
            <p className="text-slate-400 font-medium">Fetching real-time slots...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="glass-panel text-center p-16 rounded-3xl border border-white/5 max-w-xl mx-auto">
            <Tag className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Active Offers Found</h3>
            <p className="text-slate-400 mb-6">
              We couldn't find any offers matching "{searchQuery}" in "{selectedCategory}".
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOffers.map((offer) => {
              const discount = Math.round(
                ((offer.originalPrice - offer.offerPrice) / offer.originalPrice) * 100
              );
              const totalSlots = offer.totalSlots || 10;
              const slotsLeftPercent = Math.max(
                0,
                Math.min(100, (offer.availableSlots / totalSlots) * 100)
              );

              return (
                <div
                  key={offer.id}
                  className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col border border-white/5 relative group"
                >
                  {/* Category Badge & Discount Indicator */}
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <span className="bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-slate-300 px-3 py-1.5 rounded-lg border border-white/10 uppercase tracking-wide">
                      {offer.category || "Active Offer"}
                    </span>
                    {discount > 0 && (
                      <span className="bg-indigo-600 text-[11px] font-black text-white px-2.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-white" />
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Visual Accent Top Bar */}
                  <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

                  {/* Header / Brand info */}
                  <div className="p-6 pb-4 border-b border-white/5">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1.5">
                      {offer.businessName}
                    </p>
                    <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                      {offer.title}
                    </h3>
                  </div>

                  {/* Description / Info */}
                  <div className="p-6 py-4 flex-grow">
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {offer.description}
                    </p>

                    {/* Price Tag Grid */}
                    <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-xl border border-white/5 mb-6">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Regular Price</p>
                        <span className="line-through text-slate-400 text-base font-semibold">
                          ₹{offer.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-8 w-px bg-white/10" />
                      <div>
                        <p className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider">Offer Price</p>
                        <span className="text-3xl font-black text-indigo-400">
                          ₹{offer.offerPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Urgency Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          Reservation Slot Status
                        </span>
                        {offer.availableSlots <= 3 ? (
                          <span className="text-rose-400 font-extrabold animate-pulse">
                            🚨 Only {offer.availableSlots} slots left!
                          </span>
                        ) : (
                          <span className="text-indigo-300">
                            {offer.availableSlots} of {totalSlots} Available
                          </span>
                        )}
                      </div>

                      {/* Progress line */}
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                        <div
                          style={{ width: `${slotsLeftPercent}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            offer.availableSlots <= 3
                              ? "bg-gradient-to-r from-rose-500 to-red-600"
                              : "bg-gradient-to-r from-indigo-500 to-purple-600"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-6 pt-0 mt-auto">
                    <Link
                      to={`/offer/${offer.id}`}
                      className={`block text-center w-full py-4.5 rounded-xl font-bold tracking-wide transition-all duration-300 ${
                        offer.availableSlots <= 0
                          ? "bg-slate-900 text-slate-600 cursor-not-allowed border border-white/5"
                          : "glow-btn bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/40"
                      }`}
                      onClick={(e) => {
                        if (offer.availableSlots <= 0) e.preventDefault();
                      }}
                    >
                      {offer.availableSlots <= 0 ? "Fully Booked" : "Secure Reservation Slot"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Premium Footer */}
      <footer className="mt-auto border-t border-white/5 bg-slate-950/60 py-12 px-6 md:px-12 text-center text-slate-500 text-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-400">SmartOffer Booking Engine</span>
          </div>
          <p>© 2026 SmartOffer Ltd. Secure venue payment assured.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1 text-slate-400 text-xs bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              128-Bit Encryption Secure
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;