module.exports = (req, res, next) => {
    if (req.user.role !== "gerente") {
        return res.status(403).json({ error: "Apenas gerentes podem acessar." });
    }
    next();
};
