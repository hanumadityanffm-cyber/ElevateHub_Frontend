import React, { useEffect, useRef } from 'react';
import Icon from './Icon';
import Hls from 'hls.js';
import { InfiniteSlider } from './ui/infinite-slider';

const Home = ({ navigateTo }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

  // The HLS stream is offline, so we rely entirely on the native fallback video
  // defined in the <source> tag below rather than initializing Hls.js on failure.
  }, []);

  return (
    <section className="relative w-full min-h-[95vh] bg-[#010101] overflow-hidden flex flex-col justify-between">
      
      {/* ABSOLUTE BACKGROUND VIDEO */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
         <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#010101] via-[#010101]/60 to-transparent z-10"></div>
         <video 
           className="w-full h-full object-cover mix-blend-screen opacity-60 block"
           autoPlay muted playsInline loop
         >
           <source src="https://cdn.pixabay.com/video/2023/05/06/161917-824623504_large.mp4" type="video/mp4" />
         </video>
         
         {/* Heavy Glassmorphism Overlay */}
         <div className="absolute inset-0 bg-[#010101]/30 backdrop-blur-[12px] z-10 pointer-events-none"></div>
         <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#010101] via-[#010101]/80 to-transparent z-10"></div>
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center px-4 md:px-6 w-full max-w-7xl mx-auto pt-36 pb-24 flex-grow">
        


        {/* Main Headline */}
        <h1 className="text-center text-[44px] sm:text-[56px] md:text-[80px] font-extrabold leading-[1.05] tracking-tight mb-8 max-w-5xl">
          <span className="block text-white pb-2">Unlock Top Industry Mentors<br className="hidden md:block"/> You Thought Were Out of Reach –</span>
          <span className="block bg-gradient-to-r from-[#FA93FA] via-[#C967E8] to-[#983AD6] text-transparent bg-clip-text pb-4">Now Just One Click Away!</span>
        </h1>

        {/* Subheadline */}
        <p className="text-center text-white/80 text-lg md:text-[22px] font-medium max-w-3xl mb-12">
          Elevate your career with direct access to world-class coaching and personalized mentorship roadmaps.
        </p>

        {/* CTA Button */}
        <div className="relative group inline-block z-30 mb-8">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FA93FA] via-[#C967E8] to-[#983AD6] opacity-30 blur-md group-hover:opacity-60 transition duration-500"></div>
          <button 
            onClick={() => navigateTo('register')}
            className="relative flex items-center gap-4 bg-white text-black pl-8 pr-2 py-2 rounded-full font-bold text-lg leading-none hover:scale-105 transition-transform border border-white/20"
          >
            Find a Mentor
            <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-r from-[#FA93FA] via-[#C967E8] to-[#983AD6] flex items-center justify-center ml-2 shadow-[0_0_15px_#C967E8]">
               <Icon name="ArrowRight" className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>

        {/* Features - Minimal Row with Hover Highlights */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left text-sm text-slate-400">
           
           <div className="flex flex-col items-center px-6 py-4 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/5 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_30px_rgba(201,103,232,0.25)] hover:-translate-y-2 hover:border-white/20 cursor-default group">
              <span className="font-bold text-white text-[15px] mb-1 group-hover:text-[#FA93FA] transition-colors duration-300 text-center">Verified Expert Mentors</span>
              <span className="text-[12px] text-slate-500 group-hover:text-slate-400 transition-colors duration-300 text-center">Strictly Verified By Admin</span>
           </div>

           <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#C967E8]/30"></div>
           
           <div className="flex flex-col items-center px-6 py-4 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/5 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_30px_rgba(201,103,232,0.25)] hover:-translate-y-2 hover:border-white/20 cursor-default group">
              <span className="font-bold text-white text-[15px] mb-1 group-hover:text-[#FA93FA] transition-colors duration-300">1-on-1 Personalized Coaching</span>
              <span className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Tailored to your goals</span>
           </div>

           <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#C967E8]/30"></div>
           
           <div className="flex flex-col items-center px-6 py-4 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/5 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_30px_rgba(201,103,232,0.25)] hover:-translate-y-2 hover:border-white/20 cursor-default group">
              <span className="font-bold text-white text-[15px] mb-1 group-hover:text-[#FA93FA] transition-colors duration-300">AI-Powered Career Roadmaps</span>
              <span className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Dynamic generated paths</span>
           </div>

        </div>
      </div>

      {/* Animated Logo Cloud Section */}
      <div className="relative z-30 w-full bg-black/40 backdrop-blur-md border-t border-white/5 py-8 md:py-10 mt-auto">
        <div className="max-w-[1850px] mx-auto w-full px-6 flex flex-col md:flex-row items-center gap-8 md:gap-14">
          
          <div className="md:w-[260px] shrink-0 text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-12">
            <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-slate-500">Powering the best teams</span>
          </div>

          <div className="flex-1 w-full overflow-hidden mask-horizontal-fade">
            <InfiniteSlider speed={35} className="w-full opacity-60 hover:opacity-100 transition-opacity duration-500">
               <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" alt="ChatGPT" className="h-7 md:h-9 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity brightness-0 invert" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" className="h-7 md:h-9 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity brightness-0 invert" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="h-7 md:h-9 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity brightness-0 invert" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6 md:h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity brightness-0 invert" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-7 md:h-9 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity brightness-0 invert pt-1" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" alt="Meta" className="h-4 md:h-5 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity brightness-0 invert mt-1" />
            </InfiniteSlider>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Home;