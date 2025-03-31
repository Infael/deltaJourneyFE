import { FC } from "react";
import { Paragraph } from "../paragraph";

import styles from "./spinner.module.css";

interface SpinnerProps {
  text?: string;
}

export const Spinner: FC<SpinnerProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <svg className={styles.spinner} width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <polygon points="25,10 45,45 5,45" fill="#ffdc58" stroke="#000" strokeWidth="2" />
      </svg>
      {text && <Paragraph>{text}</Paragraph>}
    </div>
  );
};
