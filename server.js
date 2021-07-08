'use strict';

const {spawn} = require('child_process');

const fastify = require('fastify');

const cyclictestStandardArguments = ['-l10000', '-i1000', '-h10000'];

// initialize fastify
const server = fastify();

server.get('/cyclictest', ((request, reply) => {
    const useNormalScheduler = request.query.non_rt;

    const command = spawn('cyclictest', [...cyclictestStandardArguments, useNormalScheduler ? '--policy=normal' : '-p80']);
    const stdout = [];
    const stderr = [];

    command.stdout.on('data', data => stdout.push(data));
    command.stderr.on('data', data => stderr.push(data));

    command.on('error', error => {
        stderr.push(error);

        reply.code(503).send(composeResponse('error', -1, stdout, stderr));
    });

    command.on('close', code => {
        const successful = code === 0;
        reply.code(successful ? 200 : 503).send(composeResponse(successful ? 'success' : 'error', code, stdout, stderr));
    });
}));

server.get('/', ((request, reply) => {
    reply.send('Server up')
}))
server.listen(3500, '0.0.0.0', (err, msg) => {
    if (msg) {
        console.info(msg);
    }
    if (err) {
        console.error(err);
        process.exit(1);
    }
});

function composeResponse(result, code, stdout, stderr) {
    return {
        result: result,
        code: code,
        stdout: stdout.join('\n'),
        stderr: stderr.join('\n')
    };
}
