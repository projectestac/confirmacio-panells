/*!
 *  File    : components/Login.js
 *  Created : 2023-05-05
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
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { Button, Avatar, Card, CardHeader, CardActions, Alert } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { red } from '@mui/material/colors';
import { checkFetchResponse } from '../utils';

export default function Login({ schoolData, setSchoolData, setError, setLoading, setModified, settings, logoutRef }) {

  const { msg, apiEndPoint } = settings;

  function processOAuthResponse(codeResponse) {
    setLoading(true);

    const queryParams = { id_token: codeResponse.access_token, /* NEW_API: true, */ };
    const locationParams = new URLSearchParams(window.location.search);
    const codi = locationParams.get('codi') || null;
    if (codi)
      queryParams.codi = codi;

    fetch(`${apiEndPoint}/getSchoolData.php`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json',
      },
      body: new URLSearchParams(queryParams),
    })
      .then(checkFetchResponse)
      .then(data => {
        if (!data || data.status !== 'ok' || !data.actual || !data.resposta) {
          throw new Error(data?.error || msg.incorrectData);
        }
        setSchoolData({ ...data });
        setModified(false);
        setError(null);
      })
      .catch(error => setError(error?.toString() || 'ERROR'))
      .finally(() => {
        setLoading(false);
      });
  }

  // Perform the login
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => processOAuthResponse(codeResponse),
    onError: (error) => {
      setLoading(false);
      setSchoolData(null);
      setError(msg.replace('error', { ERROR: error }));
    },
  });

  // Perform the logout
  const logout = () => {
    googleLogout();
    setError(null);
    setSchoolData(null);
  };

  return (
    <Card sx={{ my: 2, p: 2 }}>
      {schoolData &&
        <>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: red[500] }} src={schoolData.avatar} />}
            title={`${schoolData.actual.id} ${schoolData.actual.nom}`}
            subheader={`${schoolData.actual.municipi} (${schoolData.actual.sstt})`}
          />
          <CardActions>
            <Button onClick={logout} ref={logoutRef} >{msg.logout}</Button>
          </CardActions>
        </> ||
        <>
          <CardHeader
            title={msg.loginPrompt}
            subheader={<>
              <Alert sx={{ my: 1 }} severity="info">{msg.loginWarn1}</Alert>
              <Alert severity="warning">{msg.loginWarn2}</Alert>
            </>}
          />
          <CardActions>
            <Button onClick={login} variant="contained" startIcon={<LoginIcon />}>{msg.login}</Button>
          </CardActions>
        </>
      }
    </Card>
  );
}