import { useState, type ChangeEvent } from "react"

export default function useForm<T extends object>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }) as T)
  }

  return { values, handleChange }
}
