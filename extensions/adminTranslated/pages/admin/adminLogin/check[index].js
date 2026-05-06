const { buildUrl } = require('@evershop/evershop/src/lib/router/buildUrl');
const {
  setContextValue
} = require('@evershop/evershop/src/modules/graphql/services/contextHelper.js');

module.exports = (request, response, delegate, next) => {
  // Check if the user is logged in
  const user = request.getCurrentUser();
  
  if (user) {
    // Redirect to admin dashboard
    response.redirect(buildUrl('productGrid'));
  } else {
    setContextValue(request, 'pageInfo', {
      title: 'Admin Login',
      description: 'Admin Login'
    });
    next();
  }
};
