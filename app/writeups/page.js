import SectionHeading from '@/components/SectionHeading';
import WriteupCard from '@/components/WriteupCard';
import Reveal from '@/components/Reveal';
import { getAllWriteups } from '@/lib/writeups';

export const metadata = {
  title: 'Write-ups',
  description:
    'Self-hosted malware analysis and threat hunting write-ups by Parth Jamodkar — packet evidence, decoding intermediates, and the math behind the detections.',
};

export default function WriteupsPage() {
  const items = getAllWriteups();

  return (
    <div>
      <SectionHeading
        eyebrow="Write-ups"
        title="Deep dives, hosted here"
        description="Long-form technical analysis written for this site — the evidence, the decoding steps, and the detection logic, not just the IOCs. External publications and talks are indexed under Public Work."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item.slug} delay={Math.min(i * 0.06, 0.4)} className="h-full">
            <WriteupCard item={item} />
          </Reveal>
        ))}
        <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-line p-6 text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-ink-faint">In the lab</p>
          <p className="mt-2 text-sm text-ink-faint">
            More write-ups are staged. New deep dives land here first.
          </p>
        </div>
      </div>
    </div>
  );
}
