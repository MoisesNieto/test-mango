interface RangeErrorNotificationProps {
  message: string;
}

export function RangeErrorNotification({
  message
}: RangeErrorNotificationProps) {
  return (
    <div className="range-error-notification" role="alert" aria-live="assertive">
      <strong>Unable to load the range selector</strong>
      <span>{message}</span>
    </div>
  );
}
