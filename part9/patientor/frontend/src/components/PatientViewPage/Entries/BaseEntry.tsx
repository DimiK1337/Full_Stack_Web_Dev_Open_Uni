


import type { Entry, Diagnosis } from '../../../types';

import {
  Typography,
  List,
  ListItem
} from '@mui/material';

import { useState, useEffect } from 'react';

import diagnosisService from '../../../services/diagnoses';

interface Props {
  entry: Entry
}

const BaseEntry = ({ entry }: Props) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const data = await diagnosisService.getAll();
      setDiagnoses(data);
    };
    fetchDiagnoses();
  }, []);

  const getDiagnosisCodeDescription = (code: string) => {
    const diagnosis = diagnoses.find(d => d.code === code);
    return diagnosis?.name ?? '';
  };

  return (
    <>
      <Typography>
        {entry.date} <em>{entry.description}</em>
      </Typography>
      <Typography>
        Diagnosed by: {entry.specialist}
      </Typography>
      <List>
        {entry.diagnosisCodes?.map(code => <ListItem>{code} {getDiagnosisCodeDescription(code)}</ListItem>)}
      </List>
    </>
  );
};

export default BaseEntry;