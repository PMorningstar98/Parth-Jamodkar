// Write-up: From a Challan SMS to an Exposed Botnet Panel
// Content is stored as structured blocks rendered by components/WriteupBody.js
// Inline formatting in paragraphs: **bold**, `code`, [text](url)

const meta = {
  slug: 'from-challan-sms-to-exposed-botnet-panel',
  title: 'From a Challan SMS to an Exposed Botnet Panel',
  date: '2026-11-19',
  dateLabel: 'November 2026',
  readTime: '18 min read',
  tags: ['android', 'smishing', 'firebase', 'botnet', 'threat-hunting'],
  cover: '/writeups/nexuspanel-challan-botnet/banner.svg',
  coverAlt: 'Terminal-style banner — an unauthenticated curl against the bot operator\'s Firebase returns 200 OK',
  description:
    'A fake Indian e-challan SMS leads to a Firebase-backed Android botnet whose entire control database was readable without authentication — 3,789 enrolled bots, live tasking, and an operator who never locked the door.',
};

const blocks = [
  {
    type: 'p',
    text: 'One of these texts landed in my own close-circle WhatsApp group: an "e-challan" overdue notice from a random mobile number, shortened link at the end. Everyone gets these in India. Most people delete them. I had a free evening.',
  },
  {
    type: 'p',
    text: 'What follows is the full trail: a Tailscale-funnelled fake government app, a two-layer packed Android banker/SMS-botnet I\'m calling **NexusPanel**, and a Firebase project — `ghostx-panel` — whose Realtime Database was **world-readable without any authentication**. Inside it: **3,789 registered bot clients, 33 SIM-farm devices, and live harassment tasking** I watched the operator re-point in real time. Days after the abuse reports went out, the database disappeared. This is the anatomy of that operation, and of the takedown.',
  },
  {
    type: 'callout',
    variant: 'info',
    title: 'Methodology, up front',
    text: 'Everything here was obtained passively: reading what the operator exposed without authentication, static reverse engineering of the samples, and third-party telescopes (VirusTotal relationships, crt.sh, urlscan). No credentials were bypassed, nothing was ever written to the operator\'s systems, and the one moment a server could have mistaken me for a bot, it rejected the request — which is exactly where I stopped. Victim phone numbers are partially redacted throughout; the unredacted evidence stays with the abuse reports and law-enforcement referral.',
  },
  {
    type: 'h2',
    text: 'The lure',
  },
  {
    type: 'p',
    text: 'The SMS points through `ln.run/h441h` to `2ie5ks.top/in/` — a Cloudflare-fronted page dressed up as a Ministry of Road Transport "Vehicle Status & Compliance Check" portal. Enter any registration number and it finds you a challan you don\'t have. The page\'s inline JavaScript carries a delivery config object that routes the download through `/d.php` onto an AWS Lambda + S3 staging chain, which finally serves the APK: **NextGen_mParivahan.apk**.',
  },
  {
    type: 'table',
    headers: ['Stage', 'Artifact', 'Observation'],
    rows: [
      ['Lure', 'SMS from 083899 34852', 'fake e-challan notice, ln.run/h441h'],
      ['Landing', '2ie5ks.top/in/', 'fake Parivahan portal, Cloudflare-fronted'],
      ['Redirect', '/d.php', 'delivery routing, inline window config'],
      ['Staging', 'AWS Lambda + S3', 'APK hosting chain, burned per campaign'],
      ['Payload', 'NextGen_mParivahan.apk', 'stage-1, two-layer packed'],
    ],
  },
  {
    type: 'image',
    src: '/writeups/nexuspanel-challan-botnet/attack-chain.svg',
    alt: 'Full attack chain from SMS lure to the exposed Firebase panel, with the Groklem cross-reference',
    caption: 'The full chain — SMS lure, Cloudflare funnel, AWS staging, packed APK, and the world-readable Firebase panel acting as C2. Victim numbers masked.',
  },
  {
    type: 'p',
    text: 'The funnel as a victim actually sees it — starting with the message itself, captured from my own phone:',
  },
  {
    type: 'image',
    src: '/writeups/nexuspanel-challan-botnet/shot-sms-lure.svg',
    alt: 'The smishing SMS as received: fake Airtel warning, vehicle plate, reference number, and the ln.run/h441h link',
    caption: 'The lure, verbatim: an "Airtel Warning" about CCTV footage for a parked vehicle, a reference number, and the link. The vehicle plate is real — scraped or guessed — which is what makes people click.',
  },
  {
    type: 'image',
    src: '/writeups/nexuspanel-challan-botnet/shot-portal-verification-modal.svg',
    alt: 'Fake MoRTH portal showing an Extra Verification Required dialog that demands installing the app',
    caption: 'The fake "National Vehicle Status & Compliance Check" portal. Any registration number "needs verification" — and verification means installing the app. Note the NIC-channel wording and the fake gov-style support address at the bottom.',
  },
  {
    type: 'image',
    src: '/writeups/nexuspanel-challan-botnet/shot-portal-install-guide.svg',
    alt: 'Step-by-step install guide on the fake portal instructing the victim to allow installs from the browser and ignore Play Protect',
    caption: 'The portal holds the victim\'s hand through the whole bypass: allow installs from the browser, open the APK, and — if Play Protect complains — "Install anyway". Every step is a deliberate erosion of Android\'s defenses.',
  },
  {
    type: 'image',
    src: '/writeups/nexuspanel-challan-botnet/shot-apk-download-prompt.svg',
    alt: 'Browser warning asking whether to download Challan.apk from 2ie5ks.top anyway',
    caption: 'The browser\'s "this file might be harmful" dialog is the last gate — and the last one most victims ignore. The payload is served as Challan.apk straight off 2ie5ks.top.',
  },
  {
    type: 'h2',
    text: 'The sample',
  },
  {
    type: 'p',
    text: 'Stage-1 (`5ce69895…6320f2`) is a **two-layer AES/CBC packer**. Each layer\'s key is sitting right in the DEX — literally: the key is the XOR of two 32-byte arrays declared as `fill-array-data-payload` stubs, one per stage. XOR them, feed the result to AES/CBC, and you get the next layer. Inner app: `com.vault.document`, main service `vortex.galactic.yellow.HomeSIM`. The decrypted stage-2 DEX (`b6b145a0…ea2c`) is an SMS-botnet/banker toolkit:',
  },
  {
    type: 'table',
    headers: ['Capability', 'Evidence in code', 'Note'],
    rows: [
      ['SMS botnet', 'sendSMS tasking, FCM push triggers', 'bulk SMS from infected devices'],
      ['SIM-farm ops', 'sms_realtime_upload_v2 exfil, offline replay queue', 'works through connectivity loss'],
      ['Call forwarding', 'USSD MMI codes', 'redirects victim calls to operator'],
      ['Self-protection', 'icon hide, package disguise', 'poses as a vault/documents app'],
    ],
  },
  {
    type: 'h2',
    text: 'The panel that gave it all away',
  },
  {
    type: 'p',
    text: 'The bots don\'t talk to a hard-coded C2 server. They talk to a Firebase Realtime Database: `ghostx-panel-default-rtdb.firebaseio.com`. And the operator left the default-world-readable rules in place. One unauthenticated request — the same curl anyone types while debugging — returns everything:',
  },
  {
    type: 'code',
    lang: 'bash',
    title: 'One request. No credentials. The whole botnet.',
    content: `$ curl -s https://ghostx-panel-default-rtdb.firebaseio.com/.json
HTTP/2 200
{ "clients": { ...3789 task records... }, "devices": { ...33 records... } }`,
  },
  {
    type: 'p',
    text: 'I froze the database with a full read-only harvest before doing anything else — **3,789 client task records, 33 complete device records**, two task queues, and a `Firestore` node that 404\'d (never created), a `Remote Config` that was empty, and a Storage bucket that correctly answered 401 private. The panel was the C2, the roster, the message queue and the exfil index, all in one JSON tree.',
  },
  {
    type: 'table',
    headers: ['Node', 'Contents', 'Sensitivity'],
    mono: true,
    rows: [
      ['clients', '3,789 records', 'SMS tasking + bot registry'],
      ['devices', '33 records', 'SIM-farm handsets, 27-field profiles'],
      ['sms_queue', '946 targets queued, 0 sent', 'harassment blast list'],
      ['firestore', '404 — never created', '—'],
      ['remote_config', 'empty', '—'],
      ['storage', '401 — private', 'exfil archive (inaccessible)'],
    ],
    highlightLast: false,
  },
  {
    type: 'h3',
    text: 'The signing scheme (and where I stopped)',
  },
  {
    type: 'p',
    text: 'The bots authenticate writes with a custom scheme the samples carry in full: an `X-Sig` header computed as `HMAC-SHA256(key=<32-byte secret embedded in the DEX>, msg="<customerId>:<deviceId>:<epochMillis>")`, truncated to 8 hex chars, alongside `X-Customer-ID`, `X-Device-ID` and `X-Timestamp`. I reimplemented the scheme and validated it end-to-end — **against a Firebase project I control**, with my own key.',
  },
  {
    type: 'callout',
    variant: 'warn',
    title: 'The one boundary that mattered',
    text: 'With the recovered secret I could mint signatures the live panel would accept. I sent exactly one forged, unsigned-equivalent probe to the operator\'s live node to test whether per-customer secrets exist. The server answered **401**. That rejection was the answer to my research question — and the end of the road: anything the server *accepts* would have been unauthorized access, so I built no client, registered no bot, and never authenticated. Reads of what was already public are the entire dataset.',
  },
  {
    type: 'h3',
    text: 'What the operator was doing in there',
  },
  {
    type: 'p',
    text: 'Two snapshots taken hours apart show the `clients` work queue is a **single global list** the operator bulk-re-points: at snapshot 1 every queued message targeted one number (+91 96XXX 20XXX — the alias field is unprintable harassment), at snapshot 2 every single one had been re-pointed to a different number (+91 70682 31080). Meanwhile the `devices` queue held 33 copies of "segss sux" aimed at a third number (+91 79XXX 40XXX), earliest timestamp **2026-11-14 17:09 UTC**, all `isSended:false`. The 946-target SMS queue was staged, not yet fired. This panel isn\'t just a botnet — it\'s a harassment cannon with a SIM farm attached, and the rotation (~2.5 hours between bulk re-pointings) was happening while I watched.',
  },
  {
    type: 'h2',
    text: 'Older than it looks',
  },
  {
    type: 'p',
    text: 'Certificate transparency and VirusTotal communicating-files say this is not a new operation. `nexus-panel.in` was registered **2025-12-20** (now NXDOMAIN — registration lapsed). `nexus-systemm.com` followed on **2026-03-07** and is **still live**: an ERP-flavoured catch-all decoy ("Nexus Systems ERP API v2.4.0") with a live, signature-gated `/api/ws` endpoint behind Cloudflare — a multi-tenant panel kit where each customer gets their own tenant secret. Six sample builds span June–October 2026 across two lure verticals: the mParivahan challan theme and an adult-lure APK (`Desi_Leak_Videos_FUD.apk`). Same panel lineage, same signing DNA.',
  },
  {
    type: 'p',
    text: 'It also cross-references a parallel family: the Challan.apk campaign that [Star Labs documented as Groklem build 7](https://starlabs.sg/) — raw-TCP C2 at `192.238.176.121:9999` (Antbox AS138995, a 27-port tarpit), a Telegram beacon, and a sideline that surprised me: **rented xAI API keys**, provisioned in-app as `XAI_API:<KEY>:<DAYS>:<LANGUAGE>` and burned after a single use, hitting `api.x.ai/v1/chat/completions` with `grok-4.20-0309-non-reasoning`. Malware with a pay-per-use LLM budget. The server-side markers even carry instructions like `Do NOT hardcode only BDT` — someone is localizing scam scripts per target country.',
  },
  {
    type: 'h2',
    text: 'Disruption, and the sweep that confirmed it',
  },
  {
    type: 'p',
    text: 'I sent abuse reports everywhere the chain touched: **Tailscale** (the funnel tailnet serving the APK), **Google/Firebase** (the exposed project), **Cloudflare** (both panel domains, including the live node), **both registrars**, **AWS** (the burned Lambda/S3 staging), **Telegram** (beacon channel), **x.ai** (the key-rental angle with a full provenance chain), the **Antbox** upstream, and India\'s **Chakšu / cybercrime.gov.in** with the harassment-victim evidence attached. Then I waited, and swept again on 2026-11-19.',
  },
  {
    type: 'p',
    text: 'The receipts — every report went out, and CERT-In answered the same day:',
  },
  {
    type: 'image',
    src: '/writeups/nexuspanel-challan-botnet/shot-abuse-reports-sent.svg',
    alt: 'Sent-mail folder showing abuse reports to CERT-In, Cloudflare, AWS, xAI Trust and Safety, and Telegram',
    caption: 'The sent folder on report day: CERT-In, Cloudflare (ticket #23958361), AWS abuse, xAI Trust & Safety, Telegram abuse — every choke point of the chain got a tailored, evidence-backed report.',
  },
  {
    type: 'image',
    src: '/writeups/nexuspanel-challan-botnet/shot-certin-ack.svg',
    alt: 'PGP-signed reply from CERT-In incident desk acknowledging the report and stating it has been forwarded for appropriate action',
    caption: 'CERT-In\'s PGP-signed reply: incident forwarded, "appropriate action with the concerned authority" in process. The Indian national CERT acting on an individual researcher\'s report within hours.',
  },
  {
    type: 'table',
    headers: ['Target', '2026-11-16', '2026-11-19 sweep'],
    rows: [
      ['ghostx-panel RTDB', 'world-readable, 3,822 records', '**DELETED** — 404 on every path'],
      ['nexus-systemm.com', 'live, /api/ws rejects forgeries 401', 'still live — /api/ws now answers 400'],
      ['nexus-panel.in', 'NXDOMAIN', 'NXDOMAIN'],
      ['Storage bucket', '401 private', 'moot — the C2 that fed it is gone'],
    ],
    highlightRows: [0],
  },
  {
    type: 'p',
    text: 'The 404 matters. A locked-down database answers **401 Permission denied** — I\'d seen that on the storage bucket. The RTDB returning **404 Not Found** on every node means the database itself was deleted, and with it the operator\'s entire roster, tasking history and device records. The single highest-leverage report — the one-click Firebase abuse case — landed. The panel *node* is still alive and its behaviour changed after the reports (400 where it used to 401), so the operator is rebuilding. Cloudflare and registrar follow-ups stay open.',
  },
  {
    type: 'callout',
    variant: 'signal',
    title: 'Detection takeaway',
    text: 'An Android botnet whose C2 is a Firebase RTDB is a gift to defenders: every bot enrollment, every task queue change, transits a single well-known cloud domain you can alert on. If your estate sees phones polling `*.firebaseio.com` in steady, periodic intervals with JSON GET/PUT patterns that don\'t match any installed legitimate app — that\'s this. Baseline the apps, then watch the database hostnames, not the IPs.',
  },
  {
    type: 'h2',
    text: 'IOCs (condensed)',
  },
  {
    type: 'table',
    headers: ['Type', 'Value', 'Note'],
    mono: true,
    rows: [
      ['APK', '5ce69895…6320f2', 'stage-1 NextGen_mParivahan.apk'],
      ['APK', 'fb1a6df9…4180', 'inner base.apk (com.vault.document)'],
      ['DEX', 'b6b145a0…ea2c', 'decrypted stage-2'],
      ['Domain', '2ie5ks.top', 'delivery, Cloudflare-fronted'],
      ['Domain', 'ln.run/h441h', 'SMS shortlink'],
      ['Domain', 'nexus-systemm.com', 'live panel node, /api/ws X-Sig-gated'],
      ['Domain', 'nexus-panel.in', 'registered 2025-12-20, NXDOMAIN'],
      ['IP', '192.238.176.121:9999', 'Groklem C2, Antbox AS138995'],
      ['Firebase', 'ghostx-panel (407145950785)', 'RTDB world-readable — deleted 2026-11-19'],
      ['APK', 'bbdeae03…, d31bd5b5…, e92ef27b…', 'June–Oct 2026 builds, same panel'],
    ],
  },
  {
    type: 'h2',
    text: 'Takeaways',
  },
  {
    type: 'list',
    ordered: true,
    items: [
      '**The cloud is the C2 now.** No domains to sinkhole, no IPs to block — one Firebase project *is* the whole infrastructure. The same concentration that makes these operations cheap is what makes them one report away from deletion.',
      '**World-readable is a choice, and operators keep making it.** Default-allow RTDB rules took down this botnet faster than any AV signature would have.',
      '**The X-Sig scheme was sound; the deployment wasn\'t.** Recoverable client secrets mean "signed" means nothing on rooted/analyzed devices — but per-tenant secrets on the server side still stopped casual impersonation.',
      '**Harassment is a first-class payload.** The blast queues weren\'t financial — they were targeted harassment at specific individuals, run through stolen SIM capacity. Worth treating as a primary harm in these cases, not a side effect.',
      '**Passive watching was enough.** Every fact in this write-up came from reading what was public, extracting what the samples contained, or asking telescopes. Nobody had to touch the operator\'s systems.',
    ],
  },
  {
    type: 'divider',
  },
  {
    type: 'p',
    text: '*Samples on VirusTotal and MalwareBazaar under the hashes above; full harvest, hunt ledger and tooling in the evidence bundle (kept private — it contains unredacted victim data). Groklem naming per Star Labs\' November 2026 research; NexusPanel is my designation. Independent analysis — all errors mine.*',
  },
];

export default { meta, blocks };
