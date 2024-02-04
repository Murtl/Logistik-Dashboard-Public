<script setup lang="ts">
interface Props {
  /**
   * Title of the component
   */
  title?: string

  /**
   * Savings of the component
   */
  savings: string

  /**
   * Text of the component
   */
  text?: string

  /**
   * Absolute savings of the component
   */
  psabsolute?: string

  /**
   * Percentage savings of the component
   */
  pspercentage?: string

  /**
   * Alternative bottom text of the component
   */
  alternativeBottomText?: string

  /**
   * Unit of the component
   */
  unit?: string

  /**
   * Color of the component
   */
  color?: string

  /**
   * Small title of the component
   */
  smallTitle?: boolean
}

withDefaults(defineProps<Props>(), {
  text: 'Vergleich zur Vorperiode',
  unit: '€',
  color: '#009834',
  smallTitle: false
})
</script>

<template>
  <div class="a-kennzahlkachel-host">
    <section class="title" :class="{ smallTitle }" v-if="title">
      {{ title }}
    </section>
    <section class="content">
      <div class="savings">
        {{ savings + ' ' + unit }}
      </div>
      <div class="text" v-if="psabsolute || pspercentage || alternativeBottomText">
        {{ text }}
      </div>
      <div class="alternativeBottomText" v-if="alternativeBottomText">
        {{ alternativeBottomText }}
      </div>
      <div class="ps" v-if="psabsolute || pspercentage">
        <div class="psabsolute" v-if="psabsolute">
          {{ psabsolute + ' ' + unit }}
        </div>
        <div class="pspercentage" v-if="pspercentage">
          {{ pspercentage + ' %' }}
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import 'src/styles/config.scss';

.a-kennzahlkachel-host {
  background: $background-white;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 20px;

  .title {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 125.3%;
    text-align: center;
    color: $color-black;
    transform: translateY(-6px);
    margin-bottom: 10px;

    &.smallTitle {
      font-size: 16px;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    height: 80%;

    .savings {
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 35px;
      line-height: 125.3%;
      text-align: center;
      color: v-bind(color);
    }

    .text {
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      text-align: center;
      color: $color-black;
    }

    .alternativeBottomText {
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-size: 16px;
      display: flex;
      justify-content: center;
    }

    .ps {
      display: flex;
      gap: 20px;
      justify-content: center;

      .psabsolute {
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 125.3%;
        text-align: left;
        color: v-bind(color);
      }

      .pspercentage {
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 125.3%;
        text-align: right;
        color: v-bind(color);
      }
    }
  }
}
</style>
