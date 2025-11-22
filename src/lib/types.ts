import { z } from 'zod';

// 1. Base Floor Schema
// Every floor must have an id and a type.
export const BaseFloorSchema = z.object({
  id: z.string().describe('Unique identifier for the floor instance'),
  type: z.string().describe('The type of the component (e.g., Text, Image, Shelf, Tab)'),
});

// 2. Page Schema
// A page is just a collection of floors.
export const PageSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  floors: z.array(z.any()), // We'll refine this 'any' as we define component schemas
});

export type PageConfig = z.infer<typeof PageSchema>;

