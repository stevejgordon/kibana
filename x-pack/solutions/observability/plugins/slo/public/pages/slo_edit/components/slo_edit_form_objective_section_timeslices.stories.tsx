/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import type { StoryFn } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';

import { KibanaReactStorybookDecorator } from '../../../utils/kibana_react.storybook_decorator';
import { SloEditFormObjectiveSectionTimeslices as Component } from './slo_edit_form_objective_section_timeslices';
import { SLO_EDIT_FORM_DEFAULT_VALUES } from '../constants';

export default {
  component: Component,
  title: 'app/SLO/EditPage/SloEditFormObjectiveSectionTimeslices',
  decorators: [KibanaReactStorybookDecorator],
};

const Template: StoryFn<typeof Component> = () => {
  const methods = useForm({ defaultValues: SLO_EDIT_FORM_DEFAULT_VALUES });
  return (
    <FormProvider {...methods}>
      <Component />
    </FormProvider>
  );
};

const defaultProps = {};

export const SloEditFormObjectivesTimeslices = {
  render: Template,
  args: defaultProps,
};
