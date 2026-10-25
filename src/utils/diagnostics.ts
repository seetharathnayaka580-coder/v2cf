import { DiagnosticResult } from '../types';

/**
 * Performs a live DNS-over-HTTPS lookup using Cloudflare / Google DoH
 * and measures round-trip time in milliseconds.
 */
export async function testHostDoh(host: string): Promise<DiagnosticResult> {
  const startTime = performance.now();
  const dohUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(host)}&type=A`;

  try {
    const res = await fetch(dohUrl, {
      headers: {
        Accept: 'application/dns-json',
      },
    });

    const latency = Math.round(performance.now() - startTime);

    if (!res.ok) {
      throw new Error(`DoH server returned status ${res.status}`);
    }

    const data = await res.json();
    let resolvedIp = 'Unknown';
    if (data.Answer && data.Answer.length > 0) {
      // Find first A record
      const aRecord = data.Answer.find((ans: { type: number; data: string }) => ans.type === 1);
      if (aRecord) {
        resolvedIp = aRecord.data;
      } else {
        resolvedIp = data.Answer[0].data;
      }
    }

    return {
      host,
      ip: resolvedIp,
      latencyMs: latency,
      status: latency < 350 ? 'online' : 'degraded',
      dohVerified: true,
      lastChecked: new Date().toLocaleTimeString(),
    };
  } catch (err: unknown) {
    const latency = Math.round(performance.now() - startTime);
    return {
      host,
      ip: 'Resolution Failed',
      latencyMs: latency,
      status: 'unreachable',
      dohVerified: false,
      lastChecked: new Date().toLocaleTimeString(),
    };
  }
}

/**
 * Fetches Cloudflare edge trace info to detect current edge data center (colo)
 */
export async function fetchCfTrace(): Promise<{
  ip?: string;
  colo?: string;
  loc?: string;
  tls?: string;
  sni?: string;
  warp?: string;
  raw: string;
}> {
  try {
    const res = await fetch('https://cloudflare.com/cdn-cgi/trace', {
      cache: 'no-store',
    });
    if (!res.ok) {
      return { raw: 'Trace unavailable' };
    }
    const text = await res.text();
    const parsed: Record<string, string> = {};
    text.split('\n').forEach((line) => {
      const parts = line.split('=');
      if (parts.length === 2) {
        parsed[parts[0].trim()] = parts[1].trim();
      }
    });

    return {
      ip: parsed['ip'],
      colo: parsed['colo'],
      loc: parsed['loc'],
      tls: parsed['tls'],
      sni: parsed['sni'],
      warp: parsed['warp'],
      raw: text,
    };
  } catch {
    return {
      raw: 'Network trace blocked by browser CORS policy or offline.',
      colo: 'SG-DIRECT',
      loc: 'SG',
    };
  }
}
