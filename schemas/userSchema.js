import * as Yup from "yup";

const authSchemaValidation = Yup.object({
  email: Yup.string().email("Parameter email tidak sesuai format").required("Parameter email harus di isi"),
  password: Yup.string().min(8, "Password minimal terdiri dari 8 karakter").required("Parameter password harus di isi")
})

const nameSchemaValidation = Yup.object({
  first_name: Yup.string().required("Parameter first_name harus di isi"),
  last_name: Yup.string().required("Parameter last_name harus di isi"),
})

export const registrationSchema = Yup.object({
  ...authSchemaValidation.fields,
  ...nameSchemaValidation.fields
});

export const loginSchema = Yup.object({
  ...authSchemaValidation.fields
});

export const updateProfileSchema = Yup.object({
  ...nameSchemaValidation.fields
});
