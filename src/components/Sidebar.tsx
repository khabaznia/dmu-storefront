"use client"

import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function Sidebar() {
  return (
    <aside className="flex flex-col justify-between h-screen w-64 bg-white border-r">
      <div>
        <div className="px-6 py-6 font-bold text-xl text-blue-600">Документи</div>
        <nav className="flex flex-col gap-2 px-2">
          <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-600 font-medium">
            Генерація документів
          </Link>
          <Link href="/officials" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700">
            Посадові особи
          </Link>
          <Link href="/templates" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700">
            Шаблони
          </Link>
        </nav>
      </div>
      <div className="px-6 py-4 flex flex-col gap-3 border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">JD</div>
          <div>
            <div className="font-medium">John Doe</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  )
} 