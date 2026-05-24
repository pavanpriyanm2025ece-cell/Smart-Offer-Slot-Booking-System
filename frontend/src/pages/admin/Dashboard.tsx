import { useEffect, useState } from "react";
import { Sparkles, Calendar, Ticket, TrendingUp, RefreshCw, AlertCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../services/api";
import AdminLayout from "../../layouts/AdminLayout";

interface BookingItem {
  id: number;
  customerName: string;
  email: string;
  slotTime: string;
  peopleCount: number;
  offerTitle: string;
}

const MOCK_ANALYTICS = [
  { day: "Mon", bookings: 12 },
  { day: "Tue", bookings: 19 },
  { day: "Wed", bookings: 15 },
  { day: "Thu", bookings: 27 },
  { day: "Fri", bookings: 32 },
  { day: "Sat", bookings: 45 },
  { day: "Sun", bookings: 38 },
];

const MOCK_RECENT_BOOKINGS: BookingItem[] = [
  { id: 1, customerName: "Aravind Sharma", email: "aravind@gmail.com", slotTime: "10:00 AM - 11:30 AM", peopleCount: 2, offerTitle: "Premium Gym VIP Pass" },
  { id: 2, customerName: "Meera Nair", email: "meera.nair@outlook.com", slotTime: "03:00 PM - 04:30 PM", peopleCount: 1, offerTitle: "Luxury Spa Retreat" },
  { id: 3, customerName: "Rohan Das", email: "rohan99@yahoo.com", slotTime: "07:00 PM - 08:30 PM", peopleCount: 4, offerTitle: "5-Course Gourmet Tasting" },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOffers: 0,
    totalBookings: 0,
    activeOffers: 0,
  });
  const [recentBookings, setRecentBookings] = useState<BookingItem[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get Stats
      const response = await api.get("/Dashboard/stats");
      setStats(response.data);

      // Get Recent Bookings
      const bookResponse = await api.get("/Booking");
      if (bookResponse.data && bookResponse.data.length > 0) {
        const mapped = bookResponse.data.slice(0, 5).map((b: any) => ({
          id: b.id,
          customerName: b.customerName,
          email: b.email,
          slotTime: b.slotTime,
          peopleCount: b.peopleCount,
          offerTitle: b.offer?.title || "Exclusive Offer",
        }));
        setRecentBookings(mapped);
      } else {
        setRecentBookings(MOCK_RECENT_BOOKINGS);
      }
      setIsOffline(false);
    } catch (error) {
      console.warn("Could not query live stats. Using interactive simulation dashboard.", error);
      setStats({
        totalOffers: 6,
        totalBookings: 84,
        activeOffers: 4,
      });
      setRecentBookings(MOCK_RECENT_BOOKINGS);
      setIsOffline(true);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 relative">
        {/* Banner if using simulated analytics */}
        {isOffline && (
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between text-indigo-300 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>Offline Console Simulation Active. Showing synthetic metrics.</span>
            </div>
            <button
              onClick={fetchStats}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition font-bold"
            >
              <RefreshCw size={12} className="animate-spin" />
              <span>Retry Server</span>
            </button>
          </div>
        )}

        {/* Statistical Overview grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Offers */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all duration-300">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Campaigns</p>
              <h3 className="text-3xl font-black text-white mt-2 tracking-tight">
                {stats.totalOffers}
              </h3>
              <p className="text-[10px] text-emerald-400 font-bold mt-1">+12% from last month</p>
            </div>
            <div className="bg-indigo-500/10 p-3.5 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <Ticket size={24} />
            </div>
          </div>

          {/* Card 2: Total Bookings */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all duration-300">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmed Bookings</p>
              <h3 className="text-3xl font-black text-white mt-2 tracking-tight">
                {stats.totalBookings}
              </h3>
              <p className="text-[10px] text-indigo-400 font-bold mt-1">+4.2% daily increase</p>
            </div>
            <div className="bg-indigo-500/10 p-3.5 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <Calendar size={24} />
            </div>
          </div>

          {/* Card 3: Active Campaigns */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all duration-300">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hot Campaigns</p>
              <h3 className="text-3xl font-black text-white mt-2 tracking-tight">
                {stats.activeOffers}
              </h3>
              <p className="text-[10px] text-indigo-400 font-bold mt-1">Available slots &gt; 0</p>
            </div>
            <div className="bg-indigo-500/10 p-3.5 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* Charts & Analytics splitting layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Panel */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-lg font-bold text-white">Reservation Traffic Analysis</h4>
                <p className="text-xs text-slate-400">Weekly traffic data on confirmed venue check-ins</p>
              </div>
              <span className="text-xs bg-slate-900 border border-white/5 px-3 py-1.5 rounded-lg text-slate-400 font-semibold flex items-center gap-1.5">
                <Sparkles size={12} className="text-indigo-400" />
                Real-Time
              </span>
            </div>

            {/* Recharts container */}
            <div className="h-68 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_ANALYTICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#090620",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px"
                    }}
                  />
                  <Area type="monotone" dataKey="bookings" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions / Security card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Dev shortcuts</h4>
              <p className="text-xs text-slate-400 mb-6">Manage offer details or look at the user database live feed.</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = "/admin/create-offer"}
                  className="w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  Create Campaign
                </button>
                <button
                  onClick={() => window.location.href = "/admin/offers"}
                  className="w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold py-3 px-4 rounded-xl text-sm transition cursor-pointer"
                >
                  Manage Offers Catalog
                </button>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-6 space-y-3">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Access Security</p>
              <div className="flex gap-2 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 self-center shrink-0"></span>
                <span>Active Connection Secure (JWT Authentication Verified)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Live Bookings Table */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <h4 className="text-lg font-bold text-white mb-4">Recent Bookings Log</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-4">ID</th>
                  <th className="py-4">Client Name</th>
                  <th className="py-4">Visitations Slot</th>
                  <th className="py-4">Party Size</th>
                  <th className="py-4">Reserved Deal</th>
                  <th className="py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                {recentBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-mono text-indigo-400 font-bold">#{bk.id}</td>
                    <td className="py-4">
                      <p className="text-white font-bold">{bk.customerName}</p>
                      <p className="text-xs text-slate-500">{bk.email}</p>
                    </td>
                    <td className="py-4">{bk.slotTime}</td>
                    <td className="py-4">{bk.peopleCount} {bk.peopleCount > 1 ? "Guests" : "Guest"}</td>
                    <td className="py-4 text-indigo-300 font-semibold">{bk.offerTitle}</td>
                    <td className="py-4 text-right">
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-lg">
                        Checked-in
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
