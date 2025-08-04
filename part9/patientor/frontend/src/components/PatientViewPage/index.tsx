
import type { Entry, Patient } from "../../types";
import { Gender } from "../../types";

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

import patientService from "../../services/patients";
import axios from "axios";


interface Props {
  //patient: Patient | null | undefined;
}

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

const PatientViewPage = (props: Props) => {
  //if (!patient) return <div>Patient not found</div>;

  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id || typeof id !== "string") return;
      const data = await patientService.getPatient(id);
      setPatient(data);
    };
    fetchPatient();
  }, [id]);

  if (!patient) return <div>No patient found</div>;

  const renderEntry = (entry: Entry) => {
    return (
      <Box>
        <Typography>
          {entry.date} <em>{entry.description}</em>
        </Typography>
        <List>
          {entry.diagnosisCodes?.map(code => <ListItem>{code}</ListItem>)}
        </List>
      </Box>
    );
  };

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