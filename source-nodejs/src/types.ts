export interface ExecSettingsData {
  dry_run: string;
  exec_filter: string;
  force: boolean;
}

export interface ApiResult {
  success: string | null;
  error: string | null;
}
