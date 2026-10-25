import { ProxyNodeConfig } from '../types';

/**
 * Generates a standard VLESS URI string for v2rayN, V2RayNG, Shadowrocket, Sing-box, etc.
 */
export function generateVlessUri(config: ProxyNodeConfig): string {
  const address = config.cleanIp.trim() || config.pagesDomain.trim();
  const port = config.port || 443;
  const uuid = config.uuid.trim();
  const sni = config.sni.trim() || config.pagesDomain.trim();
  const host = config.host.trim() || config.pagesDomain.trim();
  const path = config.path.trim().startsWith('/') ? config.path.trim() : `/${config.path.trim()}`;
  const name = config.name.trim() || 'CF-Pages-V2Ray-SG';

  const params = new URLSearchParams({
    encryption: 'none',
    security: config.tls ? 'tls' : 'none',
    sni: sni,
    fp: 'chrome',
    type: config.network || 'ws',
    host: host,
    path: path,
  });

  if (config.alpn && config.alpn.length > 0) {
    params.set('alpn', config.alpn.join(','));
  }

  return `vless://${uuid}@${address}:${port}?${params.toString()}#${encodeURIComponent(name)}`;
}

/**
 * Generates Clash Meta / Mihomo YAML configuration snippet
 */
export function generateClashMetaYaml(config: ProxyNodeConfig): string {
  const address = config.cleanIp.trim() || config.pagesDomain.trim();
  const sni = config.sni.trim() || config.pagesDomain.trim();
  const host = config.host.trim() || config.pagesDomain.trim();
  const path = config.path.trim().startsWith('/') ? config.path.trim() : `/${config.path.trim()}`;
  const name = config.name.trim() || 'CF-Pages-V2Ray-SG';

  return `proxies:
  - name: "${name}"
    type: vless
    server: "${address}"
    port: ${config.port || 443}
    uuid: "${config.uuid.trim()}"
    network: ws
    tls: ${config.tls}
    udp: true
    sni: "${sni}"
    client-fingerprint: chrome
    ws-opts:
      path: "${path}"
      headers:
        Host: "${host}"
      max-early-data: ${config.earlyData ? config.earlyDataLength || 2048 : 0}
      early-data-header-name: Sec-WebSocket-Protocol`;
}

/**
 * Generates Sing-box outbound JSON format (v1.8+ / v1.10+)
 */
export function generateSingBoxJson(config: ProxyNodeConfig): string {
  const address = config.cleanIp.trim() || config.pagesDomain.trim();
  const sni = config.sni.trim() || config.pagesDomain.trim();
  const host = config.host.trim() || config.pagesDomain.trim();
  const path = config.path.trim().startsWith('/') ? config.path.trim() : `/${config.path.trim()}`;
  const tag = config.name.trim() || 'CF-Pages-V2Ray-SG';

  const outbound = {
    type: 'vless',
    tag: tag,
    server: address,
    server_port: config.port || 443,
    uuid: config.uuid.trim(),
    tls: {
      enabled: config.tls,
      server_name: sni,
      utls: {
        enabled: true,
        fingerprint: 'chrome',
      },
      alpn: config.alpn,
    },
    transport: {
      type: 'ws',
      path: path,
      headers: {
        Host: host,
      },
      max_early_data: config.earlyData ? config.earlyDataLength || 2048 : 0,
      early_data_header_name: 'Sec-WebSocket-Protocol',
    },
  };

  return JSON.stringify(outbound, null, 2);
}

/**
 * Generates Shadowrocket format URI
 */
export function generateShadowrocketUri(config: ProxyNodeConfig): string {
  return generateVlessUri(config);
}

/**
 * Generates Quantumult X server line
 */
export function generateQuantumultX(config: ProxyNodeConfig): string {
  const address = config.cleanIp.trim() || config.pagesDomain.trim();
  const sni = config.sni.trim() || config.pagesDomain.trim();
  const host = config.host.trim() || config.pagesDomain.trim();
  const path = config.path.trim().startsWith('/') ? config.path.trim() : `/${config.path.trim()}`;
  const name = config.name.trim() || 'CF-Pages-V2Ray-SG';

  return `vless=${address}:${config.port || 443}, method=none, password=${config.uuid.trim()}, obfs=wss, obfs-host=${host}, obfs-uri=${path}, tls=true, tls-verification=true, fast-open=false, tag=${name}`;
}

/**
 * Generates Surge proxy line
 */
export function generateSurge(config: ProxyNodeConfig): string {
  const address = config.cleanIp.trim() || config.pagesDomain.trim();
  const sni = config.sni.trim() || config.pagesDomain.trim();
  const host = config.host.trim() || config.pagesDomain.trim();
  const path = config.path.trim().startsWith('/') ? config.path.trim() : `/${config.path.trim()}`;
  const name = config.name.trim() || 'CF-Pages-V2Ray-SG';

  return `${name} = vless, ${address}, ${config.port || 443}, username=${config.uuid.trim()}, ws=true, ws-path=${path}, ws-headers=Host:${host}, tls=true, sni=${sni}`;
}

/**
 * Generates standard Base64 subscription string
 */
export function generateBase64Subscription(links: string[]): string {
  const raw = links.join('\n');
  return btoa(unescape(encodeURIComponent(raw)));
}
