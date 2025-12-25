import { motion } from "framer-motion";

export default function AddClientForm({ form, updateField, onSubmit, submitting }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />

      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-3xl">✨</span> Summon New Client
      </h3>

      <form className="grid md:grid-cols-2 gap-6" onSubmit={onSubmit}>
        <InputGroup 
          label="The Boss (Name)" 
          placeholder="e.g. Tony Stark" 
          value={form.name} 
          onChange={(v) => updateField("name", v)} 
          required 
        />
        <InputGroup 
          label="Digital Coordinates (Email)" 
          placeholder="money@bags.com" 
          value={form.email} 
          onChange={(v) => updateField("email", v)} 
        />
        <InputGroup 
          label="Stonks ($ / Hour)" 
          placeholder="5000" 
          type="number"
          value={form.hourlyRate} 
          onChange={(v) => updateField("hourlyRate", v)} 
        />
        <InputGroup 
          label="Secret Intel (Notes)" 
          placeholder="Likes coffee, hates Comic Sans..." 
          value={form.notes} 
          onChange={(v) => updateField("notes", v)} 
        />

        <div className="md:col-span-2 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 transition-all flex items-center gap-2"
          >
            {submitting ? (
              <><span className="animate-spin">🌀</span> Processing...</>
            ) : (
              <>Add to Empire 🚀</>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

// Helper for inputs to keep JSX clean
function InputGroup({ label, type = "text", placeholder, value, onChange, required }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase text-gray-500 tracking-wider ml-1">{label}</label>
      <motion.input
        whileFocus={{ scale: 1.01, borderColor: "#22d3ee" }}
        type={type}
        className="w-full px-4 py-3 rounded-xl bg-gray-950/50 border border-gray-700 text-gray-200 focus:outline-none transition-all placeholder-gray-600"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}