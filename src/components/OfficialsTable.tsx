import React, { useState } from 'react';
import { PencilIcon, TrashIcon } from 'lucide-react';

export interface Field<T = any> {
  key: keyof T;
  label: string;
  maxWidth?: string;
  isDate?: boolean;
}

interface OfficialsTableProps<T = any> {
  officials: T[];
  fields: Field<T>[];
  onEdit: (official: T) => void;
  onDelete: (id: string) => void;
  formatDate?: (dateStr?: string) => string;
}

const OfficialsTable = <T extends { id: string }>({ officials, fields, onEdit, onDelete, formatDate }: OfficialsTableProps<T>) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {fields.map(field => (
              <th
                key={field.key as string}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${field.maxWidth ? field.maxWidth : ''}`}
              >
                {field.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {officials.map((official) => (
            <React.Fragment key={official.id}>
              <tr
                className="relative group"
                onMouseEnter={() => setHoveredId(official.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {fields.map(field => (
                  <td
                    key={field.key as string}
                    className={`px-6 py-4 whitespace-normal break-words ${field.maxWidth ? field.maxWidth : ''}`}
                  >
                    <div className={`text-sm ${field.key === 'lastName' || field.key === 'firstName' || field.key === 'middleName' ? 'font-medium text-gray-900' : 'text-gray-500'} break-words`}>
                      {field.isDate && formatDate
                        ? formatDate(official[field.key] as string)
                        : (official[field.key] as string)}
                    </div>
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(official)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(official.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
              {hoveredId === official.id && (
                <tr>
                  <td colSpan={fields.length + 1} className="relative">
                    <div className="absolute left-4 top-2 z-50 w-max min-w-[250px] bg-white border border-gray-300 shadow-lg rounded p-4 text-xs text-gray-900 whitespace-pre-line">
                      {Object.entries(official).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-semibold">{key}:</span> {String(value)}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OfficialsTable; 