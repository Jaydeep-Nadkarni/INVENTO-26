import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiPost, apiGet } from '../../utils/apiClient'
import logoLoader from '../../assets/UI/KLE-logo-small.png'
import pageTurnSound from '../../assets/audios/page-turn.mp3'
import closeSound from '../../assets/audios/briefcase-open.mp3'
import { clubsData, mapEventFromDb } from './clubsData'
import { CustomAlert, VerifyingOverlay } from './EventUIComponents'
import ClubsGrid from './ClubsGrid'
import EventCardGrid from './EventCardGrid'
import EventDetails from './EventDetails'

const EventsGrid = () => {
    const { clubSlug, eventSlug } = useParams()
    const navigate = useNavigate()
    const [liveClubs, setLiveClubs] = useState(clubsData)
    const [eventsLoading, setEventsLoading] = useState(true)

    useEffect(() => {
        const fetchLiveEvents = async () => {
            try {
                const { data } = await apiGet('/api/events');
                if (data && Array.isArray(data)) {
                    // Map DB events to frontend format
                    const mappedEvents = data.map(mapEventFromDb);

                    // Group events by club and update liveClubs
                    const updatedClubs = clubsData.map(club => {
                        const clubEvents = club.events.map(staticEvent => {
                            const dbEvent = data.find(de => de._id === staticEvent.slug || de.id == staticEvent.id);
                            if (dbEvent) {
                                const mappedDbEvent = mapEventFromDb(dbEvent, true);
                                // Merge DB data into static data, only overwriting if DB has value
                                return {
                                    ...staticEvent,
                                    ...Object.fromEntries(
                                        Object.entries(mappedDbEvent).filter(([_, v]) =>
                                            v !== null && v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
                                        )
                                    ),
                                    // Special handling for slots
                                    slotsAvailable: mappedDbEvent.slotsAvailable !== undefined ? mappedDbEvent.slotsAvailable : staticEvent.slotsAvailable,
                                    specificSlots: mappedDbEvent.specificSlots !== null ? mappedDbEvent.specificSlots : staticEvent.specificSlots
                                };
                            }
                            return staticEvent;
                        });
                        return { ...club, events: clubEvents };
                    });
                    setLiveClubs(updatedClubs);
                }
            } catch (error) {
                console.error("Failed to sync live events:", error);
            } finally {
                setEventsLoading(false);
            }
        };

        fetchLiveEvents();
    }, []);

    const playSound = (audioFile) => {
        const audio = new Audio(audioFile)
        audio.play().catch(e => console.log("Audio play failed:", e))
    }

    const currentClub = liveClubs.find(c => c.slug === clubSlug)
    const currentEvent = currentClub?.events?.find(e => e.id === eventSlug)


    const handleClubClick = (slug) => {
        playSound(pageTurnSound)
        navigate(`/${slug}`)
    }

    const handleEventClick = (eSlug) => {
        playSound(pageTurnSound)
        navigate(`/${clubSlug}/${eSlug}`)
    }

    const handleBackToClubs = () => {
        playSound(closeSound)
        navigate('/events')
    }



    const handleBackToEvents = () => {
        playSound(closeSound)
        navigate(`/${clubSlug}`)
    }

    // Navigation Logic
    const currentClubIndex = liveClubs.findIndex(c => c.slug === clubSlug)
    const currentEventIndex = currentClub?.events?.findIndex(e => e.id === eventSlug)

    const goToNextClub = (e) => {
        e?.stopPropagation()
        playSound(pageTurnSound)
        const nextIndex = (currentClubIndex + 1) % liveClubs.length
        navigate(`/${liveClubs[nextIndex].slug}`)
    }

    const goToPrevClub = (e) => {
        e?.stopPropagation()
        playSound(pageTurnSound)
        const prevIndex = (currentClubIndex - 1 + liveClubs.length) % liveClubs.length
        navigate(`/${liveClubs[prevIndex].slug}`)
    }

    const goToNextEvent = (e) => {
        e?.stopPropagation()
        playSound(pageTurnSound)
        if (currentEventIndex < currentClub.events.length - 1) {
            navigate(`/${clubSlug}/${currentClub.events[currentEventIndex + 1].id}`)
        } else {
            // Go to next club's first event
            const nextIndex = (currentClubIndex + 1) % liveClubs.length
            const nextClub = liveClubs[nextIndex]
            if (nextClub.events.length > 0) {
                navigate(`/${nextClub.slug}/${nextClub.events[0].id}`)
            } else {
                navigate(`/${nextClub.slug}`)
            }
        }
    }

    const goToPrevEvent = (e) => {
        e?.stopPropagation()
        playSound(pageTurnSound)
        if (currentEventIndex > 0) {
            navigate(`/${clubSlug}/${currentClub.events[currentEventIndex - 1].id}`)
        } else {
            // Go to prev club's last event
            const prevIndex = (currentClubIndex - 1 + liveClubs.length) % liveClubs.length
            const prevClub = liveClubs[prevIndex]
            if (prevClub.events.length > 0) {
                navigate(`/${prevClub.slug}/${prevClub.events[prevClub.events.length - 1].id}`)
            } else {
                navigate(`/${prevClub.slug}`)
            }
        }
    }


    // Registration States
    const [regLoading, setRegLoading] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const [showRegModal, setShowRegModal] = useState(false)
    const [isOfficial, setIsOfficial] = useState(false)
    const [contingentKey, setContingentKey] = useState('')
    const [teamInfo, setTeamInfo] = useState({ teamName: '', memberIds: [] })
    const [memberDetails, setMemberDetails] = useState([]) // Array of user objects
    const [newMemberId, setNewMemberId] = useState('')
    const [fetchingMember, setFetchingMember] = useState(false)

    // Confirmation State
    const [confirmation, setConfirmation] = useState({ show: false, message: '', whatsappLink: '' })

    // Custom Alert State
    const [alert, setAlert] = useState({ show: false, title: '', message: '', type: 'info' })

    const showAlert = (title, message, type = 'info') => {
        setAlert({ show: true, title, message, type })
    }

    useEffect(() => {
        const isModalActive = showRegModal || confirmation.show || alert.show || !!eventSlug
        if (isModalActive) {
            document.body.classList.add('modal-open')
        } else {
            document.body.classList.remove('modal-open')
        }
        return () => document.body.classList.remove('modal-open')
    }, [showRegModal, confirmation.show, alert.show, eventSlug])

    const handleFetchMember = async () => {
        if (!newMemberId.trim()) return

        const maxSize = currentEvent.teamSize?.toString().split('-').pop() || "1"
        if (memberDetails.length + 1 >= parseInt(maxSize)) {
            showAlert('TEAM FULL', `Maximum squad size of ${maxSize} reached.`, 'error')
            return
        }

        setFetchingMember(true)
        try {
            const { data } = await apiGet(`/api/users/validate/${newMemberId}`, navigate)

            if (memberDetails.some(m => m._id === data.data._id)) {
                showAlert('DUPLICATE AGENT', 'Agent already briefed (already in team)', 'error')
                return
            }

            const currentUser = JSON.parse(localStorage.getItem('currentUser'))
            if (currentUser && (currentUser._id === data.data._id || currentUser.id === data.data._id)) {
                showAlert('LEADER DETECTED', 'You are already the squad leader.', 'error')
                return
            }

            setMemberDetails([...memberDetails, data.data])
            setNewMemberId('')
        } catch (err) {
            showAlert('IDENTITY VERIFICATION FAILED', err.message, 'error')
        } finally {
            setFetchingMember(false)
        }
    }

    const removeMember = (id) => {
        setMemberDetails(memberDetails.filter(m => m._id !== id))
    }

    const handleRegisterClick = async () => {
        const userStr = localStorage.getItem('currentUser')
        if (!userStr) {
            showAlert('ACCESS DENIED', 'Please identify yourself (Login) to register.', 'error')
            navigate('/login')
            return
        }

        // Reset states
        setIsOfficial(false)
        setContingentKey('')
        setTeamInfo({ teamName: '', memberIds: [] })
        setMemberDetails([])
        setNewMemberId('')

        setShowRegModal(true)
    }

    const initiatePayment = async () => {
        const user = JSON.parse(localStorage.getItem('currentUser'))
        const isTeam = currentEvent.type?.toLowerCase() === 'team' || parseInt(currentEvent.teamSize) > 1
        const minTeamSize = parseInt(currentEvent.teamSize?.toString().split('-')[0] || '1');

        if (isTeam) {
            if (!teamInfo.teamName || teamInfo.teamName.trim() === '') {
                showAlert('NAME REQUIRED', 'Please assign a tactical name to your squad.', 'error')
                return
            }
            if (memberDetails.length + 1 < minTeamSize) {
                showAlert('SQUAD INCOMPLETE', `Minimum squad size for this operation is ${minTeamSize}.`, 'error')
                return
            }
        }

        if (isOfficial) {
            if (!contingentKey) return showAlert('ENCRYPTION ERROR', 'Contingent Key required for official registration', 'error')

            // Validate key before proceeding
            try {
                await apiPost('/api/events/validate-key', { key: contingentKey }, navigate)
            } catch (err) {
                showAlert('ACCESS DENIED', err.message, 'error')
                return
            }
        }

        setRegLoading(true)
        try {
            const { data } = await apiPost('/api/events/create-order', {
                eventId: currentEvent.id,
                inventoId: user._id || user.id,
                teamName: teamInfo.teamName,
                members: [user._id || user.id, ...memberDetails.map(m => m._id)],
                isOfficial,
                contingentKey
            }, navigate)

            // Common registration payload
            const regPayload = {
                inventoId: user._id || user.id,
                teamName: teamInfo.teamName,
                members: [user._id || user.id, ...memberDetails.map(m => m._id)],
                isOfficial,
                contingentKey
            }

            // Handle Free Events
            if (data.free) {
                setVerifying(true)
                const regData = await apiPost(`/api/events/register/${currentEvent.id}`, regPayload, navigate).then(res => res.data);

                setConfirmation({
                    show: true,
                    message: 'MISSION ACCOMPLISHED: Registration Successful (Free Pass Used)!',
                    whatsappLink: regData.whatsappLink
                })
                setShowRegModal(false)
                setVerifying(false)
                return
            }

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: "INR",
                name: "INVENTO 2026",
                image: logoLoader,
                description: `Payment for ${currentEvent.realName || currentEvent.themeName}`,
                order_id: data.id,
                handler: async (paymentResponse) => {
                    setVerifying(true)
                    try {
                        const regData = await apiPost(`/api/events/register/${currentEvent.id}`, {
                            ...regPayload,
                            razorpay_order_id: paymentResponse.razorpay_order_id,
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_signature: paymentResponse.razorpay_signature,
                        }, navigate).then(res => res.data);

                        setConfirmation({
                            show: true,
                            message: 'MISSION ACCOMPLISHED: Registration Successful!',
                            whatsappLink: regData.whatsappLink
                        })
                        setShowRegModal(false)
                    } catch (err) {
                        showAlert('CRITICAL ERROR', err.message, 'error')
                    } finally {
                        setVerifying(false)
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone,
                    method: 'upi'
                },
                theme: { color: "#b91c1c" },
                method: {
                    upi: true,
                    card: true,
                    netbanking: false,
                    wallet: false,
                    emi: false,
                    paylater: false
                }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (err) {
            showAlert('ORDER FAILED', err.message, 'error')
        } finally {
            setRegLoading(false)
        }
    }

    const renderContent = () => {
        if (!clubSlug) {
            return (
                <ClubsGrid
                    liveClubs={liveClubs}
                    eventsLoading={eventsLoading}
                    handleClubClick={handleClubClick}
                />
            )
        }

        if (currentClub && !eventSlug) {
            return (
                <EventCardGrid
                    currentClub={currentClub}
                    eventsLoading={eventsLoading}
                    handleBackToClubs={handleBackToClubs}
                    handleEventClick={handleEventClick}
                    goToPrevClub={goToPrevClub}
                    goToNextClub={goToNextClub}
                />
            )
        }

        if (eventSlug && currentEvent) {
            return (
                <EventDetails
                    currentEvent={currentEvent}
                    currentClub={currentClub}
                    clubSlug={clubSlug}
                    handleBackToEvents={handleBackToEvents}
                    goToPrevEvent={goToPrevEvent}
                    goToNextEvent={goToNextEvent}
                    handleRegisterClick={handleRegisterClick}
                    regLoading={regLoading}
                    showRegModal={showRegModal}
                    setShowRegModal={setShowRegModal}
                    isOfficial={isOfficial}
                    setIsOfficial={setIsOfficial}
                    contingentKey={contingentKey}
                    setContingentKey={setContingentKey}
                    teamInfo={teamInfo}
                    setTeamInfo={setTeamInfo}
                    memberDetails={memberDetails}
                    newMemberId={newMemberId}
                    setNewMemberId={setNewMemberId}
                    fetchingMember={fetchingMember}
                    handleFetchMember={handleFetchMember}
                    removeMember={removeMember}
                    initiatePayment={initiatePayment}
                    confirmation={confirmation}
                    setConfirmation={setConfirmation}
                    navigate={navigate}
                />
            )
        }

        return null
    }

    return (
        <>
            {renderContent()}
            <VerifyingOverlay show={verifying} />
            <CustomAlert
                show={alert.show}
                title={alert.title}
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ ...alert, show: false })}
            />
        </>
    )
}

export default EventsGrid
