import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { uk } from 'date-fns/locale';
import '@/styles/datepicker.css';
import { Official } from '@/types/official';

interface OfficialModalProps {
  official: Official | null;
  onClose: () => void;
  onSave: (official: Omit<Official, 'id'> & { id?: string }) => void;
}

const OfficialModal: React.FC<OfficialModalProps> = ({ official, onClose, onSave }) => {
  const [form, setForm] = useState<Omit<Official, 'id'> & { id?: string }>(official || {
    firstName: '', lastName: '', middleName: '', position: '', rank: '', passportData: '', dateFrom: '', dateTo: '', address: ''
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
    if (!form.firstName || !form.lastName || !form.position) {
      setError('Заповніть обовʼязкові поля');
      return;
    }
    setError(null);
    const { id, ...rest } = form;
    onSave(rest);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{official ? 'Редагувати' : 'Додати'} посадову особу</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-y-4">
            <div className="flex gap-2">
              <div className="w-1/3">
                <Label htmlFor="lastName">Прізвище*</Label>
                <Input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Прізвище*" className="h-11" />
              </div>
              <div className="w-1/3">
                <Label htmlFor="firstName">Імʼя*</Label>
                <Input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Імʼя*" className="h-11" />
              </div>
              <div className="w-1/3">
                <Label htmlFor="middleName">По батькові</Label>
                <Input name="middleName" value={form.middleName} onChange={handleChange} placeholder="По батькові" className="h-11" />
              </div>
            </div>
            <div>
              <Label htmlFor="position">Посада*</Label>
              <Input name="position" value={form.position} onChange={handleChange} placeholder="Посада*" className="h-11" />
            </div>
            <div>
              <Label htmlFor="rank">Звання</Label>
              <Input name="rank" value={form.rank} onChange={handleChange} placeholder="Звання" className="h-11" />
            </div>
            <div>
              <Label htmlFor="passportData">Паспортні дані</Label>
              <Input name="passportData" value={form.passportData} onChange={handleChange} placeholder="Паспортні дані" className="h-11" />
            </div>
            <div className="flex gap-2">
              <div className="w-1/2">
                <Label htmlFor="dateFrom">Дата з</Label>
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
              <div className="w-1/2">
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
              <Label htmlFor="address">Адреса</Label>
              <Input name="address" value={form.address} onChange={handleChange} placeholder="Адреса" className="h-11" />
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
};

export default OfficialModal; 