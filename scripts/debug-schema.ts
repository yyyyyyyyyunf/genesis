import { z } from 'zod';

// Define a discriminated union similar to ImageSchema
const BaseSchema = z.object({
  common: z.string(),
});

const TypeASchema = BaseSchema.extend({
  type: z.literal('typeA'),
  fieldA: z.string(),
});

const TypeBSchema = BaseSchema.extend({
  type: z.literal('typeB'),
  fieldB: z.number(),
});

const TestSchema = z.discriminatedUnion('type', [
  TypeASchema,
  TypeBSchema,
]);

function inspectSchema(schema: any) {
  console.log('Schema Type:', schema.constructor.name);
  console.log('Discriminator:', schema.discriminator);
  
  if (schema.options) {
    console.log('Options Array Length:', schema.options.length);
    schema.options.forEach((opt: any, index: number) => {
      console.log(`\n--- Option ${index} ---`);
      console.log('Option Type:', opt.constructor.name);
      
      // Try to access shape
      let shape = opt.shape;
      if (!shape && opt._def && opt._def.shape) {
        console.log('Accessing shape via _def.shape()');
        shape = typeof opt._def.shape === 'function' ? opt._def.shape() : opt._def.shape;
      }
      
      if (shape) {
        console.log('Shape found.');
        const discriminatorField = shape['type'];
        console.log('Discriminator Field:', discriminatorField);
        console.log('Discriminator Field Type:', discriminatorField?.constructor?.name);
        
        if (discriminatorField) {
           console.log('Keys in Discriminator Field:', Object.keys(discriminatorField));
           if (discriminatorField._def) {
               console.log('Keys in Discriminator Field _def:', Object.keys(discriminatorField._def));
               console.log('Value in _def:', discriminatorField._def.value);
           }
           if ('value' in discriminatorField) {
               console.log('Value in field:', discriminatorField.value);
           }
        }
      } else {
        console.log('No shape found on option.');
        console.log('Option keys:', Object.keys(opt));
        if (opt._def) console.log('_def keys:', Object.keys(opt._def));
      }
    });
  }
}

inspectSchema(TestSchema);

