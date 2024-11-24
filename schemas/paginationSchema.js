import * as Yup from "yup";

export const paginationSchema = Yup.object({
  offset: Yup.number().integer("Nilai offset harus berupa bilangan bulat").typeError("Nilai offset harus berupa angka").min(0, "Nilai offset tidak boleh negatif"),
  limit: Yup.number().integer("Nilai limit harus berupa bilangan bulat").typeError("Nilai limit harus berupa angka").min(0, "Nilai limit tidak boleh negatif")
})