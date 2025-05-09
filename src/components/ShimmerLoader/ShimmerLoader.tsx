import styles from "./ShimmerLoader.module.css";

const ShimmerLoader = () => {
  return (
    <div className={styles.shimmerWrapper}>
      <div className={styles.shimmerItem}></div>
      <div className={styles.shimmerItem}></div>
      <div className={styles.shimmerItem}></div>
      <br />
      <div className={styles.shimmerItem}></div>
      <div className={styles.shimmerItem}></div>
      <br />
      <div className={styles.shimmerItem}></div>
      <div className={styles.shimmerItem}></div>
      <div className={styles.shimmerItem}></div>
      <div className={styles.shimmerItem}></div>
    </div>
  );
};

export default ShimmerLoader;
