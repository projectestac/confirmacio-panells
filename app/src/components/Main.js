/*!
 *  File    : components/Main.js
 *  Created : 2023-03-28
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

import React, { useState, useRef } from 'react';
import { Box, Alert } from '@mui/material';
import Loading from './Loading';
import Login from './Login';
import ShowScope from './ShowScope';
import AlertDlg from './AlertDlg';
import { checkFetchResponse } from '../utils';
import Steps from './Steps';
import SaveButton from './SaveButton';
import deepEqual from 'deep-equal';

function Main({ settings }) {

  const { msg, apiEndPoint, rootRef } = settings;

  const [schoolData, setSchoolDataState] = useState(settings.testSchoolData || null);
  const [modified, setModified] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState('Atenció!');
  const [alertText, setAlertText] = React.useState('');
  const [alertCloseAction, setAlertCloseAction] = React.useState(null);
  const alertDlg = { setAlertOpen, setAlertTitle, setAlertText };


  // Ref to the 'logout' button in GoogleLogin component
  const logoutRef = useRef(null);

  const setSchoolData = (data, save = false) => {
    if (!deepEqual(data, schoolData)) {
      setModified(true);
      setSchoolDataState(data);
    }
    if (save)
      saveResponse(data.resposta);
  }

  const saveResponse = (data = schoolData.resposta) => {
    console.log(data);
    setUpdating(true);
    return fetch(`${apiEndPoint}/updateResposta.php`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({ resposta: JSON.stringify(data) }),
    })
      .then(checkFetchResponse)
      .then(result => {
        if (!result || result.status !== 'ok') {
          throw new Error(result?.error || msg.errorSavingData);
        }
        setModified(false);
        setError(null);
      })
      .catch(error => setError(error?.toString() || msg.errorSavingData))
      .finally(() => setUpdating(false));
  };

  const saveButton = <SaveButton {...{ settings, saveResponse, modified, updating }} />

  return (
    <>
      <Box sx={{ maxWidth: '800px', my: 2 }} ref={rootRef} >
        {
          loading && <Loading {...{ settings }} /> ||
          <div>
            <Login {...{ settings, schoolData, setSchoolData, setError, setLoading, setModified, logoutRef }} />
            {error && <Alert severity="error">{error.toLocaleString()}</Alert>}
            {schoolData &&
              <>
                <ShowScope {...{ settings, schoolData }} />
                <Steps {...{ settings, schoolData, setSchoolData, alertDlg, saveButton, saveResponse }} />
              </>
            }
          </div>
        }
      </Box>
      <AlertDlg {...{ alertOpen, setAlertOpen, alertTitle, alertText, alertCloseAction, setAlertCloseAction, settings }} />
    </>
  );
}

export default Main;
