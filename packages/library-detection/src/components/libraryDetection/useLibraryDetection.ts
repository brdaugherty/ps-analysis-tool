/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies.
 */
import { useState, useCallback, useEffect } from 'react';

/**
 * Internal dependencies.
 */
import {
  generateGSIV2Matches,
  generateGsiReportingData,
  getAllLoadedScripts,
  populateContentFromResource,
} from '../../utils';
import { detectMatchingSignatures, sumUpDetectionResults } from '../../core';
import type { LibraryData } from '../../types';

const useLibraryDetection = () => {
  const initialState: LibraryData = {
    gis: {
      signatureMatches: 0,
      matches: [],
    },
    gsiV2: {
      signatureMatches: 0,
      moduleMatch: 0,
      matches: [],
    },
  };

  const [libraryMatches, setLibraryMatches] = useState(initialState);

  const generateDisplayData = useCallback(() => {
    const gisMatches =
      libraryMatches.gis.signatureMatches === 0
        ? []
        : libraryMatches.gis.matches;

    const gsiMatches = generateGSIV2Matches(
      libraryMatches.gsiV2.signatureMatches,
      libraryMatches.gsiV2.matches,
      libraryMatches.gsiV2.moduleMatch
    );

    return generateGsiReportingData(gisMatches, gsiMatches);
  }, [libraryMatches]);

  const invokeGSIdetection = useCallback(async () => {
    const detectMatchingSignaturesv1Results = detectMatchingSignatures(
      await getAllLoadedScripts()
    );

    setLibraryMatches(detectMatchingSignaturesv1Results);

    chrome.devtools.inspectedWindow.onResourceAdded.addListener(
      async (resource) => {
        const realtimeComputationResult = detectMatchingSignatures(
          await populateContentFromResource([resource])
        );
        if (
          realtimeComputationResult.gis.matches.length !== 0 ||
          realtimeComputationResult.gsiV2.matches.length !== 0
        ) {
          const newResult = sumUpDetectionResults(
            libraryMatches,
            realtimeComputationResult
          );
          setLibraryMatches(newResult);
        }
      }
    );
  }, [libraryMatches]);

  useEffect(() => {
    invokeGSIdetection();
  }, [invokeGSIdetection]);

  return {
    generateDisplayData,
  };
};

export default useLibraryDetection;
