import { useLocation, useNavigate } from "react-router-dom";
import { Check, Sparkles, Printer, Calendar, ArrowLeft, ShieldCheck } from "lucide-react";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Try to read state passed from booking navigation
  const bookingDetails = location.state || {
    customerName: "Valued Customer",
    email: "customer@gmail.com",
    phone: "+91 98765 43210",
    slotTime: "10:00 AM - 11:30 AM",
    peopleCount: 1,
    offerTitle: "Exclusive VIP Experience Deal",
    businessName: "SmartOffer Partner Brand",
    offerPrice: 999,
    reference: "BK-SO-" + Math.floor(100000 + Math.random() * 900000),
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen text-slate-100 flex items-center justify-center p-4 md:p-8 relative">
      {/* Decorative Lights */}
      <div className="absolute top-[20%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-emerald-950/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-indigo-950/20 blur-[130px] pointer-events-none" />

      <div className="max-w-xl w-full flex flex-col items-center">
        {/* Success Icon Animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl scale-125 animate-pulse" />
          <div className="relative bg-gradient-to-tr from-emerald-500 to-green-400 text-slate-950 rounded-full w-24 h-24 flex items-center justify-center text-4xl font-extrabold shadow-2xl shadow-emerald-500/20 border-4 border-slate-950">
            <Check className="w-12 h-12 stroke-[3.5]" />
          </div>
        </div>

        {/* Greeting Banner */}
        <h1 className="text-3xl md:text-4xl font-black text-center mb-2 tracking-tight">
          Booking Verified!
        </h1>
        <p className="text-center text-slate-400 text-sm md:text-base max-w-sm mb-8 leading-relaxed">
          Your slot has been reserved. Show this digital slip at the counter.
        </p>

        {/* Digital Ticket Slip Card */}
        <div className="w-full bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative print:bg-white print:text-black print:border-black">
          {/* Accent Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />

          {/* Ticket Body */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mb-1">Reservation Receipt</p>
                <h3 className="text-xl font-bold tracking-tight text-white print:text-black">
                  {bookingDetails.offerTitle}
                </h3>
                <p className="text-xs font-semibold text-indigo-400">
                  by {bookingDetails.businessName}
                </p>
              </div>
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
                Confirmed
              </span>
            </div>

            {/* Dotted separator */}
            <div className="border-t border-dashed border-white/10 my-4" />

            {/* Ticket Info Matrix */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-0.5">Booking Reference</p>
                <p className="font-mono text-slate-200 font-extrabold tracking-wider print:text-black">
                  {bookingDetails.reference || "BK20260524001"}
                </p>
              </div>

              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-0.5">Customer Name</p>
                <p className="text-slate-200 font-extrabold print:text-black">
                  {bookingDetails.customerName}
                </p>
              </div>

              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-0.5">Visitation Slot</p>
                <p className="text-slate-200 font-extrabold flex items-center gap-1.5 print:text-black">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  {bookingDetails.slotTime}
                </p>
              </div>

              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-0.5">Party Size</p>
                <p className="text-slate-200 font-extrabold print:text-black">
                  {bookingDetails.peopleCount} {bookingDetails.peopleCount > 1 ? "People" : "Person"}
                </p>
              </div>
            </div>

            {/* Dotted separator */}
            <div className="border-t border-dashed border-white/10 my-4" />

            {/* Cost Details */}
            <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-white/5 print:bg-slate-100">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Amount to Pay at Venue</p>
                <p className="text-xs text-emerald-400 font-bold">No booking charges online</p>
              </div>
              <span className="text-2xl font-black text-indigo-400 print:text-black">
                ₹{(bookingDetails.offerPrice * bookingDetails.peopleCount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Centre */}
        <div className="w-full mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 group bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Discover More Deals</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 glow-btn bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/40 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Reservation Slip</span>
          </button>
        </div>

        {/* Support & Secure badges */}
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-600 font-semibold tracking-wider uppercase">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Guaranteed booking confirmation. See you there!</span>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

