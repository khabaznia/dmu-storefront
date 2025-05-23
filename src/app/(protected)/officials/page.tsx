'use client';
import React, { useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'

interface Official {
  id: string
  firstName: string
  lastName: string
  middleName: string
  position: string
  rank: string
  passport: string
  dateFrom: string
  dateTo: string
  address: string
}

const Officials = () => {
  const [officials, setOfficials] = useState<Official[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null)
  const handleSubmit = (official: Official) => {
    setOfficials((prev) =>
      editingOfficial
        ? prev.map((o) => (o.id === official.id ? official : o))
        : [...prev, official],
    )
    setIsModalOpen(false)
    setEditingOfficial(null)
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Посадові особи</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Додати особу
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ПІБ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Посада
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Звання
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Період
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {officials.map((official) => (
                <tr key={official.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {`${official.lastName} ${official.firstName} ${official.middleName}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {official.position}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{official.rank}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {official.dateFrom} - {official.dateTo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingOfficial(official)
                        setIsModalOpen(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setOfficials((prev) =>
                          prev.filter((o) => o.id !== official.id),
                        )
                      }
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Officials 