import { useEffect, useState } from "react";
import { Search, Mail, Phone, Calendar, Users, AlertCircle, RefreshCw } from "lucide-react";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";

interface Booking {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  peopleCount: number;
  slotTime: string;
  offerId: number;
  offer?: {
    title: string;
    businessName: string;
    offerPrice: number;
  };
}

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 1,
    customerName: "Aravind Sharma",
    email: "aravind@gmail.com",
    phone: "+91 98765 43210",
    peopleCount: 2,
    slotTime: "10:00 AM - 11:30 AM",
    offerId: 101,
    offer: { title: "Premium Gym VIP Pass", businessName: "FitZone Arena", offerPrice: 999 }
  },
  {
    id: 2,
    customerName: "Meera Nair",
    email: "meera.nair@outlook.com",
    phone: "+91 91234 56789",
    peopleCount: 1,
    slotTime: "03:00 PM - 04:30 PM",
    offerId: 102,
    offer: { title: "Luxury Spa & Wellness Retreat", businessName: "Serene Palms Wellness", offerPrice: 2499 }
  },
  {
    id: 3,
    customerName: "Rohan Das",
    email: "rohan99@yahoo.com",
    phone: "+91 88776 65544",
    peopleCount: 4,
    slotTime: "07:00 PM - 08:30 PM",
    offerId: 103,
    offer: { title: "5-Course Gourmet Tasting Experience", businessName: "L'Aura Fine Dining", offerPrice: 4799 }
  },
  {
    id: 4,
    customerName: "Siddharth Verma",
    email: "sid.v@gmail.com",
    phone: "+91 90001 90002",
    peopleCount: 2,
    slotTime: "12:00 PM - 01:30 PM",
    offerId: 104,
    offer: { title: "Full Stack Coding Boot Camp Access", businessName: "SmartOffer Tech Academy", offerPrice: 1499 }
  }
];

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Booking");
      if (response.data && response.data.length > 0) {
        setBookings(response.data);
      } else {
        setBookings(MOCK_BOOKINGS);
      }
      setIsOffline(false);
    } catch (error) {
      console.warn("Could not query live bookings database. Fallback active.", error);
      setBookings(MOCK_BOOKINGS);
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.phone.includes(searchQuery) ||
    (b.offer?.title && b.offer.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (b.offer?.businessName && b.offer.businessName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top heading and search bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Live Bookings Log</h3>
            <p className="text-xs text-slate-400">Review real-time slots reservations and guest rosters</p>
          </div>

          <div className="flex gap-2">
            <div className="relative w-64 md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Filter by guest name, deal, email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 p-2.5 pl-10 rounded-xl text-xs text-slate-200 outline-none placeholder-slate-600 transition"
              />
            </div>
            <button
              onClick={fetchBookings}
              className="p-2.5 bg-slate-900 border border-white/5 hover:border-indigo-500 rounded-xl text-slate-400 hover:text-indigo-400 cursor-pointer transition"
              title="Refresh Bookings Log"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Offline Simulation warning banner */}
        {isOffline && (
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-2 text-indigo-300 text-xs font-semibold">
            <AlertCircle size={14} />
            <span>Showing local demo reservations log (API not reachable).</span>
          </div>
        )}

        {/* Bookings table */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          {loading ? (
            <div className="py-20 text-center text-slate-500 text-sm font-semibold">
              Loading active bookings feed...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm font-semibold">
              No matching reservations found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-4">Reference</th>
                    <th className="py-4">Guest Information</th>
                    <th className="py-4">Visitation Schedule</th>
                    <th className="py-4">Reserved Deal</th>
                    <th className="py-4 text-center">Party Size</th>
                    <th className="py-4 text-right">Pre-tax Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                  {filteredBookings.map((bk) => {
                    const price = bk.offer?.offerPrice || 999;
                    const totalVal = price * bk.peopleCount;
                    return (
                      <tr key={bk.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 font-mono font-bold text-indigo-400">#BK-00{bk.id}</td>
                        <td className="py-4">
                          <p className="text-white font-bold">{bk.customerName}</p>
                          <div className="flex gap-4 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Mail size={12} /> {bk.email}</span>
                            <span className="flex items-center gap-1"><Phone size={12} /> {bk.phone}</span>
                          </div>
                        </td>
                        <td className="py-4 text-slate-300">
                          <span className="flex items-center gap-1.5"><Calendar size={12} className="text-indigo-400" /> {bk.slotTime}</span>
                        </td>
                        <td className="py-4">
                          <p className="text-white font-bold">{bk.offer?.title || "Exclusive Partner Offer"}</p>
                          <p className="text-xs text-indigo-400">{bk.offer?.businessName || "SmartOffer Brand Partner"}</p>
                        </td>
                        <td className="py-4 text-center font-bold font-mono">
                          <span className="bg-slate-900 border border-white/5 text-slate-300 px-2.5 py-1 rounded-lg text-xs flex items-center justify-center gap-1 w-16 mx-auto">
                            <Users size={12} className="text-slate-500" />
                            {bk.peopleCount}
                          </span>
                        </td>
                        <td className="py-4 text-right font-black text-emerald-400">₹{totalVal.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Bookings;
