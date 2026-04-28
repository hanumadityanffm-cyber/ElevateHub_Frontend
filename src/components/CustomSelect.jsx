import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ options, value, onChange, placeholder = "Select an option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full text-sm" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-4 py-3 bg-[#0f111a]/80 backdrop-blur-md border border-white/10 rounded-xl focus:border-[#C967E8] hover:border-[#C967E8]/50 text-white cursor-pointer flex justify-between items-center transition-colors shadow-inner"
      >
        <span>{value || placeholder}</span>
        <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C967E8]' : 'text-slate-500'} text-[10px]`}></i>
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#050505] border border-[#C967E8]/40 rounded-xl max-h-52 overflow-y-auto z-[999] shadow-[0_10px_40px_rgba(201,103,232,0.3)] custom-scrollbar">
           <div className="p-1.5 flex flex-col gap-1">
             {options.map(opt => (
                <div 
                  key={opt} 
                  onClick={() => { onChange && onChange(opt); setIsOpen(false) }}
                  className={`px-3 py-2.5 rounded-lg cursor-pointer transition-all ${value === opt ? 'bg-gradient-to-r from-[#FA93FA]/20 to-[#983AD6]/20 text-[#FA93FA] font-bold border border-[#FA93FA]/30' : 'text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'}`}
                >
                  {opt}
                </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
