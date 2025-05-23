'use client';
import React, { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { uk } from 'date-fns/locale';
import '@/styles/datepicker.css';

interface Official {
  id: string
  firstName: string
  lastName: string
  middleName: string
  position: string
  rank: string
  passportData: string
  dateFrom: string
  dateTo: string
  address: string
}

const monthsUA = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
];

function formatDateUA(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return `${date.getDate()} ${monthsUA[date.getMonth()]} ${date.getFullYear()}`;
}

const Officials = () => {
  const [officials, setOfficials] = useState<Official[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOfficials()
  }, [])

  const fetchOfficials = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/officials')
      const data = await res.json()
      console.log('fetchOfficials response:', data)
      setOfficials(data)
    } catch (e) {
      setError('Не вдалося завантажити дані')
      console.error('fetchOfficials error:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цю посадову особу?')) return
    setLoading(true)
    try {
      console.log('Deleting official id:', id)
      await fetch(`/api/officials/${id}`, { method: 'DELETE' })
      setOfficials((prev) => prev.filter((o) => o.id !== id))
    } catch (e) {
      setError('Не вдалося видалити особу')
      console.error('handleDelete error:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (official: Omit<Official, 'id'> & { id?: string }) => {
    setLoading(true)
    try {
      let res
      const officialData = {
        firstName: official.firstName,
        lastName: official.lastName,
        middleName: official.middleName,
        position: official.position,
        rank: official.rank,
        passportData: official.passportData,
        dateFrom: official.dateFrom ? new Date(official.dateFrom).toISOString() : null,
        dateTo: official.dateTo ? new Date(official.dateTo).toISOString() : null,
        address: official.address,
      }
      console.log('handleSave officialData:', officialData)
      if (editingOfficial) {
        res = await fetch(`/api/officials/${editingOfficial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(officialData),
        })
      } else {
        res = await fetch('/api/officials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(officialData),
        })
      }
      const result = await res.json()
      console.log('handleSave response:', result)
      if (!res.ok) throw new Error('Помилка збереження')
      fetchOfficials()
      setIsModalOpen(false)
      setEditingOfficial(null)
    } catch (e) {
      setError('Не вдалося зберегти особу')
      console.error('handleSave error:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Посадові особи</h2>
        <button
          onClick={() => { setEditingOfficial(null); setIsModalOpen(true) }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Додати особу
        </button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
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
                      {formatDateUA(official.dateFrom)}{official.dateTo ? ` - ${formatDateUA(official.dateTo)}` : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => { setEditingOfficial(official); setIsModalOpen(true) }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(official.id)}
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
      {isModalOpen && (
        <OfficialModal
          official={editingOfficial}
          onClose={() => { setIsModalOpen(false); setEditingOfficial(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

// Модальне вікно для додавання/редагування посадової особи
function OfficialModal({ official, onClose, onSave }: {
  official: Official | null,
  onClose: () => void,
  onSave: (official: Omit<Official, 'id'> & { id?: string }) => void
}) {
  const [form, setForm] = useState<Omit<Official, 'id'> & { id?: string }>(official || {
    firstName: '', lastName: '', middleName: '', position: '', rank: '', passportData: '', dateFrom: '', dateTo: '', address: ''
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleDateChange = (name: string, date: Date | null) => {
    setForm({ ...form, [name]: date ? date.toISOString().slice(0, 10) : '' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Проста валідація
    if (!form.firstName || !form.lastName || !form.position) {
      setError('Заповніть обовʼязкові поля')
      return
    }
    setError(null)
    const { id, ...rest } = form
    console.log('handleSubmit form:', rest)
    onSave(rest)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{official ? 'Редагувати' : 'Додати'} посадову особу</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-y-4">
            <div className="flex gap-2">
              <div className="w-1/3">
                <Label htmlFor="lastName">Прізвище*</Label>
                <Input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Прізвище*" />
              </div>
              <div className="w-1/3">
                <Label htmlFor="firstName">Імʼя*</Label>
                <Input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Імʼя*" />
              </div>
              <div className="w-1/3">
                <Label htmlFor="middleName">По батькові</Label>
                <Input name="middleName" value={form.middleName} onChange={handleChange} placeholder="По батькові" />
              </div>
            </div>
            <div>
              <Label htmlFor="position">Посада*</Label>
              <Input name="position" value={form.position} onChange={handleChange} placeholder="Посада*" />
            </div>
            <div>
              <Label htmlFor="rank">Звання</Label>
              <Input name="rank" value={form.rank} onChange={handleChange} placeholder="Звання" />
            </div>
            <div>
              <Label htmlFor="passportData">Паспортні дані</Label>
              <Input name="passportData" value={form.passportData} onChange={handleChange} placeholder="Паспортні дані" />
            </div>
            <div className="flex gap-2">
              <div className="w-1/2">
                <Label htmlFor="dateFrom">Дата з</Label>
                <DatePicker
                  selected={form.dateFrom ? new Date(form.dateFrom) : null}
                  onChange={date => handleDateChange('dateFrom', date)}
                  dateFormat="dd MMMM yyyy"
                  placeholderText="Дата з"
                  className="w-full border rounded-md px-3 py-2"
                  isClearable
                  locale={uk}
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="dateTo">Дата по</Label>
                <DatePicker
                  selected={form.dateTo ? new Date(form.dateTo) : null}
                  onChange={date => handleDateChange('dateTo', date)}
                  dateFormat="dd MMMM yyyy"
                  placeholderText="Дата по"
                  className="w-full border rounded-md px-3 py-2"
                  isClearable
                  locale={uk}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Адреса</Label>
              <Input name="address" value={form.address} onChange={handleChange} placeholder="Адреса" />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>Скасувати</Button>
            <Button type="submit">Зберегти</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Officials 