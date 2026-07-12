import jwt from "jsonwebtoken";

export function requireAuth(req, res, next){
    const token = req.cookies?.token;
//Se il cookie non è presente risponde con 401 Unauthorized
    if(!token){
return res.status(401).json({ message: "Devi effettuare il login per accedere a questa risorsa" });
    }
    
    try{
        //decodifica il token e ne verifica la firma e che non sia scaduto
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
  }
    //se fallisce risponde con 401 Unauthorized
    catch (err) {
    return res.status(401).json({ message: "Sessione non valida o scaduta, effettua di nuovo il login" });
  }
    }

    export function requireAdmin(req, res, next){
        //controlla se req.user.role è admin, altrimenti risponde con 403 Forbidden
        if (req.user?.role !== "admin"){
            return res.status(403).json({ message: "Accesso riservato agli amministratori" });
        }
        next();
    }