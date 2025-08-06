
import type { Entry } from '../../../types';

// Components
import HealthCheckEntryDetails from './HealthCheckEntryDetails';
import HospitalEntryDetail from './HospitalEntryDetails';
import OccupationalHealthcareEntryDetails from './OccupationalHealthcareEntryDetails';

interface Props {
  entry: Entry
}

const EntryDetails = ({ entry }: Props) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  switch (entry.type) {
    case 'Hospital': return <HospitalEntryDetail entry={entry}/>;
    case 'HealthCheck': return <HealthCheckEntryDetails entry={entry}/>;
    case 'OccupationalHealthcare': return <OccupationalHealthcareEntryDetails entry={entry}/>;
    default: return assertNever(entry);
  }
};

export default EntryDetails;