import { List, notification } from 'antd';
import { FC } from 'react';

type NotificationType = 'error' | 'info' | 'success' | 'warning';

interface IDescriptionProps {
  description: string[];
}

const Description: FC<IDescriptionProps> = ({ description }) => {
  return (
    <List
      itemLayout='horizontal'
      dataSource={description}
      renderItem={(item, index) => (
        <List.Item>
          <span>{item}</span>
        </List.Item>
      )}
    />
  );
};

const showNotification = (
  type: NotificationType,
  title: string,
  description: string | string[]
) => {
  notification.open({
    message: title,
    description:
      typeof description === 'string' ? (
        description
      ) : (
        <Description description={description} />
      ),
    type,
  });
};

export default showNotification;
