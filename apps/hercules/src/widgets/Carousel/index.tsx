'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { z } from 'zod';
import { CarouselSchema } from './schema';
import { cn } from '@/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type CarouselProps = z.infer<typeof CarouselSchema>;

const aspectRatioMap = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/1': 'aspect-[3/1]',
  'auto': '',
};

export const Carousel = (props: { data: CarouselProps }) => {
  const { items, autoplay, interval, showArrows, showDots, aspectRatio = '16/9' } = props.data;

  if (!items || items.length === 0) {
    return (
      <div className={cn("w-full bg-gray-100 flex items-center justify-center text-gray-400", aspectRatioMap[aspectRatio])}>
        请添加轮播图片
      </div>
    );
  }

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={showArrows}
        pagination={showDots ? { clickable: true } : false}
        autoplay={autoplay ? { delay: interval, disableOnInteraction: false } : false}
        loop={items.length > 1}
        className="w-full"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className={cn("w-full relative overflow-hidden", aspectRatioMap[aspectRatio])}>
              {item.link ? (
                <a href={item.link} className="block w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.alt || `Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </a>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.alt || `Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

