import express from 'express';
const staticMiddleware = (folder) => express.static(folder);
export default staticMiddleware;