import axios from 'axios';

export const getUnreadCount = () => axios.get('http://localhost:5000/api/notifications/count');
export const markAllRead = () => axios.post('http://localhost:5000/api/notifications/markAllRead');
