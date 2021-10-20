import React, { createContext, useReducer, useState, useEffect } from "react"
import { AuthClient } from "@dfinity/auth-client"
import AuthReducer from "./AuthReducer"
import { createActor, canisterId } from "canisters/counter"

const initialState = {
  client: undefined,
  actor: undefined,
  identity: "",
  principal: "",
  signedIn: false,
  isAuthenticated: false,
}

const AuthContext = createContext({
  ...initialState,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
})

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(AuthReducer, initialState)
  const [isAuth, setIsAuth] = useState(false)
  const [client, setClient] = useState()

  const initAuth = async () => {
    console.log("initializing auth")
    const client = await AuthClient.create()
    const isAuthenticated = await client.isAuthenticated()

    dispatch({ type: "SET_CLIENT", payload: client })
    setClient(client)
    console.log("before is authenticated", isAuthenticated)
    if (isAuthenticated) {
      const identity = client.getIdentity()
      const principal = identity.getPrincipal().toString()
      dispatch({ type: "SET_PRINCIPAL", payload: principal })
      dispatch({ type: "SET_IDENTITY", payload: identity })
      dispatch({ type: "SET_CLIENT", payload: client })
      initActor(identity)
    }
  }
  const initActor = (id) => {
    console.log("init actor", id)
    const actor = createActor(canisterId, {
      agentOptions: {
        identity: id,
      },
    })
    dispatch({ type: "SET_ACTOR", payload: actor })
    // setActor(actor)
  }
  const signIn = async () => {
    client.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: () => {
        const identity = client.getIdentity()
        const principal = identity.getPrincipal().toString()
        dispatch({ type: "SET_AUTHENTICATION", payload: true })
        dispatch({ type: "SET_SIGNED", payload: true })
        dispatch({ type: "SET_PRINCIPAL", payload: principal })
        dispatch({ type: "SET_IDENTITY", payload: identity })
        dispatch({ type: "SET_CLIENT", payload: client })
        initActor(identity)
      },
    })
  }
  const signOut = async () => {
    await client.logout()

    dispatch({ type: "SET_AUTHENTICATION", payload: false })
    dispatch({ type: "SET_SIGNED", payload: false })
    // dispatch({ type: "SET_PRINCIPAL", payload: "" })
    // dispatch({ type: "SET_IDENTITY", payload: "" })
  }
  useEffect(() => {
    initAuth()
  }, [])
  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }
