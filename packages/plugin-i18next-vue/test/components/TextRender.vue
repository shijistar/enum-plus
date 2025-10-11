<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'TextRender',
  props: {
    text: {
      type: Function as PropType<() => string | undefined>,
      required: true,
    },
  },
  render() {
    return this.text();
  },
});
</script>
