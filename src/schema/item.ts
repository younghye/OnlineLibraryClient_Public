import { z } from "zod";
import { validationMessage } from "./validation";

export const SearchItemSchema = z.object({
  barcode: z.coerce.number(),
  title: z.string(),
  typeID: z.string().transform((value) => (value === "" ? "" : Number(value))),
  producer: z.string(),
});

export const TypeSchema = z.object({
  typeID: z.number(),
  name: z.string(),
});

export const CategorySchema = z.object({
  categoryID: z.number(),
  name: z.string(),
});

export const GenreSchema = z.object({
  genreID: z.number(),
  name: z.string(),
});

export const BookSchema = z.object({
  isbn: z.string().min(1),
  publisher: z.string().min(1),
});

export const DvdSchema = z.object({
  duration: z.string().min(1, { message: validationMessage.require }),
  director: z.string().min(1, { message: validationMessage.require }),
});

export const SoftwareSchema = z.object({
  version: z.string().min(1, { message: validationMessage.require }),
});

export const BaseItemSchema = z.object({
  itemID: z.number().optional(),
  genreID: z.coerce.number().min(1, { message: validationMessage.require }),
  categoryID: z.coerce.number().min(1, { message: validationMessage.require }),
  typeID: z.coerce.number().min(1, { message: validationMessage.require }),
  title: z.string().min(1, { message: validationMessage.require }),
  dateOfPublication: z
    .string()
    .min(1, { message: validationMessage.require })
    .date(),
  producer: z.string().min(1, { message: validationMessage.require }),
  book: BookSchema.nullable().optional(),
  dvd: DvdSchema.nullable().optional(),
  software: SoftwareSchema.nullable().optional(),
  type: TypeSchema.optional(),
  category: CategorySchema.optional(),
  genre: GenreSchema.optional(),
});

export const ItemCopySchema = z.object({
  barcode: z.coerce
    .number()
    .min(1, { message: validationMessage.require })
    .optional(),
  itemID: z.coerce.number().optional(),
  price: z.coerce.number().optional(),
  status: z.string().min(1, { message: validationMessage.require }),
  item: BaseItemSchema.nullable().optional(),
});

export const ItemSchema = BaseItemSchema.extend({
  itemCopies: ItemCopySchema.array().optional(),
});

export type TSearchItem = z.infer<typeof SearchItemSchema>;
export type TItem = z.infer<typeof ItemSchema>;
export type TItemCopy = z.infer<typeof ItemCopySchema>;
