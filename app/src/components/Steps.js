/*!
 *  File    : components/Steps.js
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

import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, StepContent } from '@mui/material';
import ShowCurrentEndowment from './ShowCurrentEndowment';
import SelectComplementary from './SelectComplementary';
import Completed from './Completed';
import { PDFDocumentVithViewer } from "./PDFDocument";
import UploadPDF from "./UploadPDF";

export default function Steps({ settings, schoolData, setSchoolData, alertDlg, saveButton }) {

  const { msg } = settings;
  const { actual, resposta } = schoolData;
  const noComp = actual.pTotal ? 0 : 1;
  const [activeStep, setActiveStep] = useState(resposta.estat === 'DESCARREGAT' ? 3 - noComp : resposta.estat === 'ENVIAT' ? 4 - noComp : 0);
  const [warning, setWarning] = useState(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    if (confirm(msg.resetWarning)) {
      setSchoolData({ ...schoolData, resposta: { ...resposta, nomFitxer: null, dataFitxer: null, signatPer: null, metaFitxer: null } }, true);
      setActiveStep(0);
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>
            {msg.schoolEndowment}
          </StepLabel>
          <StepContent>
            <ShowCurrentEndowment {...{ settings, schoolData, setSchoolData, setWarning, alertDlg, handleNext, saveButton }} />
          </StepContent>
        </Step>
        {!noComp &&
          <Step>
            <StepLabel>
              {msg.selectFromCatalog}
            </StepLabel>
            <StepContent>
              <SelectComplementary {...{ settings, schoolData, setSchoolData, alertDlg, warning, setWarning, handleNext, handleBack, saveButton }} />
            </StepContent>
          </Step>
          || null}
        <Step>
          <StepLabel>
            {msg.downloadPDF}
          </StepLabel>
          <StepContent>
            <PDFDocumentVithViewer {...{ settings, schoolData, setSchoolData, handleNext, handleBack }} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>
            {msg.uploadPDF}
          </StepLabel>
          <StepContent>
            <UploadPDF {...{ settings, schoolData, setSchoolData, alertDlg, handleNext, handleBack }} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>
            {msg.completed}
          </StepLabel>
          <StepContent>
            <Completed {...{ settings, schoolData, handleReset }} />
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
}