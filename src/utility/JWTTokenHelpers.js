import {jwtVerify,SignJWT} from "jose";

export async function CreateToken(email,id){
    const secret=new TextEncoder().encode(process.env.JWT_SECRET);
    const Payload={email:email,id:id};
    let token= await new SignJWT(Payload)
        .setProtectedHeader({alg:'HS256'})
        .setIssuedAt()
        .setIssuer(process.env.JWT_ISSUER)
        .setExpirationTime(process.env.JWT_EXPIRATION)
        .sign(secret)
    return token;
}

export async function VerifyToken(token){
    const secret=new TextEncoder().encode(process.env.JWT_SECRET);
    const decoded =await jwtVerify(token,secret)
    return decoded['payload'];
}


