import React, { PropsWithChildren } from "react";

import styles from "styles/components/layout/TwoColumnComponent.module.css";

export function TwoColumnComponent(props: PropsWithChildren) {
  return <div className={styles.twoColumnComponent}>{props.children}</div>;
}

export function FirstColumn(props: PropsWithChildren) {
  return <div className={styles.firstColumn}>{props.children}</div>;
}

export function SecondColumn(props: PropsWithChildren) {
  return <div className={styles.secondColumn}>{props.children}</div>;
}
