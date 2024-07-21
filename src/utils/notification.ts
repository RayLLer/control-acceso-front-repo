import { notification } from 'antd';

export class Notifications {
  success(description: string) {
    notification.success({
      message: 'Éxito',
      description,
    });
  }
  error(description: string) {
    notification.error({
      message: 'Error',
      description,
    });
  }
  info(description: string) {
    notification.info({
      message: 'Información',
      description,
    });
  }
}
