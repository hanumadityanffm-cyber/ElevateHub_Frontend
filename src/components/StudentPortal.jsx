import React, { useState } from 'react'

const StudentPortal = ({ mentors, openBookingModal, sessions, showModal, closeModal, setSessions }) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter mentors based on skills searched
  let filteredMentors = mentors.filter(m => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return m.tags.some(t => t.toLowerCase().includes(term)) || m.role.toLowerCase().includes(term)
  })

  // If no search is active, limit to 3 recommended mentors
  if (!searchTerm) {
    filteredMentors = filteredMentors.slice(0, 3)
  }

  // Check if session is today
  const isToday = (dateString) => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    return dateString === today
  }

  const isPast = (dateString) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const sDate = new Date(dateString)
    sDate.setHours(0, 0, 0, 0)
    return sDate < today
  }

  const activeSessions = sessions.filter(s => !isPast(s.date))
  const todaySessions = activeSessions.filter(s => isToday(s.date))

  const handleJoinVideoCall = (session) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank')
    } else {
      showModal(
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500/10 mb-6 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <i className="fa-solid fa-link-slash text-red-500 text-3xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Link Not Provided</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            The mentor has not provided a meeting link for this session yet. Please try again closer to the meeting time.
          </p>
          <button onClick={closeModal} className="relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px] group/btn block w-full">
            <span className="absolute inset-0 bg-red-500/50 opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center px-4 py-3 rounded-xl bg-black/50 group-hover/btn:bg-transparent transition-colors duration-300 w-full h-full">
              <span className="font-bold text-white">Go Back</span>
            </span>
          </button>
        </div>
      )
    }
  }

  const handleViewRequest = (session) => {
    showModal(
      <div className="text-center py-4">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-amber-500/10 mb-6 border border-amber-500/30">
          <i className="fa-regular fa-clock text-amber-500 text-3xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Request Pending</h3>
        <div className="bg-white/[0.08] border border-white/10 rounded-xl p-4 my-6 text-left space-y-3 mx-auto max-w-sm">
           <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Mentor</span><span className="text-white font-bold">{session.mentor}</span></div>
           <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Date</span><span className="text-white font-bold">{session.date}</span></div>
           <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Time</span><span className="text-white font-bold">{session.time}</span></div>
           <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Status</span><span className="text-amber-500 font-bold text-sm bg-amber-500/20 px-2 py-0.5 rounded">AWAITING APPROVAL</span></div>
        </div>
        <button onClick={closeModal} className="relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px] group/btn block w-full">
          <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-700 opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center justify-center px-4 py-3 rounded-xl bg-black/50 group-hover/btn:bg-transparent transition-colors duration-300 w-full h-full">
            <span className="font-bold text-white">Close</span>
          </span>
        </button>
      </div>
    )
  }

  const requestCancel = (session) => {
    setSessions(prev => prev.map(s => {
      if (s.id === session.id) {
        return { ...s, status: `Pending Cancel Approval` }
      }
      return s
    }))
    showModal(
      <div className="text-center py-6">
         <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/10 mb-6 border border-emerald-500/30">
          <i className="fa-solid fa-check text-emerald-400 text-3xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Request Sent</h3>
        <p className="text-slate-400 mb-8">Your request to Cancel the session has been sent to the mentor.</p>
        <button onClick={closeModal} className="w-full bg-emerald-500/20 text-emerald-400 font-bold py-3 rounded-xl border border-emerald-500/50 hover:bg-emerald-500/30 transition">Awesome!</button>
      </div>
    )
  }

  const handleRescheduleClick = (session) => {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const minDateStr = nextWeek.toISOString().split('T')[0]

    showModal(
      <div className="text-center py-4">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#FA93FA]/20 to-[#983AD6]/20 mb-6 border border-[#C967E8]/30 shadow-[0_0_15px_rgba(201,103,232,0.3)]">
          <i className="fa-solid fa-calendar-plus text-[#FA93FA] text-2xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Reschedule Session</h3>
        <p className="text-sm text-slate-400 mb-6">Select your requested new time with <span className="text-[#C967E8] font-bold">{session.mentor}</span>.</p>
        
        <div className="space-y-4 mb-8 text-left">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">New Date</label>
            <input type="date" id="reschedule-date" min={minDateStr} defaultValue={minDateStr} className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:border-[#C967E8] focus:ring-1 focus:ring-[#C967E8] text-white outline-none transition shadow-inner" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">New Time</label>
            <select id="reschedule-time" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:border-[#C967E8] focus:ring-1 focus:ring-[#C967E8] text-white outline-none transition appearance-none shadow-inner">
              <option value="10:00 AM" className="bg-[#0f111a] text-white">10:00 AM</option>
              <option value="02:00 PM" className="bg-[#0f111a] text-white">02:00 PM</option>
              <option value="04:00 PM" className="bg-[#0f111a] text-white">04:00 PM</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => handleViewAppointment(session)} className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition">Back</button>
          <button onClick={() => confirmReschedule(session)} className="flex-1 relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px] group/btnConf">
            <span className="absolute inset-0 bg-gradient-to-r from-[#FA93FA] to-[#C967E8] opacity-70 group-hover/btnConf:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center px-4 py-3 rounded-xl bg-black/50 group-hover/btnConf:bg-transparent transition-colors duration-300 w-full h-full">
              <span className="font-bold text-white">Request Modification</span>
            </span>
          </button>
        </div>
      </div>
    )
  }

  const confirmReschedule = (session) => {
    const dateEl = document.getElementById('reschedule-date')
    const timeEl = document.getElementById('reschedule-time')
    if (!dateEl || !timeEl) return

    // Standardize date formatting to match mock data
    const dateObj = new Date(dateEl.value)
    // Adjust for timezone issues if dateEl.value is parsed as UTC by picking local components instead, but since input[type=date] returns YYYY-MM-DD, a simple trick is replacing hyphens or creating date from string directly.
    const newDateStr = new Date(dateEl.value + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const newTimeStr = timeEl.value + ' (IST)'

    setSessions(prev => prev.map(s => {
      if (s.id === session.id) {
        return { ...s, status: 'Pending Reschedule', previousDate: s.date, date: newDateStr, time: newTimeStr }
      }
      return s
    }))

    showModal(
      <div className="text-center py-6">
         <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/10 mb-6 border border-emerald-500/30">
          <i className="fa-solid fa-check text-emerald-400 text-3xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Reschedule Requested</h3>
        <p className="text-slate-400 mb-8">Your request to move the session to <span className="text-white font-bold">{newDateStr} at {timeEl.value}</span> has been submitted for approval.</p>
        <button onClick={closeModal} className="w-full bg-emerald-500/20 text-emerald-400 font-bold py-3 rounded-xl border border-emerald-500/50 hover:bg-emerald-500/30 transition">Got it!</button>
      </div>
    )
  }

  const handleViewAppointment = (session) => {
    // Check if session is >= 1 day away to show cancel/reschedule
    const today = new Date()
    const sessionDateStr = session.date
    const sDate = new Date(sessionDateStr)
    const diffTime = Math.abs(sDate - today)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const canModify = diffDays >= 1

    showModal(
      <div className="text-center py-4">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#FA93FA]/10 mb-6 border border-[#C967E8]/30">
          <i className="fa-regular fa-calendar-check text-[#FA93FA] text-3xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Appointment Details</h3>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 my-6 text-left space-y-3 mx-auto max-w-sm">
           <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Mentor</span><span className="text-white font-bold">{session.mentor}</span></div>
           <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Date</span><span className="text-white font-bold">{session.date}</span></div>
           <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Time</span><span className="text-white font-bold">{session.time}</span></div>
           <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Status</span><span className="text-[#FA93FA] font-bold text-sm bg-[#FA93FA]/20 px-2 py-0.5 rounded uppercase">{session.status}</span></div>
        </div>

        {canModify && session.status === 'Approved' ? (
          <div className="flex gap-4 mb-4">
            <button onClick={() => handleRescheduleClick(session)} className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition">Reschedule</button>
            <button onClick={() => requestCancel(session)} className="flex-1 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-bold py-3 rounded-xl transition">Cancel</button>
          </div>
        ) : session.status === 'Approved' && (
          <p className="text-xs text-red-400 mb-4 bg-red-500/10 p-2 rounded-lg border border-red-500/20">Modifications require at least 1 day notice.</p>
        )}

        <button onClick={closeModal} className="w-full bg-white text-black font-bold py-3 rounded-xl transition-transform hover:scale-[1.02]">
           Close window
        </button>
      </div>
    )
  }

  const renderSessionCard = (s) => {
    const isPending = s.status.includes('Pending');
    const isActiveToday = s.status === 'Approved' && isToday(s.date);
    
    return (
      <div key={s.id} className={`p-5 mb-4 border-l-4 ${!isPending ? 'border-[#FA93FA] bg-gradient-to-r from-[#FA93FA]/10 to-transparent' : 'border-amber-500 bg-gradient-to-r from-amber-500/10 to-transparent'} rounded-xl border border-white/5 flex flex-col relative overflow-hidden backdrop-blur-md text-left`}>
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mb-2 self-start ${!isPending ? 'bg-[#FA93FA]/20 text-[#FA93FA]' : 'bg-amber-500/20 text-amber-500'}`}>{s.status}</span>
        <h4 className="font-bold text-white text-[16px] leading-snug">{s.mentor}</h4>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-400 font-medium">
          <div className="flex items-center"><i className="fa-regular fa-calendar mr-2 text-white/50"></i> {s.date}</div>
          <div className="flex items-center"><i className="fa-regular fa-clock mr-2 text-white/50"></i> {s.time}</div>
        </div>

        {isActiveToday ? (
          <div className="mt-5 flex gap-2">
             <button onClick={() => handleJoinVideoCall(s)} className="flex-1 bg-gradient-to-r from-[#FA93FA] to-[#C967E8] hover:opacity-90 text-white py-2.5 rounded-xl text-sm font-bold transition-all duration-300 active:scale-95 shadow-lg flex justify-center items-center gap-2">
               <i className="fa-solid fa-video"></i> Join
             </button>
             <button onClick={() => handleViewAppointment(s)} className="w-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all"><i className="fa-solid fa-ellipsis-vertical"></i></button>
          </div>
        ) : (
          <button onClick={() => isPending ? handleViewRequest(s) : handleViewAppointment(s)} className="mt-5 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl text-sm font-bold transition-all duration-300 active:scale-95 shadow-lg">
            {isPending ? 'View Request' : 'View Details'}
          </button>
        )}
      </div>
    )
  }

  const handleViewAllSessions = () => {
    showModal(
      <div className="text-center py-4 w-full flex flex-col items-center">
        <h3 className="text-2xl font-bold text-white mb-2">All Sessions</h3>
        <p className="text-slate-400 mb-6 font-medium">Your learning journey ahead</p>
        <div className="w-full max-h-[60vh] overflow-y-auto px-2 space-y-2 custom-scrollbar">
          {activeSessions.length > 0 ? (
            activeSessions.map(s => renderSessionCard(s))
          ) : (
             <div className="py-10 text-slate-400">No sessions found.</div>
          )}
        </div>
        <button onClick={closeModal} className="mt-6 w-full bg-white/10 border border-white/20 text-white font-bold py-3 rounded-xl transition hover:bg-white/20">
           Close
        </button>
      </div>
    )
  }

  return (
    <section className="relative w-full min-h-screen bg-[#010101] overflow-hidden flex flex-col justify-start pb-20">
      
      {/* ABSOLUTE BACKGROUND VIDEO (Grand Vibe) */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none fixed">
         <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#010101] via-[#010101]/80 to-transparent z-10"></div>
         <video 
           className="w-full h-full object-cover mix-blend-screen opacity-30 block scale-105"
           autoPlay muted playsInline loop
         >
           <source src="https://cdn.pixabay.com/video/2023/05/06/161917-824623504_large.mp4" type="video/mp4" />
         </video>
         
         {/* Heavy Glassmorphism Overlay */}
         <div className="absolute inset-0 bg-[#010101]/75 backdrop-blur-[10px] z-10 pointer-events-none"></div>
         <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#010101] via-[#010101]/90 to-transparent z-10"></div>
      </div>

      <div className="relative z-20 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-40">
        
        {/* Dashboard Header */}
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 relative">
          <div className="relative z-10">
            <h1 className="text-[44px] sm:text-[56px] font-extrabold text-white leading-tight tracking-tight">
               Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FA93FA] via-[#C967E8] to-[#983AD6]">Portal</span>
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-medium">Elevate your skills and manage your mentorship journey seamlessly.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column - Find Mentors */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative group/form h-full">
              <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-[#FA93FA]/20 to-[#983AD6]/20 blur-xl opacity-0 group-hover/form:opacity-100 transition duration-1000 z-0 pointer-events-none"></div>
              
              <div className="relative z-10 bg-[#010101]/65 backdrop-blur-3xl rounded-[32px] border border-white/10 p-6 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] h-full transition-all duration-300 flex flex-col">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                   <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                     <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FA93FA] to-[#983AD6] flex items-center justify-center shadow-[0_0_15px_#C967E8]">
                       <i className="fa-solid fa-magnifying-glass text-sm text-white"></i>
                     </div>
                     Find a Mentor
                   </h2>
                </div>
                
                <div className="relative mb-8">
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#FA93FA]/30 to-[#983AD6]/30 blur opacity-0 focus-within:opacity-100 transition duration-300 z-0"></div>
                  <div className="relative z-10">
                    <input 
                      type="text" 
                      placeholder="Search by skill (e.g., Python, Marketing)" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-5 py-4 bg-white/[0.08] border border-white/10 rounded-2xl focus:border-[#C967E8] focus:ring-1 focus:ring-[#C967E8] text-white outline-none transition-all placeholder:text-slate-500 text-lg shadow-inner" 
                    />
                    <i className="fa-solid fa-code-merge absolute left-5 top-5 text-slate-400"></i>
                  </div>
                </div>
                
                <div className="space-y-4 flex-1">
                  {filteredMentors.length > 0 ? filteredMentors.map(m => (
                    <div key={m.id} className="group relative flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C967E8]/50 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-auto">
                        <div className="relative">
                          <img src={m.image} className="w-14 h-14 rounded-full mr-5 object-cover relative z-10 border border-white/20 group-hover:border-[#C967E8] transition-colors" alt="Mentor" />
                          <div className="absolute inset-0 bg-[#C967E8] rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity z-0"></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-[17px] group-hover:text-[#FA93FA] transition-colors">{m.name}</h3>
                          <p className="text-sm text-slate-400 font-medium">{m.role}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {m.tags.map(t => <span key={t} className="text-[11px] font-bold tracking-wider uppercase bg-black/40 border border-white/10 text-slate-300 px-2.5 py-1 rounded-md">{t}</span>)}
                          </div>
                        </div>
                      </div>
                      
                      <button onClick={() => openBookingModal(m.name, m.id)} className="relative inline-flex items-center justify-center shrink-0 w-full sm:w-auto overflow-hidden rounded-xl p-[1px] group/btn">
                        <span className="absolute inset-0 bg-gradient-to-r from-[#FA93FA] to-[#C967E8] opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl bg-black/50 group-hover/btn:bg-transparent transition-colors duration-300 w-full h-full justify-center">
                           <span className="font-bold text-white text-sm">Book Session</span>
                           <i className="fa-solid fa-arrow-right text-xs text-white"></i>
                        </span>
                      </button>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-slate-400">No mentors found for your search query.</div>
                  )}
                </div>
                {!searchTerm && mentors.length > 3 && (
                   <p className="text-center text-sm font-medium text-slate-500 mt-6 pt-4 border-t border-white/10">Type in the search bar to explore more mentors</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sessions Only */}
          <div className="space-y-8 flex flex-col self-start w-full">
            <div className="relative group/card1">
              <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-[#FA93FA]/10 to-[#983AD6]/10 blur-xl opacity-0 group-hover/card1:opacity-100 transition duration-1000 z-0 pointer-events-none"></div>
              <div className="relative z-10 bg-[#010101]/65 backdrop-blur-3xl rounded-[32px] border border-white/10 p-6 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                   <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                     <i className="fa-solid fa-calendar-day text-[#C967E8]"></i> Today's Sessions
                   </h2>
                   <button onClick={handleViewAllSessions} className="text-sm font-bold text-[#C967E8] hover:text-[#FA93FA] transition flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                     Expand <i className="fa-solid fa-expand text-[10px]"></i>
                   </button>
                </div>
                
                <div className="space-y-4 flex-1">
                  {todaySessions.length > 0 ? todaySessions.map(s => renderSessionCard(s)) : (
                    <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-white/5 rounded-2xl border border-white/5 h-full">
                      <div className="w-12 h-12 mb-4 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                        <i className="fa-regular fa-sun text-xl text-slate-400"></i>
                      </div>
                      <p className="text-sm font-medium text-slate-400 leading-relaxed">No sessions scheduled for today.<br/>Click 'Expand' to view upcoming.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default StudentPortal
