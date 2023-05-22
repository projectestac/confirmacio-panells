/*!
 *  File    : DOMRenderer.js
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

import React from "react";
import { createRoot } from "react-dom/client";
import createCache from '@emotion/cache';
import { parseStringSettings } from './utils';
import MainLayout from "./components/MainLayout";
import Main from "./components/Main";

/**
 * Renders the required component (main repository or user library) on a specific DOM component 
 * @param {HTMLElement} root - The DOM element where the requested component will be rendered
 * @param {string*} type - Type of component to be rendered. Can be 'repo' (default) or 'user'
 */
export default function DOMRenderer(rootElement) {

  const dataSettings = parseStringSettings(rootElement.dataset);
  const Component = Main;
  const cache = createCache({ key: 'css', prepend: true });
  const root = createRoot(rootElement);
  root.render(<MainLayout {...{ cache, dataSettings, Component }} />);
}
