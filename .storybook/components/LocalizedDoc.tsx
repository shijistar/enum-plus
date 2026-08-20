import type { ComponentType } from 'react';
import { useStoryLocale } from '../locales';

export interface LocalizedDocProps {
  docEn: ComponentType;
  docCn: ComponentType;
}

function LocalizedDoc(props: LocalizedDocProps) {
  const locale = useStoryLocale();
  const Doc = locale === 'en-US' ? props.docEn : props.docCn;

  return <Doc />;
}

export default LocalizedDoc;
