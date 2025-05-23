'use client';
import React, { useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, DownloadIcon, UploadIcon } from 'lucide-react'

interface Template {
  id: string
  name: string
  fields: string[]
  file: string // base64
}

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const handleFileUpload = (file: File, templateId: string) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === templateId
            ? { ...t, file: base64 }
            : t,
        ),
      )
    }
    reader.readAsDataURL(file)
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Шаблони</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Додати шаблон
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Назва
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Поля
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Файл
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {templates.map((template) => (
                <tr key={template.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {template.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {template.fields.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {template.file ? (
                        <>
                          <button
                            onClick={() => {
                              // Handle download
                              const link = document.createElement('a')
                              link.href = template.file
                              link.download = `${template.name}.docx`
                              link.click()
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <DownloadIcon className="h-5 w-5" />
                          </button>
                          <label className="cursor-pointer text-gray-600 hover:text-gray-900">
                            <input
                              type="file"
                              className="hidden"
                              accept=".docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileUpload(file, template.id)
                              }}
                            />
                            <UploadIcon className="h-5 w-5" />
                          </label>
                        </>
                      ) : (
                        <label className="cursor-pointer text-blue-600 hover:text-blue-900">
                          <input
                            type="file"
                            className="hidden"
                            accept=".docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(file, template.id)
                            }}
                          />
                          <UploadIcon className="h-5 w-5" />
                        </label>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingTemplate(template)
                        setIsModalOpen(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setTemplates((prev) =>
                          prev.filter((t) => t.id !== template.id),
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

export default Templates 