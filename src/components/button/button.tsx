import React, { Children } from 'react'
import classNames from 'classnames'
import { ConfigContext } from '../config-provider';
import { tuple } from '../../util/type'

function isUnborderedButtonType(type: ButtonType | undefined) {
  return type === 'text' || type === 'link';
}

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);

export type SizeType = 'small' | 'middle' | 'large' | undefined;

const ButtonTypes = tuple('default', 'primary', 'ghost', 'dashed', 'link', 'text')
export type ButtonType = typeof ButtonTypes[number]
const ButtonShapes = tuple('circle', 'round');
export type ButtonShape = typeof ButtonShapes[number];
const ButtonHTMLTypes = tuple('submit', 'button', 'reset');
export type ButtonHTMLType = typeof ButtonHTMLTypes[number];

export interface BaseButtonProps {
  type?: ButtonType
  icon?: React.ReactNode
  shape?: ButtonShape;
  size?: SizeType;
  loading?: boolean | { delay?: number };
  prefixCls?: string;
  className?: string;
  ghost?: boolean;
  danger?: boolean;
  block?: boolean;
  children?: React.ReactNode;
}

export type AnchorButtonProps = {
  href: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<any>, 'type' | 'onClick'>;

export type NativeButtonProps = {
  htmlType?: ButtonHTMLType;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>;

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;

interface CompoundedComponent
  extends React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLElement>> {
  __ANT_BUTTON: boolean;
}
const InternalButton: React.ForwardRefRenderFunction<unknown, ButtonProps> = (props, ref) => {
  
  const {
    loading = false,
    prefixCls: customizePrefixCls,
    type,
    danger,
    shape,
    size: customizeSize,
    className,
    children,
    icon,
    ghost = false,
    block = false,
    htmlType = 'button' as ButtonProps['htmlType'],
    ...rest
  } = props;

  const { getPrefixCls, autoInsertSpaceInButton, direction } = React.useContext(ConfigContext) 
  const buttonRef = (ref as any) || React.createRef<HTMLElement>()
  const [hasTwoCNChar, setHasTwoCNChar] = React.useState(false)

  const autoInsertSpace = autoInsertSpaceInButton !== false;
  
  const isNeedInserted = () =>
    React.Children.count(children) === 1 && !icon && !isUnborderedButtonType(type);

  const fixTwoCNChar = () => {
    if (!buttonRef || !buttonRef.current || autoInsertSpaceInButton === false) {
      return
    }
    const buttonText = buttonRef.current.textContext
    if (isNeedInserted() && isTwoCNChar(buttonText)) {
      if (!hasTwoCNChar) {
        setHasTwoCNChar(true)
      }
    } else if (hasTwoCNChar) {
      setHasTwoCNChar(false)
    }
  }

  React.useEffect(fixTwoCNChar, [buttonRef])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    const { onClick, disabled } = props
    if (disabled) {
      e.preventDefault()
      return
    }
    (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)?.(e)
  }
  const prefixCls = getPrefixCls('btn', customizePrefixCls)

  const classes = classNames(
    prefixCls,
    {
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${shape}`]: shape,
      [`${prefixCls}-block`]: block,
      [`${prefixCls}-dangerous`]: !!danger,
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && autoInsertSpace,
    },
    className
  )


  const kids = children

  const buttonNode = (
    <button
      {...(rest)}
      className={classes}
      onClick={handleClick}
      ref={buttonRef}
    >
      {kids}
    </button>
  )
  return buttonNode
}

const Button = React.forwardRef<unknown, ButtonProps>(InternalButton) as CompoundedComponent

Button.displayName = 'Button'

Button.__ANT_BUTTON = true;
export default Button