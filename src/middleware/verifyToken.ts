import { Request, Response, NextFunction} from "express"
import {verify} from "jsonwebtoken"

export const verifyToken = (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        console.log("from request header", req.headers)
        const token = req.headers.authorization?.split(" ")[1]
        console.log( "Received Token", token)

        if(!token){
            throw {rc: 400, status: false, message: "Token not exist"}
        }
        
        //verify Token
        const checkToken = verify(token, process.env.TOKEN_KEY || "SECRET")
        console.log("INI DARI VERIFY TOKEN", checkToken)

        res.locals.decript = checkToken
        next()
    }catch(error:any){
        console.log(error.message)
        res.status(401).send({
            message: "Unauthorized token, is invalid",
            success: false,
        })
    }
}