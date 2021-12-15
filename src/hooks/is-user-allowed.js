// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const {app, params} = context;
    console.log(params.user);
    if(params.user.isAllowed == 'false'){
      throw new Error('User is not allowed to run the server yet!! Contact the admin for them to allow you to use this service');
    }
    return context;
  };
};
