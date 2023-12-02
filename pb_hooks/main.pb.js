routerAdd("GET", "/getquestion", (c) => {
    // let name = c.pathParam("name")
    function randomString() {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 15; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    };
    
    const result = new DynamicModel({
        a:"",b:"",c:"",category:"",d:"",difficulty:"",id:"",question:"",subcategory:""
    })

    try {
        const user = c.get("authRecord") // empty if not authenticated as regular auth record    
        if (user === null) {
            console.log("user is null")
            try {
                $app.dao().db()
                .newQuery(`SELECT trivia.a,trivia.b,trivia.c,trivia.d,trivia.category,trivia.difficulty,trivia.subcategory,trivia.id,trivia.question FROM trivia where trivia.id >= '${randomString()}' order by trivia.id asc LIMIT 1`)
                .one(result) // throw an error on db failure or missing row
            } catch (forwarderror) {
                console.log("forwarderror:", forwarderror)
                try {
                    if (forwarderror.value.error() === 'sql: no rows in result set') {
                        $app.dao().db()
                        .newQuery(`SELECT trivia.a,trivia.b,trivia.c,trivia.d,trivia.category,trivia.difficulty,trivia.subcategory,trivia.id,trivia.question FROM trivia where trivia.id <= '${randomString()}' order by trivia.id asc LIMIT 1`)
                        .one(result) // throw an error on db failure or missing row
                    }    
                } catch (finalerror) {
                    console.log("finalerror:", finalerror)
                    return c.json(200, { "error": finalerror })
                }
            }    
        } else {
            console.log("user is: ", user?.id)
            try {
                $app.dao().db()
                .newQuery(`SELECT trivia.a,trivia.b,trivia.c,trivia.d,trivia.category,trivia.difficulty,trivia.subcategory,trivia.id,trivia.question FROM trivia left outer join trivia_log on trivia_log.user = '${user?.id}' and trivia_log.question = trivia.id where trivia.id >= '${randomString()}' and trivia_log.id is null order by trivia.id asc LIMIT 1`)
                .one(result) // throw an error on db failure or missing row
            } catch (forwarderror) {
                console.log("forwarderror:", forwarderror)
                try {
                    if (forwarderror.value.error() === 'sql: no rows in result set') {
                        $app.dao().db()
                        .newQuery(`SELECT trivia.a,trivia.b,trivia.c,trivia.d,trivia.category,trivia.difficulty,trivia.subcategory,trivia.id,trivia.question FROM trivia left outer join trivia_log on trivia_log.user = '${user?.id}' and trivia_log.question = trivia.id where trivia.id <= '${randomString()}' and trivia_log.id is null order by trivia.id asc LIMIT 1`)
                        .one(result) // throw an error on db failure or missing row
                    }    
                } catch (finalerror) {
                    console.log("finalerror:", finalerror)
                    return c.json(200, { "error": finalerror })
                }
            }
    
        }        
        return c.json(200, { result })
    } catch (err) {
        console.log("err:", err)
        return c.json(200, { "error": err })
    }


}, /* optional middlewares */)


// fires only for "users" (not) "managers" auth collections
// onRecordAfterConfirmVerificationRequest((e) => {
//     console.log('onRecordAfterConfirmVerificationRequest: e.httpContext',JSON.stringify(e.httpContext,null,2))
//     console.log('onRecordAfterConfirmVerificationRequest: e.record',JSON.stringify(e.record,null,2))
//     // e.redirect(200, "http://localhost:8100/welcome");
// }, "users")

