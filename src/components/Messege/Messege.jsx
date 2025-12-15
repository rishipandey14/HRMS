import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { Send, Plus, MoreVertical } from "lucide-react";
import { CHAT_BASE_URL, BASE_URL } from "../../utility/Config";

const parseToken = (token) => {
  try {
    const payload = token?.split(".")[1];
    return payload ? JSON.parse(atob(payload)) : null;
  } catch (err) {
    return null;
  }
};

const Messege = ({ initialChatId }) => {
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const socketRef = useRef(null);

  const [openNewChat, setOpenNewChat] = useState(false);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newChatMessage, setNewChatMessage] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // User cache to avoid repeated API calls - stored in state to trigger re-renders
  const [userCache, setUserCache] = useState({});

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const decoded = useMemo(() => parseToken(token), [token]);
  const currentUserId = decoded?.id;

  const authHeader = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  const normalizeUser = (u) => {
    if (!u) return { _id: "unknown", name: "Unknown" };
    if (typeof u === "string") return { _id: u, name: u };
    return { _id: u._id || u.id, name: u.name || u.email || "Unknown", email: u.email };
  };

  // Fetch ALL company users once when chats exist (for displaying names)
  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!token || chats.length === 0) return;
      
      try {
        const res = await axios.get(`${BASE_URL}/company/users`, authHeader);
        const users = res.data?.users || [];
        
        // Build cache object from all users at once
        const cache = {};
        users.forEach((user) => {
          const userId = user._id || user.id;
          if (userId) {
            cache[userId] = {
              _id: userId,
              name: user.name,
              email: user.email,
            };
          }
        });
        
        setUserCache(cache);
        // Also populate members list for new chat modal
        setMembers(users);
      } catch (err) {
        console.error("Error fetching company users:", err);
      }
    };
    
    fetchAllUsers();
  }, [token, authHeader, chats.length]);

  const contactDisplay = (chat) => {
    if (chat?.isGroup) {
      return {
        title: chat.groupName || `Group (${chat.members?.length || 0})`,
        subtitle: `${chat.members?.length || 0} members`,
        avatar: chat.groupAvatar || `https://i.pravatar.cc/150?u=${chat._id}`,
      };
    }
    
    // Direct chat - get the other person's info from cache
    const otherMemberId = chat?.members?.find((m) => m !== currentUserId);
    const otherUserInfo = userCache[otherMemberId] || { name: otherMemberId || "Direct chat", email: "" };
    
    return {
      title: otherUserInfo.name || otherMemberId || "Direct chat",
      subtitle: otherUserInfo.email || "Direct chat",
      avatar: `https://i.pravatar.cc/150?u=${otherMemberId || "direct"}`,
    };
  };

  const upsertMessage = useCallback((incoming) => {
    if (!incoming?._id) return;
    
    // Cache sender info if it's an object
    if (incoming.senderId && typeof incoming.senderId === "object") {
      const senderData = incoming.senderId;
      const userId = senderData._id || senderData.id;
      if (userId) {
        setUserCache((prev) => ({
          ...prev,
          [userId]: {
            _id: userId,
            name: senderData.name,
            email: senderData.email,
          },
        }));
      }
    }
    
    setMessages((prev) => {
      if (prev.some((m) => m._id === incoming._id)) return prev;
      return [...prev, incoming];
    });
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      if (!token) return;
      setLoadingChats(true);
      try {
        const res = await axios.get(`${CHAT_BASE_URL}/api/chats`, authHeader);
        const list = res.data || [];
        setChats(list);
        const chatIdFromState = location.state?.chatId;
        const targetChatId = chatIdFromState || initialChatId;
        if (targetChatId) {
          const chatFromState = list.find((chat) => chat._id === targetChatId);
          if (chatFromState) {
            setSelectedChat(chatFromState);
          }
        } else if (list.length) {
          setSelectedChat(list[0]);
        }
      } catch (err) {
        console.error("Error loading chats", err);
        setChats([]);
      } finally {
        setLoadingChats(false);
      }
    };
    fetchChats();
  }, [token, authHeader, location.state?.chatId, initialChatId]);

  // Close any open context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const loadMembers = async () => {
    // Members are already loaded from userCache, no need to fetch again
    if (members.length > 0) return;
    
    if (!token) return;
    setMembersLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/company/users`, authHeader);
      const list = res.data?.users || [];
      setMembers(list);
    } catch (err) {
      console.error("Error loading members", err);
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  // socket connect
  useEffect(() => {
    if (!token) return;
    const socket = io(CHAT_BASE_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // Register all listeners before emitting connect_user
    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("connect_user");
    });

    socket.on("receive_message", (msg) => {
      console.log("Received message:", msg);
      upsertMessage(msg);
      
      // Auto-mark as seen if the chat is currently open
      if (selectedChat?._id === msg.chatId && msg.senderId !== currentUserId) {
        socket.emit("message_seen", msg._id);
      }
    });

    socket.on("edit_message", (msg) => {
      console.log("Message edited:", msg);
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
    });

    socket.on("delete_message", (msgId) => {
      console.log("Message deleted:", msgId);
      setMessages((prev) => prev.filter((m) => m._id !== msgId));
    });

    socket.on("message_seen", ({ messageId, userId }) => {
      console.log("Message seen:", messageId, "by", userId);
      // Update local message state to reflect seen status
      setMessages((prev) =>
        prev.map((m) => {
          if (m._id === messageId) {
            return {
              ...m,
              unreadBy: (m.unreadBy || []).filter((id) => id !== userId),
            };
          }
          return m;
        })
      );
    });

    socket.on("chat_messages_seen", ({ chatId, userId, count }) => {
      console.log(`${count} messages seen in chat ${chatId} by ${userId}`);
      // Update all messages in current chat
      if (selectedChat?._id === chatId) {
        setMessages((prev) =>
          prev.map((m) => ({
            ...m,
            unreadBy: (m.unreadBy || []).filter((id) => id !== userId),
          }))
        );
      }
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, upsertMessage, selectedChat?._id, currentUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat?._id) return;
      setLoadingMessages(true);
      try {
        const res = await axios.get(
          `${CHAT_BASE_URL}/api/messages/${selectedChat._id}`,
          authHeader
        );
        const msgs = res.data || [];
        setMessages(msgs);
        
        // ensure room joined for realtime
        socketRef.current?.emit("join_chat", selectedChat._id);
        
        // Mark all messages in this chat as seen via socket (real-time)
        socketRef.current?.emit("mark_chat_seen", selectedChat._id);
      } catch (err) {
        console.error("Error loading messages", err);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedChat?._id, authHeader]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedChat?._id) return;
    const payload = { chatId: selectedChat._id, content: input.trim(), type: "text" };
    try {
      // Send via socket only; backend socket handler persists and emits receive_message
      socketRef.current?.emit("send_message", payload);
      setInput("");
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  const startDirectChat = async () => {
    if (!selectedUserId) return;
    const body = {
      receiverId: selectedUserId,
      content: newChatMessage.trim() || "Hi",
      type: "text",
    };
    try {
      const res = await axios.post(`${CHAT_BASE_URL}/api/messages`, body, authHeader);
      const chatId = res.data?.chatId || res.data?.chat?._id || res.data?.chat || body.chatId;
      // refresh chats and focus the one with this chatId
      const chatsRes = await axios.get(`${CHAT_BASE_URL}/api/chats`, authHeader);
      const list = chatsRes.data || [];
      setChats(list);
      const found = list.find((c) => c._id === chatId) || list[0];
      setSelectedChat(found || null);
      if (chatId) {
        const msgs = await axios.get(`${CHAT_BASE_URL}/api/messages/${chatId}`, authHeader);
        setMessages(msgs.data || []);
      }
      setOpenNewChat(false);
      setNewChatMessage("");
      setSelectedUserId("");
    } catch (err) {
      console.error("Start chat failed", err);
    }
  };

  const deleteChat = async (chatId) => {
    if (!chatId || !window.confirm("Are you sure you want to delete this chat?")) return;
    try {
      await axios.delete(`${CHAT_BASE_URL}/api/chats/${chatId}`, authHeader);
      setChats((prev) => prev.filter((chat) => chat._id !== chatId));
      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
      alert("Failed to delete chat.");
    }
  };

  const selectedContact = selectedChat ? contactDisplay(selectedChat) : null;
  const navigate = useNavigate();
  const openProfile = (chat) => {
    // For direct chats, open other member's profile
    const otherMemberId = chat?.members?.find((m) => m !== currentUserId);
    if (otherMemberId) {
      navigate(`/viewprofile/${otherMemberId}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-3 p-4 sm:px-4 bg-gray-200 shadow rounded-3xl overflow-hidden md:min-w-[900px]">
      {/* Left: Contacts */}
      <div className="w-full md:w-[360px] md:flex-none p-4 bg-white rounded-3xl flex flex-col max-h-[calc(100vh-120px)] min-h-0 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <button
            className="bg-blue-500 p-1 rounded-full text-white"
            onClick={() => {
              setOpenNewChat(true);
              if (!members.length) loadMembers();
            }}
          >
            <Plus size={16} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search messages"
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
          value={memberSearch}
          onChange={(e) => setMemberSearch(e.target.value)}
        />

        <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto translucent-scrollbar pr-1">
          {chats.map((chat) => {
            const contact = contactDisplay(chat);
            return (
              <div
                key={chat._id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
                  selectedChat?._id === chat._id ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setSelectedChat(chat);
                  setOpenMenuId(null);
                }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={contact.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (chat.isGroup) {
                        navigate(`/projects/${chat._id}`);
                      } else {
                        navigate(`/profile/${chat.userId}`);
                      }
                    }}
                  />
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (chat.isGroup) {
                        navigate(`/projects/${chat._id}`);
                      } else {
                        navigate(`/profile/${chat.userId}`);
                      }
                    }}
                  >
                    <h3 className="text-sm font-semibold">{contact.title}</h3>
                    <p className="text-xs text-gray-500">{contact.subtitle}</p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    className="p-2 rounded-full hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId((prev) => (prev === chat._id ? null : chat._id));
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>
                  <div
                    className={`absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg ${
                      openMenuId === chat._id ? "" : "hidden"
                    }`}
                  >
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                        deleteChat(chat._id);
                      }}
                    >
                      Delete Chat
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Chat */}
      <div className="flex-1 flex rounded-3xl bg-white flex-col max-h-[calc(100vh-120px)] overflow-hidden">
        {selectedChat ? (
          <>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
              <img
                src={selectedContact?.avatar}
                className="w-10 h-10 rounded-full"
                alt={selectedContact?.title || "Chat"}
              />
              <div>
                <h2 className="font-medium">{selectedContact?.title}</h2>
                <p className="text-xs text-gray-500">{selectedContact?.subtitle}</p>
              </div>
            </div>

            <div className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto bg-white">
              {loadingMessages && (
                <p className="text-sm text-gray-500">Loading messages...</p>
              )}
              {!loadingMessages && messages.length === 0 && (
                <p className="text-sm text-gray-500">No messages yet.</p>
              )}
              {!loadingMessages &&
                messages.map((msg) => {
                  const senderId = msg.senderId;
                  const senderInfo = userCache[senderId] || { _id: senderId, name: "Loading..." };
                  const fromMe = senderId === currentUserId;
                  const avatar = `https://i.pravatar.cc/150?u=${senderId}`;
                  return (
                    <div
                      key={msg._id}
                      className={`flex items-end gap-1 mb-3 ${
                        fromMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!fromMe && (
                        <img src={avatar} className="w-6 h-6 rounded-full flex-shrink-0" alt={senderInfo.name} title={senderInfo.email || senderInfo.name} />
                      )}
                      <div className={`flex flex-col ${fromMe ? "items-end" : "items-start"}`}>
                        {selectedChat?.isGroup && !fromMe && (
                          <p className="text-xs text-gray-500 px-3 mb-1">{senderInfo.name}</p>
                        )}
                        <div
                          className={`text-sm px-3 py-1.5 rounded-xl ${
                            fromMe
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-gray-100 text-black rounded-bl-none"
                          }`}
                          title={senderInfo.email || senderInfo.name}
                        >
                          {msg.content || msg.text}
                        </div>
                      </div>
                      {fromMe && (
                        <img src={avatar} className="w-6 h-6 rounded-full flex-shrink-0" alt="You" title="You" />
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex bg-gray-100 rounded-full px-4 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 bg-transparent outline-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button className="text-blue-500" onClick={sendMessage}>
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">
            Select a chat to start messaging.
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {openNewChat && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[200] px-4">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Start a new chat</h3>
              <button onClick={() => setOpenNewChat(false)} className="text-gray-500 hover:text-black">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search by name or email"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />

              <div className="max-h-56 overflow-y-auto border rounded-2xl divide-y">
                {membersLoading && <p className="p-3 text-sm text-gray-500">Loading members...</p>}
                {!membersLoading && members
                  .filter((m) =>
                    `${m.name || ""} ${m.email || ""}`
                      .toLowerCase()
                      .includes(memberSearch.toLowerCase())
                  )
                  .map((m) => (
                    <label
                      key={m._id}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="new-chat-user"
                        value={m._id}
                        checked={selectedUserId === m._id}
                        onChange={() => setSelectedUserId(m._id)}
                      />
                      <div>
                        <p className="text-sm font-medium">{m.name || m.email}</p>
                        <p className="text-xs text-gray-500">{m.email}</p>
                      </div>
                    </label>
                  ))}
                {!membersLoading && members.length === 0 && (
                  <p className="p-3 text-sm text-gray-500">No members found.</p>
                )}
              </div>

              <textarea
                placeholder="Say hi..."
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                className="w-full border rounded-2xl px-3 py-2 text-sm min-h-[80px]"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setOpenNewChat(false)}
                  className="px-4 py-2 rounded-full border border-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={startDirectChat}
                  disabled={!selectedUserId}
                  className="px-5 py-2 rounded-full bg-blue-500 text-white disabled:opacity-60"
                >
                  Start chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messege;
