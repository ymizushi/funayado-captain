import React, { PropsWithChildren, Ref } from "react";

import classNames from "classnames";
import styles from "styles/components/layout/VStack.module.css";

export function VStack(props: PropsWithChildren) {
  return <div className={classNames(styles.div)}>{props.children}</div>;
}

export function VStackChildren(props: PropsWithChildren) {
  return <div className={classNames(styles.childDiv)}>{props.children}</div>;
}
