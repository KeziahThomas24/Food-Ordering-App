import React, { ReactNode } from "react";

type SuccessBoxProps = {
  children: ReactNode;
};

const SuccessBox: React.FC<SuccessBoxProps> = ({ children }: SuccessBoxProps) => {
  return (
    <div className="text-center bg-green-100 p-4 rounded-lg border border-green-300">
      {children}
    </div>
  );
};

export default SuccessBox;
