// // import React, { useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import {
// //   GiCrossedSwords,
// //   GiGamepad,
// //   GiTrophy,
// //   GiPerspectiveDiceSixFacesRandom,
// //   GiLightningHelix,
// //   GiShield,
// //   GiWallet,
// //   GiFlame,
// //   GiStarMedal,
// // } from 'react-icons/gi';
// // import {
// //   FaTelegram,
// //   FaDiscord,
// //   FaTwitter,
// //   FaFacebook,
// //   FaQuoteLeft,
// //   FaChevronDown,
// // } from 'react-icons/fa';

// // export default function LandingPage() {
// //   const [openFaq, setOpenFaq] = useState(null);

// //   const toggleFaq = (idx) => {
// //     setOpenFaq(openFaq === idx ? null : idx);
// //   };

// //   const gamesList = [
// //     {
// //       id: '1v1',
// //       title: '1v1 Skill Duels',
// //       tag: 'COMPETITIVE',
// //       desc: 'Challenge real opponents in instant-match, skill-based mini-games for real cash stakes.',
// //       icon: <GiCrossedSwords className="text-4xl text-amber-400" />,
// //       gradient: 'from-amber-500/20 to-orange-600/10',
// //       border: 'border-amber-500/30',
// //     },
// //     {
// //       id: 'lucky-spin',
// //       title: 'Lucky Wheel',
// //       tag: 'DAILY REWARDS',
// //       desc: 'Spin daily to win guaranteed instant bonus multipliers, jackpot tokens, and cash prizes.',
// //       icon: <GiPerspectiveDiceSixFacesRandom className="text-4xl text-purple-400" />,
// //       gradient: 'from-purple-500/20 to-indigo-600/10',
// //       border: 'border-purple-500/30',
// //     },
// //     {
// //       id: 'tournaments',
// //       title: 'Bracket Tournaments',
// //       tag: 'BIG PRIZE POOLS',
// //       desc: 'Climb the ladder against hundreds of players in scheduled weekly esports showdowns.',
// //       icon: <GiTrophy className="text-4xl text-yellow-400" />,
// //       gradient: 'from-yellow-500/20 to-amber-600/10',
// //       border: 'border-yellow-500/30',
// //     },
// //     {
// //       id: 'daily-quests',
// //       title: 'Daily Quests',
// //       tag: 'FREE EXP',
// //       desc: 'Complete daily micro-challenges to unlock free entry passes and multiplier boosts.',
// //       icon: <GiGamepad className="text-4xl text-emerald-400" />,
// //       gradient: 'from-emerald-500/20 to-teal-600/10',
// //       border: 'border-emerald-500/30',
// //     },
// //   ];

// //   const features = [
// //     {
// //       title: 'Instant Local Payouts',
// //       desc: 'Direct integration with Telebirr, CBE Birr, and major local bank transfers.',
// //       icon: <GiWallet className="text-3xl text-amber-400" />,
// //     },
// //     {
// //       title: 'Anti-Cheat Server Tech',
// //       desc: 'Server-side engine validation ensures zero cheating and 100% fair matchmaking.',
// //       icon: <GiShield className="text-3xl text-purple-400" />,
// //     },
// //     {
// //       title: 'Ultra-Low Latency',
// //       desc: 'Engineered for smooth 60 FPS gameplay even on standard 3G/4G networks.',
// //       icon: <GiLightningHelix className="text-3xl text-blue-400" />,
// //     },
// //   ];

// //   const leaderboards = [
// //     { rank: 1, name: 'Abebe_Pro', score: '18,450 ETB', avatar: '🥇', winRate: '88%' },
// //     { rank: 2, name: 'Selam_Gamer', score: '14,200 ETB', avatar: '🥈', winRate: '82%' },
// //     { rank: 3, name: 'Yared_King', score: '11,900 ETB', avatar: '🥉', winRate: '79%' },
// //     { rank: 4, name: 'Tigist_Win', score: '9,400 ETB', avatar: '🎮', winRate: '74%' },
// //   ];

// //   const testimonials = [
// //     {
// //       name: 'Dawit Tadesse',
// //       role: 'Top Tournament Contender',
// //       quote:
// //         'The payouts via Telebirr are instant! I play 1v1 challenges in my free time and cash out daily without any hassle.',
// //       avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
// //     },
// //     {
// //       name: 'Marta Hailu',
// //       role: 'Daily Spin Winner',
// //       quote:
// //         'Hit the 5,000 ETB daily multiplier on my third spin! Highly responsive, smooth on phone data, and totally legit.',
// //       avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
// //     },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden relative">
// //       {/* Background Neon Glow Orbs */}
// //       <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
// //       <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

// //       {/* ==========================================
// //           1. NAVBAR
// //          ========================================== */}
// //       <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 px-4 sm:px-8 py-4">
// //         <div className="max-w-7xl mx-auto flex items-center justify-between">
// //           <Link to="/" className="flex items-center space-x-2 group">
// //             <GiCrossedSwords className="text-3xl text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
// //             <span className="text-xl sm:text-2xl font-black tracking-wider text-white">
// //               ETHIO<span className="text-amber-400">ARENA</span>
// //             </span>
// //           </Link>

// //           <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-300">
// //             <a href="#games" className="hover:text-amber-400 transition-colors">Games</a>
// //             <a href="#features" className="hover:text-amber-400 transition-colors">Features</a>
// //             <a href="#leaderboard" className="hover:text-amber-400 transition-colors">Leaderboard</a>
// //             <a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a>
// //           </div>

// //           <div className="flex items-center space-x-3">
// //             <Link
// //               to="/login"
// //               className="px-4 py-2 text-xs sm:text-sm font-bold text-gray-200 hover:text-white transition-colors"
// //             >
// //               Sign In
// //             </Link>
// //             <Link
// //               to="/register"
// //               className="px-5 py-2.5 text-xs sm:text-sm font-extrabold rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-0.5"
// //             >
// //               Play Now
// //             </Link>
// //           </div>
// //         </div>
// //       </nav>

// //       {/* ==========================================
// //           2. HERO SECTION
// //          ========================================== */}
// //       <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
// //         <div className="text-center space-y-8 max-w-4xl mx-auto">
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.6 }}
// //             className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold"
// //           >
// //             <GiFlame className="text-lg animate-pulse" />
// //             <span>Ethiopia's #1 Skill-Based Gaming Platform</span>
// //           </motion.div>

// //           <motion.h1
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.6, delay: 0.1 }}
// //             className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white"
// //           >
// //             Compete, Win & Cash Out <br />
// //             <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
// //               Instantly in ETB
// //             </span>
// //           </motion.h1>

// //           <motion.p
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.6, delay: 0.2 }}
// //             className="text-gray-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed"
// //           >
// //             Engage in head-to-head 1v1 duels, spin daily lucky wheels, and conquer leaderboard brackets. Fast matchmaking, secure payments via Telebirr.
// //           </motion.p>

// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.6, delay: 0.3 }}
// //             className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
// //           >
// //             <Link
// //               to="/register"
// //               className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-1 text-center"
// //             >
// //               Get Free Daily Spin
// //             </Link>
// //             <a
// //               href="#games"
// //               className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-lg transition-all text-center"
// //             >
// //               Explore Game Modes
// //             </a>
// //           </motion.div>
// //         </div>
// //       </section>

// //       {/* ==========================================
// //           3. STATS STRIP
// //          ========================================== */}
// //       <section className="py-10 border-y border-white/10 bg-black/30 backdrop-blur-md relative z-10">
// //         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
// //           {[
// //             { label: 'Active Players', val: '50,000+' },
// //             { label: 'Paid Out (ETB)', val: '2.5M+' },
// //             { label: 'Avg Match Time', val: '< 30s' },
// //             { label: 'Instant Payouts', val: '24/7' },
// //           ].map((stat, i) => (
// //             <div key={i} className="space-y-1">
// //               <div className="text-2xl sm:text-4xl font-black text-amber-400">{stat.val}</div>
// //               <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* ==========================================
// //           4. GAME MODES SECTION
// //          ========================================== */}
// //       <section id="games" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
// //         <div className="text-center space-y-4 mb-16">
// //           <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
// //             Choose Your <span className="text-amber-400">Battleground</span>
// //           </h2>
// //           <p className="text-gray-400 max-w-xl mx-auto">
// //             From rapid 1v1 skill matches to high-stakes tournaments, pick your game and start earning.
// //           </p>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //           {gamesList.map((game) => (
// //             <div
// //               key={game.id}
// //               className={`p-6 rounded-[24px] bg-gradient-to-b ${game.gradient} border ${game.border} backdrop-blur-xl hover:translate-y-[-6px] transition-all duration-300 flex flex-col justify-between group`}
// //             >
// //               <div className="space-y-4">
// //                 <div className="flex items-center justify-between">
// //                   <div className="p-3 rounded-2xl bg-white/5 border border-white/10">{game.icon}</div>
// //                   <span className="text-[10px] font-extrabold tracking-widest px-3 py-1 rounded-full bg-white/10 text-white border border-white/10">
// //                     {game.tag}
// //                   </span>
// //                 </div>
// //                 <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
// //                   {game.title}
// //                 </h3>
// //                 <p className="text-sm text-gray-400 leading-relaxed">{game.desc}</p>
// //               </div>

// //               <Link
// //                 to="/register"
// //                 className="mt-8 w-full py-3 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-black font-bold text-xs uppercase tracking-wider transition-all text-center block"
// //               >
// //                 Enter Arena
// //               </Link>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* ==========================================
// //           5. FEATURES / PLATFORM HIGHLIGHTS
// //          ========================================== */}
// //       <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/40 border-y border-white/10 relative z-10">
// //         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
// //           {features.map((feat, idx) => (
// //             <div
// //               key={idx}
// //               className="p-8 rounded-[24px] bg-white/[0.02] border border-white/10 flex flex-col items-start space-y-4 hover:border-amber-500/40 transition-colors"
// //             >
// //               <div className="p-4 rounded-2xl bg-white/5 border border-white/10">{feat.icon}</div>
// //               <h3 className="text-xl font-bold text-white">{feat.title}</h3>
// //               <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* ==========================================
// //           6. LIVE LEADERBOARD SHOWCASE
// //          ========================================== */}
// //       <section id="leaderboard" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
// //         <div className="text-center space-y-4 mb-12">
// //           <div className="inline-flex items-center space-x-2 text-amber-400 font-bold text-sm tracking-wider uppercase">
// //             <GiStarMedal className="text-xl" />
// //             <span>Top Earners This Week</span>
// //           </div>
// //           <h2 className="text-3xl sm:text-5xl font-black">Hall of Champions</h2>
// //         </div>

// //         <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[30px] p-4 sm:p-8 space-y-4 shadow-2xl">
// //           {leaderboards.map((player) => (
// //             <div
// //               key={player.rank}
// //               className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all"
// //             >
// //               <div className="flex items-center space-x-4">
// //                 <span className="text-2xl font-black w-8 text-center text-amber-400">
// //                   {player.avatar}
// //                 </span>
// //                 <div>
// //                   <div className="font-bold text-white text-base sm:text-lg">{player.name}</div>
// //                   <div className="text-xs text-gray-400">Win Rate: {player.winRate}</div>
// //                 </div>
// //               </div>
// //               <div className="text-right">
// //                 <div className="text-amber-400 font-black text-lg sm:text-xl">{player.score}</div>
// //                 <div className="text-[10px] text-gray-400 uppercase tracking-widest">Total Earned</div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* ==========================================
// //           7. TESTIMONIALS
// //          ========================================== */}
// //       <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
// //         <div className="text-center space-y-4 mb-16">
// //           <h2 className="text-3xl sm:text-5xl font-black">What Players Say</h2>
// //           <p className="text-gray-400 max-w-lg mx-auto">Real players, real stakes, and verified instant payouts.</p>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //           {testimonials.map((t, idx) => (
// //             <motion.div
// //               key={idx}
// //               whileHover={{ y: -5 }}
// //               className="p-8 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-6 relative"
// //             >
// //               <FaQuoteLeft className="text-3xl text-amber-500/20 absolute top-6 right-6" />
// //               <p className="text-gray-300 italic text-base leading-relaxed">"{t.quote}"</p>
// //               <div className="flex items-center space-x-4 pt-2">
// //                 <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-amber-400/50" />
// //                 <div>
// //                   <h4 className="text-sm font-bold text-white">{t.name}</h4>
// //                   <p className="text-xs text-gray-400">{t.role}</p>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* ==========================================
// //           8. FAQ SECTION
// //          ========================================== */}
// //       <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 bg-black/40">
// //         <div className="max-w-4xl mx-auto space-y-12">
// //           <div className="text-center space-y-4">
// //             <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
// //               Frequently Asked <span className="text-amber-400">Questions</span>
// //             </h2>
// //             <p className="text-gray-400 max-w-xl mx-auto">
// //               Everything you need to know about getting started, deposits, and payouts.
// //             </p>
// //           </div>

// //           <div className="space-y-4">
// //             {[
// //               {
// //                 q: 'How do I deposit and withdraw money?',
// //                 a: 'We support local payment systems including Telebirr, CBE Birr, and major local bank transfers. Withdrawals are processed instantly to your specified wallet or bank account.',
// //               },
// //               {
// //                 q: 'Are the games fair and cheat-free?',
// //                 a: 'Yes! All 1v1 challenges and tournament mechanics operate with server-side validation and anti-cheat protection to guarantee purely skill-based outcomes.',
// //               },
// //               {
// //                 q: 'How does the Lucky Spin work?',
// //                 a: 'Every registered user receives a free spin daily. Additional spins can be unlocked by completing daily challenges or reaching specific leaderboard thresholds.',
// //               },
// //               {
// //                 q: 'Can I play on low-speed internet connections?',
// //                 a: 'Absolutely. The platform is optimized for low latency and compressed data payloads, ensuring smooth 60 FPS performance even on mobile data networks.',
// //               },
// //             ].map((faq, idx) => (
// //               <div
// //                 key={idx}
// //                 className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[20px] overflow-hidden transition-colors hover:border-amber-500/30"
// //               >
// //                 <button
// //                   onClick={() => toggleFaq(idx)}
// //                   className="w-full p-6 text-left flex justify-between items-center space-x-4 focus:outline-none"
// //                 >
// //                   <span className="font-bold text-white text-base sm:text-lg">{faq.q}</span>
// //                   <FaChevronDown
// //                     className={`text-amber-400 text-xl transition-transform duration-300 flex-shrink-0 ${
// //                       openFaq === idx ? 'rotate-180' : ''
// //                     }`}
// //                   />
// //                 </button>
// //                 <AnimatePresence>
// //                   {openFaq === idx && (
// //                     <motion.div
// //                       initial={{ height: 0, opacity: 0 }}
// //                       animate={{ height: 'auto', opacity: 1 }}
// //                       exit={{ height: 0, opacity: 0 }}
// //                       transition={{ duration: 0.3 }}
// //                       className="overflow-hidden"
// //                     >
// //                       <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
// //                         {faq.a}
// //                       </div>
// //                     </motion.div>
// //                   )}
// //                 </AnimatePresence>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* ==========================================
// //           9. CALL TO ACTION (CTA)
// //          ========================================== */}
// //       <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
// //         <div className="max-w-5xl mx-auto relative rounded-[30px] p-8 sm:p-14 bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-blue-600/20 border border-white/15 backdrop-blur-2xl text-center space-y-8 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
// //           <div className="space-y-4 max-w-2xl mx-auto">
// //             <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
// //               Ready to Claim Your Place on the <span className="text-amber-400">Leaderboard?</span>
// //             </h2>
// //             <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
// //               Sign up today, claim your daily spin bonus, and start competing against top players across Ethiopia for real cash rewards!
// //             </p>
// //           </div>

// //           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
// //             <Link
// //               to="/register"
// //               className="w-full sm:w-auto px-10 py-4 rounded-[20px] font-extrabold text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-1 text-center"
// //             >
// //               Create Account Now
// //             </Link>
// //           </div>
// //         </div>
// //       </section>

// //       {/* ==========================================
// //           10. FOOTER
// //          ========================================== */}
// //       <footer className="border-t border-white/10 bg-black/60 pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
// //         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
// //           <div className="space-y-4 md:col-span-1">
// //             <div className="flex items-center space-x-2">
// //               <GiCrossedSwords className="text-3xl text-amber-400" />
// //               <span className="text-xl font-black tracking-wider text-white">
// //                 ETHIO<span className="text-amber-400">ARENA</span>
// //               </span>
// //             </div>
// //             <p className="text-xs text-gray-400 leading-relaxed">
// //               The premier competitive gaming and lucky spin platform in Ethiopia. Fair play, fast matching, and instant local payouts.
// //             </p>
// //           </div>

// //           <div>
// //             <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
// //             <ul className="space-y-2 text-xs text-gray-400 font-medium">
// //               <li><a href="#games" className="hover:text-amber-400 transition-colors">1v1 Challenges</a></li>
// //               <li><a href="#games" className="hover:text-amber-400 transition-colors">Lucky Spin</a></li>
// //               <li><a href="#leaderboard" className="hover:text-amber-400 transition-colors">Leaderboard</a></li>
// //               <li><a href="#games" className="hover:text-amber-400 transition-colors">Daily Quests</a></li>
// //             </ul>
// //           </div>

// //           <div>
// //             <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Support & Legal</h4>
// //             <ul className="space-y-2 text-xs text-gray-400 font-medium">
// //               <li><Link to="/faq" className="hover:text-amber-400 transition-colors">Help Center / FAQ</Link></li>
// //               <li><Link to="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
// //               <li><Link to="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
// //               <li><Link to="/fair-play" className="hover:text-amber-400 transition-colors">Fair Play Policy</Link></li>
// //             </ul>
// //           </div>

// //           <div>
// //             <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Join Community</h4>
// //             <div className="flex space-x-3 text-lg text-gray-400 mb-4">
// //               <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:text-amber-400 hover:border-amber-400/50 transition-all"><FaTelegram /></a>
// //               <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:text-amber-400 hover:border-amber-400/50 transition-all"><FaDiscord /></a>
// //               <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:text-amber-400 hover:border-amber-400/50 transition-all"><FaTwitter /></a>
// //               <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:text-amber-400 hover:border-amber-400/50 transition-all"><FaFacebook /></a>
// //             </div>
// //             <p className="text-xs text-gray-400">Supported Payouts: Telebirr & Local Banks</p>
// //           </div>
// //         </div>

// //         <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
// //           <p>© {new Date().getFullYear()} EthioArena. All rights reserved.</p>
// //           <p>Designed for competitive gaming excellence.</p>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // }

// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-[#080808] text-white">

//       {/* Hero Section */}
//       <section className="relative overflow-hidden px-6 py-20">

//         <div className="max-w-6xl mx-auto text-center">

//           <motion.h1
//             initial={{ opacity: 0, y: -40 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-5xl md:text-7xl font-bold"
//           >
//             Play. Spin. Challenge. Win.
//           </motion.h1>


//           <p className="mt-6 text-gray-300 text-lg">
//             Enter exciting games, challenge players in 1 vs 1 matches,
//             and enjoy lucky spin experiences.
//           </p>


//           <div className="flex justify-center gap-4 mt-8">

//             <Link
//               to="/login"
//               className="px-8 py-3 rounded-xl bg-yellow-500 text-black font-bold"
//             >
//               Login
//             </Link>


//             <Link
//               to="/register"
//               className="px-8 py-3 rounded-xl border border-yellow-500"
//             >
//               Register
//             </Link>

//           </div>

//         </div>

//       </section>


//       {/* Games Section */}
//       <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">


//         {/* 1 vs 1 */}
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10"
//         >

//           <h2 className="text-3xl font-bold">
//             ⚔️ 1 vs 1 Challenge
//           </h2>


//           <p className="mt-4 text-gray-300">
//             Challenge another player and compete in real-time matches.
//           </p>


//           <button className="mt-6 px-6 py-3 bg-purple-600 rounded-xl">
//             Play 1 vs 1
//           </button>

//         </motion.div>



//         {/* Spin */}
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10"
//         >

//           <h2 className="text-3xl font-bold">
//             🎡 Lucky Spin
//           </h2>


//           <p className="mt-4 text-gray-300">
//             Spin the wheel and receive exciting rewards.
//           </p>


//           <button className="mt-6 px-6 py-3 bg-yellow-500 text-black rounded-xl">
//             Spin Now
//           </button>

//         </motion.div>


//       </section>


//       {/* Footer */}
//       <footer className="text-center py-10 text-gray-500">
//         © 2026 Gaming Platform
//       </footer>


//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  GiCrossedSwords,
  GiGamepad,
  GiTrophy,
  GiPerspectiveDiceSixFacesRandom,
  GiLightningHelix,
  GiShield,
  GiWallet,
  GiFlame,
  GiStarMedal,
  GiTwoCoins,
  GiPodium,
  GiCrown,
  GiCheckMark,
} from 'react-icons/gi';
import {
  FaTelegram,
  FaDiscord,
  FaTwitter,
  FaFacebook,
  FaQuoteLeft,
  FaChevronDown,
  FaChevronRight,
  FaStar,
  FaArrowRight,
} from 'react-icons/fa';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [leaderboardTab, setLeaderboardTab] = useState('weekly');
  const { scrollYProgress } = useScroll();

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Game Modes Data
  const gamesList = [
    {
      id: '1v1',
      title: '1v1 Skill Duels',
      tag: 'COMPETITIVE',
      category: 'competitive',
      desc: 'Challenge real opponents in instant-match, skill-based mini-games for real ETB stakes.',
      icon: <GiCrossedSwords className="text-4xl text-amber-400" />,
      gradient: 'from-amber-500/20 to-orange-600/10',
      border: 'border-amber-500/30',
      hoverGradient: 'hover:from-amber-500/30 hover:to-orange-600/20',
      stats: { players: '12,450', prize: '50,000 ETB' },
      featured: true,
    },
    {
      id: 'lucky-spin',
      title: 'Lucky Wheel',
      tag: 'DAILY REWARDS',
      category: 'luck',
      desc: 'Spin daily to win guaranteed instant bonus multipliers, jackpot tokens, and cash prizes.',
      icon: <GiPerspectiveDiceSixFacesRandom className="text-4xl text-purple-400" />,
      gradient: 'from-purple-500/20 to-indigo-600/10',
      border: 'border-purple-500/30',
      hoverGradient: 'hover:from-purple-500/30 hover:to-indigo-600/20',
      stats: { players: '8,230', prize: '25,000 ETB' },
      featured: true,
    },
    {
      id: 'tournaments',
      title: 'Bracket Tournaments',
      tag: 'BIG PRIZE POOLS',
      category: 'competitive',
      desc: 'Climb the ladder against hundreds of players in scheduled weekly esports showdowns.',
      icon: <GiTrophy className="text-4xl text-yellow-400" />,
      gradient: 'from-yellow-500/20 to-amber-600/10',
      border: 'border-yellow-500/30',
      hoverGradient: 'hover:from-yellow-500/30 hover:to-amber-600/20',
      stats: { players: '5,670', prize: '100,000 ETB' },
      featured: true,
    },
    {
      id: 'daily-quests',
      title: 'Daily Quests',
      tag: 'FREE EXP',
      category: 'rewards',
      desc: 'Complete daily micro-challenges to unlock free entry passes and multiplier boosts.',
      icon: <GiGamepad className="text-4xl text-emerald-400" />,
      gradient: 'from-emerald-500/20 to-teal-600/10',
      border: 'border-emerald-500/30',
      hoverGradient: 'hover:from-emerald-500/30 hover:to-teal-600/20',
      stats: { players: '15,200', prize: '10,000 ETB' },
      featured: false,
    },
  ];

  // Platform Features
  const features = [
    {
      title: 'Instant Local Payouts',
      desc: 'Direct integration with Telebirr, CBE Birr, and major local bank transfers. Withdraw your winnings in seconds.',
      icon: <GiWallet className="text-3xl text-amber-400" />,
      gradient: 'from-amber-500/10 to-yellow-600/5',
    },
    {
      title: 'Anti-Cheat Technology',
      desc: 'Server-side engine validation ensures zero cheating and 100% fair matchmaking for all games.',
      icon: <GiShield className="text-3xl text-purple-400" />,
      gradient: 'from-purple-500/10 to-indigo-600/5',
    },
    {
      title: 'Ultra-Low Latency',
      desc: 'Engineered for smooth 60 FPS gameplay even on standard 3G/4G networks across Ethiopia.',
      icon: <GiLightningHelix className="text-3xl text-blue-400" />,
      gradient: 'from-blue-500/10 to-cyan-600/5',
    },
    {
      title: 'Secure Transactions',
      desc: 'End-to-end encryption for all deposits and withdrawals with multi-layer verification.',
      icon: <GiTwoCoins className="text-3xl text-green-400" />,
      gradient: 'from-green-500/10 to-emerald-600/5',
    },
    {
      title: '24/7 Support',
      desc: 'Dedicated Amharic and English support team ready to assist you anytime, anywhere.',
      icon: <GiCheckMark className="text-3xl text-rose-400" />,
      gradient: 'from-rose-500/10 to-pink-600/5',
    },
    {
      title: 'Fair Play Guarantee',
      desc: 'All games use certified RNG algorithms and skill-based mechanics for true competition.',
      icon: <GiPodium className="text-3xl text-orange-400" />,
      gradient: 'from-orange-500/10 to-red-600/5',
    },
  ];

  // Leaderboard Data
  const leaderboards = {
    weekly: [
      { rank: 1, name: 'Abebe_Pro', score: '18,450 ETB', avatar: '🥇', winRate: '88%', games: '245' },
      { rank: 2, name: 'Selam_Gamer', score: '14,200 ETB', avatar: '🥈', winRate: '82%', games: '198' },
      { rank: 3, name: 'Yared_King', score: '11,900 ETB', avatar: '🥉', winRate: '79%', games: '167' },
      { rank: 4, name: 'Tigist_Win', score: '9,400 ETB', avatar: '🎮', winRate: '74%', games: '143' },
      { rank: 5, name: 'Dagim_Elite', score: '7,800 ETB', avatar: '⚡', winRate: '71%', games: '128' },
    ],
    allTime: [
      { rank: 1, name: 'Legend_Haile', score: '145,000 ETB', avatar: '👑', winRate: '92%', games: '1245' },
      { rank: 2, name: 'Abebe_Pro', score: '98,500 ETB', avatar: '🏆', winRate: '88%', games: '945' },
      { rank: 3, name: 'Selam_Gamer', score: '76,200 ETB', avatar: '💎', winRate: '82%', games: '867' },
      { rank: 4, name: 'Yared_King', score: '54,300 ETB', avatar: '🌟', winRate: '79%', games: '734' },
      { rank: 5, name: 'Tigist_Win', score: '42,100 ETB', avatar: '🔥', winRate: '74%', games: '621' },
    ],
  };

  // Testimonials
  const testimonials = [
    {
      name: 'Dawit Tadesse',
      role: 'Top Tournament Contender',
      quote: 'The payouts via Telebirr are instant! I play 1v1 challenges in my free time and cash out daily without any hassle.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      earnings: '45,000 ETB',
    },
    {
      name: 'Marta Hailu',
      role: 'Daily Spin Winner',
      quote: 'Hit the 5,000 ETB daily multiplier on my third spin! Highly responsive, smooth on phone data, and totally legit.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      earnings: '15,000 ETB',
    },
    {
      name: 'Bereket Alemu',
      role: 'Professional Gamer',
      quote: 'Best gaming platform in Ethiopia. The tournaments are well organized and the competition is fierce. Love it!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      earnings: '82,000 ETB',
    },
    {
      name: 'Sara Tesfaye',
      role: 'Casual Player',
      quote: 'Started with daily spins and now I\'m competing in tournaments. The platform is so engaging and user-friendly!',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
      rating: 4,
      earnings: '8,500 ETB',
    },
  ];

  // FAQ Data
  const faqData = [
    {
      q: 'How do I deposit and withdraw money?',
      a: 'We support local payment systems including Telebirr, CBE Birr, and major local bank transfers. Withdrawals are processed instantly to your specified wallet or bank account. Minimum withdrawal is 50 ETB.',
    },
    {
      q: 'Are the games fair and cheat-free?',
      a: 'Yes! All 1v1 challenges and tournament mechanics operate with server-side validation and anti-cheat protection. Our RNG systems are certified and regularly audited to guarantee purely skill-based outcomes.',
    },
    {
      q: 'How does the Lucky Spin work?',
      a: 'Every registered user receives a free spin daily. Additional spins can be unlocked by completing daily challenges, reaching specific leaderboard thresholds, or purchasing spin packages. Prizes range from bonus ETB to multiplier tokens.',
    },
    {
      q: 'Can I play on low-speed internet connections?',
      a: 'Absolutely. The platform is optimized for low latency and compressed data payloads, ensuring smooth 60 FPS performance even on 3G mobile data networks across Ethiopia.',
    },
    {
      q: 'What games are available in 1v1 mode?',
      a: 'Currently we offer puzzle challenges, reaction speed tests, memory games, and strategic duels. We regularly add new game modes based on community feedback.',
    },
    {
      q: 'How do tournaments work?',
      a: 'Tournaments run weekly with scheduled brackets. Players compete in knockout rounds, with prize pools distributed among top performers. Entry fees vary by tournament tier.',
    },
  ];

  // Scroll animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden relative">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[150px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[200px]" />
      </div>

      {/* ==========================================
          1. PREMIUM NAVIGATION BAR
         ========================================== */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 12 }}
                transition={{ duration: 0.3 }}
              >
                <GiCrossedSwords className="text-3xl sm:text-4xl text-amber-400" />
              </motion.div>
              <span className="text-xl sm:text-2xl font-black tracking-wider text-white">
                ETHIO<span className="text-amber-400">ARENA</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-gray-300">
              {['Games', 'Features', 'Leaderboard', 'Tournaments', 'FAQ'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-amber-400 transition-colors relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="hidden sm:block px-4 py-2 text-sm font-bold text-gray-200 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 text-xs sm:text-sm font-extrabold rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]"
              >
                Play Now
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ==========================================
          2. HERO SECTION
         ========================================== */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative pt-16 sm:pt-20 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold"
            >
              <GiFlame className="text-lg animate-pulse" />
              <span>Ethiopia's #1 Skill-Based Gaming Platform</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white"
            >
              Compete, Win & Cash Out{' '}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Instantly in ETB
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Engage in head-to-head 1v1 duels, spin daily lucky wheels, and conquer 
              leaderboard brackets. Fast matchmaking with secure payments via Telebirr & CBE Birr.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-1 text-center group"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Get Free Daily Spin</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <a
                href="#games"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-lg transition-all text-center"
              >
                Explore Game Modes
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ==========================================
          3. LIVE STATS TICKER
         ========================================== */}
      <section className="py-10 border-y border-white/10 bg-black/40 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Active Players', val: '50,000+', icon: '👥' },
              { label: 'Total Paid Out (ETB)', val: '2.5M+', icon: '💰' },
              { label: 'Avg Match Time', val: '< 30s', icon: '⚡' },
              { label: 'Instant Payouts', val: '24/7', icon: '🏦' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="space-y-1"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-4xl font-black text-amber-400">{stat.val}</div>
                <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. GAME MODES SHOWCASE
         ========================================== */}
      <section id="games" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Choose Your <span className="text-amber-400">Battleground</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            From rapid 1v1 skill matches to high-stakes tournaments, pick your game and start earning.
          </p>
        </motion.div>

        {/* Game Category Filter */}
        <div className="flex justify-center space-x-4 mb-12">
          {['all', 'competitive', 'luck', 'rewards'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === category
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {category === 'all' ? 'All Games' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gamesList
            .filter((game) => activeTab === 'all' || game.category === activeTab)
            .map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`p-6 rounded-[24px] bg-gradient-to-b ${game.gradient} ${game.hoverGradient} border ${game.border} backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                      {game.icon}
                    </div>
                    <span className="text-[10px] font-extrabold tracking-widest px-3 py-1 rounded-full bg-white/10 text-white border border-white/10">
                      {game.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{game.desc}</p>
                  
                  {/* Game Stats */}
                  <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-white/5">
                    <span>👥 {game.stats.players} players</span>
                    <span>🏆 {game.stats.prize}</span>
                  </div>
                </div>

                <Link
                  to="/register"
                  className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-black font-bold text-xs uppercase tracking-wider transition-all text-center block group-hover:shadow-lg"
                >
                  Enter Arena
                </Link>
              </motion.div>
            ))}
        </div>
      </section>

      {/* ==========================================
          5. FEATURES GRID
         ========================================== */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-black/40 border-y border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Why Choose <span className="text-amber-400">EthioArena</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Built for Ethiopian gamers with local payment integration and fair play guarantee.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-8 rounded-[24px] bg-gradient-to-br ${feat.gradient} border border-white/10 backdrop-blur-xl flex flex-col items-start space-y-4 hover:border-amber-500/40 transition-all`}
              >
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{feat.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. LEADERBOARD SECTION
         ========================================== */}
      <section id="leaderboard" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center space-x-2 text-amber-400 font-bold text-sm tracking-wider uppercase">
            <GiCrown className="text-xl" />
            <span>Live Rankings</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black">Hall of Champions</h2>
          <p className="text-gray-400">Top earners and skilled players this week</p>
        </motion.div>

        {/* Leaderboard Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          {['weekly', 'allTime'].map((tab) => (
            <button
              key={tab}
              onClick={() => setLeaderboardTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                leaderboardTab === tab
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {tab === 'weekly' ? 'This Week' : 'All Time'}
            </button>
          ))}
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[30px] p-4 sm:p-8 space-y-4 shadow-2xl">
          {leaderboards[leaderboardTab].map((player, idx) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-black w-8 text-center">
                  {player.avatar}
                </span>
                <div>
                  <div className="font-bold text-white text-base sm:text-lg">{player.name}</div>
                  <div className="text-xs text-gray-400">
                    Win Rate: {player.winRate} • Games: {player.games}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-amber-400 font-black text-lg sm:text-xl">{player.score}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">Total Earned</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/leaderboard"
            className="inline-flex items-center space-x-2 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            <span>View Full Leaderboard</span>
            <FaChevronRight />
          </Link>
        </div>
      </section>

      {/* ==========================================
          7. TESTIMONIALS
         ========================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-black">What Players Say</h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Real players, real stakes, and verified instant payouts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-6 relative group"
            >
              <FaQuoteLeft className="text-3xl text-amber-500/20 absolute top-6 right-6 group-hover:text-amber-500/40 transition-colors" />
              <div className="flex space-x-1 mb-2">
                {[...Array(t.rating)].map((_, i) => (
                  <FaStar key={i} className="text-amber-400 text-sm" />
                ))}
              </div>
              <p className="text-gray-300 italic text-base leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center space-x-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/50"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-amber-400 text-sm font-bold">{t.earnings}</div>
                  <div className="text-xs text-gray-500">Earned</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==========================================
          8. FAQ SECTION
         ========================================== */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-black/40">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Frequently Asked <span className="text-amber-400">Questions</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Everything you need to know about getting started, deposits, and payouts.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[20px] overflow-hidden transition-colors hover:border-amber-500/30"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex justify-between items-center space-x-4 focus:outline-none group"
                >
                  <span className="font-bold text-white text-base sm:text-lg group-hover:text-amber-400 transition-colors">
                    {faq.q}
                  </span>
                  <FaChevronDown
                    className={`text-amber-400 text-xl transition-transform duration-300 flex-shrink-0 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          9. CALL TO ACTION
         ========================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto relative rounded-[30px] p-8 sm:p-14 bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-blue-600/20 border border-white/15 backdrop-blur-2xl text-center space-y-8 shadow-[0_0_50px_rgba(245,158,11,0.15)]"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-500/5 to-purple-600/5 rounded-[30px] pointer-events-none" />
          
          <div className="relative space-y-4 max-w-2xl mx-auto">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <GiCrown className="text-6xl text-amber-400 mx-auto" />
            </motion.div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Claim Your Place on the{' '}
              <span className="text-amber-400">Leaderboard?</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Sign up today, claim your daily spin bonus, and start competing against 
              top players across Ethiopia for real cash rewards!
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-10 py-4 rounded-[20px] font-extrabold text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] text-center group"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Create Account Now</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-10 py-4 rounded-[20px] font-bold text-white bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-lg transition-all text-center"
            >
              I Already Have Account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          10. PREMIUM FOOTER
         ========================================== */}
      <footer className="border-t border-white/10 bg-black/60 pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            {/* Brand */}
            <div className="space-y-4 lg:col-span-1">
              <div className="flex items-center space-x-2">
                <GiCrossedSwords className="text-3xl text-amber-400" />
                <span className="text-xl font-black tracking-wider text-white">
                  ETHIO<span className="text-amber-400">ARENA</span>
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                The premier competitive gaming and lucky spin platform in Ethiopia. 
                Fair play, fast matching, and instant local payouts via Telebirr & CBE Birr.
              </p>
              <div className="flex space-x-3 pt-4">
                {[
                  { icon: <FaTelegram />, href: '#' },
                  { icon: <FaDiscord />, href: '#' },
                  { icon: <FaTwitter />, href: '#' },
                  { icon: <FaFacebook />, href: '#' },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:text-amber-400 hover:border-amber-400/50 transition-all"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-xs text-gray-400 font-medium">
                {[
                  { label: '1v1 Challenges', href: '#games' },
                  { label: 'Lucky Spin', href: '#games' },
                  { label: 'Tournaments', href: '#tournaments' },
                  { label: 'Leaderboard', href: '#leaderboard' },
                  { label: 'Daily Quests', href: '#games' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="hover:text-amber-400 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Support & Legal</h4>
              <ul className="space-y-2 text-xs text-gray-400 font-medium">
                {[
                  { label: 'Help Center / FAQ', to: '/faq' },
                  { label: 'Terms of Service', to: '/terms' },
                  { label: 'Privacy Policy', to: '/privacy' },
                  { label: 'Fair Play Policy', to: '/fair-play' },
                  { label: 'Contact Support', to: '/contact' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.to} className="hover:text-amber-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Payment Methods</h4>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <div className="text-xs font-bold text-white">Telebirr</div>
                    <div className="text-[10px] text-gray-400">Instant deposits & withdrawals</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3">
                  <span className="text-2xl">🏦</span>
                  <div>
                    <div className="text-xs font-bold text-white">CBE Birr</div>
                    <div className="text-[10px] text-gray-400">Direct bank integration</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3">
                  <span className="text-2xl">💳</span>
                  <div>
                    <div className="text-xs font-bold text-white">Local Banks</div>
                    <div className="text-[10px] text-gray-400">All major Ethiopian banks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <p>© {new Date().getFullYear()} EthioArena. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <span>Designed for competitive gaming excellence</span>
              <span className="w-1 h-1 rounded-full bg-gray-500" />
              <span>Made in Ethiopia 🇪🇹</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollY > 500 ? 1 : 0 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg hover:bg-amber-400 transition-all"
      >
        ↑
      </motion.button>
    </div>
  );
}