// testPort.js
import net from "net";

const host = "smtp.gmail.com"; // your SMTP host
const ports = [587, 2525, 465]; // common SMTP ports

ports.forEach((port) => {
  const socket = new net.Socket();

  socket.setTimeout(5000); // 5 seconds timeout

  socket.on("connect", () => {
    console.log(`✅ Connected to ${host}:${port}`);
    socket.destroy();
  });

  socket.on("timeout", () => {
    console.log(`⏳ Timeout connecting to ${host}:${port}`);
    socket.destroy();
  });

  socket.on("error", (err) => {
    console.log(`❌ Cannot connect to ${host}:${port} → ${err.message}`);
  });

  socket.connect(port, host);
});
