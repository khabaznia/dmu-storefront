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
import { Official } from '@/types/official';
import { formatDateUA } from '@/utils/officials';
import OfficialsTable, { Field } from '@/components/OfficialsTable';
import OfficialModal from '@/components/OfficialModal';

// Розширений тип для computed полів
interface OfficialWithComputed extends Official {
  fullName: string;
  period: string;
}

const fields: Field<OfficialWithComputed>[] = [
  { key: 'fullName', label: 'ПІБ', maxWidth: 'max-w-xs' },
  { key: 'position', label: 'Посада', maxWidth: 'max-w-xs' },
  { key: 'rank', label: 'Звання' },
  { key: 'period', label: 'Період' },
];

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

  const officialsWithComputed: OfficialWithComputed[] = officials.map(o => ({
    ...o,
    fullName: `${o.lastName} ${o.firstName} ${o.middleName}`,
    period: `${formatDateUA(o.dateFrom)}${o.dateTo ? ` - ${formatDateUA(o.dateTo)}` : ''}`,
  }));

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
      <OfficialsTable<OfficialWithComputed>
        officials={officialsWithComputed}
        fields={fields}
        onEdit={(official) => { setEditingOfficial(official); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />
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

export default Officials 