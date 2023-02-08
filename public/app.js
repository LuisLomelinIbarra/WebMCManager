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
<main name="login" class="login container-fluid">
<div>
        <h1 class="">Login or Signup</h1>      
        <hr>
        <form action="/">
            <article>        
            <header>
                <label>
                    Email              
                    <input type="email" name="email" class="width-50" placeholder="email@domain.com"/>
                </label>
                <label>
                    Password
                    <input type="password" name="password" class="width-50" placeholder="A c00l p4$$w0rd" />
                </label>
            </header>
            <label>
                <button id="login" type="button">Log in</button>
            </label>
            <footer>
                <label>
                    <button class="secondary outline" id="signup" type="button">Sign Up and Login</button>
                </label>
            </footer>  
            </article>
        </form>
    </div>
</main>`;

const homehtml = `

<main class="container-fluid">
    <br>
    <div>
        <a href="#" id="logout" class="secondary" role="button"> 
            <i data-feather="log-out">  </i> Logout
        </a>
    </div>
    <br>
    <div><h1>Web Server Starter</h1></div><br>
    <div class="grid">
    <article class="grid">
        <nav>
        <div >
            
            <div>
                <h5>Server Type</h5>
                <select id="sertype">
                    
                </select> 
            </div>
            <div>
                <button id="serverstart" > Start Server </button>
            </div>
            <span>
            <div >
                <button id="serverstop" class="secondary"> Stop Server </button>
            </div>
            
            <div>
                <span >
                <h4>
                    Current Status: 
                </h4> 
                <div id="current"></div></span>
            </div>
        
    </nav>

        <article data-theme="dark">
            <header>
            
            Server Recent activity
            
            </header>
            
            
                
                
                    <div class="container-fluid contrast scroll"   id="logs"> </div>
                    
                    
                    
                </div>
            
        </article>

    </div>
    </article>

</main><br>

`;




const showLogin = (error) =>{
    
    if(document.querySelectorAll('.login').length && error){
        document.querySelector('.heading').insertAdjacentHTML('beforeend','<p>There was an error: ${error.message} </p>');
    }else{
        document.getElementById('app').innerHTML = loginhtml;
    }
    feather.replace()
    
};

const showHome = async () =>{
    
    document.getElementById('app').innerHTML = homehtml;
    
    const logs = await client.service('mchandler').find({query:{
        $sort:{logDate: -1},
        $limit: 25
    }});
    console.log(logs.typeRun);
    document.querySelector('#sertype').innerHTML = "";
    logs.serverlist.forEach(addOptions)
    serverinfo = logs.serverStat ? '<button class ="contrast"> Currently on!! </button>' : '<button class ="contrast bold outline" disabled> Off </button>';
    serverinfo += '<h5 class=" sp-vert-sm">Current Type running:</h5> <button class="secondary contrast" disabled> <em>' + logs.typeRun+'</em></button>';
    document.querySelector('#current').innerHTML =  serverinfo;
    logs.data.forEach(addLogs);
    feather.replace()
};

const updateHome = async () =>{
    const logs = await client.service('mchandler').find({query:{
        $sort:{logDate: -1},
        $limit: 25
    }});
    serverinfo = logs.serverStat ? '<button class ="contrast"> Currently on!! </button>' : '<button class ="contrast bold outline" disabled> Off </button>';
    serverinfo += '<h5 class=" sp-vert-sm">Current Type running:</h5> <button class="secondary contrast" disabled> <em>' + logs.typeRun+'</em></button>';
    document.querySelector('#current').innerHTML =  serverinfo;
    document.querySelector('#logs').innerHTML = "";
    logs.data.forEach(addLogs);
}

const addOptions = (option,indx) => {
    selecttag = document.querySelector('#sertype')
    if(selecttag){
        selecttag.innerHTML += `<option value=${indx}> ${option} </option>`
    }
}


const addLogs = log => {
    logdisp = document.querySelector('#logs');
    text = log.action == 'start' ? '<ins> Server Started </ins>' : ' <b> Server Stopped </b>';
    const t = new Date(log.logDate);
    const date = ('0' + t.getDate()).slice(-2);
    const month = ('0' + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    const hours = ('0' + t.getHours()).slice(-2);
    const minutes = ('0' + t.getMinutes()).slice(-2);
    const seconds = ('0' + t.getSeconds()).slice(-2);
    const time = `${date}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
    
    

    if(logdisp){
        logdisp.innerHTML += `<div> <small> >>>  ${time} </small> ::::   ${text}  </div><br>`;
    }

};

const login = async (credentials) => {
    try {
        if(!credentials){
            
            await client.reAuthenticate().then(showHome()).catch(showLogin());
            
        }else{
            
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


addEventListener('#themebtn','click',async()=>{
    feather.replace();
});

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
    var sel = document.getElementById('sertype');
    console.log(sel.value);
    
    client.service('mchandler').create({action:'start'},{query:{action:'start', server: sel.value}});
    
});

addEventListener('#serverstop','click',async()=>{
    
    client.service('mchandler').create({action:'stop'},{query:{action:'stop'}});
    
});

client.service('mchandler').on('created',updateHome);
client.service('mchandler').on('mcserverstop',updateHome);