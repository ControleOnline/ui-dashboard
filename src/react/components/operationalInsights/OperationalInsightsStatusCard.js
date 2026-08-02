import React from 'react';
import {ReportCardShell} from './shared';

const OperationalInsightsStatusCard = ({
  ppcColors = {},
  title = '',
  subtitle = '',
  message = '',
  loading = false,
  accentColor = '',
  iconName = 'alert-circle-outline',
  style = null,
}) => (
  <ReportCardShell
    ppcColors={ppcColors}
    accentColor={accentColor}
    title={title}
    subtitle={subtitle}
    iconName={iconName}
    loading={loading}
    message={message}
    style={style}
  />
);

export default OperationalInsightsStatusCard;

