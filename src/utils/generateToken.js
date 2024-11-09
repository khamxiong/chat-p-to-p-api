import jwt from "jsonwebtoken";

const generateToken = (id,res) => {
    const  token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
    });
return token;
    
}

export default generateToken