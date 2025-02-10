import { z } from "zod";
import { ItemCopySchema } from "./item";
import { validationMessage } from "./validation";

export const LoanCartSchema = z.object({
  barcode: z.coerce.number().min(1, { message: validationMessage.require }),
  title: z.string().min(1, { message: validationMessage.require }),
  type: z.string().min(1, { message: validationMessage.require }),
  price: z.coerce.number().min(1, { message: validationMessage.require }),
  loanPeriod: z.string().min(1, { message: validationMessage.require }).date(),
  // returnDueDate: z.string().min(1).pipe(z.coerce.date()),
  returnDueDate: z.date(),
});

export const BaseLoanSchema = z.object({
  loanID: z.coerce.number().optional(),
  libraryCardNumber: z.coerce
    .number()
    .min(1, { message: validationMessage.require }),
  dateOfLoan: z.date(),
  TotalAmount: z.coerce.number().min(1, { message: validationMessage.require }),
  quantities: z.coerce.number().min(1, { message: validationMessage.require }),
});

export const LoanDetailSchema = z.object({
  loanID: z.coerce.number().optional(),
  barcode: z.coerce.number().min(1, { message: validationMessage.require }),
  returnDueDate: z.date(),
  returnDate: z.date().optional(),
  fine: z.coerce.number().optional(),
  note: z.string().optional(),
  itemCopy: ItemCopySchema.optional(),
  loan: BaseLoanSchema.optional(),
});

const LoanSchema = BaseLoanSchema.extend({
  loanDetails: z.array(LoanDetailSchema),
});

export type TLoan = z.infer<typeof LoanSchema>;
export type TLoanDetail = z.infer<typeof LoanDetailSchema>;
export type TLoanCart = z.infer<typeof LoanCartSchema>;
