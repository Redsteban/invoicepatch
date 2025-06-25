import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Pencil, PlusCircle } from 'lucide-react';
import { useTemplateContext } from '../context/TemplateProvider';
import { validateTemplate } from '../utils/validation';

const unitOptions = [
  { value: 'hour', label: 'Hour' },
  { value: 'day', label: 'Day' },
];

export type TemplateFormProps = {
  initialValues?: any;
  onClose?: () => void;
};

export const TemplateForm: React.FC<TemplateFormProps> = ({ initialValues, onClose }) => {
  const isEdit = !!initialValues;
  const [form, setForm] = useState({
    name: initialValues?.name || '',
    rate: initialValues?.rate || '',
    hours: initialValues?.hours || '',
    unit: initialValues?.unit || 'hour',
    ot_multiplier: initialValues?.ot_multiplier || '',
    description: initialValues?.description || '',
  });
  const [loading, setLoading] = useState(false);
  const { create, update } = useTemplateContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateTemplate(form);
    if (!validation.success) {
      validation.errors?.forEach((err: any) => toast.error(err.message));
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await update(initialValues.id, validation.data);
        toast.success('Template updated!');
      } else {
        await create(validation.data);
        toast.success('Template created!');
      }
      onClose?.();
    } catch (err: any) {
      toast.error(err.message || 'Error saving template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 space-y-4 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          {isEdit ? <Pencil className="w-5 h-5 text-blue-500" /> : <PlusCircle className="w-5 h-5 text-green-500" />}
          <h2 className="text-lg font-semibold">{isEdit ? 'Edit Template' : 'New Template'}</h2>
        </div>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="input input-bordered w-full" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium">Rate</label>
            <input name="rate" type="number" value={form.rate} onChange={handleChange} required className="input input-bordered w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Hours</label>
            <input name="hours" type="number" value={form.hours} onChange={handleChange} required className="input input-bordered w-full" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Unit</label>
          <select name="unit" value={form.unit} onChange={handleChange} className="input input-bordered w-full">
            {unitOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">OT Multiplier</label>
          <input name="ot_multiplier" type="number" step="0.01" value={form.ot_multiplier} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}; 