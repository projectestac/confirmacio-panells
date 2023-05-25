/*!
 *  File    : components/UploadPDF.js
 *  Created : 2023-05-11
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

import React, { useState } from 'react';
import { Button, LinearProgress, Box, Typography, Card, CardContent, CardActions } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { filesize } from 'filesize';
import { checkFetchResponse } from '../utils';

export default function UploadPDF({ settings, schoolData, setSchoolData, alertDlg, handleNext, handleBack }) {

  const { msg, apiEndPoint } = settings;

  const [file, setFile] = useState(null);
  const [err, setErr] = useState(null);
  const [ready, setReady] = useState(false);
  const [waiting, setWaiting] = useState(false);

  // TODO: Call reset!
  const reset = () => {
    setFile(null);
    setErr(null);
    setReady(false);
    setWaiting(false);
  }

  const handleUploadClick = ev => {
    if (ev.target.files && ev.target.files.length > 0) {
      const file = ev.target.files[0];
      setFile(file);
      checkErrors(file);
    }
  }

  const checkErrors = (file) => {
    let err = null;
    if (!file.name.toLowerCase().endsWith('.pdf'))
      err = msg.badFileType;

    setErr(err);
    setReady(err === null);
  }

  const uploadFile = () => {
    setWaiting(true);
    setReady(false);
    const data = new FormData();
    data.append('pdfFile', file);
    data.append('schoolID', schoolData.actual.id);
    fetch(`${apiEndPoint}/uploadFile.php`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      body: data,
    })
      .then(checkFetchResponse)
      .then(response => {
        if (response.status === 'ok' && response.resposta) {
          alertDlg.setAlertTitle(msg.info);
          alertDlg.setAlertText(msg.replace('signedBy', { NAME: response.resposta.signatPer }));
          alertDlg.setAlertOpen(true);
          setSchoolData({ ...schoolData, resposta: response.resposta });
          handleNext();
        }
        else
          throw new Error(response.error || msg.unknownError);
      })
      .catch(error => {
        alertDlg.setAlertTitle(msg.uploadError);
        alertDlg.setAlertText(error?.toString() || msg.unknownError);
        alertDlg.setAlertOpen(true);
        reset();
        console.error(error);
      })
  }

  return (
    <Card>
      <CardContent sx={{ "& > *": { my: 2 } }}>
        <Typography sx={{ mb: 2 }}>{msg.uploadDialogMsg}</Typography>
        {!file &&
          <>
            <input
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              id="input-file"
              onChange={handleUploadClick}
              disabled={waiting}
            />
            <label htmlFor="input-file">
              <Button component="span" variant="contained" disabled={waiting} startIcon={<FolderOpenIcon />}>{msg.selectFile}</Button>
            </label>
          </>
        }
        {file &&
          <Typography>
            {msg.selectedFile} <Box component="span" sx={{ fontWeight: 'bold' }}>{file.name}</Box> ({filesize(file.size, { locale: true })})
          </Typography>
        }
        {err && <Box sx={{ color: 'error.dark' }}>{err}</Box>}
        {waiting &&
          <Box sx={{ mt: 2, '& > *': { my: 1 } }}>
            <Typography>{msg.uploadingFile}</Typography>
            <LinearProgress />
          </Box>
        }
        {ready &&
          <Button sx={{ mt: 2 }} variant="contained" component="div" onClick={uploadFile} disabled={waiting} startIcon={<UploadFileIcon />}>
            {msg.uploadFile}
          </Button>
        }
      </CardContent>
      <CardActions>
        <Button variant="outlined" onClick={handleBack} startIcon={<ArrowUpwardIcon />}>{msg.back}</Button>
      </CardActions>
    </Card >
  );
}
