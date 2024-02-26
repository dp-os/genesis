<template>
    <div class="app">
        <button class="btn" @click="click">Click me</button>
    <AsyncHeader />
    <Button />
    Hello World!{{ count }}</div>
</template>
<script setup lang="ts">
import { defineAsyncComponent }  from 'vue';

import { ref } from 'vue'
import { getWord } from './utils'

// import Button from './common-button.vue'
const Button = defineAsyncComponent(async () => import('./common-button.vue'));
const AsyncHeader = defineAsyncComponent(async () => import('./common-header.vue'));

const count = ref(0);

function click () {
    console.log(getWord('click'));
    count.value++;
}

</script>
<style scoped>
.btn {
    padding: 5px 10px;
    margin: 0;
    border: 1px solid #ccc;
    cursor: pointer;
    background: transparent;
}
</style>