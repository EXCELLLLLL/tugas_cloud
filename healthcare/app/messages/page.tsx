"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import Link from 'next/link';
import { FiPaperclip, FiSmile, FiSend, FiMoreVertical, FiSearch, FiFilter } from 'react-icons/fi';

interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    senderName: string;
    receiverName: string;
    subject: string;
    content: string;
    timestamp: string;
    isRead: boolean;
    attachments?: Attachment[];
    reactions?: Reaction[];
    category?: 'general' | 'appointment' | 'prescription' | 'test-results' | 'urgent';
    priority?: 'low' | 'medium' | 'high';
    status?: 'sent' | 'delivered' | 'read';
    threadId?: number;
    isTyping?: boolean;
}

interface Attachment {
    id: number;
    name: string;
    type: string;
    size: number;
    url: string;
}

interface Reaction {
    emoji: string;
    userId: number;
    userName: string;
}

interface Conversation {
    id: number;
    participantId: number;
    participantName: string;
    participantRole: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    avatar?: string;
    isOnline?: boolean;
    lastSeen?: string;
    category?: string;
}

interface QuickReply {
    id: number;
    text: string;
    category: string;
}

export default function MessagesPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const [selectedRecipient, setSelectedRecipient] = useState<{ id: number; name: string; role: string } | null>(null);
    const [messageSubject, setMessageSubject] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showQuickReplies, setShowQuickReplies] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const quickReplies: QuickReply[] = [
        { id: 1, text: "Thank you for your help!", category: "general" },
        { id: 2, text: "I'll be there at the scheduled time.", category: "appointment" },
        { id: 3, text: "Could you please provide more information?", category: "general" },
        { id: 4, text: "I'm experiencing some side effects.", category: "prescription" }
    ];

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Simulated data - replace with actual API calls
        const mockConversations: Conversation[] = [
            {
                id: 1,
                participantId: 101,
                participantName: 'Dr. Sarah Johnson',
                participantRole: 'Cardiologist',
                lastMessage: 'Your test results are ready for review.',
                lastMessageTime: '2024-03-15T10:30:00Z',
                unreadCount: 2,
                avatar: '/avatars/doctor1.jpg',
                isOnline: true,
                category: 'test-results'
            },
            {
                id: 2,
                participantId: 102,
                participantName: 'Dr. Michael Chen',
                participantRole: 'Primary Care',
                lastMessage: 'I\'ve reviewed your recent lab work.',
                lastMessageTime: '2024-03-14T15:45:00Z',
                unreadCount: 0,
                avatar: '/avatars/doctor2.jpg',
                isOnline: false,
                lastSeen: '2024-03-15T09:00:00Z',
                category: 'general'
            },
            {
                id: 3,
                participantId: 103,
                participantName: 'Nurse Emily Brown',
                participantRole: 'Nursing Staff',
                lastMessage: 'Your appointment has been confirmed.',
                lastMessageTime: '2024-03-13T09:20:00Z',
                unreadCount: 1,
                avatar: '/avatars/nurse1.jpg',
                isOnline: true,
                category: 'appointment'
            }
        ];

        setConversations(mockConversations);
        setIsLoading(false);
    }, [isAuthenticated, router]);

    const filteredConversations = useMemo(() => {
        let filtered = conversations;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(conv =>
                conv.participantName.toLowerCase().includes(query) ||
                conv.lastMessage.toLowerCase().includes(query)
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(conv => conv.category === selectedCategory);
        }

        return filtered;
    }, [conversations, searchQuery, selectedCategory]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const newMsg: Message = {
            id: messages.length + 1,
            senderId: user?.id || 0,
            receiverId: selectedConversation.participantId,
            senderName: user ? `${user.firstName} ${user.lastName}` : 'You',
            receiverName: selectedConversation.participantName,
            subject: 'Re: ' + (messages[0]?.subject || 'Conversation'),
            content: newMessage,
            timestamp: new Date().toISOString(),
            isRead: false,
            status: 'sent',
            category: 'general',
            priority: 'medium',
            attachments: selectedFiles.map((file, index) => ({
                id: index + 1,
                name: file.name,
                type: file.type,
                size: file.size,
                url: URL.createObjectURL(file)
            }))
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');
        setSelectedFiles([]);
        scrollToBottom();
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    const handleReaction = (messageId: number, emoji: string) => {
        setMessages(messages.map(msg => {
            if (msg.id === messageId) {
                const reactions = msg.reactions || [];
                const existingReaction = reactions.find(r => r.userId === user?.id);

                if (existingReaction) {
                    return {
                        ...msg,
                        reactions: reactions.filter(r => r.userId !== user?.id)
                    };
                } else {
                    return {
                        ...msg,
                        reactions: [...reactions, {
                            emoji,
                            userId: user?.id || 0,
                            userName: user ? `${user.firstName} ${user.lastName}` : 'You'
                        }]
                    };
                }
            }
            return msg;
        }));
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            // Simulate typing indicator
            setTimeout(() => setIsTyping(false), 3000);
        }
    };

    const handleStartNewConversation = () => {
        if (!selectedRecipient || !messageSubject.trim() || !newMessage.trim()) return;

        const newMsg: Message = {
            id: messages.length + 1,
            senderId: user?.id || 0,
            receiverId: selectedRecipient.id,
            senderName: user ? `${user.firstName} ${user.lastName}` : 'You',
            receiverName: selectedRecipient.name,
            subject: messageSubject,
            content: newMessage,
            timestamp: new Date().toISOString(),
            isRead: false,
            status: 'sent',
            category: 'general',
            priority: 'medium',
            attachments: selectedFiles.map((file, index) => ({
                id: index + 1,
                name: file.name,
                type: file.type,
                size: file.size,
                url: URL.createObjectURL(file)
            }))
        };

        const newConversation: Conversation = {
            id: conversations.length + 1,
            participantId: selectedRecipient.id,
            participantName: selectedRecipient.name,
            participantRole: selectedRecipient.role,
            lastMessage: newMessage,
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0,
            isOnline: true,
            category: 'general'
        };

        setConversations([newConversation, ...conversations]);
        setMessages([newMsg]);
        setNewMessage('');
        setMessageSubject('');
        setShowNewMessageModal(false);
        setSelectedRecipient(null);
        setSelectedFiles([]);
        scrollToBottom();
    };

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                                <p className="text-gray-600 mt-1">Communicate with your healthcare providers</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowQuickReplies(!showQuickReplies)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Quick Replies
                                </button>
                                <button
                                    onClick={() => setShowNewMessageModal(true)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#0a3fa8] rounded-lg hover:bg-[#083080] transition-colors"
                                >
                                    New Message
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row h-[calc(100vh-300px)]">
                        {/* Conversations List */}
                        <div className="w-full md:w-1/3 border-r border-gray-100">
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex gap-2 mb-2">
                                    <div className="relative flex-1">
                                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search conversations..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                        />
                                    </div>
                                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                        <FiFilter />
                                    </button>
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'all'
                                                ? 'bg-[#0a3fa8] text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setSelectedCategory('appointment')}
                                        className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'appointment'
                                                ? 'bg-[#0a3fa8] text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Appointments
                                    </button>
                                    <button
                                        onClick={() => setSelectedCategory('prescription')}
                                        className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'prescription'
                                                ? 'bg-[#0a3fa8] text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Prescriptions
                                    </button>
                                    <button
                                        onClick={() => setSelectedCategory('test-results')}
                                        className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'test-results'
                                                ? 'bg-[#0a3fa8] text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Test Results
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-y-auto h-full">
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a3fa8]"></div>
                                    </div>
                                ) : (
                                    filteredConversations.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500">No conversations found</div>
                                    ) : (
                                        filteredConversations.map((conversation) => (
                                            <button
                                                key={conversation.id}
                                                onClick={() => setSelectedConversation(conversation)}
                                                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-lg font-semibold text-gray-600">
                                                                {conversation.participantName.charAt(0)}
                                                            </span>
                                                        </div>
                                                        {conversation.isOnline && (
                                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                                        )}
                                                        {conversation.unreadCount > 0 && (
                                                            <span className="absolute -top-1 -right-1 bg-[#0a3fa8] text-white text-xs font-medium px-2 py-1 rounded-full">
                                                                {conversation.unreadCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                                {conversation.participantName}
                                                            </h3>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(conversation.lastMessageTime).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {conversation.lastMessage}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xs text-gray-400">
                                                                {conversation.participantRole}
                                                            </p>
                                                            {conversation.category && (
                                                                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                                                                    {conversation.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )
                                )}
                            </div>
                        </div>

                        {/* Messages View */}
                        <div className="flex-1 flex flex-col">
                            {selectedConversation ? (
                                <>
                                    <div className="p-4 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-lg font-semibold text-gray-600">
                                                        {selectedConversation.participantName.charAt(0)}
                                                    </span>
                                                </div>
                                                {selectedConversation.isOnline && (
                                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                                                )}
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900">
                                                    {selectedConversation.participantName}
                                                </h2>
                                                <p className="text-sm text-gray-500">
                                                    {selectedConversation.participantRole}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[70%] rounded-lg p-4 ${message.senderId === user.id
                                                        ? 'bg-[#0a3fa8] text-white'
                                                        : 'bg-gray-100 text-gray-900'
                                                    }`}>
                                                    {message.subject && (
                                                        <h4 className="font-medium mb-2">{message.subject}</h4>
                                                    )}
                                                    <p className="whitespace-pre-wrap">{message.content}</p>

                                                    {message.attachments && message.attachments.length > 0 && (
                                                        <div className="mt-2 space-y-2">
                                                            {message.attachments.map((attachment) => (
                                                                <div
                                                                    key={attachment.id}
                                                                    className="flex items-center gap-2 p-2 bg-white/10 rounded"
                                                                >
                                                                    <FiPaperclip />
                                                                    <span className="text-sm truncate">
                                                                        {attachment.name}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {message.reactions && message.reactions.length > 0 && (
                                                        <div className="flex gap-1 mt-2">
                                                            {message.reactions.map((reaction, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="text-sm bg-white/20 rounded-full px-2 py-0.5"
                                                                >
                                                                    {reaction.emoji}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between mt-2 text-xs opacity-75">
                                                        <span>
                                                            {new Date(message.timestamp).toLocaleTimeString()}
                                                        </span>
                                                        {message.senderId === user.id && (
                                                            <span>
                                                                {message.status === 'sent' && '✓'}
                                                                {message.status === 'delivered' && '✓✓'}
                                                                {message.status === 'read' && '✓✓'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {isTyping && (
                                            <div className="flex justify-start">
                                                <div className="bg-gray-100 rounded-lg p-4">
                                                    <div className="flex gap-1">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    <div className="p-4 border-t border-gray-100">
                                        {selectedFiles.length > 0 && (
                                            <div className="flex gap-2 mb-2 overflow-x-auto">
                                                {selectedFiles.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
                                                    >
                                                        <FiPaperclip />
                                                        <span className="text-sm truncate max-w-[150px]">
                                                            {file.name}
                                                        </span>
                                                        <button
                                                            onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                                                            className="text-gray-500 hover:text-gray-700"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => document.getElementById('fileInput')?.click()}
                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                            >
                                                <FiPaperclip />
                                            </button>
                                            <input
                                                type="file"
                                                id="fileInput"
                                                className="hidden"
                                                multiple
                                                onChange={handleFileSelect}
                                            />
                                            <button
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                            >
                                                <FiSmile />
                                            </button>
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => {
                                                    setNewMessage(e.target.value);
                                                    handleTyping();
                                                }}
                                                placeholder="Type your message..."
                                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0a3fa8] focus:ring-[#0a3fa8]"
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={!newMessage.trim()}
                                                className="p-2 text-white bg-[#0a3fa8] rounded-lg hover:bg-[#083080] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FiSend />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-500">
                                    Select a conversation to start messaging
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Quick Replies Modal */}
            {showQuickReplies && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Replies</h2>
                        <div className="space-y-2">
                            {quickReplies.map((reply) => (
                                <button
                                    key={reply.id}
                                    onClick={() => {
                                        setNewMessage(reply.text);
                                        setShowQuickReplies(false);
                                    }}
                                    className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <p className="text-gray-900">{reply.text}</p>
                                    <span className="text-xs text-gray-500">{reply.category}</span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowQuickReplies(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Message Modal */}
            {showNewMessageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">New Message</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    onChange={(e) => {
                                        const [id, name, role] = e.target.value.split('|');
                                        setSelectedRecipient({ id: Number(id), name, role });
                                    }}
                                >
                                    <option value="">Select recipient</option>
                                    <option value="101|Dr. Sarah Johnson|Cardiologist">Dr. Sarah Johnson (Cardiologist)</option>
                                    <option value="102|Dr. Michael Chen|Primary Care">Dr. Michael Chen (Primary Care)</option>
                                    <option value="103|Nurse Emily Brown|Nursing Staff">Nurse Emily Brown (Nursing Staff)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={messageSubject}
                                    onChange={(e) => setMessageSubject(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    placeholder="Enter subject"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    rows={4}
                                    placeholder="Type your message..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="general">General</option>
                                    <option value="appointment">Appointment</option>
                                    <option value="prescription">Prescription</option>
                                    <option value="test-results">Test Results</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowNewMessageModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStartNewConversation}
                                    disabled={!selectedRecipient || !messageSubject.trim() || !newMessage.trim()}
                                    className="px-4 py-2 bg-[#0a3fa8] text-white rounded-lg hover:bg-[#083080] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 