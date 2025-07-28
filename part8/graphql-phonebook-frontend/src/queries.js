import { gql } from '@apollo/client'

// Fragments
const PERSON_DETAILS_FRAGMENT = gql`
  fragment PersonDetails on Person {
    id,
    name,
    phone,
    address {
      street,
      city
    }
  }
`

// Queries

const ALL_PERSONS = gql`
  query {
    allPersons {
      name,
      phone,
      id
    }
  }
`

const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS_FRAGMENT}
`

// Mutations

const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!,
    $street: String!,
    $city: String!,
    $phone: String!
  ) {
    addPerson(
      name: $name,
      street: $street,
      city: $city,
      phone: $phone
    )
      {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS_FRAGMENT}
`

const EDIT_NUMBER = gql`
  mutation editNumber($name: String!, $phone: String!) {
    editNumber(name: $name, phone: $phone) {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS_FRAGMENT}
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

// Subscription

const PERSON_ADDED = gql`
  subscription {
    personAdded {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS_FRAGMENT}
`

export {
  // Queries
  ALL_PERSONS,
  FIND_PERSON,

  // Mutations
  CREATE_PERSON,
  EDIT_NUMBER,
  LOGIN,

  // Subscriptions
  PERSON_ADDED
}