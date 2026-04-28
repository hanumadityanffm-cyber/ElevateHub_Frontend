import React, { useEffect, useState } from 'react'
import api from './api/axios'
import './index.css'

// Internal Components
import Icon from './components/Icon'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import StudentPortal from './components/StudentPortal'
import MentorPortal from './components/MentorPortal'
import AdminControlCenter from './components/AdminControlCenter'
import Footer from './components/Footer'
import CustomSelect from './components/CustomSelect'

const BookSessionModal = ({ mentorName, minDateStr, confirmBooking, closeModal }) => {
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const timeOptions = ["12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"];

  const handleConfirm = () => {
    const dateEl = document.getElementById('book-date')
    if (dateEl) {
       confirmBooking(mentorName, dateEl.value, selectedTime);
    }
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#FA93FA]/20 to-[#983AD6]/20 mb-6 border border-[#C967E8]/30 shadow-[0_0_15px_rgba(201,103,232,0.3)]">
        <Icon name="Calendar" className="w-8 h-8 text-[#FA93FA]" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Book Session</h3>
      <p className="text-sm text-slate-400 mb-6">Select your preferred time with <span className="text-[#C967E8] font-bold">{mentorName}</span>.</p>
      <div className="space-y-4 mb-8 text-left">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2 pl-1">Date</label>
          <input type="date" id="book-date" min={minDateStr} defaultValue={minDateStr} className="w-full px-4 py-3 bg-[#0f111a]/80 backdrop-blur-md border border-white/10 rounded-xl focus:border-[#C967E8] focus:ring-1 focus:ring-[#C967E8] text-white outline-none transition shadow-inner text-sm" />
        </div>
        <div>
           <label className="block text-xs font-medium text-slate-400 mb-2 pl-1">Time</label>
           <CustomSelect options={timeOptions} value={selectedTime} onChange={setSelectedTime} />
        </div>
      </div>
      <div className="flex gap-4 relative z-0">
        <button onClick={closeModal} className="flex-1 relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px] group/btnC">
          <span className="absolute inset-0 bg-white/20 opacity-50 group-hover/btnC:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center justify-center px-4 py-3 rounded-xl bg-black/80 hover:bg-white/10 transition-colors duration-300 w-full h-full">
            <span className="font-bold text-slate-300">Cancel</span>
          </span>
        </button>
        <button onClick={handleConfirm} className="flex-1 relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px] group/btnConf">
          <span className="absolute inset-0 bg-gradient-to-r from-[#FA93FA] to-[#C967E8] opacity-70 group-hover/btnConf:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center justify-center px-4 py-3 rounded-xl bg-black/50 group-hover/btnConf:bg-transparent transition-colors duration-300 w-full h-full">
            <span className="font-bold text-white">Confirm</span>
          </span>
        </button>
      </div>
    </div>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState('') // 'student', 'mentor', or 'admin'
  const [currentUser, setCurrentUser] = useState(null) // { id, name, email, role }
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  
  // Use ref to track modal content clearing timeout to prevent race conditions
  const modalTimeoutRef = React.useRef(null)
  
  // State for data
  const [mentors, setMentors] = useState([])
  const [sessions, setSessions] = useState([])
  const [mentorRequests, setMentorRequests] = useState([])
  const [pendingApps, setPendingApps] = useState([])

  const [currentBooking, setCurrentBooking] = useState({ mentorName: null, cardId: null })
  const [regRole, setRegRole] = useState('student')

  // ─── Data Fetching ──────────────────────────────────────────────────────────
  // Fetch relevant data whenever the user navigates to a dashboard
  useEffect(() => {
    if (!isLoggedIn || !currentUser) return

    if (currentPage === 'dashboard' && currentUser.role === 'student') {
      // Fetch mentors list
      api.get('/api/mentors').then(r => setMentors(r.data)).catch(console.error)
      // Fetch student sessions
      api.get(`/api/sessions/student/${currentUser.id}`).then(r => setSessions(r.data)).catch(console.error)
    }

    if (currentPage === 'mentor-dashboard' && currentUser.role === 'mentor') {
      // Fetch mentor's sessions (pending ones become "requests")
      api.get(`/api/sessions/mentor/${currentUser.id}`).then(r => {
        const data = r.data
        const pending = data.filter(s => s.status === 'Pending Approval').map(s => ({
          id: s.id, name: s.studentName, date: s.date, time: s.time, topic: s.topic || 'General Mentoring'
        }))
        setMentorRequests(pending)
        setSessions(data)
      }).catch(console.error)
    }

    if (currentPage === 'admin-dashboard' && currentUser.role === 'admin') {
      api.get('/api/admin/applications').then(r => setPendingApps(r.data)).catch(console.error)
    }
  }, [currentPage, isLoggedIn, currentUser])

  // Dark mode forced for this specific design
  useEffect(() => {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  }, [])

  const showModal = (content) => {
    // Clear any pending clear-content timeout
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current)
      modalTimeoutRef.current = null
    }
    setModalContent(content)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    // Delay clearing content to allow for the close animation
    modalTimeoutRef.current = setTimeout(() => {
      setModalContent(null)
      modalTimeoutRef.current = null
    }, 200)
  }

  const navigateTo = (pageId, bypassAuth = false) => {
    if ((pageId === 'dashboard' || pageId === 'admin-dashboard' || pageId === 'mentor-dashboard') && !isLoggedIn && !bypassAuth) {
      showModal(
        <div className="text-center py-4">
          <Icon name="Rocket" className="w-12 h-12 text-[#C967E8] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Authentication Required</h3>
          <p className="text-slate-400 mb-6">Please log in to view this page.</p>
          <button onClick={() => { closeModal(); navigateTo('login') }} className="relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px] group/btn block w-full">
            <span className="absolute inset-0 bg-gradient-to-r from-[#FA93FA] to-[#C967E8] opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center px-4 py-3 rounded-xl bg-black/50 group-hover/btn:bg-transparent transition-colors duration-300 w-full h-full">
              <span className="font-bold text-white">Go to Login</span>
            </span>
          </button>
        </div>
      )
      return
    }
    setCurrentPage(pageId)
    window.scrollTo(0, 0)
  }

  const navigateToUserDashboard = () => {
    if (currentUserRole === 'admin') navigateTo('admin-dashboard')
    else if (currentUserRole === 'mentor') navigateTo('mentor-dashboard')
    else navigateTo('dashboard')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const selectedRole = e.target.loginRole.value
    const email    = e.target.querySelector('input[type="email"]').value.trim().toLowerCase()
    const password = e.target.querySelector('input[type="password"]').value

    try {
      const res = await api.post('/api/auth/login', { email, password, selectedRole })
      const data = res.data

      // If we get here, the request succeeded (2xx)
      if (data.success) {
        setCurrentUser({ id: data.id, name: data.name, email: data.email, role: data.role })
        setIsLoggedIn(true)
        setCurrentUserRole(data.role)
        if (data.role === 'admin') navigateTo('admin-dashboard', true)
        else if (data.role === 'mentor') navigateTo('mentor-dashboard', true)
        else navigateTo('dashboard', true)
      }
    } catch (err) {
      console.error('Login error:', err)

      // Axios puts non-2xx response data in err.response.data
      const data = err.response?.data

      if (data?.error === 'INVALID_CREDENTIALS') {
        showModal(
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500/10 mb-6 border border-red-500/30 shadow-[0_0_25px_rgba(239,68,68,0.25)]">
              <i className="fa-solid fa-circle-xmark text-red-400 text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Invalid Credentials</h3>
            <p className="text-slate-400 mb-8 max-w-xs mx-auto">We couldn't find an account matching those details. Please double-check your email and password.</p>
            <button onClick={closeModal} className="w-full bg-red-500/20 border border-red-500/40 text-red-300 font-bold py-3 rounded-xl hover:bg-red-500/30 transition">Try Again</button>
          </div>
        )
      } else if (data?.error === 'MENTOR_REJECTED') {
        showModal(
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-amber-500/10 mb-6 border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              <i className="fa-solid fa-door-closed text-amber-400 text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">We're Sorry</h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-left">
              <p className="text-slate-300 leading-relaxed">After careful review, we weren't able to accept your mentorship application at this time.</p>
              <p className="text-slate-500 text-sm mt-3 italic">We truly appreciate your interest in ElevateHub — have a wonderful journey ahead! 🌟</p>
            </div>
            <button onClick={closeModal} className="w-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold py-3 rounded-xl hover:bg-amber-500/30 transition">Close</button>
          </div>
        )
      } else if (data?.error === 'MENTOR_PENDING') {
        showModal(
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-amber-500/10 mb-6 border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              <i className="fa-solid fa-user-clock text-amber-400 text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Application Under Review</h3>
            <p className="text-slate-400 mb-8 max-w-xs mx-auto">Your mentor application is still being reviewed by our admin team. Please check back later.</p>
            <button onClick={closeModal} className="w-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold py-3 rounded-xl hover:bg-amber-500/30 transition">Close</button>
          </div>
        )
      } else if (data?.error === 'ROLE_MISMATCH') {
        const actualRole = data.actualRole
        const portalName = actualRole === 'admin' ? 'Admin Control Center' : actualRole === 'mentor' ? 'Mentor Portal' : 'Student Portal'
        showModal(
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#C967E8]/10 mb-6 border border-[#C967E8]/30 shadow-[0_0_25px_rgba(201,103,232,0.25)]">
              <i className="fa-solid fa-shield-halved text-[#FA93FA] text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Access Denied</h3>
            <p className="text-slate-400 mb-3 max-w-xs mx-auto">Your credentials belong to a <span className="text-[#FA93FA] font-bold capitalize">{actualRole}</span> account.</p>
            <div className="bg-[#C967E8]/10 border border-[#C967E8]/20 rounded-2xl p-4 mb-6">
              <p className="text-sm text-slate-300">Please switch to the <span className="text-white font-bold capitalize">{actualRole}</span> tab to access the <span className="text-[#FA93FA] font-bold">{portalName}</span>.</p>
            </div>
            <button onClick={closeModal} className="w-full bg-gradient-to-r from-[#FA93FA]/20 to-[#C967E8]/20 border border-[#C967E8]/30 text-[#FA93FA] font-bold py-3 rounded-xl hover:from-[#FA93FA]/30 hover:to-[#C967E8]/30 transition">Got it</button>
          </div>
        )
      } else {
        // Network error or unrecognized server error
        showModal(
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500/10 mb-6 border border-red-500/30">
              <i className="fa-solid fa-server text-red-400 text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Connection Error</h3>
            <p className="text-slate-400 mb-8">Unable to reach the server. Make sure the backend is running on port 8080.</p>
            <button onClick={closeModal} className="w-full bg-red-500/20 border border-red-500/40 text-red-300 font-bold py-3 rounded-xl hover:bg-red-500/30 transition">Close</button>
          </div>
        )
      }
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('name') || e.target.querySelector('input[type="text"]')?.value || ''
    const email = formData.get('email') || e.target.querySelector('input[type="email"]')?.value || ''
    const password = formData.get('password') || e.target.querySelector('input[type="password"]')?.value || ''

    try {
      const res = await api.post('/api/auth/register', { name, email, password, role: regRole, skills: [] })
      const data = res.data

      if (regRole === 'mentor') {
        showModal(
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-amber-500/10 mb-8 relative border border-amber-500/30">
              <i className="fa-solid fa-user-clock text-4xl text-amber-500"></i>
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Action Required</h3>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 shadow-inner">
              <p className="text-slate-300 text-lg leading-relaxed mb-4 font-medium">
                Your mentor application has been <span className="text-amber-400 font-bold">Successfully Received</span>.
              </p>
              <p className="text-slate-500">
                To ensure the highest quality of mentorship, all expert accounts must be <span className="text-white font-bold">manually verified and accepted</span> by our administrative team.
              </p>
            </div>
            <p className="text-slate-400 mb-8 italic">
              Check your email for status updates within 24-48 hours.
            </p>
            <button onClick={() => { closeModal(); navigateTo('home') }} className="relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px] group/btn block w-full">
              <span className="absolute inset-0 bg-white opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center px-8 py-4 rounded-xl bg-black/80 group-hover/btn:bg-transparent group-hover/btn:text-black transition-colors duration-300 w-full h-full">
                <span className="font-bold text-white group-hover/btn:text-black text-lg">Return to Home</span>
              </span>
            </button>
          </div>
        )
      } else {
        // Student registered — log them in directly
        setCurrentUser({ id: data.id, name: data.name, email: data.email, role: 'student' })
        setIsLoggedIn(true)
        setCurrentUserRole('student')
        setSessions([])
        navigateTo('dashboard', true)
      }
    } catch (err) {
      console.error('Register error:', err)
      const data = err.response?.data
      showModal(
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500/10 mb-6 border border-red-500/30">
            <i className="fa-solid fa-circle-xmark text-red-400 text-3xl"></i>
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Registration Failed</h3>
          <p className="text-slate-400 mb-8">{data?.message || 'Something went wrong.'}</p>
          <button onClick={closeModal} className="w-full bg-red-500/20 border border-red-500/40 text-red-300 font-bold py-3 rounded-xl hover:bg-red-500/30 transition">Try Again</button>
        </div>
      )
    }
  }

  const logout = () => {
    setIsLoggedIn(false)
    setCurrentUserRole('')
    setCurrentUser(null)
    setMentors([])
    setSessions([])
    setMentorRequests([])
    setPendingApps([])
    navigateTo('home')
  }

  const openBookingModal = (mentorName, cardId) => {
    setCurrentBooking({ mentorName, cardId })
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const minDateStr = nextWeek.toISOString().split('T')[0]

    showModal(
      <BookSessionModal 
        mentorName={mentorName} 
        minDateStr={minDateStr} 
        confirmBooking={confirmBooking} 
        closeModal={closeModal} 
      />
    )
  }

  const confirmBooking = async (mentorName, dateVal, timeVal) => {
    const formattedDate = new Date(dateVal).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    try {
      await api.post('/api/sessions', {
        studentId: currentUser.id,
        mentorId: currentBooking.cardId,
        date: formattedDate,
        time: timeVal + ' (IST)',
        topic: 'General Mentoring'
      })

      // Refresh sessions
      const sessRes = await api.get(`/api/sessions/student/${currentUser.id}`)
      setSessions(sessRes.data)

      // Refresh mentors list
      const mentRes = await api.get('/api/mentors')
      setMentors(mentRes.data)
    } catch (err) {
      console.error('Booking error:', err)
    }
    
    showModal(
      <div className="text-center py-4">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/10 mb-6 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <i className="fa-solid fa-check text-emerald-400 text-3xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
        <p className="text-slate-400 mb-8">Your request has been sent to <span className="text-white font-bold">{mentorName}</span> for <br /><span className="text-[#C967E8] font-bold">{formattedDate} at {timeVal}</span>.</p>
        <button onClick={closeModal} className="relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px] group/btn block w-full">
          <span className="absolute inset-0 bg-gradient-to-r from-[#FA93FA] to-[#C967E8] opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center justify-center px-4 py-3 rounded-xl bg-black/50 group-hover/btn:bg-transparent transition-colors duration-300 w-full h-full">
            <span className="font-bold text-white">Awesome!</span>
          </span>
        </button>
      </div>
    )
  }

  const handleSessionRequest = async (menteeName, action, date, time, reqId) => {
    try {
      await api.put(`/api/sessions/${reqId}/status`, { action })

      // Refresh mentor's data
      const res = await api.get(`/api/sessions/mentor/${currentUser.id}`)
      const data = res.data
      const pending = data.filter(s => s.status === 'Pending Approval').map(s => ({
        id: s.id, name: s.studentName, date: s.date, time: s.time, topic: s.topic || 'General Mentoring'
      }))
      setMentorRequests(pending)
      setSessions(data)
    } catch (err) {
      console.error('Session request error:', err)
    }

    if (action === 'accept') {
      showModal(
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#FA93FA]/10 mb-6 border border-[#FA93FA]/30 shadow-[0_0_20px_rgba(250,147,250,0.2)]">
            <i className="fa-solid fa-handshake text-[#FA93FA] text-3xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Session Accepted</h3>
          <p className="text-slate-400 mb-8">You've successfully accepted the session with <span className="text-white font-bold">{menteeName}</span>.<br />It has been added to your schedule.</p>
          <button onClick={closeModal} className="relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px] group/btn block w-full">
            <span className="absolute inset-0 bg-gradient-to-r from-[#FA93FA] to-[#C967E8] opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center px-4 py-3 rounded-xl bg-black/50 group-hover/btn:bg-transparent transition-colors duration-300 w-full h-full">
              <span className="font-bold text-white">Continue</span>
            </span>
          </button>
        </div>
      )
    }
  }

  const handleMentorApproval = async (name, action, id) => {
    try {
      await api.put(`/api/admin/applications/${id}`, { action })
      // Refresh pending applications
      const res = await api.get('/api/admin/applications')
      setPendingApps(res.data)
    } catch (err) {
      console.error('Approval error:', err)
    }

    showModal(
      <div className="text-center py-4">
        <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full ${action === 'approve' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'} mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]`}>
          <i className={`fa-solid ${action === 'approve' ? 'fa-user-check text-emerald-400' : 'fa-user-xmark text-red-400'} text-3xl`}></i>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{action === 'approve' ? 'Mentor Approved' : 'Application Rejected'}</h3>
        <p className="text-slate-400 mb-8">{name} has been {action === 'approve' ? <span className="text-emerald-400 font-bold">approved</span> : <span className="text-red-400 font-bold">rejected</span>}.</p>
        <button onClick={closeModal} className={`relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px] group/btn block w-full`}>
          <span className={`absolute inset-0 opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300 ${action === 'approve' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-red-500/50'}`}></span>
          <span className="relative flex items-center justify-center px-4 py-3 rounded-xl bg-black/50 group-hover/btn:bg-transparent transition-colors duration-300 w-full h-full">
            <span className={`font-bold text-white`}>Done</span>
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="text-slate-200 antialiased min-h-screen flex flex-col relative">
      <Navbar navigateTo={navigateTo} isLoggedIn={isLoggedIn} logout={logout} navigateToUserDashboard={navigateToUserDashboard} />

      <main className="flex-grow z-10">
        {currentPage === 'home' && <Home navigateTo={navigateTo} />}
        {currentPage === 'login' && <Login handleLogin={handleLogin} navigateTo={navigateTo} />}
        {currentPage === 'register' && <Register handleRegister={handleRegister} regRole={regRole} setRegRole={setRegRole} navigateTo={navigateTo} />}
        {currentPage === 'dashboard' && <StudentPortal mentors={mentors} openBookingModal={openBookingModal} sessions={sessions} showModal={showModal} closeModal={closeModal} setSessions={setSessions} />}
        {currentPage === 'mentor-dashboard' && <MentorPortal mentorRequests={mentorRequests} handleSessionRequest={handleSessionRequest} sessions={sessions} setSessions={setSessions} showModal={showModal} closeModal={closeModal} currentUser={currentUser} />}
        {currentPage === 'admin-dashboard' && <AdminControlCenter pendingApps={pendingApps} handleMentorApproval={handleMentorApproval} />}
      </main>

      <Footer />

      {/* MODAL OVERLAY */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#010101]/60 backdrop-blur-[10px] transition-opacity duration-300 pointer-events-none"></div>
          <div className="absolute inset-0" onClick={closeModal}></div>
          <div className="relative group/modal max-w-md w-full transform transition-all duration-300 animate-in zoom-in-95 scale-100 z-10 w-full">
            <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-[#FA93FA]/20 to-[#983AD6]/20 blur-xl opacity-100 transition duration-1000 z-0 pointer-events-none"></div>
            <div className="relative bg-[#010101]/80 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.6)] w-full p-10 flex flex-col z-10">
               {modalContent}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
