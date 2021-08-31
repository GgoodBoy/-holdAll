exports.auth = (name, required = true) => async (req, res, next) => {
    const t = req.headers[name]
    const userId = req.headers.userid
    if (!t) {
        res.json({
            success: false,
            message: '请登录后操作',
            status:401
        })
        return
    }
    try {
        if(req.method=='GET'){
            req.query.token = t;
            // req.query.userId = userId;
        }else{
            req.body.token = t;
            req.body.userId = userId;
        }
        next()
    } catch (error) {
        res.json({
            success: false,
            message: 'Token 无效',
            error,
        })
    }
}
