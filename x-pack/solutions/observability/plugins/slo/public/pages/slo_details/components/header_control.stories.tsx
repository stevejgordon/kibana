/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ComponentStory } from '@storybook/react';
import React from 'react';
import { buildSlo } from '../../../data/slo/slo';
import { KibanaReactStorybookDecorator } from '../../../utils/kibana_react.storybook_decorator';
import { HeaderControl as Component, Props } from './header_control';

export default {
  component: Component,
  title: 'app/SLO/DetailsPage/HeaderControl',
  decorators: [KibanaReactStorybookDecorator],
};

const Template: ComponentStory<typeof Component> = (props: Props) => <Component {...props} />;

const defaultProps: Props = {
  slo: buildSlo(),
};

export const Default = Template.bind({});
Default.args = defaultProps;

export const WithLoading = Template.bind({});
WithLoading.args = { slo: undefined };
