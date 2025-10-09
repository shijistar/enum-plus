<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'TextRender',
  props: {
    text: {
      type: Function as PropType<() => string>,
      required: true,
    },
  },
  render() {
    return this.text();
  },
});
</script>
