/*!
 *  File    : components/ShowSurveyData.js
 *  Created : 2023-04-20
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

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

export default function AlertDlg({ alertOpen, setAlertOpen, alertTitle, alertText, alertCloseAction, setAlertCloseAction, settings }) {

  const { rootRef, msg } = settings;

  const handleClose = () => {
    setAlertOpen(false);
    if (alertCloseAction) {
      alertCloseAction();
      setAlertCloseAction(null);
    }
  }

  return (
    <Dialog
      container={() => rootRef.current}
      open={alertOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {alertTitle || msg.warn}
      </DialogTitle>
      <DialogContent id="alert-dialog-description">
        {typeof alertText === 'string' ? <Typography>{alertText}</Typography> : alertText}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          {msg.ok}
        </Button>
      </DialogActions>
    </Dialog>
  );
}