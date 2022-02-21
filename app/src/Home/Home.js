import React, { useEffect } from 'react'
import { Stack, TextField, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SearchIcon from '@mui/icons-material/Search';
import interventionImg from '../utilities/images/intervention.svg'
import kilometresImg from '../utilities/images/kilometres.svg'
import tempsPasseImg from '../utilities/images/tempsPasse.svg'
import './Home.css';

export default function Home() {
  const [data, setData] = React.useState({
    technicien: "",
    date_debut: "",
    date_fin: "",
  });
  const [loading, setLoading] = React.useState(false)
  const [techniciens, setTechniciens] = React.useState([{
    "value": "matriculeFlo",
    "label": "Florian Bernard"
  },
  {
    "value": "matriculeBen",
    "label": "Benoit Mouton"
  }]);

  useEffect(() => { });

  const handleChange = () => (evt) => {
    let value = evt.target.value;
    let name = evt.target.name;
    setData({ ...data, [name]: value, });
    setLoading(false);
  }

  return (
    <>
      <h1>Dashboard</h1>
      <br /><br />
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} >
        <TextField
          select
          type="text"
          name="technicien" id="technicien" label="Technicien"
          sx={{ width: "40ch", textAlign: 'left' }}
          value={data.technicien}
          onChange={handleChange()}>
          {techniciens.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="date"
          name="date_debut" id="date-debut" label="Début période"
          value={data.date_debut}
          InputLabelProps={{ shrink: true, }}
          onChange={handleChange()}
        />
        <TextField
          type="date"
          name="date_fin" id="date-fin" label="Fin période"
          value={data.date_fin}
          InputLabelProps={{ shrink: true, }}
          onChange={handleChange()}
        />
        <LoadingButton
          color="primary"
          onClick={() => { setLoading(true) }}
          loading={loading}
          loadingPosition="start"
          startIcon={<SearchIcon />}
          variant="contained"
        >
          Rechercher
        </LoadingButton>
      </Stack>
      <br /><br />
      <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={2} >

        <section id="frameInterv" className="carres">
          <h2>INTERVENTION</h2>
          <span id="nbrInterv">16</span>
          <img src={interventionImg} alt="icon" id="icoInterv" />
        </section>

        <section id="frameKilo" className="carres">
          <h2>KILOMETRES</h2>
          <span id="kilometre">16</span>
          <img src={kilometresImg} alt="icon" id="icoKilo" />
        </section>

        <section id="frameTmp" className="carres">
          <h2>TEMPS PASSE</h2>
          <span id="tmpPasse">16</span>
          <img src={tempsPasseImg} alt="icon" id="icoTmpPasse" />
        </section>
      </Stack>
    </>
  )
};






