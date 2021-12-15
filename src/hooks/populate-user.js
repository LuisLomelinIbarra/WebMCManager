// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const {app, method, result, params} = context;
    const addUser = async log =>{
      //console.log("log userid", log.userId);
      
      const user = await app.service('users').get(log.userId, params);
      return {
        ...log,
        user
      }
    }

    if(method === 'find'){
      result.data = await Promise.all(result.data.map(addUser));
      result['serverStat'] = params.serverStat;
    }else{
      context.result = await addUser(result);
    }

    return context;
  };
};
