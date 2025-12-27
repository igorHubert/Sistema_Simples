module.exports = (req, res, next) => {
    if (req.user.role !== "vendedor") {
        return res.status(403).json({ error: "Apenas vendedores têm acesso." });
    }
    next();
};
