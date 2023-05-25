/*!
 *  File    : components/ShowCurrentEndowment.js
 *  Created : 2023-04-05
 *  By      : Francesc Busquets <francesc@gmail.com>
 *
 *  Necessitats aules digitals
 *  Confirmació de les necessitats dels centres educatius en digitalització d'aules 
 *
 *  @source https://github.com/projectestac/necessitats-aules-digitals
 *
 *  @license EUPL-1.2
 *  @licstart
 *  (c) 2023 Educational Telematic Network of Catalonia (XTEC)
 *
 *  Licensed under the EUPL, Version 1.2 or -as soon they will be approved by
 *  the European Commission- subsequent versions of the EUPL (the "Licence");
 *  You may not use this work except in compliance with the Licence.
 *
 *  You may obtain a copy of the Licence at:
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the Licence is distributed on an "AS IS" basis, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  Licence for the specific language governing permissions and limitations
 *  under the Licence.
 *  @licend
 *  @module
 */

import React from 'react';
import { Table, TableRow, TableCell, TableHead, TableBody, Card, CardContent, CardActions, Button, TextField } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ShowSurveyData from './ShowSurveyData';

export default function ShowCurrentEndowment({ schoolData, setSchoolData, settings, setWarning, alertDlg, handleNext, saveButton }) {

  const { msg, calcCreditsSpent } = settings;
  const { actual, resposta } = schoolData;
  const maxPanels = Math.max(0, actual.grups - actual.pDepartament);

  const warn = text => {
    alertDlg.setAlertTitle(msg.warn);
    alertDlg.setAlertText(text);
    alertDlg.setAlertOpen(true)
  }

  const updateValue = (key) => (e) => {
    const value = Number(e.target.value) || 0;
    if (value < 0 || value > 99)
      return;
    const temp = { ...resposta, [key]: value, estat: 'OBERT' };
    const numPanels = temp.a75rodes + temp.a75paret + temp.a65rodes + temp.a65paret;
    const numSupports = temp.srFixes + temp.srRodes;
    if (numPanels > maxPanels)
      warn(msg.replace('maxPanelsError', { MAX: maxPanels }));
    else if (numSupports > numPanels) {
      if (temp.srFixes > resposta.srFixes || temp.srRodes > resposta.srRodes)
        warn(msg.maxSupportsIncrementError);
      else
        warn(msg.maxSupportsDecrementError);
    }
    else
      setSchoolData({ ...schoolData, resposta: temp });
  }

  const updateComentaris = (e) => {
    const txt = e.target.value || '';
    if (txt !== resposta.comentaris)
      setSchoolData({ ...schoolData, resposta: { ...resposta, comentaris: txt } });
  }

  const checkChanges = () => {
    const { actual, resposta } = schoolData;
    const numPanels = resposta.a75rodes + resposta.a75paret + resposta.a65rodes + resposta.a65paret;
    const maxUnits = Math.min(actual.grups, actual.pTotal);
    const newMad = Math.min((actual.grups - numPanels), maxUnits);
    let updatedSchoolData = { ...schoolData };

    setWarning(null);

    // TODO: Aplicar límit d'aules digitalitzabes en funció dels grups
    if (newMad > resposta.mad)
      setWarning(msg.creditsAugmented);
    else if (newMad < resposta.mad) {
      const currentSpentCredits = calcCreditsSpent(resposta);
      if (currentSpentCredits > newMad * 100) {
        updatedSchoolData.resposta = { ...resposta, armGrans: 0, armPetits: 0, tablets: 0, visDoc: 0, altaveus: 0, estat: 'OBERT' };
        if (newMad === 0)
          setWarning(msg.creditsToZero);
        else
          setWarning(`${msg.creditsReduced} ${msg.creditsReducedClear} ${msg.creditsTryAgain}`);
      }
      else
        setWarning(msg.creditsReduced);
    }
    
    if (!newMad) {
      setWarning(msg.noCredits);
    }

    updatedSchoolData.resposta = { ...resposta, mad: newMad };
    setSchoolData(updatedSchoolData);
    return true;
  }

  const showSurvey = ev => {
    ev.preventDefault();
    alertDlg.setAlertTitle(msg.schoolSurveyTitle);
    alertDlg.setAlertText(<ShowSurveyData {...{ settings, schoolData }} />);
    alertDlg.setAlertOpen(true);
  };

  return (
    <Card sx={{ my: 2, p: 2 }}>
      <CardContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{msg.endowedPanels}</TableCell>
              <TableCell align='right'>Càlcul basat en l&apos;<a href="#" onClick={showSurvey}>enquesta de 2022</a></TableCell>
              <TableCell align='right'>{msg.endowedPanelsProposed}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ '& input': { maxWidth: '30pt' } }}>
            <TableRow>
              <TableCell>{msg.p75paret}</TableCell>
              <TableCell align='right'>{actual.a75paret}</TableCell>
              <TableCell align='right'><TextField type="number" value={resposta.a75paret} onChange={updateValue('a75paret')} size="small" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{msg.p75rodes}</TableCell>
              <TableCell align='right'>{actual.a75rodes}</TableCell>
              <TableCell align='right'><TextField type="number" value={resposta.a75rodes} onChange={updateValue('a75rodes')} size="small" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{msg.p65paret}</TableCell>
              <TableCell align='right'>{actual.a65paret}</TableCell>
              <TableCell align='right'><TextField type="number" value={resposta.a65paret} onChange={updateValue('a65paret')} size="small" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{msg.p65rodes}</TableCell>
              <TableCell align='right'>{actual.a65rodes}</TableCell>
              <TableCell align='right'><TextField type="number" value={resposta.a65rodes} onChange={updateValue('a65rodes')} size="small" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{msg.srFixes}</TableCell>
              <TableCell align='right'>{actual.srFixes}</TableCell>
              <TableCell align='right'><TextField type="number" value={resposta.srFixes} onChange={updateValue('srFixes')} size="small" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{msg.srRodes}</TableCell>
              <TableCell align='right'>{actual.srRodes}</TableCell>
              <TableCell align='right'><TextField type="number" value={resposta.srRodes} onChange={updateValue('srRodes')} size="small" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <TextField
          sx={{ mt: 3 }}
          value={resposta.comentaris}
          label={msg.observacionsTitle}
          placeholder={msg.observacionsPlaceholder}
          multiline
          fullWidth
          maxRows={6}
          inputProps={{ maxLength: 512 }}
          onChange={updateComentaris}
        />
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <span />
        {saveButton}
        <Button variant="outlined" onClick={() => checkChanges() && handleNext()} startIcon={<ArrowDownwardIcon />}>{msg.next}</Button>
      </CardActions>
    </Card>
  );
}
