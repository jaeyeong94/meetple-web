export type NotificationType =
  'sign-up' |
  'verification-success' |
  'verification-failure' |
  'recommended-meeting' |
  'match-request' |
  'match-request-remind' |
  'matched' |
  'approve' |
  'match-reject';

export type ModalType = 'welcome' | 'request-match' | 'request-accept-match' | 'reject-match' | 'matched' | 'block-partner' | 'delete-partner' |
  'logout' | 'delete-account' | 'purchase-point' | 'code-retry' | 'select' | 'deep-select' | 'alert' | null;

export type ToastType = 'ok' | 'warning' | 'check';

export type SelectOption = {
  label: string;
  value: string | number;
}

export type DeepSelectOption = SelectOption & {
  children: SelectOption[];
}
