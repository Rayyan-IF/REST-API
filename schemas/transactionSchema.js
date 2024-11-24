import * as Yup from "yup";

const invalidAmountMessage = "Parameter top_up_amount hanya boleh angka dan tidak boleh lebih kecil dari 0"

export const topupSchema = Yup.object({
  top_up_amount: Yup.number().typeError(invalidAmountMessage).positive(invalidAmountMessage).required("Parameter top_up_amount harus di isi")
})

export const paymentServiceSchema = Yup.object({
  service_code: Yup.string().required("Parameter service_code harus di isi")
})