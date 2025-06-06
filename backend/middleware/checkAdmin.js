const checkAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin privileges required' })
    }
    next()
}

module.exports = checkAdmin  