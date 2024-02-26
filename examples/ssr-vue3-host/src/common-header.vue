<template>
    <div>This is header</div>
    <RemoteButton @click="click" />
</template>
<script setup>
import RemoteButton from 'ssr-vue3-remote/src/common-button.vue'
import { getWord } from 'ssr-vue3-remote/src/utils.ts'

console.log('@remote', getWord('这是来自远程模块的方法'))

function click () {
    console.log(getWord('click'));
}
</script>
<style scoped>
.header {
    padding: 0;
    margin: 0;
}
</style>