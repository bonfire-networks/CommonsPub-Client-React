import React from 'react';
import { Context } from 'react';
import { action } from '@storybook/addon-actions';
import { Service } from '../../types';

export const StorybookAsyncServiceMockProviderDeco = <Vals, Resp>(
  name: string,
  context: Context<Service<Vals, Resp>>,
  resp: Resp,
  ms = 1000
) => getStory => (
  <context.Provider
    value={(...args) => {
      action(`${name}: calling`)(...args);
      return new Promise(resolve =>
        setTimeout(() => {
          action(`${name}: done`)(resp);
          resolve(resp);
        }, ms)
      );
    }}
  >
    {getStory()}
  </context.Provider>
);
