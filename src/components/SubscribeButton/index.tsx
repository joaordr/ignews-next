import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}

export default function subscribeButton({priceId}: SubscribeButtonProps) {
    return (
        <button type="button" className={styles.subscribeButton}>
            Subscribe Now
        </button>
    )
}