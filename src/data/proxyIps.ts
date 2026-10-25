import { ProxyIpItem, CleanIpItem } from '../types';

export const FEATURED_PROXY_IP = 'proxyip.sg.cmliussss.net';

export const PROXY_IP_LIST: ProxyIpItem[] = [
  {
    id: 'sg-cmliussss',
    host: 'proxyip.sg.cmliussss.net',
    region: 'Singapore',
    countryCode: 'SG',
    provider: 'cmliussss Network / Equinix SG',
    latencyAvgMs: 38,
    featured: true,
    description: 'Primary high-bandwidth Singapore relay optimized for stable obfuscated traffic and anti-looping.',
    port: 443
  },
  {
    id: 'hk-cmliussss',
    host: 'proxyip.hk.cmliussss.net',
    region: 'Hong Kong',
    countryCode: 'HK',
    provider: 'cmliussss Network / Mega-i HK',
    latencyAvgMs: 29,
    description: 'Ultra-low latency Hong Kong relay for East Asian routing.',
    port: 443
  },
  {
    id: 'jp-cmliussss',
    host: 'proxyip.jp.cmliussss.net',
    region: 'Japan (Tokyo)',
    countryCode: 'JP',
    provider: 'cmliussss Network / Tokyo Equinix TY2',
    latencyAvgMs: 52,
    description: 'Optimized Japan transit node with streaming service unlocking.',
    port: 443
  },
  {
    id: 'us-cmliussss',
    host: 'proxyip.us.cmliussss.net',
    region: 'United States (West)',
    countryCode: 'US',
    provider: 'cmliussss Network / San Jose Silicon Valley',
    latencyAvgMs: 145,
    description: 'Direct North American backend access to bypass geographic blocks.',
    port: 443
  },
  {
    id: 'kr-cmliussss',
    host: 'proxyip.kr.cmliussss.net',
    region: 'South Korea (Seoul)',
    countryCode: 'KR',
    provider: 'cmliussss Network / Seoul KINX',
    latencyAvgMs: 64,
    description: 'Korean domestic routing node for specialized media backends.',
    port: 443
  },
  {
    id: 'aliyun-cmliussss',
    host: 'proxyip.aliyun.cmliussss.net',
    region: 'Singapore / Alibaba Cloud',
    countryCode: 'SG',
    provider: 'Alibaba Cloud BGP Anycast',
    latencyAvgMs: 41,
    description: 'Cloud native BGP backbone with resilient TCP socket stability.',
    port: 443
  },
  {
    id: 'oracle-sg',
    host: 'proxyip.oracle.cmliussss.net',
    region: 'Singapore (Oracle)',
    countryCode: 'SG',
    provider: 'Oracle Cloud Infrastructure SG',
    latencyAvgMs: 45,
    description: 'Tier-1 enterprise fiber egress without Cloudflare ASN tagging.',
    port: 443
  }
];

export const CLEAN_IP_LIST: CleanIpItem[] = [
  {
    id: 'cf-anycast-1',
    ipOrDomain: '104.16.24.4',
    isp: 'Cloudflare Anycast (San Francisco)',
    location: 'Global CDN',
    port: 443,
    speedRating: 'Fast (95 Mbps)'
  },
  {
    id: 'cf-anycast-2',
    ipOrDomain: '172.67.74.152',
    isp: 'Cloudflare Anycast (Edge)',
    location: 'Global CDN',
    port: 443,
    speedRating: 'Fast (90 Mbps)'
  },
  {
    id: 'cf-sg-clean',
    ipOrDomain: 'www.visa.com.sg',
    isp: 'Cloudflare Enterprise CDN',
    location: 'Singapore CDN Edge',
    port: 443,
    speedRating: 'Ultra-Fast (120 Mbps)'
  },
  {
    id: 'cf-hk-clean',
    ipOrDomain: 'ip.sb',
    isp: 'Cloudflare Anycast HK',
    location: 'Hong Kong Node',
    port: 443,
    speedRating: 'Fast (88 Mbps)'
  },
  {
    id: 'cf-cloudflare-clean',
    ipOrDomain: 'cloudflare.com',
    isp: 'Cloudflare Core Anycast',
    location: 'Direct Edge',
    port: 443,
    speedRating: 'Fast (85 Mbps)'
  }
];
