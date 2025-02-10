import { z } from "zod";
import {
  passwordValidation,
  numberValidation,
  validationMessage,
} from "./validation";

export const PersonSchema = z.object({
  personID: z.coerce.number().optional(),
  firstName: z.string().min(1, { message: validationMessage.require }),
  lastName: z.string().min(1, { message: validationMessage.require }),
  address: z.string().min(1, { message: validationMessage.require }),
  phoneNumber: z
    .string()
    .min(1, { message: validationMessage.require })
    .regex(numberValidation, {
      message: validationMessage.number,
    }),
  email: z.string().min(1, { message: validationMessage.require }).email(),
});
export const PPersonSchema = PersonSchema.partial();

export const EmployeeSchema = z
  .object({
    employeeID: z.coerce.number().optional(),
    role: z.string().min(1, { message: validationMessage.require }).optional(),
    userName: z
      .string()
      .min(1, { message: validationMessage.require })
      .optional(),
    password: z
      .string()
      .min(8, { message: "Minimum 8 characters required" })
      .regex(passwordValidation, {
        message: validationMessage.password,
      })
      .optional(),
    person: PPersonSchema.optional(),
    confirmPassword: z
      .string()
      .min(8, { message: "Minimum 8 characters required" })
      .optional(),
  })
  .superRefine((val2, ctx2) => {
    if (val2.confirmPassword && val2.password !== val2.confirmPassword) {
      ctx2.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const SearchEmployeeSchema = z.object({
  role: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
});

export const CustomerSchema = z.object({
  customerID: z.coerce.number().optional(),
  libraryCardNumber: z.coerce.number().optional(),
  dateOfBirth: z.string().date().min(1, {
    message: validationMessage.require,
  }),
  person: PersonSchema,
});

export const SearchCustomerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  libraryCardNumber: z.coerce.number(),
});

export type TSearchEmployee = z.infer<typeof SearchEmployeeSchema>;
export type TEmployee = z.infer<typeof EmployeeSchema>;
export type TSearchCustomer = z.infer<typeof SearchCustomerSchema>;
export type TCustomer = z.infer<typeof CustomerSchema>;
