
import type { Entry, Patient } from "../../types";
import { Gender } from "../../types";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Typography
} from '@mui/material';

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';

import patientService from '../../services/patients';

// Components
import EntryDetails from "./Entries";
import AddEntryForm from "./AddEntryForm";


const genderIcon = (gender: Gender) => {
  switch (gender) {
    case Gender.Male:
      return <MaleIcon />;
    case Gender.Female:
      return <FemaleIcon />;
    default:
      return <TransgenderIcon />;
  }
};

const PatientViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  const fetchPatient = useCallback(async () => {
    if (!id || typeof id !== "string") return;
    const data = await patientService.getPatient(id);
    setPatient(data);
  }, [id]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  if (!patient || !id) return <div>No patient found</div>;

  return (
    <Box>
      <br />
      <Typography variant="h4" gutterBottom>
        {patient.name} {genderIcon(patient.gender)}
      </Typography>
      <br />
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
      <br />
      <AddEntryForm id={id} onEntryAdded={fetchPatient} />
      <br />
      <Typography variant="h5">
        entries:
      </Typography>
      {patient.entries.map((entry: Entry, idx: number) => <EntryDetails key={idx} entry={entry} />)}
    </Box>
  );
};

export default PatientViewPage;