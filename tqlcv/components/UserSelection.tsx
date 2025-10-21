'use client'

import { useState } from 'react'
import { USER_PERMISSIONS, Department } from '../types'

interface User {
    id: string
    name: string
    role: string
    avatar: string
    color: string
    allowedDepartments?: Department[]
}

interface UserSelectionProps {
    onUserSelect: (user: User) => void
}

// User data - Updated with UUIDs matching database
const users: User[] = [
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Sếp Hạnh',
        role: 'Giám Đốc',
        avatar: 'SH',
        color: 'bg-gradient-to-br from-blue-400 to-blue-600',
        allowedDepartments: USER_PERMISSIONS['Sếp Hạnh']
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Mr Hùng',
        role: 'Quản lý',
        avatar: 'MH',
        color: 'bg-gradient-to-br from-green-400 to-green-600',
        allowedDepartments: USER_PERMISSIONS['Mr Hùng']
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Ms Nhung',
        role: 'Trưởng phòng Marketing',
        avatar: 'MN',
        color: 'bg-gradient-to-br from-pink-400 to-pink-600',
        allowedDepartments: USER_PERMISSIONS['Ms Nhung']
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'Ninh',
        role: 'Thành viên',
        avatar: 'NI',
        color: 'bg-gradient-to-br from-purple-400 to-purple-600',
        allowedDepartments: USER_PERMISSIONS['Sếp Hạnh'] // Full access for demo
    }
]

export default function UserSelection({ onUserSelect }: UserSelectionProps) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const handleUserClick = (user: User) => {
        setSelectedUser(user)
    }

    const handleContinue = () => {
        if (selectedUser) {
            onUserSelect(selectedUser)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Liquid Glass Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-100/30 to-purple-100/30 backdrop-blur-3xl"></div>
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200/10 rounded-full blur-3xl"></div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl">
                    {/* Header */}
                    <div className="py-6 md:py-8">
                        <div className="flex items-center justify-center mb-8 md:mb-10">
                            <h2 className="text-xl md:text-2xl lg:text-3xl text-black font-semibold">Chọn người dùng</h2>
                        </div>
                    </div>

                    {/* User List */}
                    <div className="pb-8">
                        {/* Desktop: Grid layout, Mobile: List layout */}
                        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => handleUserClick(user)}
                                    className={`
                                        bg-white/40 backdrop-blur-xl rounded-2xl p-6
                                        hover:bg-white/60 active:bg-white/50 transition-all
                                        shadow-lg shadow-black/5 border border-white/40
                                        cursor-pointer relative
                                        ${selectedUser?.id === user.id ? 'ring-2 ring-[#007AFF] ring-offset-2' : ''}
                                    `}
                                >
                                    {/* Selected indicator - top right */}
                                    {selectedUser?.id === user.id && (
                                        <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#007AFF] flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}

                                    <div className="flex flex-col items-center text-center">
                                        {/* Avatar */}
                                        <div className={`w-20 h-20 rounded-full ${user.color} flex items-center justify-center shadow-lg mb-4`}>
                                            <span className="text-white text-2xl font-semibold">{user.avatar}</span>
                                        </div>

                                        {/* Content */}
                                        <div className="text-lg text-black font-semibold mb-1">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {user.role}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile: List layout */}
                        <div className="md:hidden bg-white/30 backdrop-blur-xl rounded-[20px] overflow-hidden shadow-xl shadow-black/5 border border-white/40 mb-6">
                            {users.map((user, index) => (
                                <div
                                    key={user.id}
                                    onClick={() => handleUserClick(user)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3
                                        active:bg-white/20 transition-colors
                                        border-b border-gray-200/50
                                        ${index === users.length - 1 ? 'border-b-0' : ''}
                                        cursor-pointer
                                    `}
                                >
                                    {/* Avatar */}
                                    <div className={`w-12 h-12 rounded-full ${user.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                        <span className="text-white text-[17px] font-semibold">{user.avatar}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[15px] text-black mb-0.5 font-medium">
                                            {user.name}
                                        </div>
                                        <div className="text-[13px] text-gray-500 truncate">
                                            {user.role}
                                        </div>
                                    </div>

                                    {/* Selected indicator */}
                                    {selectedUser?.id === user.id && (
                                        <div className="w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Confirm Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={handleContinue}
                                disabled={!selectedUser}
                                className={`px-16 md:px-24 h-12 md:h-14 rounded-xl md:rounded-2xl transition-all text-base md:text-lg font-medium ${
                                    selectedUser
                                        ? "bg-[#007AFF] text-white hover:bg-[#0066CC] active:scale-[0.98] shadow-lg shadow-blue-500/30 cursor-pointer"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
