import {
  EditClientZodSchema,
  EditJobZodSchema,
  EditMaterialZodSchema,
  EditPaymentZodSchema,
  EditUserZodSchema,
  LoginUserZodSchema,
  RegisterClientZodSchema,
  RegisterJobZodSchema,
  RegisterMaterialZodSchema,
  RegisterPaymentZodSchema,
  RegisterUserZodSchema,
} from "@freelancemanager/shared";

// Request examples are kept here so route declarations and example tests use the same values.
export const requestExamples = {
  client: { name: "Acme", address: "123 Main Street", contact: "555-0100" },
  clientEdit: { name: "Acme Updated" },
  job: {
    jobDate: "2026-01-15",
    descr: "Website design",
    payed: false,
    totalValue: 250,
  },
  jobEdit: { descr: "Updated design" },
  material: {
    descr: "Paper",
    supplier: "Office Supply",
    qnt: 2,
    unitaryVal: 3.5,
  },
  materialEdit: { qnt: 3 },
  payment: {
    method: "Cash",
    paymentDate: "2026-01-15",
    value: 50,
    installment: 1,
  },
  paymentEdit: { method: "Transfer" },
  user: {
    username: "Ada Lovelace",
    login: "ada@example.com",
    password: "secure-pass",
  },
  login: { login: "ada@example.com", password: "secure-pass" },
  userEdit: { username: "Ada L." },
};

export const openApiRequestExamples = [
  [RegisterClientZodSchema, requestExamples.client],
  [EditClientZodSchema, requestExamples.clientEdit],
  [RegisterJobZodSchema, requestExamples.job],
  [EditJobZodSchema, requestExamples.jobEdit],
  [RegisterMaterialZodSchema, requestExamples.material],
  [EditMaterialZodSchema, requestExamples.materialEdit],
  [RegisterPaymentZodSchema, requestExamples.payment],
  [EditPaymentZodSchema, requestExamples.paymentEdit],
  [RegisterUserZodSchema, requestExamples.user],
  [LoginUserZodSchema, requestExamples.login],
  [EditUserZodSchema, requestExamples.userEdit],
] as const;
