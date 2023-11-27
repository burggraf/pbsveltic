routerAdd("GET", "/verify/:token", (c) => {
    let token = c.pathParam("token")
    // http://127.0.0.1:8090/_/#/auth/confirm-verification/<token>

    return c.json(200, { "message": "Token " + token })
})

// fires only for "users" (not) "managers" auth collections
onRecordAfterConfirmVerificationRequest((e) => {
    console.log('onRecordAfterConfirmVerificationRequest: e.httpContext',JSON.stringify(e.httpContext,null,2))
    console.log('onRecordAfterConfirmVerificationRequest: e.record',JSON.stringify(e.record,null,2))
    // e.redirect(200, "http://localhost:8100/welcome");
}, "users")

