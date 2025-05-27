"use client";
import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { uk } from 'date-fns/locale';
import '@/styles/datepicker.css';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Witness {
  id: number;
  fullName: string;
  position: string;
  rank: string;
  dateFrom: string;
  dateTo: string | null;
  birthDate: string;
  phone: string;
  document: string;
  address: string;
}

const WitnessesPage = () => {
  const [witnesses, setWitnesses] = useState<Witness[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWitness, setEditingWitness] = useState<Witness | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWitnesses();
  }, []);

  const fetchWitnesses = async () => {
    try {
      const res = await fetch('/api/witnesses');
      const data = await res.json();
      setWitnesses(data);
    } catch (e) {
      setError('Не вдалося завантажити свідків');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цього свідка?')) return;
    try {
      await fetch(`/api/witnesses/${id}`, { method: 'DELETE' });
      setWitnesses((prev) => prev.filter((w) => w.id !== id));
    } catch (e) {
      setError('Не вдалося видалити свідка');
    }
  };

  const handleSave = async (witness: Omit<Witness, 'id'> & { id?: number }) => {
    try {
      const method = witness.id ? 'PUT' : 'POST';
      const url = witness.id ? `/api/witnesses/${witness.id}` : '/api/witnesses';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(witness),
      });
      if (!res.ok) throw new Error();
      fetchWitnesses();
      setIsModalOpen(false);
      setEditingWitness(null);
    } catch (e) {
      setError('Не вдалося зберегти свідка');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Свідки</h2>
        <button
          onClick={() => { setEditingWitness(null); setIsModalOpen(true); }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Додати свідка
        </button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ПІБ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Посада</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Звання</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата з</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата по</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата народження</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Телефон</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Документ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {witnesses.map((witness) => (
                <tr key={witness.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{witness.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{witness.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{witness.rank}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{witness.dateFrom?.slice(0, 10)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{witness.dateTo?.slice(0, 10) || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{witness.birthDate?.slice(0, 10)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{witness.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{witness.document}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => { setEditingWitness(witness); setIsModalOpen(true); }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(witness.id)}
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
        <WitnessModal
          witness={editingWitness}
          onClose={() => { setIsModalOpen(false); setEditingWitness(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

function WitnessModal({ witness, onClose, onSave }: {
  witness: Witness | null,
  onClose: () => void,
  onSave: (witness: Omit<Witness, 'id'> & { id?: number }) => void
}) {
  const [form, setForm] = useState<Omit<Witness, 'id'> & { id?: number }>(witness || {
    fullName: '',
    position: '',
    rank: '',
    dateFrom: '',
    dateTo: '',
    birthDate: '',
    phone: '',
    document: '',
    address: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setForm({ ...form, [name]: date ? date.toISOString().slice(0, 10) : '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.position || !form.rank || !form.dateFrom || !form.birthDate || !form.phone || !form.document || !form.address) {
      setError('Будь ласка, заповніть всі обовʼязкові поля');
      return;
    }
    setError(null);
    onSave(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{witness ? 'Редагувати свідка' : 'Додати свідка'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-y-4">
            <div>
              <Label htmlFor="fullName">ПІБ*</Label>
              <Input name="fullName" value={form.fullName} onChange={handleChange} placeholder="ПІБ*" className="h-11" />
            </div>
            <div>
              <Label htmlFor="position">Посада*</Label>
              <Input name="position" value={form.position} onChange={handleChange} placeholder="Посада*" className="h-11" />
            </div>
            <div>
              <Label htmlFor="rank">Звання*</Label>
              <Input name="rank" value={form.rank} onChange={handleChange} placeholder="Звання*" className="h-11" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="dateFrom">Дата з*</Label>
                <DatePicker
                  selected={form.dateFrom ? new Date(form.dateFrom) : null}
                  onChange={date => handleDateChange('dateFrom', date)}
                  dateFormat="dd MMMM yyyy"
                  placeholderText="Дата з"
                  className="w-full border rounded-md px-3 py-2 h-11"
                  wrapperClassName="w-full h-11"
                  isClearable
                  locale={uk}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="dateTo">Дата по</Label>
                <DatePicker
                  selected={form.dateTo ? new Date(form.dateTo) : null}
                  onChange={date => handleDateChange('dateTo', date)}
                  dateFormat="dd MMMM yyyy"
                  placeholderText="Дата по"
                  className="w-full border rounded-md px-3 py-2 h-11"
                  wrapperClassName="w-full h-11"
                  isClearable
                  locale={uk}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Адреса*</Label>
              <Input name="address" value={form.address} onChange={handleChange} placeholder="Адреса*" className="h-11" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="phone">Телефон*</Label>
                <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Телефон*" className="h-11" />
              </div>
              <div className="flex-1">
                <Label htmlFor="birthDate">Дата народження*</Label>
                <DatePicker
                  selected={form.birthDate ? new Date(form.birthDate) : null}
                  onChange={date => handleDateChange('birthDate', date)}
                  dateFormat="dd MMMM yyyy"
                  placeholderText="Дата народження"
                  className="w-full border rounded-md px-3 py-2 h-11"
                  wrapperClassName="w-full h-11"
                  isClearable
                  locale={uk}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="document">Документ*</Label>
                <Input name="document" value={form.document} onChange={handleChange} placeholder="Документ*" className="h-11" />
              </div>
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
  );
}

export default WitnessesPage; 