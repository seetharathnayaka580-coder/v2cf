export type ProtocolType = 'vless' | 'trojan' | 'vmess';

export interface ProxyNodeConfig {
  id: string;
  name: string;
  protocol: ProtocolType;
  pagesDomain: string; // e.g. "my-v2ray.pages.dev"
  cleanIp: string; // e.g. "proxyip.sg.cmliussss.net" or CF clean IP
  port: number; // e.g. 443
  uuid: string; // RFC4122 UUID
  path: string; // e.g. "/?ed=2048"
  sni: string; // SNI hostname, usually matches pagesDomain
  host: string; // Host header
  proxyIp: string; // Outbound relay e.g. "proxyip.sg.cmliussss.net"
  proxyIpPort: number; // 443
  earlyData: boolean;
  earlyDataLength: number; // 2048
  tls: boolean;
  alpn: string[]; // ['h2', 'http/1.1']
  network: 'ws' | 'grpc';
  remarks: string;
}

export interface ProxyIpItem {
  id: string;
  host: string;
  region: string;
  countryCode: string;
  provider: string;
  latencyAvgMs?: number;
  featured?: boolean;
  description: string;
  port: number;
}

export interface CleanIpItem {
  id: string;
  ipOrDomain: string;
  isp: string;
  location: string;
  port: number;
  speedRating: string;
}

export interface DiagnosticResult {
  host: string;
  ip: string;
  latencyMs: number;
  status: 'online' | 'degraded' | 'unreachable';
  dohVerified: boolean;
  asn?: string;
  country?: string;
  city?: string;
  lastChecked: string;
}
