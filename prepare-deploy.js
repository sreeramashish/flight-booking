const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        try { filelist = walkSync(dirFile, filelist); }
        catch (err) { if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile); }
    });
    return filelist;
};

const replaceInFiles = () => {
    const files = walkSync(path.join(__dirname, 'frontend', 'src')).filter(f => f.endsWith('.jsx'));
    let changesMade = 0;

    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        // Replace 'http://localhost:5000/api... ' with `${import.meta.env.VITE_API_URL}/api...`
        // We use regex to match single quotes around the URL.
        if (content.includes('http://localhost:5000/api')) {
            content = content.replace(/'http:\/\/localhost:5000\/api([^']*)'/g, '`${import.meta.env.VITE_API_URL}/api$1`');
            fs.writeFileSync(file, content, 'utf8');
            changesMade++;
        }
    });
    console.log(`Updated ${changesMade} files to use VITE_API_URL.`);

    fs.writeFileSync(path.join(__dirname, 'frontend', '.env'), 'VITE_API_URL=http://localhost:5000\n');
};

replaceInFiles();
