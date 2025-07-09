import { createPinia } from 'pinia';
import { createPiniaPersistPlugin } from '@/pinia/persistPlugin';

const pinia = createPinia();

const piniaPersistPlugin = createPiniaPersistPlugin({
  baseKey: 'gothic_tales',
});

pinia.use(piniaPersistPlugin);

export default pinia;
