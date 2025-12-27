let body = $response.body;
if (!body) {
  $done({});
  return;
}

let lines = body.split('\n');

let out = [];
let buffer = [];
let buffering = false;
let bufferDuration = 0;

const AD_MAX_DURATION = 28;

function flushBuffer(keep) {
  if (keep) out.push(...buffer);
  buffer = [];
  bufferDuration = 0;
  buffering = false;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.startsWith('#EXT-X-DISCONTINUITY')) {
    flushBuffer(true);
    buffering = true;
    buffer.push(line);
    continue;
  }

  if (buffering) {
    buffer.push(line);

    const m = line.match(/^#EXTINF:([\d.]+)/);
    if (m) bufferDuration += parseFloat(m[1]);

    if (
      bufferDuration > AD_MAX_DURATION ||
      lines[i + 1]?.startsWith('#EXT-X-DISCONTINUITY')
    ) {
      flushBuffer(bufferDuration > AD_MAX_DURATION);
    }
  } else {
    out.push(line);
  }
}

$done({ body: out.join('\n') });
