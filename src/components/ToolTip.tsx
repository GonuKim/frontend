import React, { ReactNode } from "react";
import styles from "../css/Tooltip.module.css";

interface TooltipProps {
  text: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className={styles.tooltip_container}>
      {children}
      <pre className={styles.tooltip}>{text}</pre>
    </div>
  );
};

export default Tooltip;
