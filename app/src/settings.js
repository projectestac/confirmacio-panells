/*!
 *  File    : settings.js
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

/* global process */

import { useRef } from 'react';
import { loadGoogleFont } from './utils';
import { initAssets } from './assets';

export const mainFont = ['Roboto', 'Arial', '"sans-serif"'].join(',');
export const titleFont = ['"Open Sans"', 'Arial', '"sans-serif"'].join(',');
export function initFonts({ alreadyLoadedFonts = '' }) {
  const fontsList = new Set(alreadyLoadedFonts.split(','));
  if (!fontsList.has('Roboto'))
    loadGoogleFont('Roboto', '300,400,500,700');
  if (!fontsList.has('Open Sans'))
    loadGoogleFont('Open Sans', '400,700');
}

export const DEFAULT_THEME = {
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#fbc02d' },
  },
  typography: {
    fontFamily: mainFont,
    fontDisplay: 'swap', // Fa res???
    h1: {
      fontFamily: titleFont,
      fontWeight: 700,
      fontSize: '3rem',
    },
    h2: {
      fontFamily: titleFont,
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontFamily: titleFont,
      fontWeight: 700,
      fontSize: '1.5rem',
      marginBottom: '0.6rem',
    },
    body1: {
      fontFamily: mainFont,
    },
    body3: {
      fontFamily: mainFont,
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle1: {
      lineHeight: 'normal',
    }
  },
  components: {
    'MuiStepLabel': {
      styleOverrides: {
        label: {
          fontSize: '1.3rem',
          '&.Mui-disabled': {
            color: '#1976d2',
            fontWeight: 500,
          }
        },
      }
    },
    'MuiTablePagination': {
      styleOverrides: {
        spacer: {
          display: 'none',
        },
        toolbar: {
          flexFlow: 'wrap',
          paddingLeft: '0 !important',
        },
      }
    }
  },
};

// See `.env.example` for example settings
export const DEFAULT_SETTINGS = {
  // Messages and other assets
  ...initAssets(),
  // Current theme
  theme: DEFAULT_THEME,
  // When `true`, debug messages should be displayed on the console
  debug: process.env.DEBUG === 'true',
  // Google OAuth2 API id
  googleOAuth2Id: process.env.GOOGLE_OAUTH2_ID,
  // API base
  apiEndPoint: process.env.API_ENDPOINT,
  // Key used to store credentials in browser session
  authKey: process.env.AUTH_KEY,
  // Array of names of fonts already loaded by the container page
  alreadyLoadedFonts: process.env.alreadyLoadedFonts || '',
  // Runing as custom web component
  isWebComponent: false,
  // Test school data, used for debugging purposes
  testSchoolData: process.env.TEST_SCHOOL_DATA ? JSON.parse(process.env.TEST_SCHOOL_DATA) : null,
  // Keys for complementary elements
  elementKeys: ['armGrans', 'armPetits', 'tablets', 'visDoc', 'altaveus'],
  // Credits required for each complementary element
  creditsPerElement: process.env.CREDITS_PER_ELEMENT ? JSON.parse(process.env.CREDITS_PER_ELEMENT) : { armGrans: 100, armPetits: 70, tablets: 25, visDoc: 70, altaveus: 30 },
};

export function useSettings(settings = DEFAULT_SETTINGS) {

  // Add a reference to the root component in settings
  settings.rootRef = useRef();

  // Add a function to calculate the amount of credits spent
  settings.calcCreditsSpent = (base) => settings.elementKeys.reduce((acc, k) => acc + settings.creditsPerElement[k] * base[k], 0);

  return settings;
}

export default useSettings;
