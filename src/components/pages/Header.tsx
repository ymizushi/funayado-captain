import React, { PropsWithChildren } from "react";
import styles from "styles/components/pages/Header.module.css";

export function Header(props: PropsWithChildren) {
  return (
    <header className={styles.header}>
      <div className={styles.headerTextDiv}>{props.children}</div>
    </header>
  );
}
