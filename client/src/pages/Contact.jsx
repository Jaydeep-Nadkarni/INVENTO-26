import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import bgImage from '../assets/UI/Invento-bg.jpg'
import paperTexture from '../assets/UI/paper-texture.jpg'
import spy2 from '../assets/UI/spy2.png'
import Navbar from '../components/Navbar'

// Dummy Data for Teams
const teamsData = [
  {
    id: 'registration',
    name: 'Registration',
    members: [
      { name: 'Akhilesh Joshi', role: 'Registration Lead', phone: '+91 88844 44382', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kuldeep', socials: { instagram: '#', linkedin: '#', whatsapp: 'https://wa.me/918884444382' } },
      { name: 'Akhilesh Joshi', role: 'Registration Coordinator', phone: '+91 79762 57768', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Devanshi', socials: { instagram: '#', linkedin: '#', whatsapp: 'https://wa.me/917976257768' } },
    ]
  },
  {
    id: 'technical',
    name: 'Technical',
    members: [
      { name: 'Akhilesh Joshi', role: 'Tech Lead', phone: '+91 98765 43210', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan', socials: { instagram: '#', linkedin: '#', whatsapp: '#' } },
      { name: 'Akhilesh Joshi', role: 'Frontend Developer', phone: '+91 87654 32109', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', socials: { instagram: '#', linkedin: '#', whatsapp: '#' } },
      { name: 'Akhilesh Joshi', role: 'Backend Developer', phone: '+91 76543 21098', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit', socials: { instagram: '#', linkedin: '#', whatsapp: '#' } },
    ]
  },
  {
    id: 'hr_literary',
    name: 'HR & Literary',
    members: [
      { name: 'Akhilesh Joshi', role: 'HR Director', phone: '+91 65432 10987', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha', socials: { instagram: '#', linkedin: '#', whatsapp: '#' } },
      { name: 'Akhilesh Joshi', role: 'Content Strategist', phone: '+91 54321 09876', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram', socials: { instagram: '#', linkedin: '#', whatsapp: '#' } },
    ]
  },
  {
    id: 'media',
    name: 'Media',
    members: [
      { name: 'Akhilesh Joshi', role: 'Press Officer', phone: '+91 43210 98765', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali', socials: { instagram: '#', linkedin: '#', whatsapp: '#' } },
      { name: 'Akhilesh Joshi', role: 'Visual Comms', phone: '+91 32109 87654', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', socials: { instagram: '#', linkedin: '#', whatsapp: '#' } },
    ]
  },
  {
    id: 'cultural',
    name: 'Cultural',
    members: [
      { name: 'Akhilesh Joshi', role: 'Event Coordinator', phone: '+91 21098 76543', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deepak', socials: { instagram: '#', linkedin: '#', whatsapp: '#' } },
      { name: 'Akhilesh Joshi', role: 'Performance Director', phone: '+91 10987 65432', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera', socials: { instagram: '#', linkedin: '#', whatsapp: '#' } },
    ]
  },
  {
    id: 'cdc',
    name: 'CDC',
    members: [
      { name: 'Akhilesh Joshi', role: 'Development Lead', phone: '+91 99887 76655', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun', socials: { instagram: '#', linkedin: '#', whatsapp: '#' } },
    ]
  },
  {
    id: 'wec',
    name: 'WEC',
    members: [
      { name: 'Akhilesh Joshi', role: 'Empowerment Lead', phone: '+91 88776 65544', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya', socials: { instagram: '#', linkedin: '#', whatsapp: '#' } },
    ]
  },
  {
    id: 'fine_arts',
    name: 'Fine Arts',
    members: [
      { name: 'Akhilesh Joshi', role: 'Art Director', phone: '+91 77665 54433', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ishaan', socials: { instagram: '#', linkedin: '#', whatsapp: '#' } },
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    members: [
      { name: 'Akhilesh Joshi', role: 'Athletics Captain', phone: '+91 66554 43322', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Virat', socials: { instagram: '#', linkedin: '#', whatsapp: '#' } },
    ]
  },
]

const Contact = () => {
  const [activeTeam, setActiveTeam] = useState('registration')

  const scrollToSection = (id) => {
    setActiveTeam(id)
    const element = document.getElementById(id)
    if (element) {
      // Temporarily unobserve or just scroll
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Scroll Spy Effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTeam(entry.target.id)
          }
        })
      },
      {
        root: document.getElementById('scrollContainer'),
        threshold: 0,
        rootMargin: "-45% 0px -45% 0px" // Creates a thin trigger line in the center of the viewport
      }
    )

    teamsData.forEach((team) => {
      const el = document.getElementById(team.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // FAQ State
  const [openQuestion, setOpenQuestion] = useState(null)

  const toggleQuestion = (questionIdx) => {
    setOpenQuestion(openQuestion === questionIdx ? null : questionIdx)
  }

  // FAQ Data
  const faqData = [
    {
      question: 'What is INVENTO 2026?',
      answer: 'INVENTO 2026 is the annual technical and cultural fest organized by KLE Technological University. It features a wide range of events including technical competitions, cultural performances, workshops, and guest lectures.'
    },
    {
      question: 'When and where will INVENTO 2026 be held?',
      answer: 'INVENTO 2026 will be held at KLE Technological University campus. Check the Schedule page for detailed dates and timings of all events.'
    },
    {
      question: 'How do I register for INVENTO 2026?',
      answer: 'Click on the "REGISTER NOW" button in the navigation bar or on any event page. Fill in your details and select the events you wish to participate in.'
    },
    {
      question: 'Is there a registration fee?',
      answer: 'Registration fees vary by event. Some events are free while others may have a nominal fee. Check individual event details for specific information.'
    },
    {
      question: 'Can I register for multiple events?',
      answer: 'Yes! You can register for as many events as you like, provided there are no time conflicts between them. Check the schedule to plan your participation.'
    },
    {
      question: 'What types of events are conducted?',
      answer: 'INVENTO features technical events (coding, robotics, paper presentations), cultural events (dance, music, drama), sports competitions, workshops, and guest lectures.'
    },
    {
      question: 'Will certificates be provided?',
      answer: 'Yes, participation certificates will be provided to all participants. Winners will receive special certificates along with prizes.'
    },
    {
      question: 'Is accommodation provided for outstation participants?',
      answer: 'Limited accommodation may be available for outstation participants. Contact the organizing committee in advance to make arrangements.'
    }
  ]


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-screen bg-[#1a1a1a] relative overflow-hidden flex flex-col font-serif"
    >
      {/* Background */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>

      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex-1 relative z-10 pt-24 px-4 md:px-8 pb-4 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6 overflow-hidden">

        {/* LEFT SIDEBAR: TEAM LIST */}
        <div className="w-full md:w-1/4 shrink-0 flex flex-col gap-2 h-auto md:h-full overflow-y-auto custom-scrollbar md:pr-4">
          <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>

          <h2 className="text-2xl font-black text-red-700 uppercase tracking-tighter mb-4 border-b-2 border-red-800/30 pb-2 hidden md:block">
            
          </h2>

          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {teamsData.map((team) => (
              <button
                key={team.id}
                onClick={() => scrollToSection(team.id)}
                className={`
                    shrink-0 px-4 py-3 text-left border-l-4 transition-all duration-300 font-serif uppercase tracking-widest
                    ${activeTeam === team.id
                    ? 'bg-red-900/20 border-red-600 text-white text-xl'
                    : 'border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/5 text-sm'}
                  `}
              >
                {team.name}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: SCROLLABLE MEMBERS Area */}
        <div className="flex-1 h-full relative bg-[#f4f1ea] rounded-xl overflow-hidden shadow-2xl flex flex-col">
          {/* Paper Texture Overlay */}
          <div
            className="absolute inset-0 opacity-100 mix-blend-multiply pointer-events-none z-0"
            style={{ backgroundImage: `url(${paperTexture})`, backgroundSize: 'cover' }}
          />
          <div className="absolute inset-0 bg-amber-50/30 mix-blend-multiply pointer-events-none z-0" />
          {/* Spy2 Watermark */}
          <div
            className="absolute inset-0 opacity-[0.1] pointer-events-none z-0"
            style={{
              backgroundImage: `url(${spy2})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />

          {/* Header / Title Bar */}
          <div className="relative z-10 bg-black/5 border-b border-black/10 px-8 py-6 backdrop-blur-sm">
            <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter loading-none">
              Contact Us
            </h1>
            <p className="font-mono text-xs text-red-800 tracking-[0.4em] uppercase mt-2">
              INVENTO 2026
            </p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 relative z-10 custom-scrollbar-dark scroll-smooth" id="scrollContainer">
            <style jsx>{`
                    .custom-scrollbar-dark::-webkit-scrollbar { width: 6px; }
                    .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 10px; }
                    .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.4); }
                `}</style>

            <div className="space-y-16 pb-40">
              {teamsData.map((team) => (
                <div key={team.id} id={team.id} className="scroll-mt-6">
                  {/* Team Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-black/20 flex-1"></div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tighter bg-black/5 px-4 py-1 rounded">
                      {team.name}
                    </h2>
                    <div className="h-px bg-black/20 flex-1"></div>
                  </div>

                  {/* Members Grid - Flexbox for Equal Height & Centering */}
                  <div className="flex flex-wrap justify-center gap-8">
                    {team.members.map((member, idx) => (
                      <div key={idx} className="group relative flex flex-col items-center w-full md:w-[calc(50%-1.5rem)]">

                        {/* Tape Visual */}
                        <div className="absolute -top-3 w-24 h-6 bg-yellow-100/90 rotate-[-2deg] opacity-70 z-20 shadow-sm border border-white/40 left-1/2 -translate-x-1/2"></div>

                        {/* Polaroid Photo Frame */}
                        <div className="bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-200 transform transition-all duration-300 w-full max-w-[300px] h-[80%] flex flex-col relative">
                          <div className="aspect-[4/5] bg-gray-100 mb-4 p-1 border border-gray-100 shadow-inner relative overflow-hidden">
                            <div className="w-full h-full bg-gray-900 grayscale contrast-125 overflow-hidden relative">
                              <img src={member.img} alt={member.name} className="w-full h-full object-cover opacity-90 mix-blend-normal group-hover:scale-110 transition-transform duration-700" />
                              {/* Scanline overlay */}
                              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,buttonface_50%,#f5f5f5_50%)] bg-[length:100%_4px,2px_100%] opacity-10 pointer-events-none"></div>
                            </div>
                          </div>

                          {/* Text Details */}
                          <div className="text-center px-1 pb-2 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-black text-xl md:text-2xl text-black uppercase leading-none font-serif tracking-tight mb-2">
                                {member.name}
                              </h3>
                              <p className="text-red-700 font-mono text-xs uppercase tracking-[0.2em] mb-4 border-b border-gray-300 pb-3 inline-block">
                                {member.role}
                              </p>

                            </div>
                            <div className="space-y-3">
                              {/* Phone Link */}
                              <a href={`tel:${member.phone.replace(/\s+/g, '')}`} className="flex items-center justify-center gap-2 text-gray-700 font-bold font-mono text-sm group/phone hover:text-black">
                                <svg className="w-3 h-3 text-gray-400 group-hover/phone:text-red-600 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.49-5.41-4.07-6.9-6.9l1.97-1.57c.26-.26.35-.65.24-1.01A11.36 11.36 0 018.59 4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-4c0-.55-.45-1-1-1z" /></svg>
                                {member.phone}
                              </a>

                              {/* Social Links Row */}
                              <div className="flex justify-center gap-5 pt-3 border-t border-gray-100">
                                {/* Instagram */}
                                <a href={member.socials?.instagram} className="text-gray-400 hover:text-pink-700 transition-all transform hover:scale-125 hover:-rotate-6" title="Instagram">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </a>
                                {/* WhatsApp */}
                                <a href={member.socials?.whatsapp} className="text-gray-400 hover:text-green-600 transition-all transform hover:scale-125" title="WhatsApp">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                </a>
                                {/* LinkedIn */}
                                <a href={member.socials?.linkedin} className="text-gray-400 hover:text-blue-700 transition-all transform hover:scale-125 hover:rotate-6" title="LinkedIn">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                </a>
                              </div>
                            </div>


                            <div className="absolute inset-0 border-[4px] border-transparent group-hover:border-black/5 pointer-events-none transition-all duration-300"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Contact

