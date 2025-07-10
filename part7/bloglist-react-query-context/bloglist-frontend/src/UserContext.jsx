import { useContext, createContext, useReducer } from 'react'

const userReducer = (state, action) => {
  switch(action.type) {
    case 'SET_USER': return action.payload
    case 'REMOVE_USER': return null
    default: return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)
  return (
    <UserContext.Provider value={[ user, userDispatch ]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const [user, ] = useContext(UserContext)
  return user
}

export const useUserDispatch = () => {
  const [, userDispatch] = useContext(UserContext)
  return userDispatch
}

export default UserContext

