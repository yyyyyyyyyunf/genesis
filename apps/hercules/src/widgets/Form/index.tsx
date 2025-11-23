'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { FormSchema } from './schema';
import { cn } from '@/lib/utils';

type FormProps = z.infer<typeof FormSchema>;

export const Form = (props: { data: FormProps }) => {
  const { title, description, fields, submitText, successMessage } = props.data;
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSuccess) {
    return (
      <div className="p-8 text-center bg-green-50 rounded-lg border border-green-100">
        <h3 className="text-xl font-semibold text-green-800 mb-2">提交成功</h3>
        <p className="text-green-600">{successMessage}</p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-4 text-sm text-green-700 hover:text-green-900 underline"
        >
          返回表单
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-xl shadow-sm border">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">{title}</h2>
      {description && <p className="text-gray-500 mb-6">{description}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields?.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                required={field.required}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            ) : (
              <input
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            )}
          </div>
        ))}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '提交中...' : submitText}
        </button>
      </form>
    </div>
  );
};

