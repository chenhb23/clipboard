import React from 'react'
import './Icon.css'

export type IconProps = {
  iconName: IconName
  gutter?: number
} & JSX.IntrinsicElements['svg']

export const Icon: React.FC<IconProps> = ({iconName, className = '', gutter, ...props}) => {
  return (
    <svg
      className={`icon ${iconName === 'loading' ? iconName : ''} ${className}`}
      style={{marginRight: gutter}}
      aria-hidden='true'
      {...props}
    >
      <use href={`#icon-${iconName}`} />
    </svg>
  )
}

Icon.defaultProps = {
  gutter: 5,
}

export type IconName = string
// | string
