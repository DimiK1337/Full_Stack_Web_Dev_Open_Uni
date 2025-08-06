import type { OccupationalHealthcareEntry } from '../../../types';
import { 
  Typography
} from '@mui/material';

// Components
import BaseEntry from './BaseEntry';
import BorderBox from '../../ui/BorderBox';


interface Props {
  entry: OccupationalHealthcareEntry;
}

const OccupationalHealthcareEntryDetails = ({ entry }: Props) => {
  return (
    <BorderBox>
      <BaseEntry entry={entry}/>
      <Typography>
        Employer name: {entry.employerName}
      </Typography>
      {entry.sickLeave && <Typography>
        Sick leave: {entry.sickLeave?.startDate} to {entry.sickLeave?.endDate}
      </Typography>}
    </BorderBox>
  );
};

export default OccupationalHealthcareEntryDetails;