import { ref, watch } from 'vue';
import { createSharedComposable } from '@vueuse/core';
import i18next, { changeLanguage, t } from 'i18next';

const useLocale = createSharedComposable(() => {
  const lang = ref<string>(i18next.language as string);
  const getText = ref<typeof t>(t);

  watch(lang, () => {
    getText.value = t;
  });

  const changeLang = async (locale: string) => {
    lang.value = locale;
    await changeLanguage(locale);
  };

  return {
    t: getText,
    lang,
    changeLang,
  };
});

export default useLocale;
