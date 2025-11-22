import { ServerRecursiveRenderer } from '@/lib/engine/renderer/ServerRecursiveRenderer';
import { Providers } from '@/providers';
import { mockPageConfig } from '@/mocks/page-config';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-center text-2xl font-bold mb-8">Next.js Low-Code Agent Platform Demo</h1>
      {/* 
        现在这是一个遍历楼层的 Server Component。
        它将在服务器端静态渲染 Text 和 Image 组件。
        它将在客户端水合 (Hydrate) Tab 和 Shelf 组件。
      */}
      <Providers>
        <ServerRecursiveRenderer floors={mockPageConfig} />
      </Providers>
    </div>
  );
}
