import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  useVerifyInviteQuery,
  useRegisterDoctorMutation,
} from "../store/onboardingApiSlice";
import {
  User,
  Mail,
  Lock,
  Stethoscope,
  GraduationCap,
  MapPin,
  Clock,
  Briefcase,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";

const DoctorRegister = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const {
    data: inviteData,
    isLoading: verifying,
    isError: tokenError,
  } = useVerifyInviteQuery(token, { skip: !token });

  const [registerDoctor, { isLoading: registering, isSuccess }] =
    useRegisterDoctorMutation();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "Male",
    qualifications: "",
    universityName: "",
    universityCity: "",
    speciality: "",
    experienceYears: "",
    licenseNumber: "",
    clinicRoomNumber: "",
    bio: "",
  });

  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (inviteData?.email) {
      setFormData((prev) => ({ ...prev, email: inviteData.email }));
    }
  }, [inviteData]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFiles(Array.from(e.target.files));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (token) data.append("token", token);
    files.forEach((file) => data.append("documents", file));

    try {
      await registerDoctor(data).unwrap();
      toast.success("Application submitted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  const inputStyle =
    "w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300 shadow-sm";
  const labelStyle =
    "text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1";

  if (verifying)
    return (
      <div className="p-20 text-center font-bold text-slate-400">
        Verifying invite token...
      </div>
    );

  if (token && tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
          <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Invalid Invite
          </h2>
          <p className="text-slate-500 font-medium mb-6">
            This invitation link is invalid, expired, or has already been used.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-6 font-['Outfit']">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-teal-600 rounded-[28px] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-teal-500/40 rotate-12">
            <Stethoscope size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
            Professional Onboarding
          </h1>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Join the Al Shifa medical network. Fill in your professional
            credentials for admin verification.
          </p>
        </div>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-[40px] shadow-2xl text-center border border-teal-100"
          >
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-500/20">
              <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              Application Submitted!
            </h2>
            <p className="text-slate-500 font-semibold mb-8 max-w-md mx-auto">
              Your credentials have been securely sent to our medical board for
              review. You will receive an email once your account is approved.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-teal-600 transition-all"
            >
              Return to Home
            </button>
          </motion.div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="bg-white/70 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[40px] shadow-2xl"
          >
            {/* 1. Account Info */}
            <div className="mb-12">
              <h3 className="text-sm font-black text-teal-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <div className="w-8 h-px bg-teal-200" /> Account Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={labelStyle}>Full Professional Name</label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={onChange}
                      required
                      placeholder="Dr. Ahmed Khan"
                      className={`${inputStyle} pl-12`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>Email Address</label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={onChange}
                      required
                      disabled={!!token}
                      className={`${inputStyle} pl-12 ${token ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>Secure Password</label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={onChange}
                      required
                      placeholder="••••••••"
                      className={`${inputStyle} pl-12`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>Confirm Password</label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={onChange}
                      required
                      placeholder="••••••••"
                      className={`${inputStyle} pl-12`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Professional Details */}
            <div className="mb-12">
              <h3 className="text-sm font-black text-teal-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <div className="w-8 h-px bg-teal-200" /> Professional
                Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={labelStyle}>Speciality</label>
                  <div className="relative">
                    <Stethoscope
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="speciality"
                      value={formData.speciality}
                      onChange={onChange}
                      required
                      placeholder="e.g. Cardiologist"
                      className={`${inputStyle} pl-12`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>Academic Qualifications</label>
                  <div className="relative">
                    <GraduationCap
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={onChange}
                      required
                      placeholder="e.g. MBBS, FRCP"
                      className={`${inputStyle} pl-12`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>University Name</label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="universityName"
                      value={formData.universityName}
                      onChange={onChange}
                      required
                      placeholder="King Edward Medical Uni"
                      className={`${inputStyle} pl-12`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>University City</label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="universityCity"
                      value={formData.universityCity}
                      onChange={onChange}
                      required
                      placeholder="Lahore, Pakistan"
                      className={`${inputStyle} pl-12`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>License Number</label>
                  <div className="relative">
                    <LinkIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={onChange}
                      required
                      placeholder="PMDC-12345-X"
                      className={`${inputStyle} pl-12`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>Years of Experience</label>
                  <div className="relative">
                    <Briefcase
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="number"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={onChange}
                      required
                      placeholder="e.g. 10"
                      className={`${inputStyle} pl-12`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Clinic & Bio */}
            <div className="mb-12">
              <h3 className="text-sm font-black text-teal-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <div className="w-8 h-px bg-teal-200" /> Additional Information
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={labelStyle}>Assigned Clinic Room #</label>
                  <div className="relative">
                    <Clock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="clinicRoomNumber"
                      value={formData.clinicRoomNumber}
                      onChange={onChange}
                      required
                      placeholder="e.g. OPD-302"
                      className={`${inputStyle} pl-12`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>Professional Bio</label>
                  <div className="relative">
                    <FileText
                      className="absolute left-4 top-6 text-slate-400"
                      size={18}
                    />
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={onChange}
                      required
                      rows="4"
                      placeholder="Briefly describe your clinical focus and expertise..."
                      className={`${inputStyle} pl-12 resize-none`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Document Upload */}
            <div className="mb-12">
              <h3 className="text-sm font-black text-teal-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <div className="w-8 h-px bg-teal-200" /> Verification Docs
              </h3>
              <div className="border-2 border-dashed border-slate-200 rounded-[28px] p-10 text-center hover:border-teal-400 transition-colors group bg-slate-50/50">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="doc-upload"
                />
                <label htmlFor="doc-upload" className="cursor-pointer">
                  <Upload
                    size={48}
                    className="text-slate-300 mx-auto mb-4 group-hover:text-teal-500 transition-colors"
                  />
                  <p className="text-slate-900 font-black">
                    Upload Degree/Certificates
                  </p>
                  <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">
                    Supports PDF, JPG, PNG (Max 5 files)
                  </p>
                </label>
                {files.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {files.map((f, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[10px] font-black text-slate-600 shadow-sm border-l-2 border-l-teal-500 uppercase"
                      >
                        {f.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={registering}
              className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg uppercase tracking-widest shadow-2xl shadow-slate-900/40 hover:bg-teal-600 transition-all flex items-center justify-center gap-4"
            >
              {registering ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Enrollment...
                </>
              ) : (
                <>
                  <CheckCircle2 size={24} />
                  Complete Professional Enrollment
                </>
              )}
            </motion.button>

            <div className="mt-8 flex items-center gap-2 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <AlertCircle size={20} className="text-amber-500 shrink-0" />
              <p className="text-[10px] font-black text-amber-900 leading-tight uppercase tracking-tight">
                Important: Your account will be placed in 'Pending Approval'
                status. You will not be able to log in until an administrator
                verifies your professional credentials.
              </p>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default DoctorRegister;
