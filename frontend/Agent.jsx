import { useEffect } from "react"

import useAuth from "./useAuth"

const counter = () => {
  const { actor } = useAuth()
  console.log("local counter")
  useEffect(() => {}, [actor])

  return actor
}

export { counter }
