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
import cookie, { type Cookie as ParsedCookie } from 'simple-cookie';

/**
 * Internal dependencies.
 */
import type { CookieData } from '../localStore';
import type {
  CookieAnalytics,
  CookieDatabase,
} from '../utils/fetchCookieDictionary';

/**
 *
 * @param {string} wildcard  Wildcard cookie name.
 * @param {string} str cookie name to be matched.
 * @returns {boolean} Flag for match
 */
const wildTest = (wildcard: string, str: string): boolean => {
  const regExp = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&'); // regexp escape
  const result = new RegExp(
    `^${regExp.replace(/\*/g, '.*').replace(/\?/g, '.')}$`,
    'i'
  );
  return result.test(str); // remove last 'i' above to have case sensitive
};

const findAnalyticsMatch = (
  key: string,
  dictionary: CookieDatabase
): CookieAnalytics | null => {
  let analytics: CookieAnalytics | null = null;
  Object.keys(dictionary).every((dictionaryKey) => {
    if (key === dictionaryKey) {
      analytics = dictionary[dictionaryKey][0];
      return false;
    } else if (dictionaryKey.includes('*') && wildTest(dictionaryKey, key)) {
      analytics = dictionary[dictionaryKey][0];

      return false;
    } else {
      return true;
    }
  });

  return analytics;
};

/**
 * Parse response cookies header.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
 * @param {string} url Cookie URL (URL of the server which is setting/updating cookies).
 * @param {string} value header value
 * @param {CookieDatabase} dictionary Dictionary from open cookie database
 * @returns {CookieData} Parsed cookie object.
 */
const parseResponseCookieHeader = (
  url: string,
  value: string,
  dictionary: CookieDatabase
): CookieData => {
  const parsedCookie: ParsedCookie = cookie.parse(value);

  let analytics: CookieAnalytics | null = null;

  if (dictionary) {
    analytics = findAnalyticsMatch(parsedCookie.name, dictionary);
  }

  return {
    parsedCookie: parsedCookie,
    analytics,
    url,
    headerType: 'response',
  };
};

export default parseResponseCookieHeader;
