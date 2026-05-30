import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { Send, Plus, MoreVertical, CornerUpLeft, Check, CheckCheck, Paperclip, Download, ExternalLink, X } from "lucide-react";
import { CHAT_BASE_URL, BASE_URL } from "../../utility/Config";
import { formatLastSeen, getPresenceBadgeClass, getPresenceBadgeLabel, getPresenceDotClass } from "../../utility/presence";

const formatFileSize = (bytes) => {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size <= 0) return null;
  const units = ["B", "KB", "MB", "GB"];
  let index = 0;
  let value = size;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
};

const getAttachmentType = (msg) => {
  const mimeType = String(msg?.fileMimeType || "").toLowerCase();
  const fileUrl = String(msg?.fileUrl || "").toLowerCase();
  const content = String(msg?.content || "").toLowerCase();
  const source = `${mimeType} ${fileUrl} ${content}`;

  if (/\bimage\//.test(source) || /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/.test(fileUrl)) return "IMG";
  if (/\bpdf\b/.test(source) || /\.pdf$/.test(fileUrl)) return "PDF";
  if (/\bword\b|\.docx?$/.test(source)) return "DOC";
  if (/\bexcel\b|\.xlsx?$/.test(source)) return "XLS";
  if (/\bzip\b|\barchive\b|\.zip$|\.rar$|\.7z$/.test(source)) return "ZIP";
  if (/\bvideo\//.test(source) || /\.(mp4|mov|webm|mkv)$/.test(fileUrl)) return "VID";
  if (/\baudio\//.test(source) || /\.(mp3|wav|ogg|m4a)$/.test(fileUrl)) return "AUD";
  return "FILE";
};

const isImageUrl = (fileUrl = "") => /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(String(fileUrl));

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
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const fileInputRef = useRef(null);
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState("");
  const [nowTick, setNowTick] = useState(Date.now());
  
  // User cache to avoid repeated API calls - stored in state to trigger re-renders
  const [userCache, setUserCache] = useState({});

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const decoded = useMemo(() => parseToken(token), [token]);
  const currentUserId = decoded?.id;

  const authHeader = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  const getId = (obj) => {
    if (!obj) return null;
    if (typeof obj === 'string') return obj;
    return obj._id || obj.id || null;
  };

  const normalizeUser = (u) => {
    if (!u) return { _id: "unknown", name: "Unknown" };
    if (typeof u === "string") return { _id: u, name: u };
    return {
      _id: u._id || u.id,
      name: u.name || u.email || "Unknown",
      email: u.email,
      isOnline: Boolean(u.isOnline),
      lastSeenAt: u.lastSeenAt || null,
      lastSeenAgo: u.lastSeenAgo || null,
    };
  };

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString();
  };

  const formatTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTick(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getReplyPreview = (msg) => {
    if (!msg) return "";
    if (msg.content) return msg.content;
    if (msg.text) return msg.text;
    return "Message";
  };

  const getReadStatus = (msg) => {
    if (Array.isArray(msg.unreadBy)) {
      if (msg.unreadBy.length === 0) return "read";
      return "delivered";
    }
    return "sent";
  };

  const getAttachmentName = (msg) => {
    if (!msg) return "Attachment";
    if (msg.content && msg.content.trim()) return msg.content.trim();
    if (!msg.fileUrl) return "Attachment";
    try {
      const parts = String(msg.fileUrl).split('/');
      return decodeURIComponent(parts[parts.length - 1] || 'Attachment');
    } catch {
      return "Attachment";
    }
  };

  const downloadAttachment = async (fileUrl, fileName = "attachment") => {
    if (!fileUrl) return;
    try {
      const response = await fetch(fileUrl, { credentials: 'include' });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Attachment download failed, falling back to open:', error);
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const buildAttachmentMeta = (file) => ({
    fileName: file?.name || "attachment",
    fileSize: file?.size || null,
    fileMimeType: file?.type || null,
  });

  const openAttachment = (msg) => {
    if (!msg?.fileUrl) return;
    if (isImageUrl(msg.fileUrl)) {
      setPreviewAttachment({
        fileUrl: msg.fileUrl,
        fileName: getAttachmentName(msg),
        isImage: true,
      });
      return;
    }

    window.open(msg.fileUrl, '_blank', 'noopener,noreferrer');
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
              isOnline: Boolean(user.isOnline),
              lastSeenAt: user.lastSeenAt || null,
              lastSeenAgo: user.lastSeenAgo || null,
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
    const chatId = getId(chat);
    if (chat?.isGroup) {
      return {
        title: chat.groupName || `Group (${chat.members?.length || 0})`,
        subtitle: `${chat.members?.length || 0} members`,
        avatar: chat.groupAvatar || `https://i.pravatar.cc/150?u=${chatId || "group"}`,
        lastSeenAt: null,
      };
    }
    
    // Direct chat - get the other person's info from cache
    const otherMemberId = chat?.members?.find((m) => String(m) !== String(currentUserId));
    const otherUserInfo = userCache[otherMemberId] || { name: otherMemberId || "Direct chat", email: "" };
    
    return {
      title: otherUserInfo.name || otherMemberId || "Direct chat",
      subtitle: otherUserInfo.email || "Direct chat",
      avatar: `https://i.pravatar.cc/150?u=${otherMemberId || "direct"}`,
      isOnline: Boolean(otherUserInfo.isOnline),
      lastSeenAt: otherUserInfo.lastSeenAt || null,
      lastSeenText: getPresenceBadgeLabel(otherUserInfo, nowTick),
    };
  };

  const upsertMessage = useCallback((incoming) => {
    if (!incoming) return;
    // normalize id field to _id for client-side consistency
    if (!incoming._id && incoming.id) incoming._id = incoming.id;
    if (!incoming._id) return;
    
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
            isOnline: Boolean(senderData.isOnline),
            lastSeenAt: senderData.lastSeenAt || null,
            lastSeenAgo: senderData.lastSeenAgo || null,
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
          const chatFromState = list.find((chat) => (chat._id || chat.id) === targetChatId);
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
    // Prevent creating multiple sockets (React StrictMode mounts twice in dev)
    if (socketRef.current) return;

    const socket = io(CHAT_BASE_URL, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: false,
    });

    socketRef.current = socket;

    // Register all listeners before connecting / emitting connect_user
    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("connect_user");
    });

    // Heartbeat emit: send presence_ping every 60 seconds while connected
    let heartbeatTimer = null;
    socket.on('connect', () => {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      heartbeatTimer = setInterval(() => {
        try {
          if (socket && socket.connected) socket.emit('presence_ping', { ts: Date.now() });
        } catch (e) {}
      }, 60000);
    });

    socket.on("receive_message", (msg) => {
      console.log("Received message:", msg);
      upsertMessage(msg);

      // Auto-mark as seen if the chat is currently open
      const currentChatId = getId(selectedChat);
      const incomingChatId = msg.chatId || msg.chatId;
      const messageId = msg._id || msg.id;
      if (currentChatId && incomingChatId && currentChatId === incomingChatId && (msg.senderId !== currentUserId)) {
        socket.emit("message_seen", { messageId, chatId: incomingChatId });
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
      if ((selectedChat?._id || selectedChat?.id) === chatId) {
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

    socket.on("presence_changed", (payload) => {
      if (!payload?.userId) return;
      const targetUserId = String(payload.userId);
      const nextLastSeenAgo = payload.isOnline
        ? "Online now"
        : formatLastSeen(payload.lastSeenAt, Date.now());

      setUserCache((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          if (String(key) !== targetUserId) return;
          next[key] = {
            ...next[key],
            isOnline: Boolean(payload.isOnline),
            lastSeenAt: payload.lastSeenAt || next[key].lastSeenAt || null,
            lastSeenAgo: nextLastSeenAgo,
          };
        });
        return next;
      });

      setMembers((prev) =>
        prev.map((member) => {
          const memberId = String(member._id || member.id || member.email || "");
          if (memberId !== targetUserId) return member;

          return {
            ...member,
            isOnline: Boolean(payload.isOnline),
            lastSeenAt: payload.lastSeenAt || member.lastSeenAt || null,
            lastSeenAgo: nextLastSeenAgo,
          };
        })
      );
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // finally connect after listeners are registered
    socket.connect();

    return () => {
      // Only disconnect the same socket instance created by this effect
      if (socketRef.current === socket) {
        socket.disconnect();
        socketRef.current = null;
        if (heartbeatTimer) clearInterval(heartbeatTimer);
      }
    };
  }, [token, upsertMessage, selectedChat, currentUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const chatId = getId(selectedChat);
      if (!chatId) return;
      setLoadingMessages(true);
      try {
        const res = await axios.get(`${CHAT_BASE_URL}/api/messages/${chatId}`, authHeader);
        const msgs = (res.data || []).map(m => ({ ...m, _id: m._id || m.id }));
        setMessages(msgs);

        // ensure room joined for realtime (send object as server expects {chatId})
        socketRef.current?.emit("join_chat", { chatId });
        console.debug("join_chat", { chatId });

        // Mark all messages in this chat as seen via socket (real-time)
        for (const m of msgs) {
          const messageId = m._id || m.id;
          if (m.senderId && m.senderId !== currentUserId) {
            socketRef.current?.emit("message_seen", { messageId, chatId });
            console.debug("message_seen", { messageId, chatId });
          }
        }
      } catch (err) {
        console.error("Error loading messages", err);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedChat, authHeader]);

  useEffect(() => {
    setReplyToMessage(null);
  }, [selectedChat]);

  const sendMessage = async () => {
    const chatId = getId(selectedChat);
    if (!input.trim() || !chatId) return;
    const payload = {
      chatId,
      content: input.trim(),
      type: "text",
      replyToId: replyToMessage?._id || replyToMessage?.id || null,
    };
    try {
      // Send via socket only; backend socket handler persists and emits receive_message
      socketRef.current?.emit("send_message", payload);
      console.debug("send_message", payload);
      setInput("");
      setReplyToMessage(null);
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  const uploadFileAndSend = async (file) => {
    if (!file) return;
    const chatId = getId(selectedChat);
    if (!chatId) return;
    try {
      setUploadProgress(0);
      setUploadingFileName(file.name);
      const form = new FormData();
      form.append('file', file);
      const res = await axios.post(`${CHAT_BASE_URL}/api/messages/upload`, form, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
        maxBodyLength: Infinity,
      });
      const { fileUrl, fileSize, fileMimeType } = res.data || {};
      if (!fileUrl) throw new Error('Upload did not return fileUrl');

      const payload = {
        chatId,
        content: file.name,
        type: 'file',
        fileUrl,
        fileSize: fileSize || file.size || null,
        fileMimeType: fileMimeType || file.type || null,
        replyToId: replyToMessage?._id || replyToMessage?.id || null,
      };
      socketRef.current?.emit('send_message', payload);
      setReplyToMessage(null);
      setUploadProgress(0);
      setUploadingFileName("");
    } catch (err) {
      console.error('File upload/send failed', err);
      alert('Failed to upload file');
      setUploadProgress(0);
      setUploadingFileName("");
    }
  };

  const handleFileSelection = (file) => {
    if (file) uploadFileAndSend(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const droppedFile = event.dataTransfer?.files?.[0];
    if (droppedFile) {
      uploadFileAndSend(droppedFile);
    }
  };

  const startDirectChat = async () => {
    if (!selectedUserId) return;
    try {
      const trimmed = newChatMessage.trim();
      let chatId = null;

      if (trimmed) {
        const body = {
          receiverId: selectedUserId,
          content: trimmed,
          type: "text",
        };
        const res = await axios.post(`${CHAT_BASE_URL}/api/messages`, body, authHeader);
        chatId = res.data?.chatId || res.data?.chat?._id || res.data?.chat || body.chatId;
        console.debug("startDirectChat", { chatId, receiverId: body.receiverId });
      } else if (currentUserId) {
        const res = await axios.post(
          `${CHAT_BASE_URL}/api/chats`,
          { members: [currentUserId, selectedUserId] },
          authHeader
        );
        chatId = res.data?._id || res.data?.id || res.data?.chatId || res.data?.chat || null;
        console.debug("startDirectChat (no message)", { chatId, receiverId: selectedUserId });
      }

      if (!chatId) return;
      // refresh chats and focus the one with this chatId
      const chatsRes = await axios.get(`${CHAT_BASE_URL}/api/chats`, authHeader);
      const list = chatsRes.data || [];
      setChats(list);
      const found = list.find((c) => (c._id || c.id) === chatId) || list[0];
      setSelectedChat(found || null);
      if (chatId) {
        const msgs = await axios.get(`${CHAT_BASE_URL}/api/messages/${chatId}`, authHeader);
        const fetched = (msgs.data || []).map(m => ({ ...m, _id: m._id || m.id }));
        setMessages(fetched || []);
      }
      setOpenNewChat(false);
      setNewChatMessage("");
      setSelectedUserId(null);
    } catch (err) {
      console.error("Start chat failed", err);
    }
  };

  const deleteChat = async (chatId) => {
    if (!chatId || !window.confirm("Are you sure you want to delete this chat?")) return;
    try {
      await axios.delete(`${CHAT_BASE_URL}/api/chats/${chatId}`, authHeader);
      setChats((prev) => prev.filter((chat) => (chat._id || chat.id) !== chatId));
      if ((selectedChat?._id || selectedChat?.id) === chatId) {
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
            const chatKey = chat._id || chat.id;
            const chatIdCompare = chat._id || chat.id;
            const otherMemberId = chat?.members?.find((m) => m !== currentUserId);
            return (
              <div
                key={chatKey}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
                  (selectedChat?._id || selectedChat?.id) === chatIdCompare ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setSelectedChat(chat);
                  setOpenMenuId(null);
                }}
              >
                <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (chat.isGroup) {
                            navigate(`/projects/${chatIdCompare}`);
                          } else {
                            if (otherMemberId) navigate(`/profile/${otherMemberId}`);
                          }
                        }}
                      />
                      {!chat.isGroup && (
                        contact.isOnline ? (
                          <span className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ring-2 ring-white ${getPresenceDotClass(true)}`} />
                        ) : (
                          <span
                            className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ring-2 ring-white text-[10px] font-semibold leading-none flex items-center justify-center ${getPresenceBadgeClass(false)}`}
                          >
                            {getPresenceBadgeLabel(contact, nowTick)}
                          </span>
                        )
                      )}
                    </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (chat.isGroup) {
                        navigate(`/projects/${chatIdCompare}`);
                      } else {
                        if (otherMemberId) navigate(`/profile/${otherMemberId}`);
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
                      setOpenMenuId((prev) => (prev === chatKey ? null : chatKey));
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>
                  <div
                    className={`absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg ${
                      openMenuId === chatKey ? "" : "hidden"
                    }`}
                  >
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                        deleteChat(chatIdCompare);
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

      {previewAttachment?.isImage && (
        <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewAttachment(null)}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-12 right-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => downloadAttachment(previewAttachment.fileUrl, previewAttachment.fileName)}
                className="inline-flex items-center gap-1 rounded-full bg-white/10 text-white px-3 py-2 text-sm font-semibold hover:bg-white/20"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                type="button"
                onClick={() => window.open(previewAttachment.fileUrl, '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center gap-1 rounded-full bg-white/10 text-white px-3 py-2 text-sm font-semibold hover:bg-white/20"
              >
                <ExternalLink className="w-4 h-4" />
                Open
              </button>
              <button
                type="button"
                onClick={() => setPreviewAttachment(null)}
                className="inline-flex items-center justify-center rounded-full bg-white/10 text-white w-10 h-10 hover:bg-white/20"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewAttachment.fileUrl}
              alt={previewAttachment.fileName}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Right: Chat */}
      <div className="flex-1 flex rounded-3xl bg-white flex-col max-h-[calc(100vh-120px)] overflow-hidden">
        {selectedChat ? (
          <>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
              <div className="relative">
                <img
                  src={selectedContact?.avatar}
                  className="w-10 h-10 rounded-full"
                  alt={selectedContact?.title || "Chat"}
                />
                {selectedChat && !selectedChat.isGroup && (
                  selectedContact?.isOnline ? (
                    <span className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ring-2 ring-white ${getPresenceDotClass(true)}`} />
                  ) : (
                    <span
                      className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ring-2 ring-white text-[10px] font-semibold leading-none flex items-center justify-center ${getPresenceBadgeClass(false)}`}
                    >
                      {getPresenceBadgeLabel(selectedContact, nowTick)}
                    </span>
                  )
                )}
              </div>
              <div>
                <h2 className="font-medium">{selectedContact?.title}</h2>
                <p className="text-xs text-gray-500">{selectedContact?.subtitle}</p>
              </div>
            </div>

            <div className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto bg-white">
              <div className="flex flex-col items-center gap-2 text-sm text-gray-500 mb-4">
                <div className="px-4 py-2 rounded-2xl bg-yellow-50 text-yellow-800 text-center">
                  Messages are end to end encrypted. Only people in this chat can read or share them.
                </div>
              </div>
              {loadingMessages && (
                <p className="text-sm text-gray-500">Loading messages...</p>
              )}
              {/* {!loadingMessages && messages.length === 0 && (
                <p className="text-sm text-gray-500">No messages yet.</p>
              )} */}
              {!loadingMessages &&
                messages.map((msg, index) => {
                  const senderId = msg.senderId;
                  const senderInfo = userCache[senderId] || { _id: senderId, name: "Loading..." };
                  const fromMe = senderId === currentUserId;
                  const avatar = `https://i.pravatar.cc/150?u=${senderId}`;
                  const currentDate = formatDate(msg.createdAt || msg.updatedAt);
                  const prevDate = index > 0 ? formatDate(messages[index - 1].createdAt || messages[index - 1].updatedAt) : "";
                  const showDate = currentDate && currentDate !== prevDate;
                  const readStatus = getReadStatus(msg);
                  return (
                    <div key={msg._id || msg.id}>
                      {showDate && (
                        <div className="flex justify-center my-2">
                          <div className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                            {currentDate}
                          </div>
                        </div>
                      )}
                      <div
                        className={`flex items-end gap-1 mb-3 group ${
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
                          className={`text-sm px-3 py-1.5 rounded-xl relative ${
                            fromMe
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-gray-100 text-black rounded-bl-none"
                          }`}
                          title={senderInfo.email || senderInfo.name}
                        >
                          {msg.replyTo && (
                            <div className={`text-[11px] mb-1 px-2 py-1 rounded-lg ${
                              fromMe ? "bg-blue-600/40" : "bg-gray-200"
                            }`}>
                              <div className="font-semibold">{msg.replyTo?.senderId === currentUserId ? "You" : senderInfo.name}</div>
                              <div className="truncate">{getReplyPreview(msg.replyTo)}</div>
                            </div>
                          )}
                          <div className="whitespace-pre-wrap">
                            {msg.fileUrl ? (
                              <div className="space-y-2">
                                <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${fromMe ? 'bg-white/15 text-white' : 'bg-blue-50 text-blue-700'}`}>
                                  <span className="rounded-full bg-black/10 px-2 py-0.5 text-[9px]">{getAttachmentType(msg)}</span>
                                  <span>{getAttachmentName(msg)}</span>
                                  {formatFileSize(msg.fileSize) && (
                                    <span className={fromMe ? 'text-white/80' : 'text-blue-500'}>{formatFileSize(msg.fileSize)}</span>
                                  )}
                                </div>
                                {isImageUrl(msg.fileUrl) ? (
                                  <button
                                    type="button"
                                    onClick={() => openAttachment(msg)}
                                    className="block text-left"
                                    title="Open image"
                                  >
                                    <img
                                      src={msg.fileUrl}
                                      alt={msg.content || 'file'}
                                      className="max-w-xs max-h-60 rounded-md border border-white/20 shadow-sm cursor-zoom-in"
                                    />
                                  </button>
                                ) : (
                                  <div className={`rounded-xl border p-3 min-w-[220px] ${fromMe ? 'border-white/20 bg-white/10' : 'border-gray-200 bg-white'}`}>
                                      <div className="flex items-center gap-2">
                                        <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${fromMe ? 'bg-white/15 text-white' : 'bg-blue-50 text-blue-700'}`}>{getAttachmentType(msg)}</span>
                                        <div className="text-xs font-semibold truncate flex-1">{getAttachmentName(msg)}</div>
                                      </div>
                                      <div className={`text-[11px] mt-1 ${fromMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                        File attachment{formatFileSize(msg.fileSize) ? ` • ${formatFileSize(msg.fileSize)}` : ''}
                                      </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => openAttachment(msg)}
                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${fromMe ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    Open
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => downloadAttachment(msg.fileUrl, getAttachmentName(msg))}
                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${fromMe ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                  >
                                    <Download className="w-3 h-3" />
                                    Download
                                  </button>
                                </div>
                              </div>
                            ) : (
                              msg.content || msg.text
                            )}
                          </div>
                          <div className="flex items-center gap-1 justify-end mt-1 text-[10px] text-gray-200">
                            <span className={fromMe ? "text-white/80" : "text-gray-400"}>
                              {formatTime(msg.createdAt || msg.updatedAt)}
                            </span>
                            {fromMe && (
                              <span className={readStatus === "read" ? "text-blue-300" : "text-white/70"}>
                                {readStatus === "sent" && <Check className="w-3 h-3" />}
                                {readStatus === "delivered" && <CheckCheck className="w-3 h-3" />}
                                {readStatus === "read" && <CheckCheck className="w-3 h-3" />}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
                        onClick={() => setReplyToMessage(msg)}
                        aria-label="Reply"
                        type="button"
                      >
                        <CornerUpLeft className="w-4 h-4" />
                      </button>
                      {fromMe && (
                        <img src={avatar} className="w-6 h-6 rounded-full flex-shrink-0" alt="You" title="You" />
                      )}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="p-4 border-t border-gray-200" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              {dragActive && (
                <div className="mb-3 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                  Drop a file or image to attach it to this chat.
                </div>
              )}
              {uploadProgress > 0 && (
                <div className="mb-3 rounded-2xl bg-gray-100 px-4 py-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-2">
                    <span>{uploadingFileName ? `Uploading ${uploadingFileName}` : 'Uploading file'}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
              {replyToMessage && (
                <div className="mb-2 px-4 py-2 rounded-2xl bg-gray-100 flex items-center justify-between">
                  <div className="text-sm">
                    <div className="text-xs text-gray-500">Replying to</div>
                    <div className="font-medium truncate">{getReplyPreview(replyToMessage)}</div>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setReplyToMessage(null)}
                    aria-label="Cancel reply"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="flex bg-gray-100 rounded-full px-2 py-2 items-center gap-2">
                <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => {
                  const f = e.target.files && e.target.files[0];
                  if (f) handleFileSelection(f);
                  e.target.value = null;
                }} />
                <button
                  className="text-gray-500 p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  title="Attach a file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
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
                <button className="text-blue-500 p-2 rounded-full" onClick={sendMessage}>
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
                  .map((m, idx) => {
                    const uid = m._id || m.id || m.email || String(idx);
                    return (
                      <label
                        key={uid}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="new-chat-user"
                          value={uid}
                          checked={selectedUserId === uid}
                          onChange={() => setSelectedUserId(uid)}
                        />
                      <div>
                        <p className="text-sm font-medium">{m.name || m.email}</p>
                        <p className="text-xs text-gray-500">{m.email}</p>
                      </div>
                      </label>
                    );
                  })}
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
