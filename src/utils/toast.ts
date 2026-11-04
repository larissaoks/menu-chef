import { toast } from "react-toastify"

export const toastSuccess = (text: string) =>
  toast.success(text, { hideProgressBar: true })

export const toastError = (text: string) =>
  toast.error(text, { hideProgressBar: true })
