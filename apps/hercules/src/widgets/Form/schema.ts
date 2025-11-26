import { z } from 'zod';
import { withMeta } from '@/lib/schema-utils';

export const FormSchema = z.object({
  title: withMeta(z.string(), {
    label: '表单标题',
  }).default('联系我们'),
  description: withMeta(z.string(), {
    label: '表单描述',
  }).optional(),
  fields: withMeta(
    z.array(
      z.object({
        label: withMeta(z.string(), {
          label: '字段标签',
        }),
        name: withMeta(z.string(), {
          label: '字段名(唯一标识)',
        }),
        type: withMeta(z.enum(['text', 'email', 'tel', 'textarea']), {
          label: '字段类型',
          labels: {
            text: '文本',
            email: '邮箱',
            tel: '电话',
            textarea: '长文本',
          },
        }).default('text'),
        placeholder: withMeta(z.string(), {
          label: '占位符',
        }).optional(),
        required: withMeta(z.boolean(), {
          label: '是否必填',
        }).default(false),
      })
    ),
    {
      label: '字段列表',
    }
  ).default([
    { label: '姓名', name: 'name', type: 'text', placeholder: '请输入您的姓名', required: true },
    { label: '邮箱', name: 'email', type: 'email', placeholder: '请输入您的邮箱', required: true }
  ]),
  submitText: withMeta(z.string(), {
    label: '提交按钮文案',
  }).default('提交'),
  successMessage: withMeta(z.string(), {
    label: '提交成功提示',
  }).default('提交成功！我们会尽快联系您。'),
});

