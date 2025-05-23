'use client';
import React, { useState } from 'react'
import { FileIcon, UserIcon, Loader2Icon } from 'lucide-react'

interface FormData {
  [key: string]: string
}

const DocumentGeneration = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedOfficial, setSelectedOfficial] = useState('')
  const [formData, setFormData] = useState<FormData>({})
  const [isLoading, setIsLoading] = useState(false)
  // Mock data - replace with actual data
  const templates = [
    { id: '1', name: 'Шаблон договору' },
    { id: '2', name: 'Шаблон наказу' },
  ]
  const officials = [
    { id: '1', name: 'Іван Петров', position: 'Директор' },
    { id: '2', name: 'Марія Іванова', position: 'Заступник директора' },
  ]
  const handleGenerateDocument = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        'https://n1mrvi9bc7.execute-api.eu-west-1.amazonaws.com',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ params: formData, template: 'base64 docx' }),
        },
      )
      const data = await response.json()
      // Handle the response - download the generated document
      console.log(data)
    } catch (error) {
      console.error('Error generating document:', error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Оберіть шаблон
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">Оберіть шаблон...</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          {selectedTemplate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Оберіть посадову особу
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedOfficial}
                onChange={(e) => setSelectedOfficial(e.target.value)}
              >
                <option value="">Оберіть посадову особу...</option>
                {officials.map((official) => (
                  <option key={official.id} value={official.id}>
                    {official.name} - {official.position}
                  </option>
                ))}
              </select>
            </div>
          )}
          {selectedTemplate && selectedOfficial && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Поля для заповнення</h3>
              {/* Example form fields - replace with dynamic fields based on template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Назва документа
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Опис
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="pt-4">
                <button
                  onClick={handleGenerateDocument}
                  disabled={isLoading}
                  className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2Icon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Генерація...
                    </>
                  ) : (
                    <>
                      <FileIcon className="mr-2 h-5 w-5" />
                      Згенерувати документ
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentGeneration 