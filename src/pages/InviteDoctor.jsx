import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useInviteDoctorMutation } from "../store/onboardingApiSlice";
import { toast } from "react-hot-toast";

const InviteDoctor = () => {
  const [email, setEmail] = useState("");
  const [inviteDoctor, { isLoading, isSuccess }] = useInviteDoctorMutation();

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await inviteDoctor({ email }).unwrap();
      toast.success("Invite sent successfully!");
      setEmail("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send invite");
    }
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    borderRadius: "28px",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 font-['Outfit']">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={cardStyle}
        className="w-full max-w-lg p-10 text-center"
      >
        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-teal-600 border border-teal-100/50">
          <Mail size={32} />
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-2">
          Invite a Doctor
        </h1>
        <p className="text-slate-500 font-medium mb-8">
          Send a secure registration link to a professional medical
          practitioner.
        </p>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700"
          >
            <CheckCircle2 size={40} className="mx-auto mb-3" />
            <h3 className="font-black mb-1">Invitation Sent!</h3>
            <p className="text-sm font-medium">
              The doctor will receive an email with instructions to join the
              platform.
            </p>
            <button
              onClick={() => setEmail("")}
              className="mt-6 font-bold text-teal-600 hover:text-teal-700 text-sm"
            >
              Send another invite
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleInvite} className="space-y-6">
            <div className="text-left">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">
                Doctor's Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@professional.com"
                  required
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:bg-teal-600 transition-all"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={20} />
                  Send Invite Link
                </>
              )}
            </motion.button>

            <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl text-left border border-slate-100">
              <AlertCircle size={20} className="text-slate-400 shrink-0" />
              <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                This link will expire in 48 hours and can only be used once for
                registration.
              </p>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default InviteDoctor;
