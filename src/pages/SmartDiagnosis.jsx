import { useState } from "react";
import { useGetSmartDiagnosisMutation } from "../store/aiApiSlice";
import { useForm } from "react-hook-form";
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  Activity,
  FileText,
} from "lucide-react";

const SmartDiagnosis = () => {
  const { register, handleSubmit, reset } = useForm();
  const [getDiagnosis, { isLoading }] = useGetSmartDiagnosisMutation();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      setError(null);
      const res = await getDiagnosis(data).unwrap();
      setResult(res.data);
    } catch (err) {
      setError(
        "Failed to fetch diagnosis. AI may be down. Please proceed manually.",
      );
      console.error(err);
    }
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-teal-500 p-3 rounded-lg text-white">
          <Brain size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Smart Diagnosis Toolkit
          </h2>
          <p className="text-slate-500">
            AI-powered clinical assessment assistant for doctors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-teal-600" /> Patient Details
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  {...register("age")}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="e.g. 45"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  {...register("gender")}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Medical History
              </label>
              <textarea
                {...register("history")}
                rows="2"
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                placeholder="Past illnesses, chronic conditions, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Current Symptoms <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("symptoms", { required: true })}
                rows="4"
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                placeholder="Describe the current symptoms in detail..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-teal-600 text-white font-medium rounded hover:bg-teal-700 transition-colors flex justify-center items-center gap-2 disabled:bg-teal-400"
            >
              {isLoading ? (
                <>Processing AI Analysis...</>
              ) : (
                <>
                  <Brain size={18} /> Run Smart Diagnosis
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setResult(null);
                setError(null);
              }}
              className="w-full py-2 bg-slate-100 text-slate-600 font-medium rounded hover:bg-slate-200 transition-colors mt-2"
            >
              Clear Form
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 h-full min-h-[500px]">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="shrink-0 mt-0.5" size={20} />
              <p>{error}</p>
            </div>
          )}

          {!result && !isLoading && !error && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
              <Brain size={64} className="mb-4 opacity-50 text-slate-300" />
              <p className="text-lg">Awaiting Patient Data</p>
              <p className="text-sm max-w-xs mt-2">
                Enter symptoms and patient details to let AI assist with the
                diagnosis.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-teal-600">
              <div className="animate-pulse flex flex-col items-center">
                <Brain size={48} className="mb-4" />
                <p className="font-medium text-lg">Analyzing symptoms...</p>
                <p className="text-sm text-slate-500 mt-2 text-center max-w-xs">
                  Comparing against medical databases to suggest possible
                  conditions.
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              <div
                className={`p-4 rounded-lg flex justify-between items-center bg-white border border-slate-200 shadow-sm`}
              >
                <div className="flex items-center gap-2 font-medium text-slate-700">
                  <Activity size={20} /> Risk Assessment
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-bold border ${getRiskColor(result.riskLevel)} capitalize`}
                >
                  {result.riskLevel} Risk
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Possible Conditions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.possibleConditions?.map((condition, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={16} /> Brief Explanation
                </h4>
                <p className="text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200 text-sm">
                  {result.briefExplanation}
                </p>
              </div>

              {result.suggestedTests?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Suggested Tests
                  </h4>
                  <ul className="space-y-2">
                    {result.suggestedTests.map((test, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-700 bg-white p-3 rounded border border-slate-100 shadow-sm"
                      >
                        <CheckCircle
                          size={16}
                          className="text-teal-500 mt-0.5 shrink-0"
                        />
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-400 italic text-center">
                  Disclaimer: AI diagnosis is for informational purposes only.
                  The final clinical decision must be made by the attending
                  physician.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartDiagnosis;
