/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { Render } from '@kbn/presentation-util-plugin/public/__stories__';
import { from } from 'rxjs';
import { tagcloudRenderer } from '../expression_renderers';
import { TagcloudRendererConfig } from '../../common/types';
import { ScaleOptions, Orientation } from '../../common/constants';
import { palettes } from '../__mocks__/palettes';
import { ExpressionTagcloudRendererDependencies } from '../plugin';

const config: TagcloudRendererConfig = {
  visType: 'tagcloud',
  visData: {
    type: 'datatable',
    rows: [
      { country: 'US', Count: 14 },
      { country: 'JP', Count: 13 },
      { country: 'UK', Count: 13 },
      { country: 'CN', Count: 8 },
      { country: 'TZ', Count: 14 },
      { country: 'NL', Count: 11 },
      { country: 'AZ', Count: 14 },
      { country: 'BR', Count: 11 },
      { country: 'DE', Count: 16 },
      { country: 'SA', Count: 11 },
      { country: 'RU', Count: 9 },
      { country: 'IN', Count: 9 },
      { country: 'PH', Count: 7 },
    ],
    columns: [
      { id: 'country', name: 'country', meta: { type: 'string' } },
      { id: 'Count', name: 'Count', meta: { type: 'number' } },
    ],
  },
  visParams: {
    scale: ScaleOptions.LINEAR,
    orientation: Orientation.SINGLE,
    minFontSize: 18,
    maxFontSize: 72,
    showLabel: true,
    metric: {
      type: 'vis_dimension',
      accessor: { id: 'Count', name: 'Count', meta: { type: 'number' } },
      format: { id: 'string', params: {} },
    },
    bucket: {
      type: 'vis_dimension',
      accessor: { id: 'country', name: 'country', meta: { type: 'string' } },
      format: { id: 'string', params: {} },
    },
    palette: { type: 'palette', name: 'default' },
    isPreview: false,
  },
  syncColors: false,
};

const containerSize = {
  width: '700px',
  height: '700px',
};

const getStartDeps = (() => ({
  core: {
    theme: {
      theme$: from([{ darkMode: false }]),
    },
  },
  plugins: {
    charts: {
      palettes,
    },
  },
})) as ExpressionTagcloudRendererDependencies['getStartDeps'];

export default {
  title: 'renderers/tag_cloud_vis',
};

export const Default = () => {
  return (
    <Render
      renderer={() => tagcloudRenderer({ getStartDeps })}
      config={config}
      {...containerSize}
    />
  );
};

export const WithLogScale = {
  render: () => {
    return (
      <Render
        renderer={() => tagcloudRenderer({ getStartDeps })}
        config={{ ...config, visParams: { ...config.visParams, scale: ScaleOptions.LOG } }}
        {...containerSize}
      />
    );
  },

  name: 'With log scale',
};

export const WithSquareRootScale = {
  render: () => {
    return (
      <Render
        renderer={() => tagcloudRenderer({ getStartDeps })}
        config={{ ...config, visParams: { ...config.visParams, scale: ScaleOptions.SQUARE_ROOT } }}
        {...containerSize}
      />
    );
  },

  name: 'With square root scale',
};

export const WithRightAngledOrientation = {
  render: () => {
    return (
      <Render
        renderer={() => tagcloudRenderer({ getStartDeps })}
        config={{
          ...config,
          visParams: { ...config.visParams, orientation: Orientation.RIGHT_ANGLED },
        }}
        {...containerSize}
      />
    );
  },

  name: 'With right angled orientation',
};

export const WithMultipleOrientations = {
  render: () => {
    return (
      <Render
        renderer={() => tagcloudRenderer({ getStartDeps })}
        config={{
          ...config,
          visParams: { ...config.visParams, orientation: Orientation.MULTIPLE },
        }}
        {...containerSize}
      />
    );
  },

  name: 'With multiple orientations',
};

export const WithHiddenLabel = {
  render: () => {
    return (
      <Render
        renderer={() => tagcloudRenderer({ getStartDeps })}
        config={{ ...config, visParams: { ...config.visParams, showLabel: false } }}
        {...containerSize}
      />
    );
  },

  name: 'With hidden label',
};

export const WithEmptyResults = {
  render: () => {
    return (
      <Render
        renderer={() => tagcloudRenderer({ getStartDeps })}
        config={{ ...config, visData: { ...config.visData, rows: [] } }}
        {...containerSize}
      />
    );
  },

  name: 'With empty results',
};
