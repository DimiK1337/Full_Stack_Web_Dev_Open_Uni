
import type { Entry, Patient } from "../../types";
import { Diagnosis, Gender } from "../../types";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Typography,
  List,
  ListItem
} from '@mui/material';

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';

import patientService from '../../services/patients';
import diagnosisService from '../../services/diagnoses';


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
  //if (!patient) return <div>Patient not found</div>;

  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id || typeof id !== "string") return;
      const data = await patientService.getPatient(id);
      setPatient(data);
    };
    fetchPatient();
  }, [id]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const data = await diagnosisService.getAll();
      setDiagnoses(data);
    };
    fetchDiagnoses();
  }, []);

  if (!patient) return <div>No patient found</div>;

  const getDiagnosisCodeDescription = (code: string) => {
    const diagnosis = diagnoses.find(d => d.code === code);
    return diagnosis?.name ?? '';
  };

  const renderEntry = (entry: Entry) => {
    return (
      <Box>
        <Typography>
          {entry.date} <em>{entry.description}</em>
        </Typography>
        <List>
          {entry.diagnosisCodes?.map(code => <ListItem>{code} {getDiagnosisCodeDescription(code)}</ListItem>)}
        </List>
      </Box>
    );
  };

  console.log('patient.entries', patient.entries);
  
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
      <Typography variant="h5">
        entries:
      </Typography>
      {
        patient.entries.map((entry: Entry) => renderEntry(entry))
      }
    </Box>
  );
};

export default PatientViewPage;