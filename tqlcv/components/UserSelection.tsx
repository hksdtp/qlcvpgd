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

const users: User[] = [
    {
        id: '1',
        name: 'Sếp Hạnh',
        role: 'Giám Đốc',
        avatar: 'SH',
        color: 'bg-blue-500',
        allowedDepartments: USER_PERMISSIONS['Sếp Hạnh']
    },
    {
        id: '2',
        name: 'Mr Hùng',
        role: 'Quản lý',
        avatar: 'MH',
        color: 'bg-green-500',
        allowedDepartments: USER_PERMISSIONS['Mr Hùng']
    },
    {
        id: '3',
        name: 'Ms Nhung',
        role: 'Trưởng phòng Marketing',
        avatar: 'MN',
        color: 'bg-purple-500',
        allowedDepartments: USER_PERMISSIONS['Ms Nhung']
    },
    {
        id: '4',
        name: 'Ninh',
        role: 'Thành viên',
        avatar: 'NI',
        color: 'bg-yellow-500',
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        Chọn người sử dụng
                    </h1>
                    <p className="text-slate-600">
                        Vui lòng chọn hồ sơ của bạn để tiếp tục.
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => handleUserClick(user)}
                            className={`
                                flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200
                                ${selectedUser?.id === user.id 
                                    ? 'bg-blue-50 border-2 border-blue-500 shadow-md' 
                                    : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100 hover:shadow-sm'
                                }
                            `}
                        >
                            <div className={`
                                w-12 h-12 rounded-full ${user.color} 
                                flex items-center justify-center text-white font-bold text-lg
                            `}>
                                {user.avatar}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-800 text-lg">
                                    {user.name}
                                </h3>
                                <p className="text-slate-600 text-sm">
                                    {user.role}
                                </p>
                            </div>
                            {selectedUser?.id === user.id && (
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!selectedUser}
                    className={`
                        w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200
                        ${selectedUser 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        }
                    `}
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    )
}
