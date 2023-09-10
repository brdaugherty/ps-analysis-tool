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
const addFrameOverlay = (selectedFrame: string) => {
  const iframes = document.querySelectorAll('iframe');

  // Iterate through each iframe and check its src attribute
  for (const iframe of iframes) {
    const src = iframe.getAttribute('src');

    if (src && src.startsWith(selectedFrame)) {
      iframe.style.border = '5px solid red';
      iframe.style.boxShadow = '1px 5px 10px';

      iframe.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    } else {
      iframe.style.border = '';
      iframe.style.boxShadow = '';
    }
  }
};

export default addFrameOverlay;
