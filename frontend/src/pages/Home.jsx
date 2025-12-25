import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  // Animation variants for stagger effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-32 px-6 flex items-center justify-center min-h-[80vh]">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-cyan-500/10 rounded-full blur-[80px] md:blur-[100px] -z-10" />

        <motion.div
          className="max-w-4xl w-full mx-auto text-center space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <span className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs md:text-sm font-medium tracking-wide shadow-lg shadow-cyan-500/10">
              🚀 The Ultimate Freelancer Tool
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Track Time. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Get Paid Faster.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Effortlessly log work sessions, manage clients, and generate professional PDF invoices in seconds. Stop wasting time on admin work.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-6 px-4"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold rounded-xl text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
              >
                Start for Free
              </motion.button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700 transition-all"
              >
                Log In
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 px-6 bg-gray-900/50 backdrop-blur-sm border-y border-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 px-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to run your business
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Simple, powerful tools designed specifically for modern freelancers and agencies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
            <FeatureCard
              icon="⏱️"
              title="Real-time Timer"
              desc="Start and stop timers as you work. We calculate the billable hours automatically so you don't have to."
            />
            <FeatureCard
              icon="📝"
              title="Manual Logging"
              desc="Forgot to start the timer? No problem. Log manual entries with custom dates, hours, and notes."
            />
            <FeatureCard
              icon="📄"
              title="Instant Invoices"
              desc="Turn your work sessions into professional PDF invoices with one click. Send them to clients and get paid."
            />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-gray-400">Three steps to organized chaos.</p>
          </div>

          <div className="space-y-12 relative px-4 md:px-0">
            {/* Connecting Line (Desktop Only) */}
            <div className="absolute left-[43px] top-4 bottom-10 w-0.5 bg-gray-800 -z-10 hidden md:block" />

            <Step
              number="1"
              title="Add Your Clients"
              desc="Create profiles for the people you work for. Set default hourly rates to automate calculations."
            />
            <Step
              number="2"
              title="Track Your Work"
              desc="Use the dashboard timer or manual entry form to log exactly what you worked on and for how long."
            />
            <Step
              number="3"
              title="Generate & Send"
              desc="Select your unbilled sessions, click 'Generate Invoice', and download your PDF ready for email."
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-8 md:p-12 rounded-3xl max-w-4xl mx-auto shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to take control?
          </h2>
          <p className="text-gray-400 mb-8 text-lg max-w-xl mx-auto">
            Join other freelancers who are saving hours on admin work every week. No credit card required.
          </p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold rounded-xl text-lg shadow-lg w-full sm:w-auto"
            >
              Get Started Now
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 bg-gray-900 border border-gray-800 rounded-2xl shadow-lg hover:shadow-cyan-900/20 hover:border-cyan-500/30 transition-all group flex flex-col items-center text-center"
    >
      <div className="text-4xl mb-6 bg-gray-800 w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed text-sm md:text-base">{desc}</p>
    </motion.div>
  );
}

function Step({ number, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex flex-col md:flex-row gap-4 md:gap-10 items-center md:items-start text-center md:text-left"
    >
      <div className="shrink-0 w-14 h-14 rounded-full bg-cyan-900/30 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 text-xl font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] z-10 bg-gray-950">
        {number}
      </div>
      <div className="pt-2">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-lg leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}