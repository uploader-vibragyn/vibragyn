import styles from "./Avatar.module.css";

export default function Avatar({ src, alt = "avatar", size = 64 }) {
  return (
    <img
      src={src}
      alt={alt}
      className={styles.avatar}
      style={{ width: size, height: size }}
    />
  );
}
