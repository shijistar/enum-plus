import { Enum } from 'enum-plus';
import searchItemsPlugin from './plugins/searchItems';
import toSelectPlugin from './plugins/toSelect';

Enum.install(searchItemsPlugin);
Enum.install(toSelectPlugin);
