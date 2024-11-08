export type NotificationType =
  'sign-up' |
  'verification-success' |
  'verification-failure' |
  'recommended-meeting' |
  'match-request' |
  'match-request-remind' |
  'matched' |
  'match-reject';

export type ModalType = 'request-match' | 'request-accept-match' | 'reject-match' | 'matched' | 'block-partner' | 'delete-partner' |
  'logout' | 'delete-account' | 'purchase-point' | 'code-retry' | 'select' | 'deep-select' | 'alert' | null;


export type SelectOption = {
  label: string;
  value: string | number;
}

export type DeepSelectOption = SelectOption & {
  children: SelectOption[];
}
