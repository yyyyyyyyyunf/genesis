import { z } from 'zod';
import { FormSchema } from './schema';

type FormProps = z.infer<typeof FormSchema>;

export const FormMockData: {
  minimal: FormProps;
  complete: FormProps;
} = {
  minimal: {
    title: '联系我们',
    submitText: '提交',
    successMessage: '提交成功！我们会尽快联系您。'
  },
  complete: {
    title: '预约咨询',
    description: '请填写以下信息，我们的客服将在24小时内与您联系',
    fields: [
      {
        label: '姓名',
        name: 'name',
        type: 'text',
        placeholder: '请输入您的姓名',
        required: true
      },
      {
        label: '手机号',
        name: 'phone',
        type: 'tel',
        placeholder: '请输入您的手机号',
        required: true
      },
      {
        label: '邮箱',
        name: 'email',
        type: 'email',
        placeholder: '请输入您的邮箱',
        required: false
      },
      {
        label: '咨询内容',
        name: 'message',
        type: 'textarea',
        placeholder: '请描述您的需求',
        required: true
      }
    ],
    submitText: '立即预约',
    successMessage: '预约成功！我们会在24小时内与您联系。'
  }
};

