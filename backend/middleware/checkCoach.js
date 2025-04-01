const checkCoach = (req, res, next) => {
    if (req.user?.role !== 'coach') {
        return res.status(403).json({ error: 'Coach privileges required' })
    }
    next()
}

module.exports = checkCoach  