/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { Observable } from 'rxjs';
import { EsQueryConfig } from '@kbn/es-query';
import { SharedGlobalConfig } from '@kbn/core/server';
import type { IRouter, IUiSettingsClient, KibanaRequest } from '@kbn/core/server';
import type { DataViewsService } from '@kbn/data-views-plugin/common';
import type { DataRequestHandlerContext } from '@kbn/data-plugin/server';
import type { FieldFormatsRegistry } from '@kbn/field-formats-plugin/common';
import type { Series, VisPayload } from '../common/types';
import type { SearchStrategyRegistry } from './lib/search_strategies';
import type { CachedIndexPatternFetcher } from './lib/search_strategies/lib/cached_index_pattern_fetcher';
import type { FetchedIndexPattern } from '../common/types';

export type ConfigObservable = Observable<SharedGlobalConfig>;

export type VisTypeTimeseriesRequestHandlerContext = DataRequestHandlerContext;
export type VisTypeTimeseriesRouter = IRouter<VisTypeTimeseriesRequestHandlerContext>;
export type VisTypeTimeseriesVisDataRequest = KibanaRequest<{}, {}, VisPayload>;
export type VisTypeTimeseriesFieldsRequest = KibanaRequest<{}, { index: string }, any>;
export type VisTypeTimeseriesRequest =
  | VisTypeTimeseriesFieldsRequest
  | VisTypeTimeseriesVisDataRequest;

export interface VisTypeTimeseriesRequestServices {
  esShardTimeout: number;
  esQueryConfig: EsQueryConfig;
  uiSettings: IUiSettingsClient;
  indexPatternsService: DataViewsService;
  searchStrategyRegistry: SearchStrategyRegistry;
  cachedIndexPatternFetcher: CachedIndexPatternFetcher;
  fieldFormatService: FieldFormatsRegistry;
  buildSeriesMetaParams: (
    index: FetchedIndexPattern,
    useKibanaIndexes: boolean,
    series?: Series
  ) => Promise<{
    maxBars: number;
    timeField?: string;
    interval: string;
  }>;
}
