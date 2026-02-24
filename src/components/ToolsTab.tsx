import React from 'react';
import { SealRingCalculator } from './ui/valve-form';
import { BearingPositionCalculator } from './tools/bearing-position-calculator';
import { IsoToleranceCalculator } from './tools/iso-tolerance-calculator';
import { ValveLockWeldCalculator } from './tools/valve-lock-weld-calculator';
import { IcvClampingRingCalculator } from './tools/icv-clamping-ring-calculator';

export const ToolsTab: React.FC = () => {
  return (
    <div className="tools-page">
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <h2>Calculators</h2><div className="line"></div>
        <span className="tag tag--muted" style={{ whiteSpace: 'nowrap' }}>5 tools</span>
      </div>
      <div className="tools-grid" style={{ marginBottom: '32px' }}>

        {/* Active Tool: Seal Ring OD Calculator */}
        <SealRingCalculator />

        {/* Active Tool: Valve Lock Weld Calculator */}
        <ValveLockWeldCalculator />

        {/* Active Tool: ICV Clamping Ring Calculator */}
        <IcvClampingRingCalculator />

        {/* Active Tool: Bearing Position Calculator */}
        <BearingPositionCalculator />

        {/* Active Tool: ISO Tolerance Calculator */}
        <IsoToleranceCalculator />

      </div>
    </div>
  );
};
