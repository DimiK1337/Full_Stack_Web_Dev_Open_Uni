import { useState, useEffect } from "react";
import axios from "axios";
import {
  Route,
  Link,
  Routes,
  useMatch
} from "react-router-dom";
import {
  Button,
  Divider,
  Container,
  Typography
} from '@mui/material';

import { apiBaseUrl } from "./constants";
import { Patient } from "./types";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientViewPage from "./components/PatientViewPage";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  
  /* const patientMatch = useMatch('/patients/:id');
  const patient = patientMatch ? patients.find(p => p.id === patientMatch.params.id) : null; */

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  return (
    <div className="App">

      <Container>
        <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider hidden />
        <Routes>
          <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
          <Route path="/patients/:id" element={<PatientViewPage/>} />
        </Routes>
      </Container>

    </div>
  );
};

export default App;
