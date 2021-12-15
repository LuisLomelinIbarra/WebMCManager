// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const {data} = context;
    //Validate that there is an action

    const {user} = context.params;
    if(!context.params.query.action){
      throw new Error('No Action Was Called');
    }
    
    context.data = {
      userId: user._id,
      action: !context.params.query.action ? "Error": context.params.query.action,
      logDate: new Date(),
    }
    

    return context;
  };
};
