const getProfile = (req, res) => {
    res.render('profile', { user: req.session.user });
  };
  
  const getRealtimeProducts = (req, res) => {
    res.render('realtimeproducts');
  };
  
  // Exporta cualquier otro controlador relacionado con el usuario aquí
  
  export { getProfile, getRealtimeProducts };
  