import { RealtimePreviewRenderer } from '@/lib/engine/renderer/realtime-preview/RealtimePreviewRenderer';
import { ServerRecursiveRenderer } from '@/lib/engine/renderer/server/ServerRecursiveRenderer';
import { Providers } from '@/providers';
import { searchParamsCache } from '@/lib/search-params';
import { fetchPageConfig } from '@/api/page-config';

import { PageConfig } from '@/lib/types';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { mode } = await searchParamsCache.parse(await searchParams);
  const isPreview = mode === 'preview';
  
  let pageConfig: PageConfig = [];
  try {
    pageConfig = await fetchPageConfig();
  } catch (error) {
    console.error('获取页面配置出错:', error);
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-center text-2xl font-bold mb-8">唐图2.0</h1>
      {/* 
        如果 mode=preview，使用 RealtimePreviewRenderer (Client Component) 以支持从编辑器 (Zeus) 实时预览。
        否则，使用 ServerRecursiveRenderer (Server Component) 进行服务端渲染。
      */}
      <Providers>
        {isPreview ? (
           <RealtimePreviewRenderer initialFloors={pageConfig} />
        ) : (
           <ServerRecursiveRenderer floors={pageConfig} />
        )}
      </Providers>
    </div>
  );
}
