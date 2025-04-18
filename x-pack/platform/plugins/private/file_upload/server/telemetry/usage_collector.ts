/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreSetup } from '@kbn/core/server';

import type { UsageCollectionSetup } from '@kbn/usage-collection-plugin/server';
import type { Telemetry } from './telemetry';
import { getTelemetry, initTelemetry } from './telemetry';
import { telemetryMappingsType } from './mappings';
import { getInternalRepository, setInternalRepository } from './internal_repository';

export function initFileUploadTelemetry(
  coreSetup: CoreSetup,
  usageCollection: UsageCollectionSetup
) {
  coreSetup.savedObjects.registerType(telemetryMappingsType);
  registerUsageCollector(usageCollection);
  void coreSetup.getStartServices().then(([core]) => {
    setInternalRepository(core.savedObjects.createInternalRepository);
  });
}

function registerUsageCollector(usageCollectionSetup: UsageCollectionSetup): void {
  const usageCollector = usageCollectionSetup.makeUsageCollector<Telemetry>({
    type: 'fileUpload',
    isReady: () => true,
    schema: {
      file_upload: {
        index_creation_count: { type: 'long' },
      },
    },
    fetch: async () => {
      const mlUsage = await getTelemetry(getInternalRepository()!);
      if (!mlUsage) {
        return initTelemetry();
      }

      return mlUsage;
    },
  });

  usageCollectionSetup.registerCollector(usageCollector);
}
