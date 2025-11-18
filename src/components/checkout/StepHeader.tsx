// src/components/checkout/StepHeader.tsx
import React from "react";

const StepHeader: React.FC<{ title: string; stepIndex: number; canChange?: boolean; onChange?: () => void }> = ({
  title,
  stepIndex,
  canChange = false,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold">{`Step ${stepIndex + 1}`}</div>
        <div className="text-lg font-semibold">{title}</div>
      </div>

      <div>
        {canChange && (
          <button onClick={onChange} className="px-3 py-1 border rounded text-sm">
            Change
          </button>
        )}
      </div>
    </div>
  );
};

export default StepHeader;
