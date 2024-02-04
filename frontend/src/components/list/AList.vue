<script setup lang="ts">
import AEditIcon from '@/components/icons/AEditIcon.vue'

interface Props {
  /**
   * The names of the columns to be displayed in the header row
   */
  columnNames: { key: string; name: string }[]

  /**
   * The array containing the objects that will be displayed in the rows of the list
   */
  list: any[]

  /**
   * Whether every row should contain an edit button in the end that triggers the edit event
   */
  editable?: boolean
}

withDefaults(defineProps<Props>(), {
  editable: false
})

interface Emits {
  /**
   * Returns the object that belongs to the clicked edit button
   * @param e The event
   * @param object The object that belongs to the clicked edit button
   */
  (e: 'edit', object: any): void
}

const emit = defineEmits<Emits>()
</script>

<template>
  <table class="a-list-host">
    <tr>
      <td v-for="(column, columnIndex) in columnNames" v-bind:key="columnIndex">
        <div class="a-list-header">
          {{ column.name }}
        </div>
      </td>
    </tr>
    <tr v-for="(row, rowIndex) in list" v-bind:key="rowIndex">
      <td v-for="(column, columnIndex) in columnNames" v-bind:key="columnIndex">
        <div>
          {{ row[column.key] ? row[column.key].toLocaleString() : row[column.key] }}
        </div>
      </td>
      <td v-if="editable">
        <button @click="emit('edit', row)">
          <AEditIcon />
        </button>
      </td>
    </tr>
  </table>
</template>

<style scoped lang="scss">
@import 'src/styles/config.scss';

.a-list-host {
  box-sizing: border-box;
  min-width: 900px;
  background: $background-white;
  border: 1px solid rgba(26, 56, 96, 0.1);
  border-collapse: collapse;
  user-select: text;

  tr {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 26px;
    border-top: 1px solid rgba(26, 56, 96, 0.1);
    color: rgba(25, 39, 57, 0.94);
    flex: none;
    order: 1;
    flex-grow: 0;

    .a-list-header {
      height: 51px;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      display: flex;
      align-items: center;
      color: rgba(27, 43, 65, 0.69);
      order: 0;
    }
  }

  td {
    padding-left: 16px;
    padding-right: 20px;
  }

  button {
    background-color: rgba(25, 59, 103, 0.05);
    border: 0;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    user-select: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    :hover {
      background-color: #d1d1d1;
    }
  }
}
</style>
