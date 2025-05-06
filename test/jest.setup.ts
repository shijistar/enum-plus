import { defaultLocalize, Enum } from '@enum-plus';
import { getLocales, setLang } from './data/week-config';

setLang('en-US', Enum, getLocales, defaultLocalize);
