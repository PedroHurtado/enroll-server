import { dev } from './dev';
import { prod } from './prod';

const ENV = process.argv.includes("--prod") ? "prod" : "dev";
const config = ENV === "prod" ? prod : dev;

export {config}