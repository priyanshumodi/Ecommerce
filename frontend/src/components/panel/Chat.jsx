import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersChats } from '../features/userSlice';
import { fetchUsersMessages, addLocalMessage, setMessage } from '../features/messageSlice';
import { socket } from '../../sockets/socket.js';

const GLOBAL_CHANNEL_ID = "GLOBAL_BROADCAST";

const Chat = () => {
    const dispatch = useDispatch()
    const {users, isLoading, error} = useSelector(state => state.user)
    const currentUser = useSelector(state => state.user.currentUser)
    const messages = useSelector(state => state.message.messages)
    console.log(messages)

    // 1. State for data and active interactions
    const [activeContact, setActiveContact] = useState({
        _id: GLOBAL_CHANNEL_ID,
        firstName: "Global",
        lastName: "Announcement"
    })
    const [activeContactId, setActiveContactId] = useState(GLOBAL_CHANNEL_ID);
    const [inputText, setInputText] = useState("");
    const [typing, setTyping] = useState(false);
    const messageEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        // 1. Fetch the initial list of chat contacts
        dispatch(fetchUsersChats());

        // 2. Open the socket connection ONE time
        socket.connect();

        // 3. Mount the permanent incoming pipelines
        socket.on("receive_message", (newMessage) => {
            console.log("⚡ Real-time private message caught!", newMessage);
            const currentRoomId = [currentUser?._id, activeContactId].sort().join("_");
            if (newMessage.roomId === currentRoomId) {
                console.log(newMessage)
                dispatch(addLocalMessage(newMessage));
            }
        });

        socket.on("receive_global_message", (broadcastMessage) => {
            console.log("⚡ Real-time broadcast alert caught!", broadcastMessage);
            if (activeContactId === GLOBAL_CHANNEL_ID) {
                console.log(activeContactId, GLOBAL_CHANNEL_ID)
                dispatch(addLocalMessage(broadcastMessage));

            } else {
                alert(`📢 Global Announcement: ${broadcastMessage.text}`);
            }
        });

        // CLEANUP: Only runs when the user leaves the chat screen entirely
        return () => {
            socket.off("receive_message");
            socket.off("receive_global_message");
            socket.disconnect(); // Only disconnect on total page exit
        };
    }, [dispatch, activeContactId]); // 👈 Keep this array clean so it doesn't loop or reconnect!

    useEffect(() => {
        // If the socket isn't connected yet, or we're on the broadcast channel, stop here
        if (!currentUser?._id || activeContactId === GLOBAL_CHANNEL_ID) return;

        // Dynamically update the backend about our room switch WITHOUT disconnecting
        socket.emit("join_chat", {
            senderId: currentUser._id,
            receiverId: activeContactId
        });

        socket.on('userTyping', (data) => {
            setTyping(true);
        });

        socket.on('userStoppedTyping', () => {
            setTyping(false);
        });

        console.log(`Switched active socket pipeline room to: ${activeContactId}`);

        // Clean up event listeners when component unmounts
        return () => {
            socket.off('userTyping');
            socket.off('userStoppedTyping');
        };
    }, [activeContactId, currentUser]); // 👈 Listens carefully to contact changes

    // Fetch initial channel logs on start
    useEffect(() => {
        dispatch(fetchUsersMessages(GLOBAL_CHANNEL_ID));
        setActiveContact({ _id: GLOBAL_CHANNEL_ID, firstName: "Global", lastName: "Announcement" });
    }, [dispatch]);

    // Scroll chat to the bottom automatically 
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    //     }, 50);

    //     return () => clearTimeout(timer);
    // }, [messages, typing]);

    // Handle changing channels/contacts
    const handleSwitchContact = (user) => {
        setActiveContactId(user?._id);
        setActiveContact(user);

        dispatch(setMessage([]))
        dispatch(fetchUsersMessages(user?._id));

        // If switching to a normal user, join their private room string channel
        if (user?._id !== GLOBAL_CHANNEL_ID && currentUser?._id) {
            socket.emit("join_chat", {
                senderId: currentUser._id,
                receiverId: user._id
            });
        }
    };

    const handleInputChange = (e) => {
        // console.log(e.target.value)
        setInputText(e.target.value)
        // Notify server that this user is typing
        const currentRoomId = [currentUser?._id, activeContactId].sort().join("_");
        socket.emit('typing', { room: currentRoomId, user: currentUser });

        // Clear the previous timeout tracker
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set a new timeout to stop typing after 2 seconds of silence
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stopTyping', { room: currentRoomId });
        }, 2000);
    }

    // Send Message Routing Logic
    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        if (activeContactId === GLOBAL_CHANNEL_ID) {
            // Send Global Broadcast (Only execution path available for Admin)
            socket.emit("send_admin_broadcast", {
                senderId: currentUser?._id,
                text: inputText,
                roomId: GLOBAL_CHANNEL_ID
            });
        } else {
            // Send standard private 1-on-1 Message
            socket.emit("send_message", {
                senderId: currentUser?._id,
                receiverId: activeContactId,
                text: inputText
            });
        }
        setInputText("");
    };

    if (isLoading) return <div className="home-title">Loading Data....</div>;
    if (error) return <div className="home-title" style={{ color: "#ff6b6b" }}>Error: {error}</div>;

    return (
        <div className="chat-root">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <h3>Messages</h3>
                    <div className="search-box">
                        <i className="ti ti-search"></i>
                        <input type="text" placeholder="Search chats..." />
                    </div>
                </div>
                <div className="contacts">

                    <div
                        className={`contact global-channel-row ${activeContactId === GLOBAL_CHANNEL_ID ? 'active' : ''}`}
                        onClick={() => handleSwitchContact({ _id: GLOBAL_CHANNEL_ID, firstName: "Global", lastName: "Announcement" })}
                    >
                        <div className="avatar-wrap">
                            <div className="avatar av-red">📢</div>
                        </div>
                        <div className="contact-info">
                            <div className="contact-name">Broadcast to All Users</div>
                        </div>
                    </div>

                    {users?.map(user => (
                        <div
                            key={user?._id}
                            className={`contact ${user?._id === activeContactId ? 'active' : ''}`}
                            onClick={() => handleSwitchContact(user)}
                        >
                            <div className="avatar-wrap">
                                <div className={`avatar av-purple`}>{user?.firstName?.charAt(0).toUpperCase()}{user?.lastName?.charAt(0).toUpperCase()}</div>
                                {/* {c.online && <div className="dot"></div>} */}
                            </div>
                            <div className="contact-info">
                                <div className="contact-name">{user?.firstName} {user?.lastName}</div>
                                {/* this is preview the latest message on top */}
                                {/* <div className="contact-preview">{c.preview}</div> */}
                            </div>
                            <div className="contact-meta">
                                {/* <div className="contact-time">{c.time}</div> */}
                                {/* {c.unread > 0 && <div className="unread-badge">{c.unread}</div>} */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat */}
            <div className="chat-main">
                <div className="chat-topbar">
                    <div className="chat-topbar-left">
                        <div className="avatar-wrap">
                            <div className={`avatar av-purple`}>{activeContact?.firstName?.charAt(0).toUpperCase()}{activeContact?.lastName?.charAt(0).toUpperCase()}</div>
                            {/* {activeContact.online && <div className="dot"></div>} */}
                        </div>
                        <div>
                            <div className="contact-name">{activeContact?.firstName} {activeContact?.lastName}</div>
                            {/* <div className="online-text">{activeContact.online ? "Online" : "Offline"}</div> */}
                        </div>
                    </div>
                    <div className="topbar-actions">
                        <div className="icon-btn"><i className="ti ti-phone"></i></div>
                        <div className="icon-btn"><i className="ti ti-video"></i></div>
                        <div className="icon-btn"><i className="ti ti-dots-vertical"></i></div>
                    </div>
                </div>

                <div className="messages">
                    {/* <div className="day-divider">Today</div> */}
                    {messages?.map((message) => (
                        <div key={message?._id} className={`msg-row ${message?.senderId === currentUser?._id ? 'out' : 'in'}`}>
                            {/* avatar on chat */}
                            {/* {m.from !== 'me' && <div className={`msg-avatar ${activeContact.cls}`}>{activeContact.initials}</div>} */}
                            <div>
                                <div className={`bubble ${message?.senderId === currentUser?._id ? 'out' : 'in'}`}>
                                    {message?.text}
                                </div>
                                {/* message time and tick */}
                                {/* <div className="bubble-meta">
                                    {m.time} {m.from === 'me' && <span className="tick">✓✓</span>}
                                </div> */}
                            </div>
                            <div ref={messageEndRef} />
                        </div>
                    ))}
                    {/* typing logic */}
                    {typing && (
                        <div className="msg-row in">
                            <div className={`msg-avatar ${activeContact.cls}`}>{activeContact.initials}</div>
                            <div className="bubble in" style={{ padding: '12px 16px' }}>
                                <div className="typing-dots"><span></span><span></span><span></span></div>
                            </div>
                        </div>
                    )}
                    {/* Dummy div for auto-scroll */}
                    {/* <div ref={messageEndRef} /> */}
                </div>



                {
                    activeContactId === GLOBAL_CHANNEL_ID && currentUser?.role !== 'admin' ? (
                        <div className="input-bar locked-bar" style={{ justifyContent: 'center', backgroundColor: '#eaeaea', color: '#555', fontStyle: 'italic' }}>
                            <span>🔒 Only administrators can post announcements to this channel.</span>
                        </div>
                    ) : (
                        <div className="input-bar">
                            <textarea
                                className="msg-input"
                                rows="1"
                                placeholder="Type a message..."
                                value={inputText}
                                onChange={(e) => handleInputChange(e)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <button className="send-btn" onClick={handleSendMessage}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M10 14l11 -11" />
                                    <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                                </svg>
                            </button>
                        </div>
                    )
                }

            </div>
        </div >
    );
};

export default Chat;