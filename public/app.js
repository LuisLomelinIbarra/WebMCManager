const socket = io();
const client = feathers();

client.configure(feathers.socketio(socket));

client.configure(
    feathers.authentication(
        {storage: window.localStorage}
    )
);

//main();

const loginhtml = `
<main class="sp-horiz-lg" name="login" class="login heading">
    <div class="sp-vert-lg txt-center">
        <h1 class="txt-center">Login or Signup</h1>      
        <hr>
            <div class="col txt-left">        
                <form>
                    <label>
                        Email              
                        <input type="email" name="email" class="width-50" placeholder="email@domain.com"/>
                    </label>
                    <label>
                        Password
                        <input type="password" name="password" class="width-50" placeholder="A c00l p4$$w0rd" />
                    </label>
                    <label>
                        <button class="btn bg-green width-50" id="login" type="button">Log in</button>
                    </label>
                    <label>
                        <button class="btn bg-blue btn-m" id="signup" type="button">Sign Up and Login</button>
                    </label>
                </form>      
            </div>
        </div>
</main>`;

const homehtml = `
<main class="sp-horiz-lg bg-grey">
<div class="sp-vert-lg">
    <div class="row">
        
        <div class="col c2">
            <a href="#" id="logout" class="btn bg-blue txt-bold box" style="text-decoration:none;color:inherit;"> 
                <span>
                    <span class="material-icons md-48">
                        logout
                    </span> <h6>logout</h6>
                </span>
            </a>
        </div>
        <div class="col c10"></div>
    </div>
    <h1 class="txt-center">Web Server Starter</h1>
    <hr>
    <div class="row">
        <div class="col c3">
            <div class="col txt-white">
                <div class="sp-vert-sm row">
                    <a class="btn btn-lg bg-green txt-bold box" id="serverstart" style="text-decoration:none;color:inherit; "> Start Server </a>
                </div>
                <div class="sp-vert-sm row">
                    <a class="btn btn-lg bg-red txt-bold box" id="serverstop" style="text-decoration:none;color:inherit;"> Stop Server </a>
                </div>
                <div class="sp-vert-md row"><span>Current Status: <div id="current"></div></span></div>
            </div>
        </div>
        <div class="sp-lg col c8 bg-black txt-light-gray box">
            <div id="logs" class="scroll"></div>
        </div>
    </div>

    
</div> 

</main>
`;

const showLogin = (error) =>{
    
    if(document.querySelectorAll('.login').length && error){
        document.querySelector('.heading').insertAdjacentHTML('beforeend','<p>There was an error: ${error.message} </p>');
    }else{
        document.getElementById('app').innerHTML = loginhtml;
    }

    
};

const showHome = async () =>{
    console.log("Start home");
    document.getElementById('app').innerHTML = homehtml;
    
    const logs = await client.service('mchandler').find({query:{
        $sort:{logDate: -1},
        $limit: 25
    }});
    
    document.querySelector('#current').innerHTML = logs.serverStat ? '<div class ="btn bg-magenta txt-centered txt-light-grey"> Currently on!! </div>' : '<div class ="btn bg-cyan txt-centered"> Off </div>'; 
    logs.data.reverse().forEach(addLogs);
};

const addLogs = log => {
    logdisp = document.querySelector('#logs');
    text = log.action == 'start' ? 'Server recived a start signal' : 'Server Recived a stopped signal';
    //console.log(`<il> ${log.logDate} ::::  ${text} </li>`);
    if(logdisp){
        logdisp.innerHTML += `<div> >>> ${log.logDate} ::::  ${text} </div><br>`;
    }

};

const login = async (credentials) => {
    try {
        if(!credentials){
            console.log("ReAuth Run");
            await client.reAuthenticate().then(showHome()).catch(showLogin());
            
        }else{
            console.log("Normal Auth Run");
            await client.authenticate(
                {
                    strategy: 'local',
                    ...credentials,
                }
            );
        }
        //main page
        showHome();
        
        
        
    } catch (error) {
        showLogin(error);
    }
}
//main();
login();

const getCredentials = () =>{
    const user = {
        email: document.querySelector('[name="email"]').value,
        password: document.querySelector('[name="password"]').value, 
    }
    return user;
}


const addEventListener = (selector, event, handler) => {
    document.addEventListener(event, async ev => {
        if(ev.target.closest(selector)){
            handler(ev);
        }
    });
}



addEventListener('#signup','click', async()=>{
    const credentials = getCredentials();
    
    
    await client.service('users').create(credentials);
    await login(credentials);
});


addEventListener('#login','click', async()=>{
    const credentials = getCredentials();
    await login(credentials);
});

addEventListener('#logout','click', async()=>{
    
    await client.logout();
    showLogin();
});

addEventListener('#serverstart','click',async()=>{
    console.log("Start server");
    client.service('mchandler').create({action:'start'},{query:{action:'start'}});
    showHome();
});

addEventListener('#serverstop','click',async()=>{
    console.log("Stop server");
    client.service('mchandler').create({action:'stop'},{query:{action:'stop'}});
    showHome();
});