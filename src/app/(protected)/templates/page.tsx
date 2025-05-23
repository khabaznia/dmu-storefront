'use client';
import React, { useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, DownloadIcon, UploadIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Template {
  id: number;
  name: string;
  properties: string[];
}

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      setTemplates(data);
    } catch (e) {
      setError('Не вдалося завантажити шаблони');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цей шаблон?')) return;
    setLoading(true);
    try {
      await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError('Не вдалося видалити шаблон');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (template: { id?: number; name: string; properties: string[]; file?: File | null }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', template.name);
      formData.append('properties', JSON.stringify(template.properties));
      if (template.file) formData.append('docxTemplate', template.file);
      let res;
      if (template.id) {
        res = await fetch(`/api/templates/${template.id}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        res = await fetch('/api/templates', {
          method: 'POST',
          body: formData,
        });
      }
      if (!res.ok) throw new Error('Помилка збереження');
      await fetchTemplates();
      setIsModalOpen(false);
      setEditingTemplate(null);
    } catch (e) {
      setError('Не вдалося зберегти шаблон');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Шаблони документів</h2>
        <button
          onClick={() => { setEditingTemplate(null); setIsModalOpen(true); }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Додати шаблон
        </button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Назва</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Поля</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {templates.map((template) => (
                <tr key={template.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{template.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{template.properties.join(', ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => { setEditingTemplate(template); setIsModalOpen(true); }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
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
        <TemplateModal
          template={editingTemplate}
          onClose={() => { setIsModalOpen(false); setEditingTemplate(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

function TemplateModal({ template, onClose, onSave }: {
  template: Template | null,
  onClose: () => void,
  onSave: (template: { id?: number; name: string; properties: string[]; file?: File | null }) => void
}) {
  const [form, setForm] = useState<{ id?: number; name: string; properties: string; file: File | null }>(template ? {
    id: template.id,
    name: template.name,
    properties: template.properties.join(', '),
    file: null,
  } : { name: '', properties: '', file: null });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, file: e.target.files?.[0] || null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      setError('Вкажіть назву шаблону');
      return;
    }
    setError(null);
    onSave({
      id: form.id,
      name: form.name,
      properties: form.properties.split(',').map(s => s.trim()).filter(Boolean),
      file: form.file,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{template ? 'Редагувати' : 'Додати'} шаблон</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-y-4">
            <div>
              <Label htmlFor="name">Назва*</Label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Назва шаблону*" />
            </div>
            <div>
              <Label htmlFor="properties">Поля (через кому)</Label>
              <Input name="properties" value={form.properties} onChange={handleChange} placeholder="Напр. ПІБ,Посада,Дата" />
            </div>
            <div>
              <Label htmlFor="file">DOCX-файл</Label>
              <Input type="file" accept=".docx" onChange={handleFileChange} />
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

export default Templates 