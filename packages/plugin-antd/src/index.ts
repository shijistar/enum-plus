import { Enum } from 'enum-plus';
import searchItemsPlugin from './searchItems';
import toFilterPlugin from './toFilter';
import toMenuPlugin from './toMenu';
import toSelectPlugin from './toSelect';
import toValueMapPlugin from './toValueMap';

Enum.install(searchItemsPlugin);
Enum.install(toSelectPlugin);
Enum.install(toMenuPlugin);
Enum.install(toFilterPlugin);
Enum.install(toValueMapPlugin);
