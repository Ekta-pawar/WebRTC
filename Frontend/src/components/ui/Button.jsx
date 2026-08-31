export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size,
  block,
  loading,
  icon,
  className = '',
  children,
  disabled,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'sm' && 'btn--sm',
    block && 'btn--block',
    !children && icon && 'btn--icon',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} disabled={disabled || loading} {...rest}>
      {loading ? <span className={`spinner ${variant === 'primary' || variant === 'danger' ? 'spinner--light' : ''}`} /> : icon}
      {children}
    </Component>
  )
}
