import styles from './button.module.scss'

/**
 * Represents the properties of a button component
 */
export interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: string
  className?: string
  style?: React.CSSProperties
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
}

/**
 * A button component inspired by native Figma buttons
 * @param props A list of button properties
 * @returns The button component
 */
export default function Button(props: ButtonProps) {
  return <button
    type={props.type ?? 'button'}
    onClick={props.onClick}
    className={styles.button + (props.className ? ' ' + props.className : '')}
    style={props.style}
  >
    {props.children ?? 'Button'}
  </button>
}