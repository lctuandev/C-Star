import { issuesUrl, policySections, policyUpdated } from '@cstar/content';
import Link from 'next/link';
import { buttonClass } from '@/components/ui/Button';
import { PageFrame } from '@/components/ui/PageFrame';

const PolicyPage = () => (
  <PageFrame title="Chính sách">
    <p className="text-ink-muted text-sm">Cập nhật {policyUpdated}</p>
    {policySections.map(({ title, body }) => (
      <section key={title} className="flex flex-col gap-1">
        <h2 className="text-lg font-extrabold">{title}</h2>
        <p className="text-ink-secondary leading-7">{body}</p>
      </section>
    ))}
    <a href={issuesUrl} rel="noopener noreferrer" className={buttonClass('quiet')}>
      Trang GitHub của dự án
    </a>
    <Link href="/" className={buttonClass('quiet')}>
      Quay lại
    </Link>
  </PageFrame>
);

export default PolicyPage;
