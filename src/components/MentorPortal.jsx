import React, { useState } from 'react'
import api from '../api/axios'
import CustomSelect from './CustomSelect'

const SetAvailabilityForm = ({ closeModal, currentUser }) => {
  const timeOptions = ["12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"];
  const weekendOptions = ["Off / Unavailable", ...timeOptions];
  
  const [wdStart, setWdStart] = useState("09:00 AM");
  const [wdEnd, setWdEnd] = useState("06:00 PM");
  const [weStart, setWeStart] = useState("11:00 AM");
  const [weEnd, setWeEnd] = useState("02:00 PM");

  const handleSave = async () => {
    if (currentUser?.id) {
      try {
        await api.put(`/api/mentors/${currentUser.id}/availability`, { weekdayStart: wdStart, weekdayEnd: wdEnd, weekendStart: weStart, weekendEnd: weEnd })
      } catch (err) { console.error('Availability error:', err) }
    }
    closeModal()
  }

  return (
    <div className="text-center py-4 w-full">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#FA93FA]/20 to-[#983AD6]/20 mb-6 border border-[#C967E8]/30 shadow-[0_0_15px_rgba(201,103,232,0.3)]">
        <i className="fa-solid fa-clock text-[#FA93FA] text-2xl"></i>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Set Availability</h3>
      <p className="text-sm text-slate-400 mb-6 font-medium">Define your standard coaching hours.</p>
      
      <div className="space-y-6 mb-8 text-left">
         <div>
           <label className="block text-sm font-bold text-[#FA93FA] mb-3 pl-1 border-b border-white/10 pb-2">Weekday Timings (Mon - Fri)</label>
           <div className="flex gap-4">
             <div className="flex-1">
               <label className="block text-xs font-medium text-slate-400 mb-2 pl-1">Start Time</label>
               <CustomSelect options={timeOptions} value={wdStart} onChange={setWdStart} />
             </div>
             <div className="flex-1">
               <label className="block text-xs font-medium text-slate-400 mb-2 pl-1">End Time</label>
               <CustomSelect options={timeOptions} value={wdEnd} onChange={setWdEnd} />
             </div>
           </div>
         </div>

         <div>
           <label className="block text-sm font-bold text-[#FA93FA] mb-3 pl-1 border-b border-white/10 pb-2">Weekend Timings (Sat - Sun)</label>
           <div className="flex gap-4">
             <div className="flex-1">
               <label className="block text-xs font-medium text-slate-400 mb-2 pl-1">Start Time</label>
               <CustomSelect options={weekendOptions} value={weStart} onChange={setWeStart} />
             </div>
             <div className="flex-1">
               <label className="block text-xs font-medium text-slate-400 mb-2 pl-1">End Time</label>
               <CustomSelect options={weekendOptions} value={weEnd} onChange={setWeEnd} />
             </div>
           </div>
         </div>
      </div>

      <div className="flex gap-4 relative z-0">
        <button onClick={closeModal} className="flex-1 bg-white/[0.08] border border-white/10 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition">Cancel</button>
        <button onClick={handleSave} className="flex-1 bg-gradient-to-r from-[#FA93FA] to-[#C967E8] text-white font-bold py-3 rounded-xl transition hover:opacity-90 shadow-[0_0_20px_rgba(201,103,232,0.3)]">Save Layout</button>
      </div>
    </div>
  )
}

const MentorPortal = ({ mentorRequests, handleSessionRequest, sessions, setSessions, showModal, closeModal, currentUser }) => {
  const [lastOfflineDate, setLastOfflineDate] = useState(null)

  // Helper date functions
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

  // Filter approved mapping for this mentor to see active scheduled sessions
  // Simulating dashboard: showing all global approved sessions as theirs temporarily
  const activeSessions = sessions.filter(s => s.status === 'Approved' && !isPast(s.date))
  const todaySessions = activeSessions.filter(s => isToday(s.date))

  const handleSetAvailability = () => {
    showModal(<SetAvailabilityForm closeModal={closeModal} currentUser={currentUser} />)
  }

  const executeGoOffline = async () => {
    if (!currentUser?.id) return
    try {
      const res = await api.put(`/api/mentors/${currentUser.id}/offline`)
      const data = res.data

      if (data.success) {
        // Refresh sessions from server
        const sessRes = await api.get(`/api/sessions/mentor/${currentUser.id}`)
        setSessions(sessRes.data)
        setLastOfflineDate(new Date())

        showModal(
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/10 mb-6 border border-emerald-500/30">
              <i className="fa-solid fa-power-off text-emerald-400 text-3xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Offline Protocol Activated</h3>
            <p className="text-slate-400 mb-8">All active and pending appointments have been pushed forward by 1 calendar day to accommodate your emergency shutdown.</p>
            <button onClick={closeModal} className="w-full bg-emerald-500/20 text-emerald-400 font-bold py-3 rounded-xl border border-emerald-500/50 hover:bg-emerald-500/30 transition">Resume Operations</button>
          </div>
        )
      } else if (data.locked) {
        showModal(
          <div className="text-center py-6 w-full">
             <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500/10 mb-6 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <i className="fa-solid fa-lock text-red-500 text-3xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Feature Locked</h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">Offline mode can only be triggered once every 14 days. You can use it again in <span className="text-white font-bold">{data.daysRemaining} day(s)</span>.</p>
            <button onClick={closeModal} className="w-full bg-red-500/20 text-red-400 font-bold py-3 rounded-xl border border-red-500/50 hover:bg-red-500/30 transition">Got it</button>
          </div>
        )
      }
    } catch (err) {
      console.error('Offline error:', err)
    }
  }

  const handleGoOffline = () => {
    // Backend enforces the 14-day cooldown — just show confirmation here

    showModal(
      <div className="text-center py-4 w-full">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500/10 mb-6 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <i className="fa-solid fa-triangle-exclamation text-red-500 text-3xl animate-pulse"></i>
        </div>
        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Warning: Master Reschedule</h3>
        <p className="text-sm font-medium text-slate-300 mb-8 max-w-sm mx-auto">
          You are about to enter Offline Mode. This will immediately push <span className="text-red-400 font-bold">ALL</span> active mentoring sessions backward by exactly 1 calendar day.
        </p>
        <div className="flex gap-4">
          <button onClick={closeModal} className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition">Abort</button>
          <button onClick={executeGoOffline} className="flex-1 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 hover:text-red-300 font-bold py-3 rounded-xl transition">I Understand, Go Offline</button>
        </div>
      </div>
    )
  }

  const saveMeetingLink = async (sessionId) => {
    const el = document.getElementById('meeting-url-input')
    const url = el ? el.value.trim() : null
    
    if (url) {
      try {
        await api.put(`/api/sessions/${sessionId}/link`, { meetingLink: url })
        // Refresh sessions
        if (currentUser?.id) {
          const res = await api.get(`/api/sessions/mentor/${currentUser.id}`)
          setSessions(res.data)
        }
      } catch (err) {
        console.error('Meeting link error:', err)
      }
      
      showModal(
        <div className="text-center py-6">
           <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#FA93FA]/10 mb-6 border border-[#FA93FA]/30">
            <i className="fa-solid fa-link text-[#FA93FA] text-3xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Link Attached!</h3>
          <p className="text-slate-400 mb-8">The meeting link is now visible to the student for this session.</p>
          <button onClick={closeModal} className="w-full bg-[#FA93FA]/20 text-[#FA93FA] font-bold py-3 rounded-xl border border-[#FA93FA]/50 hover:bg-[#FA93FA]/30 transition">Awesome</button>
        </div>
      )
    }
  }

  const openAddLinkModal = (session) => {
    showModal(
      <div className="text-center py-4 w-full text-left">
        <h3 className="text-2xl font-bold text-white mb-2 text-center">Add Meeting Link</h3>
        <p className="text-sm text-slate-400 mb-6 text-center">Attach your Zoom or Google Meet URL for your session with <span className="text-white font-bold">{session.studentName || 'Student'}</span>.</p>
        <div className="mb-8">
           <input type="url" id="meeting-url-input" placeholder="https://meet.google.com/..." className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#C967E8] focus:ring-1 focus:ring-[#C967E8] text-white outline-none transition shadow-inner font-mono text-sm" />
        </div>
        <div className="flex gap-4">
          <button onClick={closeModal} className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition">Cancel</button>
          <button onClick={() => saveMeetingLink(session.id)} className="flex-1 bg-gradient-to-r from-[#FA93FA] to-[#C967E8] text-white font-bold py-3 rounded-xl transition hover:opacity-90">Store Link</button>
        </div>
      </div>
    )
  }

  const handleJoinVideoCall = (url) => {
    window.open(url, '_blank')
  }

  const renderSessionBox = (s) => {
    // Determine context based on status
    const isTodaySession = isToday(s.date)
    const hasLink = s.meetingLink ? true : false

    return (
       <div key={s.id} className="p-5 mb-4 border-l-4 border-[#C967E8] bg-gradient-to-r from-[#FA93FA]/10 to-transparent rounded-xl border-y border-r border-white/5 flex flex-col relative overflow-hidden backdrop-blur-md">
          {isTodaySession && (
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mb-2 self-start bg-[#C967E8]/20 text-[#FA93FA]">Today</span>
          )}
          <h4 className="font-bold text-white text-[16px] leading-snug">Session with {s.studentName || 'Student'}</h4>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-400 font-medium">
             <div className="flex items-center"><i className="fa-regular fa-calendar mr-2 text-white/50"></i> {s.date}</div>
             <div className="flex items-center"><i className="fa-regular fa-clock mr-2 text-white/50"></i> {s.time}</div>
          </div>
          
          <div className="mt-5">
            {!hasLink ? (
              <button onClick={() => openAddLinkModal(s)} className="w-full bg-white/5 border border-white/10 hover:border-[#FA93FA]/50 hover:bg-white/10 text-white py-2.5 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2">
                 <i className="fa-solid fa-plus text-[#FA93FA]"></i> Add Session Link
              </button>
            ) : (
              <button onClick={() => handleJoinVideoCall(s.meetingLink)} className="w-full bg-gradient-to-r from-[#FA93FA] to-[#C967E8] hover:opacity-90 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                 <i className="fa-solid fa-video"></i> Join Session
              </button>
            )}
          </div>
       </div>
    )
  }

  const handleViewAllSchedule = () => {
    showModal(
      <div className="text-center py-4 w-full flex flex-col items-center">
        <h3 className="text-2xl font-bold text-white mb-2">My Entire Schedule</h3>
        <p className="text-slate-400 mb-6 font-medium">All upcoming confirmed mentoring sessions.</p>
        <div className="w-full max-h-[60vh] overflow-y-auto px-2 space-y-2 custom-scrollbar text-left">
          {activeSessions.length > 0 ? (
            activeSessions.map(s => renderSessionBox(s))
          ) : (
             <div className="py-10 text-slate-400 text-center">Your schedule is currently clear.</div>
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
         <div className="absolute inset-0 bg-[#010101]/60 backdrop-blur-[10px] z-10 pointer-events-none"></div>
         <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#010101] via-[#010101]/90 to-transparent z-10"></div>
      </div>

      <div className="relative z-20 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-40">
        
        {/* Dashboard Header */}
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 relative">
          <div className="relative z-10">
            <h1 className="text-[44px] sm:text-[56px] font-extrabold text-white leading-tight tracking-tight">
               Mentor <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FA93FA] via-[#C967E8] to-[#983AD6]">Portal</span>
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-medium">Manage your mentees and coaching schedule</p>
          </div>
          <div className="flex gap-4 items-center">
             <button onClick={handleSetAvailability} className="px-5 py-2.5 rounded-xl border border-[#FA93FA]/50 text-[#FA93FA] bg-[#FA93FA]/10 hover:bg-[#FA93FA]/20 font-bold transition flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(250,147,250,0.15)]">
               <i className="fa-solid fa-sliders"></i> Availability
             </button>
             <button onClick={handleGoOffline} className="px-5 py-2.5 rounded-xl border border-red-500/50 text-red-400 bg-red-500/10 hover:bg-red-500/20 font-bold transition flex items-center gap-2 text-sm">
               <i className="fa-solid fa-power-off"></i> Go Offline
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column - Session Requests */}
          <div className="lg:col-span-2 space-y-8 h-full">
            <div className="relative group/form h-full">
              <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-[#FA93FA]/20 to-[#983AD6]/20 blur-xl opacity-0 group-hover/form:opacity-100 transition duration-1000 z-0 pointer-events-none"></div>
              
              <div className="relative z-10 bg-[#010101]/65 backdrop-blur-3xl rounded-[32px] border border-white/10 p-6 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] h-full transition-all duration-300 flex flex-col">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                   <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                     <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FA93FA] to-[#983AD6] flex items-center justify-center shadow-[0_0_15px_#C967E8]">
                       <i className="fa-solid fa-users text-sm text-white"></i>
                     </div>
                     Session Requests
                   </h2>
                </div>
                
                <div className="space-y-4 flex-1">
                  {mentorRequests.length > 0 ? mentorRequests.map(r => (
                    <div key={r.id} className="group relative flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-auto">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full mr-5 bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/30 group-hover:border-amber-500 transition-colors z-10 relative">
                            {r.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div className="absolute inset-0 bg-amber-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity z-0"></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-[17px] group-hover:text-amber-400 transition-colors">{r.name}</h3>
                          <div className="flex flex-col gap-1 mt-1">
                            <span className="text-sm text-slate-400 font-medium">Requested: {r.date} at {r.time}</span>
                            <span className="text-xs text-slate-500 italic">Topic: {r.topic}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 w-full sm:w-auto shrink-0 mt-4 sm:mt-0">
                        <button onClick={() => handleSessionRequest(r.name, 'decline', r.date, r.time, r.id)} className="flex-1 sm:flex-none relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px] group/btnDecl">
                          <span className="absolute inset-0 bg-red-500/50 opacity-50 group-hover/btnDecl:opacity-100 transition-opacity duration-300"></span>
                          <span className="relative flex items-center px-4 py-2.5 rounded-xl bg-black/80 hover:bg-red-500/10 text-red-400 transition-colors duration-300 w-full h-full justify-center">
                            <span className="font-bold text-sm">Decline</span>
                          </span>
                        </button>
                        <button onClick={() => handleSessionRequest(r.name, 'accept', r.date, r.time, r.id)} className="flex-1 sm:flex-none relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px] group/btnAcc">
                          <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-70 group-hover/btnAcc:opacity-100 transition-opacity duration-300"></span>
                          <span className="relative flex items-center px-6 py-2.5 rounded-xl bg-black/50 group-hover/btnAcc:bg-transparent transition-colors duration-300 w-full h-full justify-center">
                            <span className="font-bold text-white text-sm">Accept</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-white/5 rounded-2xl border border-white/5 h-full">
                      <div className="w-12 h-12 mb-4 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                        <i className="fa-solid fa-inbox text-xl text-slate-400"></i>
                      </div>
                      <p className="text-sm font-medium text-slate-400 leading-relaxed">No pending requests right now.<br/>Check back later!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Schedule */}
          <div className="space-y-8 flex flex-col self-start w-full">
            <div className="relative group/card1">
              <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-[#FA93FA]/10 to-[#983AD6]/10 blur-xl opacity-0 group-hover/card1:opacity-100 transition duration-1000 z-0 pointer-events-none"></div>
              <div className="relative z-10 bg-[#010101]/50 backdrop-blur-3xl rounded-[32px] border border-white/10 p-6 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                   <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                     <i className="fa-solid fa-calendar-check text-[#C967E8]"></i> My Schedule
                   </h2>
                   <button onClick={handleViewAllSchedule} className="text-sm font-bold text-[#C967E8] hover:text-[#FA93FA] transition flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                     Expand <i className="fa-solid fa-expand text-[10px]"></i>
                   </button>
                </div>
                
                <div className="space-y-4 flex-1">
                   {todaySessions.length > 0 ? (
                      todaySessions.map(s => renderSessionBox(s))
                   ) : (
                      <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-white/5 rounded-2xl border border-white/5 h-full">
                        <div className="w-12 h-12 mb-4 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                          <i className="fa-regular fa-sun text-xl text-slate-400"></i>
                        </div>
                        <p className="text-sm font-medium text-slate-400 leading-relaxed">No sessions lined up today.<br/>Click 'Expand' to view upcoming.</p>
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

export default MentorPortal
