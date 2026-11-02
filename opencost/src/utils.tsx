import { ConfigStore } from '@kinvolk/headlamp-plugin/lib';
import { isOpenCostInstalled } from './request';

type Conf = {
  isEnabledInListView: boolean;
  namespace: string;
  serviceURL: string;
  defaultTimespan: string;
  displayCurrency: string;
};

export function getConfigStore(): ConfigStore<Conf> {
  return new ConfigStore<Conf>('@headlamp-k8s/opencost');
}

export async function getServiceDetails(): Promise<[string, string]> {
  const configStore = getConfigStore();

  const config = configStore.get();

  if (config?.serviceURL) {
    return [config?.namespace, config?.serviceURL];
  }

  const [installed, name, namespace] = await isOpenCostInstalled();
  if (installed) {
    return [namespace, name];
  }
  return ['', ''];
}

export function getDisplayCurrency(): string {
  const configStore = getConfigStore();
  const config = configStore.get();

  return config?.displayCurrency ?? '$';
}

// The default window is a day: a 14-day allocation query takes minutes on a cluster with heavy pod
// churn (one with tens of thousands of short-lived Job pods in two weeks), longer than the reverse
// proxies in front of Headlamp wait, so the cost columns and sections stayed empty.
export const DEFAULT_TIMESPAN = '24h';

export function getDisplayTimespan(): string {
  const configStore = getConfigStore();
  const config = configStore.get();

  return config?.defaultTimespan ?? DEFAULT_TIMESPAN;
}
