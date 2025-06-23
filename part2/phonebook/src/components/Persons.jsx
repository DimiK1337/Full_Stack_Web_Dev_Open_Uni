
const Entry = ({ person }) => {
    return (
        <li>{person.name} : {person.number}</li>
    );
}

const Persons = ({ persons, filterQuery }) => {
    return (
        persons.map(
            person => person.name.toLowerCase().includes(filterQuery.toLowerCase())
                ? <Entry key={person.name} person={person} /> : ''
        )
    );
}

export default Persons