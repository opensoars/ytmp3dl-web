const { spawn } = require('child_process');

require('dotenv').config();

const lftpArgs = [
  '-e',
  `set net:max-retries 10; set net:timeout 5; ` +
    `set net:reconnect-interval-multiplier 1; set net:reconnect-interval-base 5; ` +
    `mirror -R -P 20 ./build ${process.env.SFTP_UPLOAD_DIRECTORY} ` +
    `&& exit`,
  process.env.SFTP_URL
];

const deploy = spawn('lftp', lftpArgs);

deploy.stdout.on('data', data => {
  console.log(`stdout: ${data}`);
});

deploy.stderr.on('data', data => {
  console.error(`stderr: ${data}`);
});

deploy.on('close', code => {
  console.log(`child process exited with code ${code}`);
});
