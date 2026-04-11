import { useStoryLocale } from '../locales';

export interface LocalizedDocProps {
  docEn: React.ComponentType;
  docCn: React.ComponentType;
}

function LocalizedDoc(props: LocalizedDocProps) {
  const locale = useStoryLocale();
  const Doc = locale === 'en-US' ? props.docEn : props.docCn;

  return <Doc />;
}

export default LocalizedDoc;
