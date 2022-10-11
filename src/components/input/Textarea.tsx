import React, { PropsWithChildren } from "react";

import styles from "styles/components/input/Textarea.module.css";

type Props = PropsWithChildren<{
  value: string;
}>;

export function Textarea(props: Props) {
  return (
    <textarea
      readOnly
      className={styles.textarea}
      value={props.value}
      rows={6}
    />
  );
}
