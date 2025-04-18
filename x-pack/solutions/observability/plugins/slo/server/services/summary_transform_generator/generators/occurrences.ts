/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { TransformPutTransformRequest } from '@elastic/elasticsearch/lib/api/types';
import { calendarAlignedTimeWindowSchema, DurationUnit } from '@kbn/slo-schema';
import {
  getSLOSummaryPipelineId,
  getSLOSummaryTransformId,
  SLI_DESTINATION_INDEX_NAME,
  SLO_RESOURCES_VERSION,
  SUMMARY_DESTINATION_INDEX_NAME,
} from '../../../../common/constants';
import { SLODefinition } from '../../../domain/models';
import { getGroupBy } from './common';
import { buildBurnRateAgg } from './utils';

export function generateSummaryTransformForOccurrences(
  slo: SLODefinition
): TransformPutTransformRequest {
  const isCalendarAligned = calendarAlignedTimeWindowSchema.is(slo.timeWindow);
  let isWeeklyAligned = false;
  if (isCalendarAligned) {
    isWeeklyAligned = slo.timeWindow.duration.unit === DurationUnit.Week;
  }

  const rangeLowerBound = isCalendarAligned
    ? isWeeklyAligned
      ? 'now/w'
      : 'now/M'
    : `now-${slo.timeWindow.duration.format()}/m`;

  return {
    transform_id: getSLOSummaryTransformId(slo.id, slo.revision),
    dest: {
      pipeline: getSLOSummaryPipelineId(slo.id, slo.revision),
      index: SUMMARY_DESTINATION_INDEX_NAME,
    },
    source: {
      index: `${SLI_DESTINATION_INDEX_NAME}*`,
      query: {
        bool: {
          filter: [
            {
              range: {
                '@timestamp': {
                  gte: rangeLowerBound,
                  lte: 'now/m',
                },
              },
            },
            {
              term: {
                'slo.id': slo.id,
              },
            },
            {
              term: {
                'slo.revision': slo.revision,
              },
            },
          ],
        },
      },
    },
    pivot: {
      group_by: getGroupBy(slo),
      aggregations: {
        goodEvents: {
          sum: {
            field: 'slo.numerator',
          },
        },
        totalEvents: {
          sum: {
            field: 'slo.denominator',
          },
        },
        sliValue: {
          bucket_script: {
            buckets_path: {
              goodEvents: 'goodEvents',
              totalEvents: 'totalEvents',
            },
            script:
              'if (params.totalEvents == 0) { return -1 } else if (params.goodEvents >= params.totalEvents) { return 1 } else { return params.goodEvents / params.totalEvents }',
          },
        },
        errorBudgetInitial: {
          bucket_script: {
            buckets_path: {},
            script: `1 - ${slo.objective.target}`,
          },
        },
        errorBudgetConsumed: {
          bucket_script: {
            buckets_path: {
              sliValue: 'sliValue',
              errorBudgetInitial: 'errorBudgetInitial',
            },
            script:
              'if (params.sliValue == -1) { return 0 } else { return (1 - params.sliValue) / params.errorBudgetInitial }',
          },
        },
        errorBudgetRemaining: {
          bucket_script: {
            buckets_path: {
              errorBudgetConsumed: 'errorBudgetConsumed',
            },
            script: '1 - params.errorBudgetConsumed',
          },
        },
        statusCode: {
          bucket_script: {
            buckets_path: {
              sliValue: 'sliValue',
              errorBudgetRemaining: 'errorBudgetRemaining',
            },
            script: {
              source: `if (params.sliValue == -1) { return 0 } else if (params.sliValue >= ${slo.objective.target}) { return 4 } else if (params.errorBudgetRemaining > 0) { return 2 } else { return 1 }`,
            },
          },
        },
        latestSliTimestamp: {
          max: {
            field: '@timestamp',
          },
        },
        ...buildBurnRateAgg('fiveMinuteBurnRate', slo),
        ...buildBurnRateAgg('oneHourBurnRate', slo),
        ...buildBurnRateAgg('oneDayBurnRate', slo),
      },
    },
    description: `Summarise the rollup data of SLO: ${slo.name} [id: ${slo.id}, revision: ${slo.revision}].`,
    frequency: '1m',
    sync: {
      time: {
        field: 'event.ingested',
        delay: '65s',
      },
    },
    settings: {
      deduce_mappings: false,
      unattended: true,
    },
    defer_validation: true,
    _meta: {
      version: SLO_RESOURCES_VERSION,
      managed: true,
      managed_by: 'observability',
    },
  };
}
