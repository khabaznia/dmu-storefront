'use client';
import React, { useState } from 'react'
import { FileIcon, UserIcon, Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Template {
  id: number;
  name: string;
  properties: string[];
}
interface Official {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  position: string;
  rank: string;
  passportData: string;
  dateFrom: string;
  dateTo: string;
  address: string;
}

const DocumentGeneration = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      const [templatesRes, officialsRes] = await Promise.all([
        fetch('/api/templates'),
        fetch('/api/officials')
      ]);
      const templatesData = await templatesRes.json();
      const officialsData = await officialsRes.json();
      setTemplates(templatesData);
      setOfficials(officialsData);
    };
    fetchData();
  }, []);

  const handleTemplateChange = async (templateId: string) => {
    if (!templateId) {
      setSelectedTemplate(null);
      setFormData({});
      return;
    }
    const template = templates.find(t => t.id === Number(templateId));
    setSelectedTemplate(template || null);
    if (template) {
      const initialData: Record<string, string> = {};
      template.properties.forEach(prop => {
        initialData[prop] = '';
      });
      setFormData(initialData);
    }
  };

  const handleOfficialChange = (officialId: string) => {
    if (!officialId) {
      setSelectedOfficial(null);
      return;
    }
    const official = officials.find(o => o.id === Number(officialId));
    setSelectedOfficial(official || null);
    if (official && selectedTemplate) {
      const updatedFormData = { ...formData };
      Object.keys(official).forEach(key => {
        if (selectedTemplate.properties.includes(key)) {
          updatedFormData[key] = String(official[key as keyof Official] ?? '');
        }
      });
      setFormData(updatedFormData);
    }
  };

  const handleInputChange = (property: string, value: string) => {
    setFormData(prev => ({ ...prev, [property]: value }));
  };

  const handleGenerateDocument = async () => {
    if (!selectedTemplate) return;
    setIsGenerating(true);
    setError('');
    try {
      // 1. Завантажити docx шаблон
      const templateRes = await fetch(`/api/templates/${selectedTemplate.id}/download`);
      const templateBlob = await templateRes.blob();
      // 2. Перетворити blob у base64
      const base64Template = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(templateBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data.split(',')[1]);
        };
      });
      // 3. Відправити запит на /api/generate-document
      const apiRes = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params: formData, template: base64Template })
      });
      if (!apiRes.ok) throw new Error('Помилка при генерації документа');
      const result = await apiRes.json();
      // 4. Завантажити згенерований документ
      const byteCharacters = atob(result.base64dataResult);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const docBlob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = window.URL.createObjectURL(docBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate.name}_${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      setError('Помилка при генерації документа. Спробуйте ще раз.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="space-y-4">
          <div>
            <Label htmlFor="template">Оберіть шаблон</Label>
            <select
              id="template"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedTemplate?.id || ''}
              onChange={(e) => handleTemplateChange(e.target.value)}
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
              <Label htmlFor="official">Оберіть посадову особу (опціонально)</Label>
              <select
                id="official"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedOfficial?.id || ''}
                onChange={(e) => handleOfficialChange(e.target.value)}
              >
                <option value="">Оберіть посадову особу...</option>
                {officials.map((official) => (
                  <option key={official.id} value={official.id}>
                    {official.lastName} {official.firstName} {official.middleName}
                  </option>
                ))}
              </select>
            </div>
          )}
          {selectedTemplate && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Поля для заповнення</h3>
              <form onSubmit={e => { e.preventDefault(); handleGenerateDocument(); }}>
                {selectedTemplate.properties.map(property => (
                  <div key={property} className="mb-3">
                    <Label htmlFor={property}>{property}</Label>
                    <Input
                      id={property}
                      value={formData[property] || ''}
                      onChange={e => handleInputChange(property, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                ))}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center"
                  >
                    {isGenerating ? (
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
                  </Button>
                </div>
                {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentGeneration 