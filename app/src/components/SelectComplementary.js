/*!
 *  File    : components/SelectComplementary.js
 *  Created : 2023-04-06
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
import { Alert, AlertTitle, Card, CardHeader, CardContent, CardActions, Button, Table, TableBody, TableHead, TableRow, TableCell, TextField, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function SelectComplementary({ schoolData, setSchoolData, settings, alertDlg, warning, setWarning, handleNext, handleBack, saveButton }) {

  const { /*actual,*/ resposta } = schoolData;
  const { msg, elementKeys, creditsPerElement, calcCreditsSpent } = settings;

  const [creditsSpent, setCreditsSpent] = React.useState(calcCreditsSpent(resposta));

  const updateValue = (key) => (e) => {
    const value = Number(e.target.value) || 0;
    if (value < 0 || value > 999)
      return;
    const temp = { ...resposta, [key]: value };
    const spent = calcCreditsSpent(temp);
    if (spent > resposta.mad * 100) {
      alertDlg.setAlertTitle(msg.warn);
      alertDlg.setAlertText(msg.creditsExceeded);
      alertDlg.setAlertOpen(true);
      return;
    }
    // Check max points
    setSchoolData({ ...schoolData, resposta: { ...resposta, [key]: value, estat: 'OBERT' } });
    setCreditsSpent(spent);
  }

  const elementRow = (key) => {
    return (
      <TableRow key={key}>
        <TableCell>{msg[key]} ({creditsPerElement[key]} {msg.pluralize('credits', creditsPerElement[key])})</TableCell>
        <TableCell align='right'><TextField type="number" value={resposta[key]} onChange={updateValue(key)} size="small" /></TableCell>
        <TableCell align='right'>{resposta[key] * creditsPerElement[key]}</TableCell>
      </TableRow>
    )
  };

  return (
    <Card sx={{ my: 2, p: 2, backgroundColor: '#fafafa' }}>
      <CardHeader
        subheader={msg.selectFromCatalogSubtitle}
      />
      <CardContent sx={{ pb: 0 }}>
        {warning &&
          <Alert sx={{ mb: 2 }} severity="info" onClose={() => setWarning(null)}>
            <AlertTitle>{msg.info}</AlertTitle>
            {warning}
          </Alert>}
        {resposta.mad && <>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{msg.complementaryClassrooms}: {resposta.mad}</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>{msg.complementaryClassroomsDescription}</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{msg.complementaryCredits}: {resposta.mad * 100}</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>{msg.complementaryCreditsDescription}</Typography>
          <Table sx={{ my: 2 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>{msg.complementaryElement}</TableCell>
                <TableCell align='right'>{msg.complementaryElementUnits}</TableCell>
                <TableCell align='right'>{msg.complementaryElementCredits}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ '& input': { maxWidth: '30pt' } }}>
              {elementKeys.map(key => elementRow(key))}
              <TableRow key="total" sx={{ "& td": { fontWeight: 'bold' } }}>
                <TableCell colSpan={2} >{msg.total}</TableCell>
                <TableCell align='right'>{creditsSpent}</TableCell>
              </TableRow>
              <TableRow key="available" sx={{ "& td": { fontWeight: 'bold' } }}>
                <TableCell colSpan={2}>{msg.complementaryCreditsAvailable}</TableCell>
                <TableCell align='right'>{resposta.mad * 100 - creditsSpent}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </> || null}
      </CardContent>
      <CardActions sx={{ mt: 2, justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={handleBack} startIcon={<ArrowUpwardIcon />}>{msg.back}</Button>
        {saveButton}
        <Button variant="outlined" onClick={handleNext} startIcon={<ArrowDownwardIcon />}>{msg.next}</Button>
      </CardActions>
    </Card>
  );

}