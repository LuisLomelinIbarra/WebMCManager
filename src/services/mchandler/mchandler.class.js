const { Console } = require('console');
const { Service } = require('feathers-nedb');
var bat;
var isServerRunning = false;
var serverList = ["vanilla","pixelmon"];
var typeRunning = "None";
exports.Mchandler = class Mchandler extends Service {
    create(data, params){
        console.log('hellos', params.query.action);
        if(params.query.action == 'start' && params.query.server != null){
            //var handlecpross = require('../../helpers/child_status');
            if(isServerRunning){
                const errors = require('@feathersjs/errors');
                const serverAlredyAvailable = new errors.GeneralError(new Error('Server is currently running'));

                return  Promise.reject(serverAlredyAvailable);
            }
            isServerRunning = true;
            const { spawn } = require('child_process');
            typeRunning = serverList[params.query.server];
            bat = spawn('cmd.exe', ['/c', process.cwd()+'/javaserver/'+serverList[params.query.server]+'/run.bat'],{cwd: (process.cwd()+'/javaserver/'+serverList[params.query.server])});
            console.log( process.cwd()+'/javaserver/'+serverList[params.query.server]+'/run.bat');
            bat.stdout.on('data', (data) => {
                console.log(data.toString());
            });
            process.stdin.pipe(bat.stdin);
            bat.stderr.on('data', (data) => {
                console.error("ERROR_________________");
                console.error(data.toString());
            });

            bat.on('exit', (code) => {
                isServerRunning = false;
                typeRunning = "None";
                this.emit('mcserverstop',{action:'stopped'});
                console.log(`Child exited with code ${code}`);
            });
            //handlecpross.setCProcess(bat);
        }
        if(params.query.action == 'stop'){
            if(!isServerRunning){
                const errors = require('@feathersjs/errors');
                const serverNotAvailable = new errors.GeneralError(new Error('Server is not currently running'));

                return  Promise.reject(serverNotAvailable);
            }
            console.log('Entered stop');
            //var handlecpross = require('../../helpers/child_status');
            //bat = handlecpross.getCProcess();
            console.log(bat.pid);
            /*const streamss = require('stream');
            var stdinStream = new streamss.Readable();
            stdinStream.push("Cool msg\n");
            stdinStream.push("stop");
            stdinStream.pipe(bat.stdin);*/
            bat.stdin.cork();
            bat.stdin.write("hello\n");
            bat.stdin.write("stop\n");
            bat.stdin.uncork();
            console.log('child comm was run');
            //console.log(bat);
        }
        return super.create(data,params);
    }
    find(params){
        params['serverStat'] = isServerRunning;
        params['typeRun'] = typeRunning;
        return super.find(params);
    }
};
