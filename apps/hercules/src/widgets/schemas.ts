import { TextSchema } from './Text/schema';
import { ShelfSchema } from './Shelf/schema';
import { TabSchema } from './Tab/schema';
import { ImageSchema } from './Image/schema';
import { ButtonSchema } from './Button/schema';
import { VideoSchema } from './Video/schema';
import { CarouselSchema } from './Carousel/schema';
import { SpacerSchema } from './Spacer/schema';

export const SchemaRegistry = {
  Text: TextSchema,
  Shelf: ShelfSchema,
  Tab: TabSchema,
  Image: ImageSchema,
  Button: ButtonSchema,
  Video: VideoSchema,
  Carousel: CarouselSchema,
  Spacer: SpacerSchema,
};
