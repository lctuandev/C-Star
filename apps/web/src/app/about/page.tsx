import { disclaimer, gameInfo } from '@cstar/content';
import Link from 'next/link';
import { buttonClass } from '@/components/ui/Button';
import { PageFrame } from '@/components/ui/PageFrame';
import { SaveTools } from '@/features/save/SaveTools';

const AboutPage = () => (
  <PageFrame title={gameInfo.title}>
    <p className="text-ink-secondary text-base leading-7">{disclaimer.body}</p>
    <SaveTools />
    <Link href="/" className={buttonClass('quiet')}>
      Quay lại
    </Link>
  </PageFrame>
);

export default AboutPage;
