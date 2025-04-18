/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Filter } from '@kbn/es-query';
import { i18n } from '@kbn/i18n';
import {
  ALERT_STATUS_ACTIVE,
  ALERT_STATUS_RECOVERED,
  ALERT_STATUS_UNTRACKED,
  ALERT_STATUS,
} from '@kbn/rule-data-utils';
import { AlertStatusFilter } from '../../../common/typings';
import { ALERT_STATUS_ALL } from '../../../common/constants';

export const EMPTY_FILTERS: Filter[] = [];
export const DEFAULT_QUERY_STRING = '';

export const ALL_ALERTS: AlertStatusFilter = {
  status: ALERT_STATUS_ALL,
  query: '',
  filter: [],
  label: i18n.translate('xpack.observability.alerts.alertStatusFilter.showAll', {
    defaultMessage: 'Show all',
  }),
};

export const ACTIVE_ALERTS: AlertStatusFilter = {
  status: ALERT_STATUS_ACTIVE,
  query: `${ALERT_STATUS}: "${ALERT_STATUS_ACTIVE}"`,
  filter: [
    {
      query: {
        match_phrase: {
          [ALERT_STATUS]: ALERT_STATUS_ACTIVE,
        },
      },
      meta: {},
    },
  ],
  label: i18n.translate('xpack.observability.alerts.alertStatusFilter.active', {
    defaultMessage: 'Active',
  }),
};

export const RECOVERED_ALERTS: AlertStatusFilter = {
  status: ALERT_STATUS_RECOVERED,
  query: `${ALERT_STATUS}: "${ALERT_STATUS_RECOVERED}"`,
  filter: [
    {
      query: {
        match_phrase: {
          [ALERT_STATUS]: ALERT_STATUS_RECOVERED,
        },
      },
      meta: {},
    },
  ],
  label: i18n.translate('xpack.observability.alerts.alertStatusFilter.recovered', {
    defaultMessage: 'Recovered',
  }),
};

export const UNTRACKED_ALERTS: AlertStatusFilter = {
  status: ALERT_STATUS_UNTRACKED,
  query: `${ALERT_STATUS}: "${ALERT_STATUS_UNTRACKED}"`,
  filter: [
    {
      query: {
        match_phrase: {
          [ALERT_STATUS]: ALERT_STATUS_UNTRACKED,
        },
      },
      meta: {},
    },
  ],
  label: i18n.translate('xpack.observability.alerts.alertStatusFilter.untracked', {
    defaultMessage: 'Untracked',
  }),
};

export const ALERT_STATUS_QUERY = {
  [ACTIVE_ALERTS.status]: ACTIVE_ALERTS.query,
  [RECOVERED_ALERTS.status]: RECOVERED_ALERTS.query,
  [UNTRACKED_ALERTS.status]: UNTRACKED_ALERTS.query,
};

export const ALERT_STATUS_FILTER = {
  [ACTIVE_ALERTS.status]: ACTIVE_ALERTS.filter,
  [RECOVERED_ALERTS.status]: RECOVERED_ALERTS.filter,
  [UNTRACKED_ALERTS.status]: UNTRACKED_ALERTS.filter,
};
