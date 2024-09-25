function checkforAuthenticationCookie(cookieName){
    return (req , res , next)=>{
        const tokenCookieValue = req.cookies(cookieName);
        if(!tokenCookieValue){
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
        } catch (error) {
            next();
        }
    }
}