import React, { useState, useEffect } from 'react'

export const useApi = (req, initForm = {}) => {
  const [res, setRes] = useState(null)
  const [form, setForm] = useState(initForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)
      try {
        const res = await req(form)
        setRes(res)
      } catch (error) {
        setIsError(true)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [form])
  return [{ res, isLoading, isError }, setForm]
}
