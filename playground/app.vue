<template>
  <div>
    <h1>App</h1>
    <p>App config: {{ appConfig }}</p>
    <p>Runtime config: See server console logs</p>
    <p>Runtime public config: {{ config.public }}</p>
  </div>
</template>

<script setup>
import { useRuntimeConfig, useAppConfig } from '#app'
const config = useRuntimeConfig()
console.log('Runtime Config', config)
const appConfig = useAppConfig()

</script>
