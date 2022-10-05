import React, { PropsWithChildren }  from "react";
import classNames from 'classnames'

import styles from '../../../styles/Components/text/Text.module.css'

type TextSize = 'small'
type TextType = 'sub'

type TextProps = PropsWithChildren & {
  size?: TextSize
  type?: TextType
}

export function Text({children, size, type}: TextProps) {
  return <span className={classNames(...['span', size, type].filter(v => !!v).map(v => v && styles[v]))}>
    {children}
  </span>
}
