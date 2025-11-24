import { z } from 'zod';
import { AccordionSchema } from './schema';

type AccordionProps = z.infer<typeof AccordionSchema>;

export const AccordionMockData: {
  minimal: AccordionProps;
  complete: AccordionProps;
} = {
  minimal: {
    items: [
      {
        title: '如何下单购买？',
        content: '您可以浏览商品页面，点击"加入购物车"按钮，然后进入购物车结算。'
      }
    ],
    allowMultiple: false
  },
  complete: {
    items: [
      {
        title: '如何下单购买？',
        content: '您可以浏览商品页面，点击"加入购物车"按钮，然后进入购物车结算。支持多种支付方式。'
      },
      {
        title: '配送时间需要多久？',
        content: '一般情况下，订单会在1-3个工作日内发货，具体配送时间取决于您所在的地区。'
      },
      {
        title: '支持哪些支付方式？',
        content: '我们支持支付宝、微信支付、银行卡等多种支付方式，您可以根据自己的需求选择。'
      },
      {
        title: '如何申请退换货？',
        content: '商品签收后7天内，如有质量问题可申请退换货。请在个人中心的订单页面提交申请。'
      }
    ],
    allowMultiple: true
  }
};

