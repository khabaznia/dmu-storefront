import { useState, useEffect } from 'react';
import { Official } from '@/types/official';
import { formatDateUA } from '@/utils/officials';

export interface OfficialWithComputed extends Official {
  fullName: string;
  period: string;
}

export function useOfficialsLogic() {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOfficials();
  }, []);

  const fetchOfficials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/officials');
      const data = await res.json();
      setOfficials(data);
    } catch (e) {
      setError('Не вдалося завантажити дані');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цю посадову особу?')) return;
    setLoading(true);
    try {
      await fetch(`/api/officials/${id}`, { method: 'DELETE' });
      setOfficials((prev) => prev.filter((o) => o.id !== id));
    } catch (e) {
      setError('Не вдалося видалити особу');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (official: Omit<Official, 'id'> & { id?: string }) => {
    setLoading(true);
    try {
      let res;
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
      };
      if (editingOfficial) {
        res = await fetch(`/api/officials/${editingOfficial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(officialData),
        });
      } else {
        res = await fetch('/api/officials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(officialData),
        });
      }
      if (!res.ok) throw new Error('Помилка збереження');
      fetchOfficials();
      setIsModalOpen(false);
      setEditingOfficial(null);
    } catch (e) {
      setError('Не вдалося зберегти особу');
    } finally {
      setLoading(false);
    }
  };

  const officialsWithComputed: OfficialWithComputed[] = officials.map(o => ({
    ...o,
    fullName: `${o.lastName} ${o.firstName} ${o.middleName}`,
    period: `${formatDateUA(o.dateFrom)}${o.dateTo ? ` - ${formatDateUA(o.dateTo)}` : ''}`,
  }));

  return {
    officials,
    officialsWithComputed,
    isModalOpen,
    setIsModalOpen,
    editingOfficial,
    setEditingOfficial,
    loading,
    error,
    handleDelete,
    handleSave,
  };
} 