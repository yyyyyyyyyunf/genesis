import { z } from 'zod';

export const FormSchema = z.object({
  title: z.string().describe('表单标题').default('联系我们'),
  description: z.string().optional().describe('表单描述'),
  fields: z.array(z.object({
    label: z.string().describe('字段标签'),
    name: z.string().describe('字段名(唯一标识)'),
    type: z.enum(['text', 'email', 'tel', 'textarea']).describe('字段类型 @labels({"text":"文本", "email":"邮箱", "tel":"电话", "textarea":"长文本"})').default('text'),
    placeholder: z.string().optional().describe('占位符'),
    required: z.boolean().describe('是否必填').default(false),
  })).describe('字段列表').default([
    { label: '姓名', name: 'name', type: 'text', placeholder: '请输入您的姓名', required: true },
    { label: '邮箱', name: 'email', type: 'email', placeholder: '请输入您的邮箱', required: true }
  ]),
  submitText: z.string().describe('提交按钮文案').default('提交'),
  successMessage: z.string().describe('提交成功提示').default('提交成功！我们会尽快联系您。'),
});

