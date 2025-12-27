module.exports = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Apenas administradores podem acessar." });
    }
    next();
};

