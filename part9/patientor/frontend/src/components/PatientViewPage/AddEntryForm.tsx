
import type {
  Diagnosis,
  EntryWithoutId,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry
} from '../../types';
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
  onEntryAdded: () => void;
}

const AddEntryForm = ({ id, onEntryAdded }: Props) => {
  const [entryType, setEntryType] = useState<'HealthCheck' | 'Hospital' | 'OccupationalHealthcare'>('HealthCheck');

  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<Date | null>(null);
  const [specialist, setSpecialist] = useState<string>('');
  const [diagnosisCodesStr, setDiagnosisCodesStr] = useState<Diagnosis['code']>('');

  // HealthCheck
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(0);

  // Hospital
  const [dischargeDate, setDischargeDate] = useState<Date | null>(null);
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  // Occupational
  const [employerName, setEmployerName] = useState<string>('');
  const [sickLeaveStart, setSickLeaveStart] = useState<Date | null>(null);
  const [sickLeaveEnd, setSickLeaveEnd] = useState<Date | null>(null);

  const parseDiagnosisCodes = (input: string): Array<Diagnosis['code']> => input
    .split(',')
    .map(code => code.trim())
    .filter(code => code.length > 0);

  const parseDate = (input: Date | null): string => input?.toISOString().split('T')[0] ?? ''; // "2025-08-07T13:45:30.000Z" is an example str

  const _submitEntryHelper = async (entry: EntryWithoutId) => {
    try {
      await patientService.createEntry(id, entry);
      onEntryAdded();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Submission error:', error.message);
        alert(error.message);
      }
    }
  };
  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const diagnosisCodes = parseDiagnosisCodes(diagnosisCodesStr);

    const baseEntry = {
      description,
      date: parseDate(date),
      specialist,
      diagnosisCodes
    };

    const healthCheckEntry: Omit<HealthCheckEntry, "id"> = {
      ...baseEntry,
      type: 'HealthCheck',
      healthCheckRating
    };

    const hospitalEntry: Omit<HospitalEntry, "id"> = {
      ...baseEntry,
      type: 'Hospital',
      discharge: {
        date: parseDate(dischargeDate),
        criteria: dischargeCriteria
      }
    };

    const occupationalHealthcareEntry: Omit<OccupationalHealthcareEntry, "id"> = {
      ...baseEntry,
      type: 'OccupationalHealthcare',
      employerName,
      sickLeave: {
        startDate: parseDate(sickLeaveStart),
        endDate: parseDate(sickLeaveEnd)
      }
    };

    switch (entryType) {
      case 'HealthCheck': return _submitEntryHelper(healthCheckEntry);
      case 'Hospital': return _submitEntryHelper(hospitalEntry);
      case 'OccupationalHealthcare': return _submitEntryHelper(occupationalHealthcareEntry);
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

      <FormControl fullWidth>
        <InputLabel id="entryType-label">Entry Type</InputLabel>
        <Select
          labelId="entryType-label"
          id="entryType"
          value={entryType}
          onChange={(e) => setEntryType(e.target.value as typeof entryType)}
        >
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
        </Select>
      </FormControl>


      <TextField
        label='description'
        name='description'
        value={description}
        onChange={({ target }) => setDescription(target.value)}
        required
      />

      <DateField
        label='Date'
        value={date}
        setValue={setDate}
      />

      <TextField
        label='specialist'
        name='specialist'
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
        required
      />

      <TextField
        label='diagnosis codes'
        name='diagnosisCodes'
        placeholder='The list of codes must be separated by a comma'
        value={diagnosisCodesStr}
        onChange={({ target }) => setDiagnosisCodesStr(target.value)}
        required
      />

      {entryType === 'HealthCheck' &&
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
        </FormControl>}

      {entryType === 'Hospital' && (
        <>
          <DateField
            label='Discharge Date'
            value={dischargeDate}
            setValue={setDischargeDate}
          />
          <TextField
            label="Discharge Criteria"
            value={dischargeCriteria}
            onChange={({ target }) => setDischargeCriteria(target.value)}
            required
          />
        </>
      )}

      {entryType === 'OccupationalHealthcare' && (
        <>
          <TextField
            label="Employer Name"
            value={employerName}
            onChange={({ target }) => setEmployerName(target.value)}
            required
          />
          <DateField
            label='Sick Leave Start Date'
            value={sickLeaveStart}
            setValue={setSickLeaveStart}
          />
          <DateField
            label='Sick Leave End Date'
            value={sickLeaveEnd}
            setValue={setSickLeaveEnd}
          />
        </>
      )}
      <Button type='submit'>
        submit
      </Button>
    </Box>
  );


};

export default AddEntryForm;