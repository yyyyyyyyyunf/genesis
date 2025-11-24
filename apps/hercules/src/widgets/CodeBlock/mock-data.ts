import { z } from 'zod';
import { CodeBlockSchema } from './schema';

type CodeBlockProps = z.infer<typeof CodeBlockSchema>;

export const CodeBlockMockData: {
  minimal: CodeBlockProps;
  complete: CodeBlockProps;
} = {
  minimal: {
    code: 'console.log("Hello World");',
    language: 'typescript',
    theme: 'github-dark'
  },
  complete: {
    code: `interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  const data = await response.json();
  return data;
}

// 使用示例
const products = await fetchProducts();
console.log('商品列表:', products);`,
    language: 'typescript',
    theme: 'github-dark'
  }
};

