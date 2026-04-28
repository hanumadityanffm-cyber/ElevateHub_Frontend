import React, { useState, useEffect } from 'react'
import api from '../api/axios'

// --- PROFESSIONAL DELETE MODAL ---
const DeleteConfirmationModal = ({ userName, onConfirm, onCancel }) => (
  <div className="w-full text-center py-4">
    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500/10 mb-8 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
      <i className="fa-solid fa-trash-can text-red-500 text-3xl"></i>
    </div>
    
    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Confirm Deletion</h3>
    <p className="text-slate-400 mb-8 max-w-sm mx-auto font-medium">
      Are you sure you want to delete <span className="text-white font-bold">{userName}</span>? This will permanently remove their account and all associated data.
    </p>

    <div className="flex gap-4">
      <button 
        onClick={onCancel} 
        className="flex-1 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all"
      >
        Cancel
      </button>
      <button 
        onClick={onConfirm} 
        className="flex-1 px-6 py-3.5 bg-red-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:bg-red-700 transition-colors"
      >
        Proceed
      </button>
    </div>
  </div>
)

// --- ENHANCED USER FORM MODAL ---
const UserFormModal = ({ role, onSave, onCancel }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('123456')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [targetCourse, setTargetCourse] = useState('React & Frontend')

  const mentorSkills = ['React / UI', 'Python', 'Leadership', 'Data Science', 'UX/UI Design', 'Agile/Scrum']
  const studentCourses = ['React & Frontend', 'Python & Backend', 'Leadership & Agile', 'UX/UI Design', 'Data Science']

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])
  }

  const handleCreate = () => {
    if (!name || !email) return
    const skills = role === 'mentor' ? selectedSkills : [targetCourse]
    onSave({ name, email, password: pass, role, skills })
  }

  return (
    <div className="w-full text-left">
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${role === 'mentor' ? 'from-[#FA93FA] to-[#8b5cf6]' : 'from-[#3b82f6] to-[#8b5cf6]'} shadow-lg`}>
          <i className={`fa-solid ${role === 'mentor' ? 'fa-chalkboard-user' : 'fa-user-graduate'} text-white text-2xl`}></i>
        </div>
        <div>
          <h3 className="text-2xl font-black text-white leading-none mb-1">Create {role.charAt(0).toUpperCase() + role.slice(1)}</h3>
          <p className="text-slate-500 text-sm font-medium">Standard provisioning protocol active</p>
        </div>
      </div>

      <div className="space-y-5 mb-10">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[2px] pl-1">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Aditya Varma" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#FA93FA] outline-none transition-all placeholder:text-slate-700 font-medium" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[2px] pl-1">Password</label>
            <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#FA93FA] outline-none transition-all placeholder:text-slate-700 font-medium" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[2px] pl-1">Email Address</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="aditya@elevate.in" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#FA93FA] outline-none transition-all placeholder:text-slate-700 font-medium" />
        </div>

        {role === 'mentor' ? (
          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[2px] pl-1">Expertise & Skills</label>
            <div className="grid grid-cols-2 gap-2 bg-white/5 p-4 rounded-2xl border border-white/5">
              {mentorSkills.map(s => (
                <label key={s} className="flex items-center space-x-3 text-xs text-slate-300 cursor-pointer group py-1">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input type="checkbox" className="peer sr-only" checked={selectedSkills.includes(s)} onChange={() => toggleSkill(s)} />
                    <div className="w-4 h-4 rounded border border-white/20 peer-checked:bg-[#FA93FA] peer-checked:border-[#FA93FA] transition-all flex items-center justify-center group-hover:border-white/40">
                      <i className={`fa-solid fa-check text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity`}></i>
                    </div>
                  </div>
                  <span className="group-hover:text-white transition-colors">{s}</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[2px] pl-1">Target Course Pathway</label>
            <div className="relative">
              <select value={targetCourse} onChange={e => setTargetCourse(e.target.value)} className="w-full bg-[#1a1b23] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#3b82f6] outline-none transition-all appearance-none cursor-pointer font-bold">
                {studentCourses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"></i>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button onClick={onCancel} className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition shadow-lg">Decline</button>
        <button onClick={handleCreate} className={`flex-1 px-6 py-4 bg-gradient-to-r ${role === 'mentor' ? 'from-[#FA93FA] to-[#8b5cf6]' : 'from-[#3b82f6] to-[#8b5cf6]'} text-white font-black rounded-2xl hover:scale-[1.02] transition-transform shadow-xl`}>Provision User</button>
      </div>
    </div>
  )
}

const ManageSection = ({ title, icon, role, users, onDelete, onAdd, colorClass }) => (
  <div className="relative group/card h-full">
    <div className={`absolute -inset-1.5 rounded-[32px] bg-gradient-to-r ${colorClass} blur-xl opacity-0 group-hover/card:opacity-60 transition duration-1000 z-0 pointer-events-none`}></div>
    <div className="relative z-10 bg-[#010101]/65 backdrop-blur-3xl rounded-[32px] border border-white/10 p-6 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <i className={`fa-solid ${icon} text-[#8b5cf6]`}></i> Manage {title}
          </h2>
          <button 
            onClick={() => onAdd(role)}
            className="group/add relative flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-white/10 to-white/5 hover:to-white/10 border border-white/10 rounded-xl text-xs font-black text-white transition-all overflow-hidden"
          >
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#FA93FA] to-[#8b5cf6] transform translate-y-full group-hover/add:translate-y-0 transition-transform"></div>
            <i className="fa-solid fa-plus text-[#FA93FA] group-hover:scale-110 transition-transform"></i> Add New
          </button>
      </div>
      
      <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-3 custom-scrollbar">
        {users.length > 0 ? users.map(u => (
          <div key={u.id} className="flex items-center justify-between p-5 rounded-[22px] bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all duration-300 group/row hover:translate-x-2">
            <div className="flex items-center gap-5">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-sm font-black text-white border border-white/10 shadow-inner">
                {u.initials}
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-black text-white">{u.name}</span>
                <span className="text-xs text-slate-500 font-medium">{u.email}</span>
              </div>
            </div>
            <button 
              onClick={() => onDelete(u.id, u.name)}
              className="p-3 bg-red-500/0 hover:bg-red-500/10 rounded-xl opacity-0 group-hover/row:opacity-100 hover:text-red-500 text-slate-500 transition-all"
            >
              <i className="fa-solid fa-trash-can text-sm"></i>
            </button>
          </div>
        )) : (
          <div className="text-center py-16 text-slate-600 font-medium italic text-sm">Deployment sequence empty...</div>
        )}
      </div>
    </div>
  </div>
)

const AdminControlCenter = ({ pendingApps, handleMentorApproval }) => {
  const [stats, setStats] = useState({ totalMentees: 0, totalMentors: 0, activeSessions: 0 })
  const [mentors, setMentors] = useState([])
  const [students, setStudents] = useState([])
  
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState(null) // 'add' or 'delete'
  const [targetRole, setTargetRole] = useState('')
  const [targetUser, setTargetUser] = useState({ id: null, name: '' })

  const refreshAll = async () => {
    try {
      const s = await api.get('/api/admin/stats')
      setStats(s.data)
      const m = await api.get('/api/admin/users?role=mentor')
      setMentors(m.data)
      const st = await api.get('/api/admin/users?role=student')
      setStudents(st.data)
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    refreshAll()
  }, [pendingApps])

  const openAddModal = (role) => {
    setTargetRole(role)
    setModalType('add')
    setShowModal(true)
  }

  const openDeleteModal = (id, name) => {
    setTargetUser({ id, name })
    setModalType('delete')
    setShowModal(true)
  }

  const handleSaveUser = async (userData) => {
    const res = await api.post('/api/admin/users', userData)
    
    if (res.data.success) {
      refreshAll()
      setShowModal(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!targetUser.id) return
    await api.delete(`/api/admin/users/${targetUser.id}`)
    refreshAll()
    setShowModal(false)
  }

  return (
    <section className="relative w-full min-h-screen bg-[#010101] overflow-hidden flex flex-col justify-start pb-20">
      
      {/* ABSOLUTE BACKGROUND VIDEO */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none fixed">
         <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#010101] via-[#010101]/80 to-transparent z-10"></div>
         <video className="w-full h-full object-cover mix-blend-screen opacity-30 block scale-105" autoPlay muted playsInline loop>
           <source src="https://cdn.pixabay.com/video/2023/05/06/161917-824623504_large.mp4" type="video/mp4" />
         </video>
         <div className="absolute inset-0 bg-[#010101]/60 backdrop-blur-[10px] z-10 pointer-events-none"></div>
         <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#010101] via-[#010101]/90 to-transparent z-10"></div>
      </div>

      <div className="relative z-20 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-40">
        
        <div className="mb-12 relative z-10">
          <h1 className="text-[44px] sm:text-[56px] font-extrabold text-white leading-tight tracking-tight">
             Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#ec4899]">Control Center</span>
          </h1>
          <p className="text-slate-400 mt-2 text-lg font-medium">Global platform oversight system.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          <div className="lg:col-span-1 space-y-8 flex flex-col">
            <div className="relative group/card1 h-full">
              <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-[#3b82f6]/20 to-[#8b5cf6]/20 blur-xl opacity-60 transition duration-1000 z-0 pointer-events-none"></div>
              <div className="relative z-10 bg-[#010101]/65 backdrop-blur-3xl rounded-[32px] border border-white/10 p-6 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] h-full flex flex-col">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                   <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                     <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center shadow-[0_0_15px_#8b5cf6]">
                        <i className="fa-solid fa-chart-line text-sm text-white"></i>
                     </div> Platform Stats
                   </h2>
                </div>
                <div className="space-y-4 flex-1">
                  {[
                    { label: 'Total Students', val: String(stats.totalMentees), color: 'text-purple-400', icon: 'fa-user-graduate', bg: 'bg-purple-400/10' },
                    { label: 'Total Mentors', val: String(stats.totalMentors), color: 'text-blue-400', icon: 'fa-chalkboard-user', bg: 'bg-blue-400/10' },
                    { label: 'Active Sessions', val: String(stats.activeSessions), color: 'text-emerald-400', icon: 'fa-video', bg: 'bg-emerald-400/10' }
                  ].map(s => (
                    <div key={s.label} className="group relative flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
                          <i className={`fa-solid ${s.icon} ${s.color}`}></i>
                        </div>
                        <span className="text-slate-300 font-bold">{s.label}</span>
                      </div>
                      <span className={`font-black text-2xl ${s.color}`}>{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="relative group/form h-full">
              <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-[#8b5cf6]/20 to-[#ec4899]/20 blur-xl opacity-60 group-hover/form:opacity-100 transition duration-1000 z-0 pointer-events-none"></div>
              <div className="relative z-10 bg-[#010101]/50 backdrop-blur-3xl rounded-[32px] border border-white/10 p-6 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] h-full flex flex-col">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                   <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                     <i className="fa-solid fa-list-check text-[#8b5cf6]"></i> Pending Mentor Applications
                   </h2>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-sm text-slate-400 border-collapse">
                    <thead className="text-xs text-slate-500 uppercase tracking-wider">
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-4 font-black uppercase text-slate-500 tracking-widest text-[10px]">Applicant</th>
                        <th className="px-4 py-4 font-black uppercase text-slate-500 tracking-widest text-[10px]">Stack</th>
                        <th className="px-4 py-4 font-black uppercase text-slate-500 tracking-widest text-[10px] text-right">Gatekeeper</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingApps.length > 0 ? pendingApps.map(a => (
                        <tr key={a.id} className="border-b border-white/5 hover:bg-white/5 transition duration-300">
                          <td className="px-4 py-5 whitespace-nowrap">
                            <div className="flex items-center text-white">
                              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-300 flex items-center justify-center font-black mr-4 text-xs border border-white/10 shadow-lg">{a.initials}</div>
                              <span className="font-black text-[15px]">{a.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex flex-wrap gap-2">
                              {a.skills.map(s => <span key={s} className="text-[10px] font-black uppercase bg-white/5 border border-white/10 text-slate-400 px-2.5 py-1 rounded-lg">{s}</span>)}
                            </div>
                          </td>
                          <td className="px-4 py-5 text-right">
                             <div className="flex justify-end gap-2">
                                <button onClick={() => handleMentorApproval(a.name, 'reject', a.id)} className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center"><i className="fa-solid fa-xmark"></i></button>
                                <button onClick={() => handleMentorApproval(a.name, 'approve', a.id)} className="px-6 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-[11px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all">Authorize</button>
                             </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="3" className="py-12 text-center text-slate-600 font-medium italic">All applications processed.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <ManageSection 
             title="Mentors" 
             icon="fa-chalkboard-user" 
             role="mentor" 
             users={mentors} 
             onDelete={openDeleteModal} 
             onAdd={openAddModal} 
             colorClass="from-[#FA93FA]/30 to-[#8b5cf6]/30"
           />
           <ManageSection 
             title="Students" 
             icon="fa-user-graduate" 
             role="student" 
             users={students} 
             onDelete={openDeleteModal} 
             onAdd={openAddModal} 
             colorClass="from-[#3b82f6]/30 to-[#8b5cf6]/30"
           />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="relative z-10 bg-[#010101]/92 backdrop-blur-[15px]" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-[#010101]/80 backdrop-blur-3xl border border-white/10 rounded-[48px] p-12 max-w-lg w-full shadow-[0_0_100px_rgba(0,0,0,0.9)] border-t border-white/20 transform transition-all animate-in zoom-in-95 duration-300">
             {modalType === 'add' ? (
               <UserFormModal role={targetRole} onSave={handleSaveUser} onCancel={() => setShowModal(false)} />
             ) : (
               <DeleteConfirmationModal userName={targetUser.name} onConfirm={handleDeleteUser} onCancel={() => setShowModal(false)} />
             )}
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminControlCenter
