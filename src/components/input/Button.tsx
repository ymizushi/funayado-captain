import classNames from "classnames";
import React, { PropsWithChildren } from "react";
import styles from "styles/components/input/Button.module.css";

type Props = PropsWithChildren & {
  onClick: () => Promise<void>;
  disabled?: boolean;
};

export function Button({ onClick, disabled, children }: Props) {
  return (
    <button className={styles.button} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function LargeButton({ onClick, disabled, children }: Props) {
  return (
    <button
      className={classNames(styles.button, styles.buttonLarge)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
