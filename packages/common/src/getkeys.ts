import fs from 'fs'
import path from 'path';
const secretsDir = process.argv.includes("--prod") ? 
     '/run/secrets' :
     `${process.cwd()}/run/secrets`;

const privateKeyPath = path.join(secretsDir, 'private.pem');
const publicKeyPath = path.join(secretsDir, 'public.pem');

let privateKey: string = ''
let publicKey: string = ''

export interface Keys {
    privateKey: string
    publicKey: string
}

export const getKeys = (): Keys => {
    if (!privateKey) {
        privateKey = fs.readFileSync(privateKeyPath, "utf-8")
    }
    if (!publicKey) {
        publicKey = fs.readFileSync(publicKeyPath, "utf-8")
    }
    return {
        privateKey,
        publicKey
    }
}