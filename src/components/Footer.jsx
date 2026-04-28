import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-transparent text-slate-500 py-12 px-6 border-t border-slate-900/50 z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <p className="font-bold text-white text-lg mb-2">ElevateHub</p>
            <p>&copy; 2026 ElevateHub Mentorship Platform. All rights reserved.</p>
        </div>
        <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition">Contact Us</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
