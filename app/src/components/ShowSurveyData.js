/*!
 *  File    : components/ShowSurveyData.js
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
import { Box, Alert, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

export default function ShowSurveyData({ schoolData: { actual: data }, settings: { msg } }) {

  return (
    <Box>
      {!data.enquesta &&
        // School did not participate in the survey
        <Alert severity="warning">{msg.schoolNoSurvey}</Alert>
        ||
        // School participated in the survey
        <>
          <Table sx={{ my: 2 }} size="small">
            <TableHead>
              <TableRow><TableCell>{msg.existingPanels}</TableCell><TableCell align='right'>{msg.pluralize('units', 2)}</TableCell></TableRow>
            </TableHead>
            <TableBody>
              <TableRow><TableCell>{msg.pDepartament}</TableCell><TableCell align='right'>{data.pDepartament}</TableCell></TableRow>
              <TableRow><TableCell>{msg.pAltres}</TableCell><TableCell align='right'>{data.pAltres}</TableCell></TableRow>
              <TableRow><TableCell>{msg.pTotalActual}</TableCell><TableCell align='right'>{data.pTotal}</TableCell></TableRow>
            </TableBody>
          </Table>
          <Table sx={{ my: 2 }} size="small">
            <TableHead>
              <TableRow><TableCell>{msg.requestedPanels}</TableCell><TableCell align='right'>{msg.pluralize('units', 2)}</TableCell></TableRow>
            </TableHead>
            <TableBody>
              <TableRow><TableCell>{msg.p75paret}</TableCell><TableCell align='right'>{data.e75paret}</TableCell></TableRow>
              <TableRow><TableCell>{msg.p75rodes}</TableCell><TableCell align='right'>{data.e75rodes}</TableCell></TableRow>
              <TableRow><TableCell>{msg.p65paret}</TableCell><TableCell align='right'>{data.e65paret}</TableCell></TableRow>
              <TableRow><TableCell>{msg.p65rodes}</TableCell><TableCell align='right'>{data.e65rodes}</TableCell></TableRow>
            </TableBody>
          </Table>
          <Table sx={{ my: 2 }} size="small">
            <TableHead>
              <TableRow><TableCell>{msg.requestedSupports}</TableCell><TableCell align='right'>{msg.pluralize('units', 2)}</TableCell></TableRow>
            </TableHead>
            <TableBody>
              <TableRow><TableCell>{msg.srFixes}</TableCell><TableCell align='right'>{data.srFixes}</TableCell></TableRow>
              <TableRow><TableCell>{msg.srRodes}</TableCell><TableCell align='right'>{data.srRodes}</TableCell></TableRow>
            </TableBody>
          </Table>
        </>
      }
    </Box>
  );
}
