const commercantAuth = (req, res, next) => {
  if (req.user.typeUtilisateur !== 'commercant' && req.user.typeUtilisateur !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux commerçants'
    });
  }
  next();
};

module.exports = commercantAuth;