import apiClient from './api';
import type { EmailInbox } from '../types/account';

export async function getEmailInbox(): Promise<EmailInbox> {
  const response = await apiClient.get<EmailInbox>('/accounts/email-inbox/');
  return response.data;
}
