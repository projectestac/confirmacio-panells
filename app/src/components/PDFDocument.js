/*!
 *  File    : components/PDFDocument.js
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
import { saveAs } from 'file-saver';
import { pdf, Page, Text, View, Document, Image, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { Card, CardHeader, CardContent, CardActions, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import logo from '../assets/logo.png';
import logosMRR from '../assets/logosMRR.png';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  body: {
    paddingLeft: 30,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  section: {
    // marginVertical: 10,
  },
  line: {
    marginBottom: 3,
  },
  smallLine: {
    fontSize: 10,
    marginBottom: 2,
  },
  image: {
    maxWidth: 220,
  },
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    fontWeight: 800,
    marginTop: 30,
    marginBottom: 10,
    paddingBottom: 3,
    borderBottomWidth: '2px',
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 3,
    borderBottomWidth: '1px',
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
  },
  table: {
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 36,
  },
  lineFooter: {
    marginBottom: 4,
    fontSize: 10,
  },
  imgFooter: {
    width: 510,
  },
  sideText: {
    position: 'absolute',
    transform: 'rotate(-90deg)',
    left: -70,
    top: 450,
    fontFamily: 'Helvetica-Oblique',
    fontSize: 9,
  }
});

const TableRow = ({ textLeft, textRight }) => (
  <View style={styles.tableRow}>
    <Text>{textLeft}</Text>
    <Text>{textRight}</Text>
  </View>
);

// Create Document Component
export default function PDFDocument({ schoolData, settings }) {
  const { msg } = settings;
  const { actual, resposta } = schoolData;

  const { idCentre, /*mad,*/ a75paret, a75rodes, a65paret, a65rodes, srFixes, srRodes, armGrans, armPetits, tablets, visDoc, altaveus, comentaris } = resposta;
  const { nom, municipi } = actual;
  const date = resposta.date || new Date();

  const totalPanels = a75paret + a75rodes + a65paret + a65rodes;
  const totalComplements = armGrans + armPetits + tablets + visDoc + altaveus;

  return (
    <Document
      title={`${msg.app_title} - ${idCentre} ${actual.nom}`}
      creator={msg.app_creator}
      subject={JSON.stringify({ idCentre, a75paret, a75rodes, a65paret, a65rodes, srFixes, srRodes, armGrans, armPetits, tablets, visDoc, altaveus, comentaris })}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image style={styles.image} src={logo} />
        </View>
        <View style={styles.sideText}>
          <Text>{`${msg.pdfDate} ${Intl.DateTimeFormat('ca-ES', { dateStyle: 'long', timeStyle: 'short' }).format(date)}`}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>{msg.pdfTitle}</Text>
          <Text style={styles.subtitle}>{msg.pdfSchoolSection}</Text>
          <View style={styles.section}>
            <Text style={styles.line}>{`${msg.pdfSchool} ${idCentre} ${nom}`}</Text>
            <Text style={styles.line}>{`${msg.pdfCity} ${municipi}`}</Text>
          </View>
          {totalPanels && <Text style={styles.subtitle}>{msg.pdfPanelsTitle}</Text> || null}
          {totalPanels &&
            <View style={styles.table}>
              {a75paret && <TableRow textLeft={`${msg.p75paret}:`} textRight={`${a75paret} ${msg.pluralize('units', a75paret)}`} /> || null}
              {a75rodes && <TableRow textLeft={`${msg.p75rodes}:`} textRight={`${a75rodes} ${msg.pluralize('units', a75rodes)}`} /> || null}
              {a65paret && <TableRow textLeft={`${msg.p65paret}:`} textRight={`${a65paret} ${msg.pluralize('units', a65paret)}`} /> || null}
              {a65rodes && <TableRow textLeft={`${msg.p65rodes}:`} textRight={`${a65rodes} ${msg.pluralize('units', a65rodes)}`} /> || null}
              {srFixes && <TableRow textLeft={`${msg.srFixes}:`} textRight={`${srFixes} ${msg.pluralize('units', srFixes)}`} /> || null}
              {srRodes && <TableRow textLeft={`${msg.srRodes}:`} textRight={`${srRodes} ${msg.pluralize('units', srRodes)}`} /> || null}
            </View>
            || null}
          {totalComplements && <Text style={styles.subtitle}>{msg.pdfComplementsTitle}</Text> || null}
          {totalComplements &&
            <View style={styles.table}>
              {armGrans && <TableRow textLeft={`${msg.armGrans}:`} textRight={`${armGrans} ${msg.pluralize('units', armGrans)}`} /> || null}
              {armPetits && <TableRow textLeft={`${msg.armPetits}:`} textRight={`${armPetits} ${msg.pluralize('units', armPetits)}`} /> || null}
              {tablets && <TableRow textLeft={`${msg.tablets}:`} textRight={`${tablets} ${msg.pluralize('units', tablets)}`} /> || null}
              {visDoc && <TableRow textLeft={`${msg.visDoc}:`} textRight={`${visDoc} ${msg.pluralize('units', visDoc)}`} /> || null}
              {altaveus && <TableRow textLeft={`${msg.altaveus}:`} textRight={`${altaveus} ${msg.pluralize('units', altaveus)}`} /> || null}
            </View>
            || null}
          {comentaris && <>
            <Text style={styles.subtitle}>{msg.pdfObservacionsTitle}</Text>
            <Text style={styles.line}>{comentaris}</Text>
          </> || null}
          <Text style={[styles.subtitle, { marginTop: 40 }]}>{msg.pdfSignTitle}</Text>
        </View>
        <View style={styles.footer} fixed>
          <Text style={styles.lineFooter}>Finançat per:</Text>
          <Image style={styles.imgFooter} src={logosMRR} />
        </View>
      </Page>
    </Document >
  );
}

export function PDFDocumentVithViewer({ settings, schoolData, setSchoolData, handleNext, handleBack, width = '100%', height = 1100 }) {
  const { msg } = settings;
  const { resposta } = schoolData;

  const docElement = <PDFDocument {...{ schoolData, settings }} />;

  const downloadPDFDocument = async () => {
    const blob = await pdf((docElement)).toBlob();
    saveAs(blob, settings.msg.replace('PDFFileName', { CODI: schoolData.actual.id }));
    setSchoolData({ ...schoolData, resposta: { ...resposta, estat: 'DESCARREGAT' } }, true);
    handleNext();
  }

  return (
    <Card sx={{ my: 2, p: 2 }}>
      <CardHeader title={msg.printPdf} />
      <CardContent>
        <PDFViewer {...{ width, height }}>{docElement}</PDFViewer>
      </CardContent>
      <CardActions sx={{ mt: 2, justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={handleBack} startIcon={<ArrowBackIcon />}>{msg.back}</Button>
        <Button variant="contained" onClick={downloadPDFDocument} startIcon={<DownloadIcon />}>{msg.downloadPDF}</Button>
        {/* <Button variant="outlined" onClick={handleNext} endIcon={<ArrowForwardIcon />}>{msg.next}</Button> */}
      </CardActions>
    </Card>
  );
}