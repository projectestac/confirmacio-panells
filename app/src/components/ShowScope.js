/*!
 *  File    : components/ShowScope.js
 *  Created : 2023-04-21
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
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

export default function ShowScope({ schoolData, settings }) {

  const { msg } = settings;
  const { actual } = schoolData;
  const maxPanels = Math.max(0, actual.grups - actual.pDepartament);
  const maxCredits = Math.max(0, Math.min(actual.grups, actual.pTotal)) * 100;

  return (
    <Card sx={{ my: 2, p: 2 }}>
      <CardHeader title={msg.replace('scope', { CODI: actual.id })} />
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{msg.maxDigitalClassrooms}: {actual.grups}</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>{msg.schoolGroupsDescription}</Typography>
        {actual.pDepartament && <>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{msg.pDepartament}: {actual.pDepartament}</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>{msg.pDepartamentDescription}</Typography>

          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{msg.maxPanels}: {maxPanels}</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>{msg.maxPanelsDescription}</Typography>
        </> || null}
        {maxCredits && <>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{msg.maxCredits}: {maxCredits}</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>{msg.maxCreditsDescription}</Typography>
        </> || null}
      </CardContent>
    </Card>
  );
}
