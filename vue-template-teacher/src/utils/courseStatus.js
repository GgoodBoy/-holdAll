// 0: {name: "草稿", value: 0}
// 1: {name: "审核中", value: 1}
// 2: {name: "审核失败", value: 2}
// 3: {name: "上架", value: 3}
// 4: {name: "下架", value: 4}

const courseStatus = {
    draft: 0,//草稿
    draftTwo: 9,//校编辑草稿
    auditing: 1,//审核中
    auditFail: 2,//审核失败
    putaway: 3,//上架
    soldOut: 4,//下架
    schooleditwait:5,//校编辑待审核
    schoolediterroer:6,//校编辑审核失败
    updateWait:7,//更新待审核
    updateError:8 //更新审核失败
}
export default courseStatus
