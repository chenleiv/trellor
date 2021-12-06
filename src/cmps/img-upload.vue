<template>
    <div class="img-upload-container">
        <label class="clickable" v-if="!isLoading">
            <!-- <img :src="require('../assets/img/upload.png')" alt="" /> -->
            <div><span class="el-icon-plus"> </span></div>
            <input type="file" id="uploadImg" @change="onUploadImg" hidden />
        </label>
        <img v-else :src="require('../assets/img/loader48x48.gif')" alt="" />
    </div>
</template>

<script>
    import { uploadImg } from '@/services/imgUpload.service.js';

    export default {
        data() {
            return {
                isLoading: false,
            };
        },
        methods: {
            async onUploadImg(ev) {
                this.isLoading = true;
                let res = await uploadImg(ev);
                // console.log(res);

                this.$emit('onSaveImg', res.url);
                console.log('res.url', res.url);
                this.isLoading = false;
            },
        },
    };
</script>

<style>
    .clickable {
        cursor: pointer;
    }
</style>
