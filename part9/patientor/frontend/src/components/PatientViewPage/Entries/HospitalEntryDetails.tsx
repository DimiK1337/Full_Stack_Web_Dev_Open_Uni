import type { HospitalEntry } from '../../../types';

import { 
  Box, 
  Typography
} from '@mui/material';

// Components
import BaseEntry from './BaseEntry';
import BorderBox from '../../ui/BorderBox';

interface Props {
  entry: HospitalEntry;
}

const HospitalEntryDetail = ({ entry }: Props) => {
  const { date, criteria } = entry.discharge;
  return (
    <BorderBox>
      <BaseEntry entry={entry}/>
      <Box>
        Discharge:
        <Typography>
          Date: {date}
        </Typography>
        <Typography>
          Criteria: {criteria}
        </Typography>

      </Box>
    </BorderBox>
  );
};

export default HospitalEntryDetail;