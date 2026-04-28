import React from 'react'
import Icon from './Icon'

const Navbar = ({ navigateTo, isLoggedIn, logout, navigateToUserDashboard }) => {
  return (
    <header className="absolute top-0 inset-x-0 w-full z-50">
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigateTo('home')}>
          <Icon name="Rocket" className="w-8 h-8 text-white" />
          <span className="text-2xl font-bold tracking-tight text-white">ElevateHub</span>
        </div>

      
      <div className="flex items-center space-x-6">
        {!isLoggedIn ? (
          <>
            <button onClick={() => navigateTo('login')} className="text-white hover:text-slate-300 transition font-medium">Log In</button>
            <button onClick={() => navigateTo('register')} className="bg-[#0f111a] border border-slate-800 text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all">Join Now</button>
          </>
        ) : (
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="h-8 w-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300 font-bold border border-indigo-700 shadow-sm">U</div>
            <button onClick={logout} className="text-red-400 hover:text-red-300 font-medium transition text-sm">Logout</button>
          </div>
        )}
      </div>
      </div>
    </header>
  )
}

export default Navbar
