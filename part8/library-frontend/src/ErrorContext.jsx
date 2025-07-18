import { createContext } from 'react'

const ErrorContext = createContext()

export const ErrorContextProvider = (props) => {
  return (
    <ErrorContext.Provider value={[props.errorMessage, props.setErrorMessage]}>
      {props.children}
    </ErrorContext.Provider>
  )
}

export default ErrorContext