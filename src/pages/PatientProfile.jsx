import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Lock,
  Phone,
  MapPin,
  Droplets,
  AlertCircle,
  Save,
  Eye,
  EyeOff,
  Camera,
  ShieldCheck,
  Heart,
  ChevronRight,
  Mail,
  MoreVertical,
} from "lucide-react";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useChangePasswordMutation,
} from "../store/patientApiSlice";

const PatientProfile = () => {
  const dispatch = useDispatch();
  const { data: profile, isLoading } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateMyProfileMutation();
  const [changePassword, { isLoading: isChangingPwd }] =
    useChangePasswordMutation();

  const [form, setForm] = useState({
    fullname: "",
    gender: "",
    phone: "",
    address: "",
    bloodGroup: "",
    allergies: "",
    emergencyContact: "",
    medicalNotes: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState({ current: false, new: false });
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (profile) {
      setForm({
        fullname: profile.fullname || "",
        gender: profile.gender || "",
        phone: profile.phone || "",
        address: profile.address || "",
        bloodGroup: profile.bloodGroup || "",
        allergies: profile.allergies || "",
        emergencyContact: profile.emergencyContact || "",
        medicalNotes: profile.medicalNotes || "",
      });
    }
  }, [profile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append("image", imageFile);
      await updateProfile(formData).unwrap();
      toast.success("Profile refined successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const handleChangePassword = async () => {
    if (pwdForm.newPassword !== pwdForm.confirmPassword)
      return toast.error("New passwords do not match");
    try {
      await changePassword({
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      }).unwrap();
      toast.success("Security credentials updated!");
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.data?.message || "Password change failed");
    }
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    borderRadius: "28px",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
  };

  const inputClass =
    "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition-all placeholder:text-slate-300";
  const labelClass =
    "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block";

  const getInitials = (n) =>
    n
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (isLoading)
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-['Outfit']">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto border border-teal-100 animate-pulse">
            <User size={24} className="text-teal-400" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Loading Profile Grid...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-['Outfit'] text-slate-900 overflow-hidden relative">
      {/* Background Decor */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-100/30 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-2 text-teal-600 font-bold tracking-widest uppercase text-xs mb-3">
              <ShieldCheck size={14} />
              Identity Management
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2">
              My{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
                Identity
              </span>
            </h1>
            <p className="text-slate-500 font-medium">
              Refine your public profile and clinical preference settings.
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
            {[
              { id: "profile", label: "Overview", icon: <User size={14} /> },
              { id: "password", label: "Security", icon: <Lock size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hide-mobile-label flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "profile" ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-10"
            >
              {/* Profile Card Mini */}
              <div
                style={cardStyle}
                className="p-8 relative overflow-hidden group"
              >
                <div className="absolute top-[-50%] right-[-20%] w-[300px] h-[300px] bg-teal-500/5 blur-[80px] rounded-full" />

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <div className="relative group/avatar">
                    <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white text-4xl font-black">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : profile?.image && profile.image !== "no-photo.jpg" ? (
                        <img
                          src={profile.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(profile?.fullname)
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center border-2 border-white cursor-pointer hover:bg-teal-600 transition-colors shadow-lg">
                      <Camera size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        {profile?.fullname}
                      </h2>
                      <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 lowercase tracking-tight">
                          <Mail size={12} /> {profile?.email}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 lowercase tracking-tight">
                          <Phone size={12} />{" "}
                          {profile?.phone || "No device linked"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <div className="px-4 py-1.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Droplets size={12} fill="currentColor" /> Blood Group:{" "}
                        {profile?.bloodGroup || "—"}
                      </div>
                      <div className="px-4 py-1.5 bg-teal-50 border border-teal-100 rounded-xl text-teal-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={12} /> Verified Identity
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block">
                    <div className="w-24 h-24 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center justify-center shadow-inner">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Health
                      </p>
                      <p className="text-2xl font-black text-slate-800 tracking-tighter">
                        Gold
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div style={cardStyle} className="p-10">
                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <MoreVertical size={20} className="text-teal-500" /> Identity
                  Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Legal Full Name</label>
                      <input
                        type="text"
                        value={form.fullname}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, fullname: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Gender</label>
                        <select
                          value={form.gender}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, gender: e.target.value }))
                          }
                          className={inputClass}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Blood Group</label>
                        <select
                          value={form.bloodGroup}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              bloodGroup: e.target.value,
                            }))
                          }
                          className={inputClass}
                        >
                          <option value="">Select</option>
                          {[
                            "A+",
                            "A-",
                            "B+",
                            "B-",
                            "AB+",
                            "AB-",
                            "O+",
                            "O-",
                          ].map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Primary Contact</label>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="+92 3xx xxxxxxx"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Physical Address</label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, address: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="Street, District, City"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Emergency Contact</label>
                      <input
                        type="text"
                        value={form.emergencyContact}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            emergencyContact: e.target.value,
                          }))
                        }
                        className={inputClass}
                        placeholder="+92 3xx xxxxxxx"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Known Allergies</label>
                      <input
                        type="text"
                        value={form.allergies}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, allergies: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="e.g. Penicillin, Peanuts"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-10 border-t border-slate-100 flex flex-col md:flex-row md:items-end gap-10">
                  <div className="flex-1">
                    <label className={labelClass}>Clinical Notes / Bio</label>
                    <textarea
                      rows={3}
                      value={form.medicalNotes}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, medicalNotes: e.target.value }))
                      }
                      className={`${inputClass} resize-none`}
                      placeholder="Brief summary of your clinical journey..."
                    />
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-12 py-5 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shrink-0"
                  >
                    {isSaving ? (
                      <MoreVertical size={20} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    Update Profile
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div style={cardStyle} className="p-12">
                <div className="text-center mb-12">
                  <div className="w-20 h-20 bg-teal-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-teal-100 shadow-sm">
                    <Lock size={32} className="text-teal-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 italic">
                    Security Credentials
                  </h3>
                  <p className="text-slate-400 font-medium">
                    Refine your secret access keys to maintain privacy.
                  </p>
                </div>

                <div className="space-y-8">
                  {[
                    {
                      label: "Current Password",
                      key: "currentPassword",
                      show: "current",
                    },
                    {
                      label: "New Secret Key",
                      key: "newPassword",
                      show: "new",
                    },
                    {
                      label: "Repeat Secret Key",
                      key: "confirmPassword",
                      show: null,
                    },
                  ].map((row) => (
                    <div key={row.key}>
                      <label className={labelClass}>{row.label}</label>
                      <div className="relative">
                        <input
                          type={
                            row.show && showPwd[row.show] ? "text" : "password"
                          }
                          value={pwdForm[row.key]}
                          onChange={(e) =>
                            setPwdForm((p) => ({
                              ...p,
                              [row.key]: e.target.value,
                            }))
                          }
                          className={inputClass}
                          placeholder="********"
                        />
                        {row.show && (
                          <button
                            onClick={() =>
                              setShowPwd((p) => ({
                                ...p,
                                [row.show]: !p[row.show],
                              }))
                            }
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-teal-500 transition-colors"
                          >
                            {showPwd[row.show] ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleChangePassword}
                    disabled={
                      isChangingPwd ||
                      !pwdForm.currentPassword ||
                      !pwdForm.newPassword
                    }
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-teal-600 transition-all flex items-center justify-center gap-3"
                  >
                    {isChangingPwd ? (
                      <MoreVertical size={20} className="animate-spin" />
                    ) : (
                      <Lock size={18} />
                    )}
                    Update Credentials
                  </button>

                  <div className="flex items-center gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 grayscale hover:grayscale-0 transition-all">
                    <ShieldCheck size={28} className="text-blue-500 shrink-0" />
                    <div className="text-[10px] font-medium text-blue-800">
                      <span className="font-black uppercase tracking-widest block mb-0.5">
                        Dual Authentication Recommended
                      </span>
                      Password should be at least 12 characters with symbols for
                      maximum clinical data safety.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="mt-20 flex flex-col items-center gap-4 opacity-40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Heart size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Endorsed Patient
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Privacy Protected
              </span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 text-center">
            Clinical Profile v2.4 • Last refined on{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
