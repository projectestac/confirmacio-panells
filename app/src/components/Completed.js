/*!
 *  File    : components/Completed.js
 *  Created : 2023-05-12
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
import { Card, CardHeader, CardContent, CardActions, Typography, Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

export default function Completed({ settings, schoolData, handleReset }) {

  const { msg, apiEndPoint } = settings;
  const { actual, resposta } = schoolData;
  const t = new Date(resposta.dataFitxer * 1000);

  // TODO: set download link!

  return (
    <Card>
      <CardHeader title={<><PlaylistAddCheckIcon sx={{mr: '10px', mb: '-3px'}}/>{msg.completedTitle}</>} />
      <CardContent sx={{"& *": {mb: 2}}}>
        <Typography>{msg.replace('completedDescription', { ID: actual.id, NAME: actual.nom })}</Typography>
        <Typography>{msg.replace('completedDetails', { SIGNEDBY: resposta.signatPer, DATE: t.toLocaleDateString(), TIME: t.toLocaleTimeString() })}</Typography>
        <Typography>{msg.completedDownloadPDF} <a href={`${apiEndPoint}/downloadFile.php`} target="_blank" rel="noreferrer">{msg.completedDownloadLink}</a>.</Typography>
        <Typography>{msg.completedReset}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="outlined" onClick={handleReset} startIcon={<DeleteForeverIcon sx={{ mb: '3px' }} />}>{msg.resetButton}</Button>
      </CardActions>
    </Card>
  );
}
