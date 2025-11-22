import { ServerRecursiveRenderer } from '@/lib/engine/renderer/ServerRecursiveRenderer';
import { Providers } from '@/providers';
import { mockPageConfig } from '@/mocks/page-config';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-center text-2xl font-bold mb-8">Next.js Low-Code Agent Platform Demo</h1>
      {/* 
        This is now a Server Component iterating over the floors.
        It will statically render Text and Image on the server.
        It will hydrate Tab and Shelf on the client.
      */}
      <Providers>
        <ServerRecursiveRenderer floors={mockPageConfig} />
      </Providers>
    </div>
  );
}
