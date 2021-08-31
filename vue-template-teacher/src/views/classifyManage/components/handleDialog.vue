<template>
    <div>
        <el-form :model="form"
                 ref="formName"
                 :rules="rules"
                 class="dialog-inner">
            <el-form-item prop="name">
                <el-input v-model="form.name"
                          autocomplete="off"
                          class="form-input"
                          maxlength="4"
                          @keydown.13.native.prevent="handle"
                          placeholder="请输入分类"></el-input>
                <el-button
                           class="red-btn form-btn redBackColor butColorF"
                           @click.native.prevent="handle"
                           :loading="btnLoading">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props: ["editorInfo"],
    data() {
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {  
                case "name":
                    if (value === "") {
                        callback(new Error("请输入分类名称"));
                    }  else if (value&&value.lenght>4){
                        callback(new Error("长度在 1 到 4 个长度"))
                    }else if(! /^[\u4e00-\u9fa5]+$/.test(value)){
                        callback(new Error("请输入汉字"))
                    }else{
                        callback(); 
                    }
                break;                                                              
            }
        };         
        return {
            form: {
                name: "",
                mtype:''
            },
            rules: {
                name: [
                    { required: true, message: '请输入分类名称', trigger: 'change' },
                    { validator: checkAge,trigger: 'blur' }
                ]             
            },
            btnLoading: false
        };
    },
    created() {
        if (this.editorInfo && this.editorInfo["id"]) {
            this.form["name"] = this.editorInfo["name"];
            this.form["mtype"] = this.editorInfo["mtype"];
        }
    },
    methods: {
        handle() {
            this.$refs["formName"].validate(valid => {
                if (valid) {
                    this.btnLoading = true;
                    if (this.editorInfo && this.editorInfo["id"]) {
                        this.editor();
                    } else {
                        this.create();
                    }
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        create() {
            this.$http
                .post(this.$server.getCategory, {
                    name: this.form.name
                })
                .then(res => {
                    if (res.status === 200) {
                        this.$message({
                            message: "添加分类成功，正在获取最新数据",
                            type: "success"
                        });
                        this.$emit("refreshList");
                    } else {
                        this.btnLoading = false;
                    }
                })
                .catch(err => {
                    this.btnLoading = false;
                    console.log(err);
                });
        },
        editor() {
            //  .put(`${this.$server.getCategory}/${this.editorInfo["id"]}`, {
            this.$http
               .post(this.$server.getCategory+'/'+this.editorInfo["id"], {
                    name: this.form.name,
                    id: this.editorInfo["id"],
                    mtype: this.form.mtype,
                })
                .then(res => {
                    if (res.status === 200) {
                        this.$message({
                            message: "编辑分类成功，正在获取最新数据",
                            type: "success"
                        });
                        this.$emit("refreshList");
                    } else {
                        this.$message.error(res.message);
                        this.btnLoading = false;
                    }
                })
                .catch(err => {
                    this.btnLoading = false;
                    console.log(err);
                });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../../../components/formSynthesisPlugin/my-component.css";
.dialog-inner {
    padding: 50px 107px 60px;
    .form-input {
        width: 240px;
    }
    .form-btn {
        width: 130px;
        margin-left: 30px;
    }
}
</style>

