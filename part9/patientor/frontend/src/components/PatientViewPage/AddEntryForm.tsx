
import type { Diagnosis, HealthCheckEntry } from '../../types';
import { HealthCheckRating } from '../../types';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';

import DateField from '../ui/DateField';

import patientService from '../../services/patients';

interface Props {
  id: string;
}

const AddEntryForm = ({ id }: Props) => {
  // TODO: Make a selector for the type of Entry

  // To start, do a health check entry
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<Date | null>(null);
  const [specialist, setSpecialist] = useState<string>('');
  const [diagnosisCodesStr, setDiagnosisCodesStr] = useState<Diagnosis['code']>('');

  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(0);

  const parseDiagnosisCodes = (input: string): Array<Diagnosis['code']> => input
    .split(',')
    .map(code => code.trim())
    .filter(code => code.length > 0);

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const diagnosisCodes = parseDiagnosisCodes(diagnosisCodesStr);
    const healthCheckEntry: Omit<HealthCheckEntry, "id"> = {
      description,
      date: date?.toISOString().split('T')[0] ?? '', // "2025-08-07T13:45:30.000Z" is an example str
      specialist,
      diagnosisCodes,
      type: "HealthCheck",
      healthCheckRating
    };

    try {
      await patientService.createEntry(id, healthCheckEntry);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Submission error:', error.message);
        alert(error.message);
      }
    }
  };

  return (
    <Box
      component='form'
      onSubmit={onSubmit}
      display='flex'
      flexDirection='column'
      gap={2}
    >
      <Typography>
        Add a new entry:
      </Typography>

      <TextField
        label='description'
        name='description'
        value={description}
        onChange={({ target }) => setDescription(target.value)}
      />

      <DateField label='Date' value={date} setValue={setDate}/>

      <TextField
        label='specialist'
        name='specialist'
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
      />

      <TextField
        label='diagnosis codes'
        name='diagnosisCodes'
        placeholder='The list of codes must be separated by a comma'
        value={diagnosisCodesStr}
        onChange={({ target }) => setDiagnosisCodesStr(target.value)}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="healthCheckRating-label">Health Check Rating</InputLabel>
        <Select
          labelId="healthCheckRating-label"
          id="healthCheckRating"
          value={healthCheckRating}
          label="Health Check Rating"
          onChange={(event) => setHealthCheckRating(Number(event.target.value))}
        >
          {Object.entries(HealthCheckRating)
            .filter(([_, value]) => typeof value === 'number')
            .map(([key, value]) => (
              <MenuItem key={value} value={value}>
                {key}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <Button type='submit'>
        submit
      </Button>
    </Box>
  );


};

export default AddEntryForm;