module.exports = (req, res, next) => {
    if (req.user.role !== "producao") {
        return res.status(403).json({ error: "Apenas funcionários da produção têm acesso." });
    }
    next();
};
