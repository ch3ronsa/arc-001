import dotenv from "dotenv";
dotenv.config();

console.log("Checking .env loading...");
console.log("PRIVATE_KEY exists:", !!process.env.PRIVATE_KEY);
if (process.env.PRIVATE_KEY) {
    console.log("PRIVATE_KEY length:", process.env.PRIVATE_KEY.length);
    console.log("PRIVATE_KEY starts with 0x:", process.env.PRIVATE_KEY.startsWith("0x"));
} else {
    console.log("PRIVATE_KEY is undefined or empty");
}
