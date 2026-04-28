import React from 'react'

const Register = ({ handleRegister, regRole, setRegRole, navigateTo }) => {
  return (
    <section className="relative w-full min-h-[95vh] bg-[#010101] overflow-hidden flex flex-col justify-center">
      
      {/* ABSOLUTE BACKGROUND VIDEO (Same as Home for consistency) */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
         <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#010101] via-[#010101]/60 to-transparent z-10"></div>
         <video 
           className="w-full h-full object-cover mix-blend-screen opacity-50 block"
           autoPlay muted playsInline loop
         >
           <source src="https://cdn.pixabay.com/video/2023/05/06/161917-824623504_large.mp4" type="video/mp4" />
         </video>
         
         {/* Heavy Glassmorphism Overlay */}
         <div className="absolute inset-0 bg-[#010101]/40 backdrop-blur-[8px] z-10 pointer-events-none"></div>
         <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#010101] via-[#010101]/80 to-transparent z-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 pt-32 lg:pt-40 pb-20">
        
        {/* Left Column: Grand Typography */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
           <button onClick={() => navigateTo('home')} className="mb-8 inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
             <i className="fa-solid fa-arrow-left text-sm group-hover:-translate-x-1 transition-transform"></i>
             <span className="text-sm font-medium">Back to Home</span>
           </button>
           
           <h1 className="text-[44px] sm:text-[56px] lg:text-[72px] font-extrabold leading-[1.05] tracking-tight mb-6">
             <span className="block text-white pb-2">Start Your</span>
             <span className="block bg-gradient-to-r from-[#FA93FA] via-[#C967E8] to-[#983AD6] text-transparent bg-clip-text">Journey Here</span>
           </h1>
           <p className="text-white/80 text-lg sm:text-[22px] font-medium max-w-xl leading-relaxed">
             Join the ElevateHub community. Whether you're looking to accelerate your career or share your expertise, your next big leap starts now.
           </p>

           <div className="mt-12 hidden lg:flex flex-col sm:flex-row items-center lg:items-start gap-6">
             <div className="flex -space-x-4">
               {[
                 "https://i.pravatar.cc/150?img=12", 
                 "https://i.pravatar.cc/150?img=35", 
                 "https://i.pravatar.cc/150?img=34",
                 "https://i.pravatar.cc/150?img=45"
               ].map((src, i) => (
                 <img key={i} src={src} className="w-12 h-12 rounded-full border-2 border-[#010101]" alt="User avatar" />
               ))}
               <div className="w-12 h-12 rounded-full border-2 border-[#010101] bg-gradient-to-r from-[#FA93FA] to-[#C967E8] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_#C967E8]">
                 +5k
               </div>
             </div>
             <p className="text-sm text-slate-400 font-medium max-w-[200px] text-left">
               Over <span className="text-white">5,000+</span> mentors and mentees already connected.
             </p>
           </div>
        </div>

        {/* Right Column: Giant Glassmorphic Form */}
        <div className="w-full lg:w-[500px]">
          <div className="relative group/form">
            {/* Animated Glow Behind Form */}
            <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-[#FA93FA] via-[#C967E8] to-[#983AD6] opacity-30 blur-xl group-hover/form:opacity-40 transition duration-700 z-0 pointer-events-none"></div>
            
            <div className="relative z-10 bg-[#010101]/75 backdrop-blur-2xl rounded-[32px] border border-white/10 p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
                <p className="text-slate-400 mt-2 text-sm">Join ElevateHub to start your journey</p>
              </div>

              <form onSubmit={handleRegister}>
                {/* Role Tabs */}
                <div className="mb-8 flex p-1.5 bg-white/[0.08] rounded-2xl border border-white/10 backdrop-blur-sm">
                  {['student', 'mentor'].map(r => (
                    <label key={r} className="flex-1 text-center cursor-pointer relative">
                      <input type="radio" name="regRole" value={r} className="peer sr-only" checked={regRole === r} onChange={() => setRegRole(r)} />
                      <div className={`py-3 rounded-xl text-[15px] font-bold transition-all capitalize ${regRole === r ? 'bg-gradient-to-r from-[#FA93FA]/20 to-[#C967E8]/20 text-white border border-[#C967E8]/50' : 'text-slate-400 hover:text-slate-300'}`}>
                        I am a {r}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Inputs */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full px-5 py-4 bg-white/[0.08] border border-white/10 rounded-2xl focus:border-[#C967E8] focus:ring-1 focus:ring-[#C967E8] text-white outline-none transition-all placeholder:text-slate-600 text-lg" 
                      placeholder="Aditya Varma" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      className="w-full px-5 py-4 bg-white/[0.08] border border-white/10 rounded-2xl focus:border-[#C967E8] focus:ring-1 focus:ring-[#C967E8] text-white outline-none transition-all placeholder:text-slate-600 text-lg" 
                      placeholder="you@example.com" 
                    />
                  </div>

                  {regRole === 'student' ? (
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">Skill you want to learn</label>
                      <select className="w-full px-5 py-4 bg-[#1a1b23] border border-white/10 rounded-2xl focus:border-[#C967E8] focus:ring-1 focus:ring-[#C967E8] text-white outline-none transition-all text-lg appearance-none cursor-pointer">
                        {['React & Frontend', 'Python & Backend', 'Leadership & Agile', 'UX/UI Design', 'Data Science'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">Your Expertise (Select top skills)</label>
                      <div className="grid grid-cols-2 gap-3 bg-white/[0.08] p-4 rounded-2xl border border-white/10">
                        {['React / UI', 'Python', 'Leadership', 'Data Science', 'UX/UI Design', 'Agile/Scrum'].map(s => (
                          <label key={s} className="flex items-center space-x-3 text-sm text-slate-300 cursor-pointer group">
                            <div className="relative flex items-center justify-center w-5 h-5">
                              <input type="checkbox" className="peer sr-only" />
                              <div className="w-5 h-5 rounded border-2 border-white/20 peer-checked:bg-[#FA93FA] peer-checked:border-[#FA93FA] transition-colors flex items-center justify-center">
                                <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              </div>
                            </div>
                            <span className="group-hover:text-white transition-colors">{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">Password</label>
                    <input 
                      type="password" 
                      required 
                      className="w-full px-5 py-4 bg-white/[0.08] border border-white/10 rounded-2xl focus:border-[#C967E8] focus:ring-1 focus:ring-[#C967E8] text-white outline-none transition-all placeholder:text-slate-600 text-lg" 
                      placeholder="Create a strong password" 
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 mb-6 relative group/btn inline-block w-full">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FA93FA] via-[#C967E8] to-[#983AD6] opacity-40 blur-md group-hover/btn:opacity-70 transition duration-500"></div>
                  <button type="submit" className="relative w-full bg-white text-black py-4 rounded-2xl font-black text-xl transition-transform hover:scale-[1.02] border border-white/20 flex items-center justify-center gap-3">
                    Create Account
                    <i className="fa-solid fa-arrow-right text-sm"></i>
                  </button>
                </div>
              </form>

              <p className="text-center text-[15px] font-medium text-slate-400 mt-6 pt-6 border-t border-white/10">
                Already have an account? <button type="button" onClick={() => navigateTo('login')} className="text-[#FA93FA] hover:text-white transition-colors ml-1 font-bold">Log in</button>
              </p>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Register
