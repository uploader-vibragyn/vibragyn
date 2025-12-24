import styles from "./Button.module.css";

export default function Button({ children, onClick, type = "button", variant = "primary", ...rest }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]}`}
      {...rest}
    >
      {children}
    </button>
  );
}
