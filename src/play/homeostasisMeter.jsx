import React from 'react';

export function HomeostasisMeter({ value }) {
  const className = value < 30 ? 'homeostasis critical' : 'homeostasis';
  return <div className={className}>Homeostasis: {value}%</div>;
}
