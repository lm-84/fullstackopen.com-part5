const Notification = ({ message, classText }) => {
  if (message === "") {
    return null;
  }

  return <div className={classText}>{message}</div>;
};

export default Notification;