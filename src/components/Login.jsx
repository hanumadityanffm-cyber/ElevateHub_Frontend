import React from 'react'

const Login = ({ handleLogin, navigateTo }) => {
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
             <span className="block text-white pb-2">Welcome Back to</span>
             <span className="block bg-gradient-to-r from-[#FA93FA] via-[#C967E8] to-[#983AD6] text-transparent bg-clip-text">ElevateHub</span>
           </h1>
           <p className="text-white/80 text-lg sm:text-[22px] font-medium max-w-xl leading-relaxed">
             Pick up right where you left off. Access your personalized mentorship roadmap, connect with industry experts, and accelerate your career.
           </p>

           <div className="mt-12 hidden lg:flex flex-col sm:flex-row items-center lg:items-start gap-6">
             <div className="flex -space-x-4">
               {[
                 "https://i.pravatar.cc/150?img=11", 
                 "https://i.pravatar.cc/150?img=32", 
                 "https://i.pravatar.cc/150?img=33",
                 "https://i.pravatar.cc/150?img=44"
               ].map((src, i) => (
                 <img key={i} src={src} className="w-12 h-12 rounded-full border-2 border-[#010101]" alt="User avatar" />
               ))}
               <div className="w-12 h-12 rounded-full border-2 border-[#010101] bg-gradient-to-r from-[#FA93FA] to-[#C967E8] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_#C967E8]">
                 +2k
               </div>
             </div>
             <p className="text-sm text-slate-400 font-medium max-w-[200px] text-left">
               Join over <span className="text-white">2,000+</span> professionals accelerating their careers.
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
                <h2 className="text-3xl font-bold text-white tracking-tight">Log In</h2>
                <p className="text-slate-400 mt-2 text-sm">Choose your account type to continue</p>
              </div>

              <form onSubmit={handleLogin}>
                {/* Role Tabs */}
                <div className="mb-8 flex p-1.5 bg-white/[0.08] rounded-2xl border border-white/10 backdrop-blur-sm">
                  {['student', 'mentor', 'admin'].map(r => (
                    <label key={r} className="flex-1 text-center cursor-pointer relative">
                      <input type="radio" name="loginRole" value={r} className="peer sr-only" defaultChecked={r === 'student'} />
                      <div className="py-3 rounded-xl text-[15px] font-bold peer-checked:bg-gradient-to-r peer-checked:from-[#FA93FA]/20 peer-checked:to-[#C967E8]/20 peer-checked:text-white peer-checked:border peer-checked:border-[#C967E8]/50 text-slate-400 transition-all capitalize">
                        {r}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Inputs */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      className="w-full px-5 py-4 bg-white/[0.08] border border-white/10 rounded-2xl focus:border-[#C967E8] focus:ring-1 focus:ring-[#C967E8] text-white outline-none transition-all placeholder:text-slate-600 text-lg" 
                      placeholder="you@example.com" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">Password</label>
                    <input 
                      type="password" 
                      required 
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#C967E8] focus:ring-1 focus:ring-[#C967E8] text-white outline-none transition-all placeholder:text-slate-600 text-lg" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-10 mb-6 relative group/btn inline-block w-full">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FA93FA] via-[#C967E8] to-[#983AD6] opacity-40 blur-md group-hover/btn:opacity-70 transition duration-500"></div>
                  <button type="submit" className="relative w-full bg-white text-black py-4 rounded-2xl font-black text-xl transition-transform hover:scale-[1.02] border border-white/20 flex items-center justify-center gap-3">
                    Sign In
                    <i className="fa-solid fa-arrow-right text-sm"></i>
                  </button>
                </div>
              </form>

              <p className="text-center text-[15px] font-medium text-slate-400 mt-6 pt-6 border-t border-white/10">
                New to ElevateHub? <button type="button" onClick={() => navigateTo('register')} className="text-[#FA93FA] hover:text-white transition-colors ml-1 font-bold">Create an account</button>
              </p>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Login
