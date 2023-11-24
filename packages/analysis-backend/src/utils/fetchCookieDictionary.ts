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
import fs from 'fs/promises';
import path from 'path';
import { CookieDatabase } from '@ps-analysis-tool/analysis-utils';

/**
 * Fetch dictionary from local data folder.
 * @returns {Promise<CookieDatabase>} Open Cookie Data base
 */
async function fetchDictionary(): Promise<CookieDatabase> {
  const data = JSON.parse(
    await fs.readFile(
      path.resolve('./third_party/data/open-cookie-database.json'),
      { encoding: 'utf8' }
    )
  );

  return data;
}

export default fetchDictionary;
