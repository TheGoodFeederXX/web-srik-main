export const themeColors = {
  primary: {
    main: 'var(--color-primary)',
    light: 'var(--color-primary-light)',
    dark: 'var(--color-primary-dark)',
    text: 'var(--text-on-primary)',
  },
  secondary: {
    main: 'var(--color-secondary)',
    light: 'var(--color-secondary-light)',
    dark: 'var(--color-secondary-dark)',
    text: 'var(--text-on-secondary)',
  },
  accent: {
    main: 'var(--color-accent)',
    light: 'var(--color-accent-light)',
    dark: 'var(--color-accent-dark)',
    text: 'var(--text-on-accent)',
  },
  dark: {
    main: 'var(--color-dark)',
    text: 'var(--text-on-dark)',
  },
} as const;

export const themeTailwindClasses = {
  primary: {
    solid: 'bg-theme-primary text-white',
    outline: 'border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white',
    ghost: 'text-theme-primary hover:bg-theme-primary/10',
  },
  secondary: {
    solid: 'bg-theme-secondary text-theme-dark',
    outline: 'border-2 border-theme-secondary text-theme-secondary hover:bg-theme-secondary hover:text-theme-dark',
    ghost: 'text-theme-secondary hover:bg-theme-secondary/10',
  },
  accent: {
    solid: 'bg-theme-accent text-white',
    outline: 'border-2 border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-white',
    ghost: 'text-theme-accent hover:bg-theme-accent/10',
  },
  dark: {
    solid: 'bg-theme-dark text-white',
    outline: 'border-2 border-theme-dark text-theme-dark hover:bg-theme-dark hover:text-white',
    ghost: 'text-theme-dark hover:bg-theme-dark/10',
  },
} as const;
